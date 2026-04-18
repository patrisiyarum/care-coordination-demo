import { useCallback, useRef, useState } from 'react'
import { apiUrl } from '../api'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

export function CoordinationAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)
    const thread: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(thread)
    setLoading(true)

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: thread }),
      })
      const data: { reply?: string; error?: string; detail?: string } =
        await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || data.detail || `Request failed (${res.status})`)
      }
      if (!data.reply) {
        throw new Error('No reply from assistant')
      }

      setMessages([...thread, { role: 'assistant', content: data.reply }])
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: 'smooth',
        })
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  return (
    <section id="assistant" className="section assistant" aria-labelledby="assistant-title">
      <div className="shell">
        <header className="section__head">
          <h2 id="assistant-title">Coordination assistant</h2>
          <p>
            Ask high-level questions about how care coordination typically works for
            firms, providers, and patients. This assistant does not access real case
            data and is not a substitute for clinicians or attorneys.
          </p>
        </header>

        <div className="assistant__panel">
          <div className="assistant__thread" ref={listRef} role="log" aria-live="polite">
            {messages.length === 0 ? (
              <p className="assistant__empty">
                Try: &ldquo;How does scheduling usually work for PI cases?&rdquo; or
                &ldquo;What do attorneys typically need from a coordination team?&rdquo;
              </p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={
                    m.role === 'user' ? 'assistant__bubble assistant__bubble--user' : 'assistant__bubble'
                  }
                >
                  <span className="assistant__role">
                    {m.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <p className="assistant__text">{m.content}</p>
                </div>
              ))
            )}
            {loading ? (
              <p className="assistant__typing" aria-busy="true">
                Thinking…
              </p>
            ) : null}
          </div>

          {error ? (
            <p className="assistant__error" role="alert">
              {error}
              {error.includes('not configured') ? (
                <>
                  {' '}
                  Add <code>OPENAI_API_KEY</code> to <code>server/.env</code> and run{' '}
                  <code>npm run dev:all</code>.
                </>
              ) : null}
            </p>
          ) : null}

          <div className="assistant__composer">
            <label className="visually-hidden" htmlFor="assistant-input">
              Your message
            </label>
            <textarea
              id="assistant-input"
              className="assistant__input"
              rows={3}
              value={input}
              placeholder="Ask about coordination workflows (not medical or legal advice)…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send()
                }
              }}
              disabled={loading}
            />
            <button
              type="button"
              className="btn btn--primary assistant__send"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>

          <p className="assistant__legal">
            For emergencies, call <strong>911</strong>. For account-specific help,
            contact AP Healthcare via the{' '}
            <a href="https://aphealthcare.org/contact-us/" target="_blank" rel="noopener noreferrer">
              official contact form
            </a>{' '}
            or phone number in the footer.
          </p>
        </div>
      </div>
    </section>
  )
}
