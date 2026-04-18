import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import OpenAI from 'openai'

const PORT = Number(process.env.PORT) || 3001
const MAX_MESSAGE_CHARS = 4000
const MAX_HISTORY_MESSAGES = 20

const SYSTEM_PROMPT = `You are a professional assistant for AP Healthcare, an organization that provides medical care coordination for personal injury cases—supporting attorneys, medical providers, and injured patients with scheduling, communication, records, and lien-related workflows.

Guidelines:
- Be concise, warm, and professional. Use plain language.
- Explain coordination concepts (scheduling, updates between parties, records, how teams typically work together) at a high level.
- Do NOT provide medical diagnosis, treatment recommendations, or legal advice. For clinical questions, encourage speaking with a treating clinician. For legal strategy, encourage speaking with an attorney.
- For emergencies or urgent medical situations, tell the user to call 911 or seek immediate in-person care.
- When you do not know something specific about a case or account, say so and suggest contacting AP Healthcare directly via their official contact channels.
- Never invent phone numbers, addresses, or policies; if asked for specifics, point to the official website or phone contact users can verify themselves.`

const app = express()

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : true

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
)
app.use(express.json({ limit: '128kb' }))

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_PER_MIN) || 30,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', apiLimiter)

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'care-coordination-api' })
})

function normalizeMessages(body) {
  if (body.messages && Array.isArray(body.messages)) {
    const cleaned = body.messages
      .filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string',
      )
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_CHARS),
      }))
    return cleaned.slice(-MAX_HISTORY_MESSAGES)
  }
  if (typeof body.message === 'string' && body.message.trim()) {
    return [{ role: 'user', content: body.message.trim().slice(0, MAX_MESSAGE_CHARS) }]
  }
  return null
}

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(503).json({
      error: 'AI backend is not configured. Set OPENAI_API_KEY in server/.env',
    })
    return
  }

  const messages = normalizeMessages(req.body)
  if (!messages?.length) {
    res.status(400).json({
      error: 'Send { message: string } or { messages: [{ role, content }] }',
    })
    return
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  try {
    const openai = new OpenAI({ apiKey })
    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.4,
      max_tokens: 800,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    })

    const text = completion.choices[0]?.message?.content?.trim()
    if (!text) {
      res.status(502).json({ error: 'Empty response from model' })
      return
    }

    res.json({ reply: text, model })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[api/chat]', message)
    res.status(502).json({ error: 'Assistant temporarily unavailable', detail: message })
  }
})

app.listen(PORT, () => {
  console.log(`Care coordination API listening on http://localhost:${PORT}`)
})
