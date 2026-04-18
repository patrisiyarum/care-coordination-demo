import { useState } from 'react'
import './App.css'

function IconPulse() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h2.5l2-6 3 12 3-9 2.5 3H20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 3v6c0 4.5-3.5 8.2-7 9-3.5-.8-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.5l1.7 1.7 3.8-4.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconNodes() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="17" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M7.6 8.6l3.2 6.8M16.4 8.6l-3.2 6.8M9.2 7.3h5.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site">
      <header className="header">
        <div className="shell header__bar">
          <a className="brand" href="#top">
            <span className="brand__mark" aria-hidden />
            Northstar Care
          </a>
          <nav className="nav" aria-label="Primary">
            <ul className="nav__links">
              <li>
                <a href="#platform">Platform</a>
              </li>
              <li>
                <a href="#outcomes">Outcomes</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
            <a className="btn btn--primary" href="#contact">
              Book a walkthrough
            </a>
            <button
              type="button"
              className="nav__toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
            >
              Menu
            </button>
          </nav>
        </div>
        {menuOpen ? (
          <div className="shell nav__mobile" id="mobile-nav">
            <a href="#platform" onClick={() => setMenuOpen(false)}>
              Platform
            </a>
            <a href="#outcomes" onClick={() => setMenuOpen(false)}>
              Outcomes
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
            <a
              className="btn btn--primary"
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Book a walkthrough
            </a>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell hero__grid">
            <div>
              <p className="hero__eyebrow">Care coordination</p>
              <h1 id="hero-title">Align teams around the patient in real time</h1>
              <p className="hero__lede">
                Northstar is a demo landing layout you own end to end—swap
                messaging, metrics, and visuals to tell your hospital&apos;s story.
                Built for clarity, trust, and fast iteration.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#contact">
                  Plan a pilot
                </a>
                <a className="btn btn--ghost" href="#platform">
                  See the platform
                </a>
              </div>
              <p className="hero__note">
                Replace this copy with your compliance posture, integrations, and
                evidence—keep the structure, make the claims yours.
              </p>
            </div>
            <div className="hero__panel" aria-label="Example metrics panel">
              <div className="panel__row">
                <span className="panel__title">Response pipeline</span>
                <span className="panel__badge">Live</span>
              </div>
              <div className="panel__chart" role="presentation">
                <div className="panel__bar" />
                <div className="panel__bar" />
                <div className="panel__bar" />
                <div className="panel__bar" />
                <div className="panel__bar" />
                <div className="panel__bar" />
                <div className="panel__bar" />
              </div>
              <div className="panel__footer">
                <div className="panel__stat">
                  <strong>−18 min</strong>
                  <span>median time to align</span>
                </div>
                <div className="panel__stat">
                  <strong>99.2%</strong>
                  <span>handoff completeness</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="Illustrative outcomes">
          <div className="shell stats__grid">
            <div>
              <div className="stat__value">120+</div>
              <p className="stat__label">sites modeled in this template</p>
            </div>
            <div>
              <div className="stat__value">24/7</div>
              <p className="stat__label">placeholder for your coverage story</p>
            </div>
            <div>
              <div className="stat__value">HIPAA-ready</div>
              <p className="stat__label">swap for your actual attestations</p>
            </div>
          </div>
        </section>

        <section id="platform" className="section">
          <div className="shell">
            <header className="section__head">
              <h2>One workflow, fewer gaps</h2>
              <p>
                Feature cards are placeholders—rename them to match your modules
                (imaging triggers, paging, pathway analytics, and so on).
              </p>
            </header>
            <div className="cards">
              <article className="card">
                <div className="card__icon">
                  <IconPulse />
                </div>
                <h3>Signal without noise</h3>
                <p>
                  Prioritize what clinicians must see first; route the rest to the
                  right channel with rules you control.
                </p>
              </article>
              <article className="card">
                <div className="card__icon">
                  <IconShield />
                </div>
                <h3>Trust by design</h3>
                <p>
                  Audit trails, role-aware views, and environment separation patterns
                  your security team can review.
                </p>
              </article>
              <article className="card">
                <div className="card__icon">
                  <IconNodes />
                </div>
                <h3>Fits your stack</h3>
                <p>
                  Document your EHR, imaging, and communication integrations here;
                  this section is for credibility, not vapor.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="outcomes" className="section">
          <div className="shell quote">
            <figure>
              <blockquote>
                &ldquo;We used this scaffold to align marketing and clinical leads on
                one narrative before we wrote a single line of product demo
                code.&rdquo;
              </blockquote>
              <figcaption>— Placeholder quote; attribute your champions.</figcaption>
            </figure>
            <aside aria-label="Checklist">
              <strong style={{ color: 'var(--ink)' }}>Launch checklist</strong>
              <ul>
                <li>Replace metrics with validated figures.</li>
                <li>Add your IRB or publication links if applicable.</li>
                <li>Hook forms to your CRM or email endpoint.</li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="shell">
            <div className="cta">
              <div>
                <h2>Ship a credible story faster</h2>
                <p>
                  This repo is yours—iterate in the open, deploy to GitHub Pages or
                  any static host, and keep brand and legal review in lockstep.
                </p>
              </div>
              <a
                className="btn btn--on-dark"
                href="mailto:hello@example.com?subject=Northstar%20demo%20inquiry"
              >
                Email the team
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer__grid">
          <div>
            <div className="footer__brand">Northstar Care Platform</div>
            <p style={{ maxWidth: '40ch', margin: 0 }}>
              Original demo layout—not affiliated with any commercial site. Rename,
              restyle, and extend freely under your license.
            </p>
          </div>
          <div className="footer__cols">
            <h3>Product</h3>
            <ul>
              <li>
                <a href="#platform">Platform</a>
              </li>
              <li>
                <a href="#outcomes">Outcomes</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer__cols">
            <h3>Company</h3>
            <ul>
              <li>
                <a href="#top">Careers (stub)</a>
              </li>
              <li>
                <a href="#top">Press (stub)</a>
              </li>
            </ul>
          </div>
          <div className="footer__cols">
            <h3>Legal</h3>
            <ul>
              <li>
                <a href="#top">Privacy (stub)</a>
              </li>
              <li>
                <a href="#top">Terms (stub)</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="shell footer__bottom">
          <span>© {new Date().getFullYear()} Your organization</span>
          <span>Built with Vite + React</span>
        </div>
      </footer>
    </div>
  )
}
