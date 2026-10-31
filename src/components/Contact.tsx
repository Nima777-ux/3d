import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Check, Loader2, Send } from 'lucide-react';
import { site } from '../data/site';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import SocialLinks from './SocialLinks';
import './Contact.css';

type Values = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const emptyValues: Values = { name: '', email: '', subject: '', message: '' };

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (values.subject.trim().length < 3) errors.subject = 'Please add a short subject.';
  if (values.message.trim().length < 10) errors.message = 'Please write at least a few words about your project.';
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());

  const update = (field: keyof Values) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setStatus('sending');
    setFeedback('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          company: honeypotRef.current?.value ?? '',
          startedAt: startedAt.current,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setStatus('error');
        setFeedback(data.error ?? 'Your message could not be sent. Please try again.');
        return;
      }

      setStatus('sent');
      setValues(emptyValues);
      startedAt.current = Date.now();
    } catch {
      setStatus('error');
      setFeedback('Network error — please check your connection and try again.');
    }
  };

  return (
    <section id="contact" className="section contact tone-dark" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <Reveal className="contact__intro">
          <SectionHeading
            id="contact-title"
            index="05"
            label="Contact"
            title="Let's Work"
            accent="together"
            intro={site.contact.description}
          />

          <p className="contact__status">
            <span className="contact__pulse" aria-hidden="true" />
            {site.availability}
          </p>

          <dl className="contact__meta">
            <div>
              <dt>Email</dt>
              <dd>
                {site.email ? (
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                ) : (
                  <span className="contact__placeholder" title="Add your email in src/data/site.ts">
                    hello@yourdomain.com
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt>Response time</dt>
              <dd>Within two business days</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Working remotely, worldwide</dd>
            </div>
          </dl>

          <SocialLinks tone="dark" />
        </Reveal>

        <Reveal className="contact__panel" delay={120}>
          {status === 'sent' ? (
            <div className="contact__success" role="status">
              <span className="contact__success-icon" aria-hidden="true">
                <Check size={20} strokeWidth={1.8} />
              </span>
              <h3>Message received</h3>
              <p>
                Thank you — your message is on its way to Nima. You will hear back within two business days.
              </p>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => {
                  setStatus('idle');
                  setFeedback('');
                }}
              >
                Send another message
                <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              <p className="contact__note">{site.contact.formNote}</p>

              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={update('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  required
                />
                {errors.name ? (
                  <p className="field__error" id="name-error" role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={update('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  required
                />
                {errors.email ? (
                  <p className="field__error" id="email-error" role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={values.subject}
                  onChange={update('subject')}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  required
                />
                {errors.subject ? (
                  <p className="field__error" id="subject-error" role="alert">
                    {errors.subject}
                  </p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={update('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  required
                />
                {errors.message ? (
                  <p className="field__error" id="message-error" role="alert">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <div className="field field--honeypot" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input ref={honeypotRef} id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {status === 'error' && feedback ? (
                <p className="contact__error" role="alert">
                  {feedback}
                </p>
              ) : null}

              <button type="submit" className="btn btn--solid contact__submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <Loader2 className="contact__spinner" size={17} strokeWidth={1.8} aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} strokeWidth={1.7} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
