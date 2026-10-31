import express from 'express';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const app = express();
const PORT = Number(process.env.PORT ?? 8000);
const MESSAGE_DIR = process.env.MESSAGE_STORE_DIR ?? path.join(process.cwd(), 'data');
const MESSAGE_FILE = path.join(MESSAGE_DIR, 'messages.jsonl');

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? '';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>';
const RESEND_KEY = process.env.RESEND_API_KEY ?? '';
const emailDeliveryEnabled = Boolean(RESEND_KEY && TO_EMAIL);

app.set('trust proxy', true);
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

/* --- very small in-memory rate limiter (per IP) --- */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const attempts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.startedAt > RATE_WINDOW_MS) {
    attempts.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body) {
  const errors = {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || name.length > 120) errors.name = 'Please enter your full name.';
  if (!EMAIL_PATTERN.test(email) || email.length > 180) errors.email = 'Please enter a valid email address.';
  if (subject.length < 3 || subject.length > 160) errors.subject = 'Please add a short subject.';
  if (message.length < 10 || message.length > 5000)
    errors.message = 'Please write at least a few words about your project.';

  return { errors, values: { name, email, subject, message } };
}

async function sendEmail({ name, email, subject, message }) {
  if (!emailDeliveryEnabled) return false;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!response.ok) {
      console.error('contact: email provider rejected the message', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('contact: could not reach the email provider', error);
    return false;
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, emailDelivery: emailDeliveryEnabled });
});

app.post('/api/contact', async (req, res) => {
  const body = req.body ?? {};

  // 1. Honeypot — real people never fill this in.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return res.json({ ok: true });
  }

  // 2. Submitted implausibly fast — treat as automated.
  if (typeof body.startedAt === 'number' && Date.now() - body.startedAt < 1200) {
    return res.json({ ok: true });
  }

  if (isRateLimited(req.ip ?? 'unknown')) {
    return res.status(429).json({ error: 'Too many messages sent from this connection. Please try again later.' });
  }

  const { errors, values } = validate(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Please check the highlighted fields.', fields: errors });
  }

  try {
    await mkdir(MESSAGE_DIR, { recursive: true });
    await appendFile(
      MESSAGE_FILE,
      `${JSON.stringify({ receivedAt: new Date().toISOString(), ...values })}\n`,
      'utf8',
    );
  } catch (error) {
    console.error('contact: could not store the message', error);
    return res.status(500).json({ error: 'Your message could not be stored. Please try again.' });
  }

  const delivered = await sendEmail(values);
  return res.json({ ok: true, delivered });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`contact api listening on :${PORT} (email delivery: ${emailDeliveryEnabled ? 'enabled' : 'disabled'})`);
});
