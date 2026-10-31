import express from 'express'
import pg from 'pg'

const PORT = Number(process.env.PORT || 4000)
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://nima:nima_dev_pw@db:5432/nima'

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 10 })

const app = express()
app.use(express.json({ limit: '64kb' }))

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* Very small in-memory throttle: 8 submissions per IP per 10 minutes. */
const hits = new Map()
function throttled(ip) {
  const now = Date.now()
  const windowStart = now - 10 * 60 * 1000
  const list = (hits.get(ip) || []).filter((t) => t > windowStart)
  list.push(now)
  hits.set(ip, list)
  return list.length > 8
}

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id          SERIAL PRIMARY KEY,
      kind        TEXT NOT NULL DEFAULT 'message',
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      message     TEXT NOT NULL DEFAULT '',
      tour_date   TEXT,
      travellers  INTEGER,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch (err) {
    res.status(503).json({ ok: false, error: 'database unavailable' })
  }
})

app.post('/api/inquiries', async (req, res) => {
  const ip = req.ip || 'unknown'
  if (throttled(ip)) {
    return res.status(429).json({ error: 'Too many messages. Please try again later.' })
  }

  const body = req.body || {}
  const kind = body.kind === 'booking' ? 'booking' : 'message'
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const message = String(body.message || '').trim()
  const tourDate = body.tourDate ? String(body.tourDate).trim() : null
  const travellers = body.travellers ? Number(body.travellers) : null

  if (name.length < 2 || name.length > 120) {
    return res.status(400).json({ error: 'Please enter your name.' })
  }
  if (!EMAIL_RE.test(email) || email.length > 160) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }
  if (kind === 'message' && message.length < 10) {
    return res.status(400).json({ error: 'Please write at least a sentence.' })
  }
  if (message.length > 4000) {
    return res.status(400).json({ error: 'Your message is too long.' })
  }
  if (kind === 'booking' && !tourDate) {
    return res.status(400).json({ error: 'Please choose a departure date.' })
  }
  if (travellers !== null && (!Number.isInteger(travellers) || travellers < 1 || travellers > 20)) {
    return res.status(400).json({ error: 'Travellers must be between 1 and 20.' })
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO inquiries (kind, name, email, message, tour_date, travellers)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [kind, name, email, message, tourDate, travellers]
    )
    res.status(201).json({ ok: true, id: rows[0].id, receivedAt: rows[0].created_at })
  } catch (err) {
    console.error('Failed to store inquiry', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

async function start() {
  let attempt = 0
  // The database may still be warming up when this process starts.
  while (attempt < 30) {
    try {
      await ensureSchema()
      break
    } catch (err) {
      attempt += 1
      if (attempt === 30) throw err
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API listening on http://0.0.0.0:${PORT}`)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
