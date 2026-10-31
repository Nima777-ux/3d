import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { FAQ, PRICING, media } from '../data/site.js'
import './Pricing.css'

export default function Pricing({ onBook }) {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <section className="section pricing" id="pricing">
      <div className="inner">
        <Reveal>
          <p className="eyebrow">05 — Investment</p>
        </Reveal>

        <div className="pricing__grid">
          <Reveal className="pricing__left" delay={60}>
            <figure className="pricing__figure">
              <img
                src={media.pricing}
                alt="A woman carrying a woven basket across her back"
                loading="lazy"
              />
            </figure>
            <div className="pricing__price-block">
              <span className="pricing__price">{PRICING.price}</span>
              <span className="pricing__deposit">{PRICING.deposit}</span>
              <p className="pricing__note">{PRICING.note}</p>
              <button className="btn btn--solid" type="button" onClick={onBook}>
                Reserve a seat
              </button>
            </div>
          </Reveal>

          <div className="pricing__right">
            <Reveal delay={100}>
              <h2 className="section-title pricing__title">
                What you <em>carry home</em>
              </h2>
            </Reveal>

            <Reveal className="pricing__lists" delay={140}>
              <div className="pricing__list">
                <h3 className="pricing__list-title">Included</h3>
                <ul>
                  {PRICING.includes.map((item) => (
                    <li key={item}>
                      <span className="pricing__mark pricing__mark--yes" aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pricing__list">
                <h3 className="pricing__list-title">Not included</h3>
                <ul>
                  {PRICING.excludes.map((item) => (
                    <li key={item}>
                      <span className="pricing__mark" aria-hidden="true">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal className="pricing__faq" delay={80}>
              <p className="label pricing__faq-label">Good to know</p>
              {FAQ.map((item, i) => {
                const open = openFaq === i
                return (
                  <div key={item.q} className={`faq ${open ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq__head"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? -1 : i)}
                    >
                      <span>{item.q}</span>
                      <span className="faq__icon" aria-hidden="true">
                        {open ? '−' : '+'}
                      </span>
                    </button>
                    <div className="faq__body" hidden={!open}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                )
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
