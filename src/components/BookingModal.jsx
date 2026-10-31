import { useEffect, useRef, useState } from 'react'
import { DEPARTURES } from '../data/site.js'
import { EMAIL_RE, sendInquiry } from '../lib/api.js'
import './BookingModal.css'

const EMPTY = {
  name: '',
  email: '',
  departure: DEPARTURES[0],
  travellers: '1',
  message: '',
}

export default function BookingModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState('')
  const firstField = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    if (!open) return

    setStatus('idle')
    setErrors({})
    const t = setTimeout(() => firstField.current?.focus(), 120)

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [open, onClose])

  if (!open) return null

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please tell me your name.'
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    setServerError('')
    try {
      await sendInquiry({
        kind: 'booking',
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim() || 'Seat reservation request',
        tourDate: form.departure,
        travellers: Number(form.travellers),
      })
      setStatus('sent')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setServerError(err.message)
    }
  }

  return (
    <div className="booking" role="dialog" aria-modal="true" aria-label="Reserve a seat">
      <button className="booking__backdrop" type="button" onClick={onClose} aria-label="Close" />

      <div className="booking__panel">
        <button className="booking__close" type="button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {status === 'sent' ? (
          <div className="booking__done">
            <p className="eyebrow">Request received</p>
            <h3 className="booking__title">See you in Java</h3>
            <p>
              Your seat request for <strong>{form.departure || 'the selected departure'}</strong> is
              with me. I will confirm availability and send the deposit link within two working days.
            </p>
            <button className="btn btn--solid" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Reserve a seat</p>
            <h3 className="booking__title">Origins of Java</h3>
            <p className="booking__sub">
              14 days, eight photographers, one island. Leave your details and I will
              hold a place for 72 hours.
            </p>

            <form className="booking__form" onSubmit={onSubmit} noValidate>
              <div className={`field ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="b-name">Your name</label>
                <input
                  ref={firstField}
                  id="b-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <span className="field__error">{errors.name}</span>}
              </div>

              <div className={`field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="b-email">Your e-mail</label>
                <input
                  id="b-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <span className="field__error">{errors.email}</span>}
              </div>

              <div className="booking__row">
                <div className="field">
                  <label htmlFor="b-departure">Departure</label>
                  <select
                    id="b-departure"
                    value={form.departure}
                    onChange={update('departure')}
                  >
                    {DEPARTURES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="b-travellers">Travellers</label>
                  <select
                    id="b-travellers"
                    value={form.travellers}
                    onChange={update('travellers')}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field field--area">
                <label htmlFor="b-message">Anything I should know? (optional)</label>
                <textarea
                  id="b-message"
                  rows={3}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Experience level, dietary needs, room preference…"
                />
              </div>

              <button className="btn btn--solid" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Request a seat'}
              </button>
              {status === 'error' && (
                <span className="field__error" role="status">
                  {serverError}
                </span>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
