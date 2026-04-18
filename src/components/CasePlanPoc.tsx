import { useState } from 'react'

type PlanResponse = {
  poc: boolean
  disclaimer: string
  algorithm: { id: string; method: string }
  extractedSignals: {
    themes: string[]
    urgency: string
    regionHint: string | null
  }
  caseSummary: string
  coordinators: Array<{
    id: string
    name: string
    role: string
    score: number
    matchReasons: string[]
    strengths: string[]
  }>
  attorneys: Array<{
    id: string
    name: string
    firm: string
    score: number
    matchReasons: string[]
    strengths: string[]
  }>
  carePlan: {
    horizon: string
    phases: Array<{
      order: number
      title: string
      window: string
      summary: string
      steps: string[]
      owner: string
    }>
    checkpoints: Array<{ label: string; when: string }>
  }
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

const DEMO_TEXT = `I was rear-ended last Tuesday on I-85 near Atlanta while commuting to work. 
My neck and upper back hurt, and I've had headaches since the crash. I went to urgent care 
the same day. I need help scheduling PT and imaging if my doctor orders it, and I'm also 
looking for an attorney because the other driver's insurance is already pushing back. 
I speak English only and can do weekday appointments.`

export function CasePlanPoc() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<PlanResponse | null>(null)

  async function submit() {
    setError(null)
    setLoading(true)
    setPlan(null)
    try {
      const res = await fetch(`${API_BASE}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseDescription: text }),
      })
      const data: PlanResponse & { error?: string } = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      setPlan(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="plan-poc" className="section plan-poc" aria-labelledby="plan-poc-title">
      <div className="shell">
        <header className="section__head">
          <p className="plan-poc__badge">Proof of concept</p>
          <h2 id="plan-poc-title">From case narrative to a coordinated plan</h2>
          <p>
            Describe your situation in your own words. The backend extracts themes, scores
            illustrative coordinator and attorney profiles, and assembles a phased plan—
            showing how a real system could go from <strong>0 → 1</strong> without storing
            your text beyond this request.
          </p>
        </header>

        <div className="plan-poc__layout">
          <div className="plan-poc__input-panel">
            <label className="plan-poc__label" htmlFor="case-text">
              Your case description
            </label>
            <textarea
              id="case-text"
              className="plan-poc__textarea"
              rows={10}
              value={text}
              placeholder="Include what happened, symptoms, location hints, and whether you already have counsel…"
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
            <div className="plan-poc__toolbar">
              <button
                type="button"
                className="btn btn--ghost plan-poc__demo"
                onClick={() => setText(DEMO_TEXT)}
                disabled={loading}
              >
                Load demo narrative
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => void submit()}
                disabled={loading || text.trim().length < 30}
              >
                {loading ? 'Matching…' : 'Generate plan'}
              </button>
            </div>
            <p className="plan-poc__hint">
              Minimum 30 characters. Requires the API running (e.g. <code>npm run dev:all</code>).
            </p>
            {error ? (
              <p className="plan-poc__error" role="alert">
                {error}
                {error.includes('fetch') || error.includes('Network') ? (
                  <>
                    {' '}
                    Start the API: <code>npm run dev:server</code> or <code>npm run dev:all</code>.
                  </>
                ) : null}
              </p>
            ) : null}
          </div>

          <div className="plan-poc__result" aria-live="polite">
            {!plan && !loading ? (
              <div className="plan-poc__empty">
                <h3 className="plan-poc__empty-title">What you’ll see</h3>
                <ol className="plan-poc__empty-list">
                  <li>
                    <strong>Signals</strong> — themes like motor vehicle, MSK, or neuro inferred from text.
                  </li>
                  <li>
                    <strong>Matches</strong> — top coordinators & attorneys with scores and reasons.
                  </li>
                  <li>
                    <strong>Plan</strong> — phased checklist from intake through records readiness.
                  </li>
                </ol>
              </div>
            ) : null}

            {loading ? <p className="plan-poc__loading">Running matcher…</p> : null}

            {plan ? (
              <div className="plan-poc__output">
                <p className="plan-poc__disclaimer">{plan.disclaimer}</p>

                <div className="plan-poc__algo">
                  <strong>{plan.algorithm.id}</strong>
                  <span>{plan.algorithm.method}</span>
                </div>

                <h3 className="plan-poc__h3">Detected signals</h3>
                <ul className="plan-poc__tags">
                  {plan.extractedSignals.themes.map((t) => (
                    <li key={t}>{t.replace(/_/g, ' ')}</li>
                  ))}
                  <li>Urgency: {plan.extractedSignals.urgency}</li>
                  {plan.extractedSignals.regionHint ? (
                    <li>Region hint: {plan.extractedSignals.regionHint}</li>
                  ) : (
                    <li>Region hint: none</li>
                  )}
                </ul>

                <p className="plan-poc__summary">{plan.caseSummary}</p>

                <div className="plan-poc__columns">
                  <div>
                    <h3 className="plan-poc__h3">Care coordinators</h3>
                    <ul className="plan-poc__cards">
                      {plan.coordinators.map((c) => (
                        <li key={c.id} className="plan-poc__card">
                          <div className="plan-poc__card-head">
                            <span className="plan-poc__name">{c.name}</span>
                            <span className="plan-poc__score">{c.score}% fit</span>
                          </div>
                          <p className="plan-poc__role">{c.role}</p>
                          <ul className="plan-poc__reasons">
                            {c.matchReasons.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                          <p className="plan-poc__strengths-label">Strengths</p>
                          <ul className="plan-poc__strengths">
                            {c.strengths.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="plan-poc__h3">Attorney partners (illustrative)</h3>
                    <ul className="plan-poc__cards">
                      {plan.attorneys.map((a) => (
                        <li key={a.id} className="plan-poc__card">
                          <div className="plan-poc__card-head">
                            <span className="plan-poc__name">{a.name}</span>
                            <span className="plan-poc__score">{a.score}% fit</span>
                          </div>
                          <p className="plan-poc__role">{a.firm}</p>
                          <ul className="plan-poc__reasons">
                            {a.matchReasons.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                          <p className="plan-poc__strengths-label">Strengths</p>
                          <ul className="plan-poc__strengths">
                            {a.strengths.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h3 className="plan-poc__h3">Care plan (0 → 1)</h3>
                <p className="plan-poc__horizon">{plan.carePlan.horizon}</p>
                <ol className="plan-poc__timeline">
                  {plan.carePlan.phases.map((ph) => (
                    <li key={ph.order} className="plan-poc__phase">
                      <div className="plan-poc__phase-head">
                        <span className="plan-poc__phase-num">Phase {ph.order}</span>
                        <span className="plan-poc__phase-window">{ph.window}</span>
                      </div>
                      <h4 className="plan-poc__phase-title">{ph.title}</h4>
                      <p className="plan-poc__phase-sum">{ph.summary}</p>
                      <p className="plan-poc__phase-owner">
                        <strong>Lead:</strong> {ph.owner}
                      </p>
                      <ul className="plan-poc__phase-steps">
                        {ph.steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>

                <h3 className="plan-poc__h3">Checkpoints</h3>
                <ul className="plan-poc__checkpoints">
                  {plan.carePlan.checkpoints.map((c) => (
                    <li key={c.label}>
                      <strong>{c.label}</strong>
                      <span>{c.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
