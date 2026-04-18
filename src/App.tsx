import { useState } from 'react'
import './App.css'

const SITE = {
  name: 'AP Healthcare',
  origin: 'https://aphealthcare.org/',
  contactPage: 'https://aphealthcare.org/contact-us/',
  phoneDisplay: '(404) 850-9600',
  phoneTel: '+14048509600',
  email: 'info@aphealthcare.org',
  addressLine: '7000 Peachtree Dunwoody Rd',
  cityLine: 'Atlanta, GA 30328',
  mailingLine: '6595G Roswell Rd #241, Atlanta, GA 30328',
  hours: 'Mon–Fri 8:00 AM – 6:00 PM EST',
} as const

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

function IconHandshake() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11h3l2.5-2.5a2 2 0 012.8 0L15 12.5M8 20l2.5-2.5a2 2 0 012.8 0L16 20M4 15l3-3M16 8l4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12l7-3v8a2 2 0 01-2 2h-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
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
            <span className="brand__mark" aria-hidden>
              AP
            </span>
            {SITE.name}
          </a>
          <nav className="nav" aria-label="Primary">
            <ul className="nav__links">
              <li>
                <a href="#who-we-serve">Who we serve</a>
              </li>
              <li>
                <a href="#reviews">Reviews</a>
              </li>
              <li>
                <a href={SITE.contactPage} target="_blank" rel="noopener noreferrer">
                  Contact
                </a>
              </li>
            </ul>
            <a
              className="btn btn--primary"
              href={SITE.contactPage}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get started
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
            <a href="#who-we-serve" onClick={() => setMenuOpen(false)}>
              Who we serve
            </a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>
              Reviews
            </a>
            <a
              href={SITE.contactPage}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
            <a
              className="btn btn--primary"
              href={SITE.contactPage}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Get started
            </a>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell hero__grid">
            <div>
              <p className="hero__eyebrow">Professional medical coordination</p>
              <h1 id="hero-title">
                Top-tier providers, seamless coordination, fair settlements
              </h1>
              <p className="hero__lede">
                {SITE.name} helps accident victims navigate care after an injury—
                connecting people to treatment, keeping legal teams informed, and
                supporting providers with scheduling, communication, and timely
                reimbursement.
              </p>
              <div className="hero__actions">
                <a
                  className="btn btn--primary"
                  href={SITE.contactPage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tell us about your case
                </a>
                <a className="btn btn--ghost" href="#who-we-serve">
                  How we help
                </a>
              </div>
              <p className="hero__note">
                Serving attorneys, medical providers, and injured patients with
                lien-aware workflows and dedicated coordinators—details on{' '}
                <a href={SITE.origin} target="_blank" rel="noopener noreferrer">
                  aphealthcare.org
                </a>
                .
              </p>
            </div>
            <div className="hero__panel" aria-label="Coordination overview">
              <div className="panel__row">
                <span className="panel__title">Care coordination</span>
                <span className="panel__badge">Active</span>
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
                  <strong>End-to-end</strong>
                  <span>scheduling to records</span>
                </div>
                <div className="panel__stat">
                  <strong>Aligned</strong>
                  <span>attorneys &amp; clinicians</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="What AP Healthcare emphasizes">
          <div className="shell stats__grid">
            <div>
              <div className="stat__value">Network</div>
              <p className="stat__label">
                Broad access to medical providers across specialties
              </p>
            </div>
            <div>
              <div className="stat__value">Updates</div>
              <p className="stat__label">
                Consistent communication on treatment status
              </p>
            </div>
            <div>
              <div className="stat__value">Resolution</div>
              <p className="stat__label">
                Support with bills, records, and settlement timelines
              </p>
            </div>
          </div>
        </section>

        <section id="who-we-serve" className="section">
          <div className="shell">
            <header className="section__head">
              <h2>Who we serve</h2>
              <p>
                Professional medical coordination tailored to legal workflows,
                provider operations, and patient access—summarized from{' '}
                {SITE.name}&apos;s public service areas.
              </p>
            </header>
            <div className="cards">
              <article className="card">
                <div className="card__icon">
                  <IconHandshake />
                </div>
                <h3>Attorneys</h3>
                <p>
                  Access to a wide network of medical providers for your clients,
                  steady updates on treatment, expedited collection of bills and
                  records, global reduction options, and help moving cases toward
                  settlement.
                </p>
              </article>
              <article className="card">
                <div className="card__icon">
                  <IconShield />
                </div>
                <h3>Medical providers</h3>
                <p>
                  Help growing patient volume and cash flow while reducing
                  collection risk—with support for scheduling, communication,
                  orders, transportation, translation, and timely payment.
                </p>
              </article>
              <article className="card">
                <div className="card__icon">
                  <IconPulse />
                </div>
                <h3>Injured patients</h3>
                <p>
                  Choice of local providers across specialties, priority
                  scheduling, facilitation of clinical orders, a dedicated care
                  coordinator, and transportation and translation assistance when
                  needed.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="reviews" className="section">
          <div className="shell quote">
            <figure>
              <blockquote>
                Partners frequently highlight responsive communication and
                thorough coordination across firms, providers, and patients—
                themes reflected in {SITE.name}&apos;s public Google reviews.
              </blockquote>
              <figcaption>
                — Summary of recurring feedback; see reviews on{' '}
                <a href={SITE.origin} target="_blank" rel="noopener noreferrer">
                  aphealthcare.org
                </a>
              </figcaption>
            </figure>
            <aside aria-label="Why teams work with AP Healthcare">
              <strong style={{ color: 'var(--ink)' }}>Why it matters</strong>
              <ul>
                <li>One team aligned around treatment access and case momentum.</li>
                <li>Less administrative drag for firms and front-desk staff.</li>
                <li>Patients get help navigating a complex moment.</li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="shell">
            <div className="cta">
              <div>
                <h2>Talk with {SITE.name}</h2>
                <p>
                  Reach the team by phone or email, or submit the secure contact
                  form on the official website.
                </p>
              </div>
              <div className="cta__actions">
                <a className="btn btn--on-dark" href={`tel:${SITE.phoneTel}`}>
                  Call {SITE.phoneDisplay}
                </a>
                <a
                  className="btn btn--ghost cta__ghost"
                  href={SITE.contactPage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open contact form
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer__grid">
          <div>
            <div className="footer__brand">{SITE.name}</div>
            <p style={{ maxWidth: '42ch', margin: 0 }}>
              Professional medical coordination for personal injury workflows—
              information on this page summarizes public details from{' '}
              <a href={SITE.origin} target="_blank" rel="noopener noreferrer">
                aphealthcare.org
              </a>
              .
            </p>
            <p className="footer__contact">
              <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
              <br />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <br />
              {SITE.hours}
            </p>
            <p className="footer__contact">
              <strong>Main office</strong>
              <br />
              {SITE.addressLine}
              <br />
              {SITE.cityLine}
            </p>
            <p className="footer__contact">
              <strong>Mail</strong>
              <br />
              {SITE.mailingLine}
            </p>
          </div>
          <div className="footer__cols">
            <h3>Services</h3>
            <ul>
              <li>
                <a href="#who-we-serve">Who we serve</a>
              </li>
              <li>
                <a href="#reviews">Reviews</a>
              </li>
              <li>
                <a href={SITE.contactPage} target="_blank" rel="noopener noreferrer">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__cols">
            <h3>Official site</h3>
            <ul>
              <li>
                <a href={SITE.origin} target="_blank" rel="noopener noreferrer">
                  aphealthcare.org
                </a>
              </li>
              <li>
                <a href={SITE.contactPage} target="_blank" rel="noopener noreferrer">
                  Contact form
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__cols">
            <h3>Legal</h3>
            <ul>
              <li>
                <a href={SITE.origin} target="_blank" rel="noopener noreferrer">
                  Policies on aphealthcare.org
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="shell footer__bottom">
          <span>© {new Date().getFullYear()} AP Healthcare</span>
          <span>
            <a href={SITE.origin} target="_blank" rel="noopener noreferrer">
              aphealthcare.org
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
