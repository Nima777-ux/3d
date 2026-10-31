import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { BRAND, SOCIALS, media } from '../data/site.js'
import { EMAIL_RE, sendInquiry } from '../lib/api.js'
import './Contact.css'

const EMPTY = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [serverError, setServerError] = useState('')

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: undefined }))
    if (status === 'sent' || status === 'error') setStatus('idle')
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please tell me your name.'
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 10) next.message = 'A sentence or two is plenty.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    setServerError('')
    try {
      await sendInquiry({
        kind: 'message',
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      setStatus('sent')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setServerError(err.message)
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="contact__bg" aria-hidden="true">
        <img src={media.contact} alt="" loading="lazy" />
      </div>

      <div className="inner contact__inner">
        <Reveal className="contact__head">
          <p className="eyebrow">06 — Contact</p>
          <h2 className="contact__title">
            Start your <em>journey</em>
          </h2>
          <p className="contact__sub">
            If you still have questions, write to us. Every message reaches me
            directly — I answer within two working days.
          </p>
        </Reveal>

        <Reveal className="contact__grid" delay={80}>
          <form className="contact__form" onSubmit={onSubmit} noValidate>
            <div className={`field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="c-name">Your name</label>
              <input
                id="c-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Nima Nabizada"
                value={form.name}
                onChange={update('name')}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </div>

            <div className={`field ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="c-email">Your e-mail</label>
              <input
                id="c-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </div>

            <div className={`field field--area ${errors.message ? 'has-error' : ''}`}>
              <label htmlFor="c-message">Message</label>
              <textarea
                id="c-message"
                name="message"
                rows={4}
                placeholder="Tell me what you would like to photograph…"
                value={form.message}
                onChange={update('message')}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <span className="field__error">{errors.message}</span>}
            </div>

            <div className="contact__actions">
              <button className="btn btn--solid" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : '> Send message'}
              </button>
              <span className="contact__status" role="status">
                {status === 'sent' && 'Thank you — your message is with me.'}
                {status === 'error' && (serverError || 'Something went wrong. Please try again.')}
              </span>
            </div>
          </form>

          <aside className="contact__aside">
            <div className="contact__aside-block">
              <p className="label">Write directly</p>
              <a className="contact__email" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
            </div>
            <div className="contact__aside-block">
              <p className="label">Follow the journey</p>
              <ul className="contact__socials">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer">
                      {s.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="contact__note">
              Based in Yogyakarta · Available for commissions and editorial work
              across Southeast Asia.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
