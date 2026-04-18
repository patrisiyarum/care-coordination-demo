/**
 * POC matching engine: rule-based signals + weighted profile tags.
 * Demonstrates how a backend could score coordinators/attorneys and assemble a phased plan.
 * Not clinical or legal advice; fictional roster for illustration.
 */

const ALGO_ID = 'poc-matcher-v1'
const ALGO_METHOD =
  'Weighted keyword/theme extraction + profile tag overlap + urgency/region boosts; phase templates customized by themes.'

/** @type {Array<{ id: string, name: string, role: string, tags: string[], region: string, strengths: string[] }>} */
export const COORDINATORS = [
  {
    id: 'coord-1',
    name: 'Morgan Ellis',
    role: 'Lead Care Coordinator',
    region: 'georgia',
    tags: ['motor_vehicle', 'musculoskeletal', 'scheduling', 'liens'],
    strengths: [
      'High-volume auto injury routing',
      'MSK appointment sequencing',
      'Lien documentation hygiene',
    ],
  },
  {
    id: 'coord-2',
    name: 'Riley Park',
    role: 'Clinical Navigation Coordinator',
    region: 'georgia',
    tags: ['neuro', 'imaging', 'motor_vehicle', 'scheduling'],
    strengths: [
      'Concussion and headache pathways',
      'Imaging escalation when indicated',
      'Cross-specialty handoffs',
    ],
  },
  {
    id: 'coord-3',
    name: 'Sam Okonkwo',
    role: 'Provider Relations Coordinator',
    region: 'georgia',
    tags: ['musculoskeletal', 'premises', 'scheduling'],
    strengths: [
      'PT/chiro alignment',
      'Premises-liability intake patterns',
      'Reducing no-shows',
    ],
  },
  {
    id: 'coord-4',
    name: 'Avery Chen',
    role: 'Complex Case Coordinator',
    region: 'georgia',
    tags: ['catastrophic', 'motor_vehicle', 'liens', 'scheduling'],
    strengths: [
      'Multi-provider orchestration',
      'Long-horizon treatment maps',
      'Records consolidation',
    ],
  },
  {
    id: 'coord-5',
    name: 'Jamie Rivera',
    role: 'Patient Experience Coordinator',
    region: 'georgia',
    tags: ['premises', 'musculoskeletal', 'scheduling'],
    strengths: [
      'Transportation & language logistics',
      'Frequent touchpoints for anxious patients',
      'Education on what to expect',
    ],
  },
]

/** @type {Array<{ id: string, name: string, firm: string, tags: string[], region: string, strengths: string[] }>} */
export const ATTORNEYS = [
  {
    id: 'att-1',
    name: 'Jordan Blake',
    firm: 'Blake & Ruiz Injury Law (POC)',
    region: 'georgia',
    tags: ['motor_vehicle', 'insurance_disputes'],
    strengths: ['UM/UIM stacks', 'Liability disputes', 'Med-pay coordination'],
  },
  {
    id: 'att-2',
    name: 'Priya Nair',
    firm: 'Nair Trial Group (POC)',
    region: 'georgia',
    tags: ['premises', 'motor_vehicle'],
    strengths: ['Premises notice issues', 'Third-party investigations'],
  },
  {
    id: 'att-3',
    name: 'Marcus Webb',
    firm: 'Webb Legal (POC)',
    region: 'georgia',
    tags: ['catastrophic', 'motor_vehicle', 'product'],
    strengths: ['Serious injury valuation', 'Life-care narratives'],
  },
  {
    id: 'att-4',
    name: 'Elena Voss',
    firm: 'Voss Litigation (POC)',
    region: 'georgia',
    tags: ['neuro', 'motor_vehicle'],
    strengths: ['TBI presentation to carriers', 'Neuropsych timelines'],
  },
  {
    id: 'att-5',
    name: 'David Cho',
    firm: 'Cho Injury (POC)',
    region: 'georgia',
    tags: ['musculoskeletal', 'motor_vehicle'],
    strengths: ['Soft-tissue documentation', 'Fast-track settlements'],
  },
]

const THEME_RULES = [
  {
    tag: 'motor_vehicle',
    patterns: [
      /\bcar\b/,
      /\bauto\b/,
      /\baccident\b/,
      /\bcrash\b/,
      /\bwreck\b/,
      /\bmva\b/,
      /\brear[- ]ended\b/,
      /\bvehicle\b/,
      /\bdriver\b/,
      /\bintersection\b/,
    ],
  },
  { tag: 'premises', patterns: [/\bslip\b/, /\bfall\b/, /\btrip\b/, /\bstore\b/, /\bproperty\b/] },
  {
    tag: 'musculoskeletal',
    patterns: [
      /\bneck\b/,
      /\bback\b/,
      /\bspine\b/,
      /\bwhiplash\b/,
      /\bshoulder\b/,
      /\bknee\b/,
      /\bpt\b/,
      /\bphysical therapy\b/,
      /\bchiro\b/,
      /\bchiropractic\b/,
    ],
  },
  {
    tag: 'neuro',
    patterns: [
      /\bhead\b/,
      /\bconcussion\b/,
      /\btbi\b/,
      /\bbrain\b/,
      /\bdizz(y|iness)\b/,
      /\bheadaches?\b/,
      /\bneuro\b/,
    ],
  },
  { tag: 'imaging', patterns: [/\bmri\b/, /\bct\b/, /\bx-?ray\b/, /\bscan\b/, /\bimaging\b/] },
  {
    tag: 'catastrophic',
    patterns: [/\bfracture\b/, /\bsurgery\b/, /\bhospital\b/, /\bicub\b/, /\bambulance\b/, /\bserious\b/],
  },
]

const REGION_PATTERNS = [
  { region: 'georgia', patterns: [/\bgeorgia\b/, /\batlanta\b/, /\bga\b/, /\b303\d{2}\b/] },
]

const URGENT_PATTERNS = [
  /\burgent\b/,
  /\bemergency\b/,
  /\bemergency room\b/,
  /\b911\b/,
  /\bambulance\b/,
  /\bunconscious\b/,
  /\bsevere bleeding\b/,
]

/**
 * @param {string} text
 */
export function extractSignals(text) {
  const t = text.toLowerCase()
  /** @type {Set<string>} */
  const themes = new Set()

  for (const rule of THEME_RULES) {
    if (rule.patterns.some((re) => re.test(t))) {
      themes.add(rule.tag)
    }
  }

  let regionHint = null
  for (const { region, patterns } of REGION_PATTERNS) {
    if (patterns.some((re) => re.test(t))) {
      regionHint = region
      break
    }
  }

  let urgency = 'standard'
  if (URGENT_PATTERNS.some((re) => re.test(t))) {
    urgency = 'urgent'
  } else if (/\bsoon\b|\basap\b|\bquickly\b|\bthis week\b/i.test(t)) {
    urgency = 'priority'
  }

  if (themes.size === 0) {
    themes.add('musculoskeletal')
    themes.add('motor_vehicle')
  }

  return {
    themes: [...themes],
    regionHint,
    urgency,
  }
}

/**
 * @param {{ tags: string[], region?: string }} profile
 * @param {{ themes: string[], regionHint: string | null, urgency: string }} signals
 * @param {string} rawText
 */
function scoreProfile(profile, signals, rawText) {
  let score = 40
  const t = rawText.toLowerCase()
  const reasons = []

  for (const theme of signals.themes) {
    if (profile.tags.includes(theme)) {
      score += 14
      reasons.push(`Tag overlap: ${theme.replace(/_/g, ' ')}`)
    }
  }

  if (signals.regionHint && profile.region === signals.regionHint) {
    score += 12
    reasons.push(`Region alignment (${signals.regionHint})`)
  }

  if (signals.urgency === 'urgent' && profile.tags.includes('catastrophic')) {
    score += 10
    reasons.push('Urgent case → complex routing strength')
  }

  if (signals.urgency === 'priority' && profile.tags.includes('scheduling')) {
    score += 6
    reasons.push('Expedited scheduling focus')
  }

  if (/\bspanish\b|\btranslator\b|\binterpreter\b/i.test(t) && profile.id === 'coord-5') {
    score += 8
    reasons.push('Language / logistics emphasis')
  }

  if (/\battorney\b|\bfirm\b|\blawyer\b|\blawsuit\b/i.test(t)) {
    if (profile.id?.startsWith('att-')) {
      score += 5
      reasons.push('Legal context mentioned')
    }
  }

  return { score: Math.min(100, Math.round(score)), reasons }
}

/**
 * @param {typeof COORDINATORS[0]} a
 * @param {typeof COORDINATORS[0]} b
 */
function byScoreDesc(a, b) {
  return b.score - a.score
}

/**
 * @param {typeof COORDINATORS | typeof ATTORNEYS} pool
 * @param {{ themes: string[], regionHint: string | null, urgency: string }} signals
 * @param {string} rawText
 */
function rankPool(pool, signals, rawText) {
  return pool
    .map((p) => {
      const { score, reasons } = scoreProfile(p, signals, rawText)
      return {
        ...p,
        score,
        matchReasons: reasons.slice(0, 4),
      }
    })
    .sort(byScoreDesc)
}

/**
 * @param {{ themes: string[], urgency: string }} signals
 */
function buildCarePlan(signals) {
  const neuro = signals.themes.includes('neuro')
  const mv = signals.themes.includes('motor_vehicle')
  const urgent = signals.urgency === 'urgent'

  /** @type {Array<{ order: number, title: string, window: string, summary: string, steps: string[], owner: string }>} */
  const phases = [
    {
      order: 1,
      title: 'Intake & safety',
      window: 'Days 0–3',
      summary:
        'Confirm facts, screen for red flags, and stand up your coordination thread across clinical and legal stakeholders.',
      owner: 'Care coordinator + triage',
      steps: [
        urgent
          ? 'If symptoms are severe or worsening: seek emergency care or call 911 (this POC does not triage).'
          : 'Document how the injury occurred, current symptoms, and any prior care.',
        'Assign a primary coordinator based on injury themes and capacity.',
        mv ? 'Preserve crash/premises context for liability narrative (factual only).' : 'Capture scene/context details relevant to your case type.',
        'Set communication preferences (SMS, email, calls) and language needs.',
      ],
    },
    {
      order: 2,
      title: 'Clinical evaluation path',
      window: 'Days 3–14',
      summary:
        'Sequence evaluations so the record tells a coherent story without unnecessary duplication.',
      owner: 'Coordinator + providers',
      steps: [
        neuro
          ? 'Schedule appropriate neuro evaluation or imaging workup when clinically indicated (clinician-directed).'
          : 'Schedule MSK evaluation and any entry-point imaging per treating clinician.',
        'Align PT/chiro/ortho referrals based on presentation and orders.',
        'Push updates to your legal team on milestones (dates only—no legal advice).',
      ],
    },
    {
      order: 3,
      title: 'Active care coordination',
      window: 'Weeks 2–8',
      summary: 'Keep appointments moving, resolve barriers, and consolidate documentation.',
      owner: 'Coordinator',
      steps: [
        'Weekly check-ins until stable; escalate if barriers (transport, language, scheduling).',
        'Track orders, referrals, and visit compliance for records completeness.',
        'Begin assembling medical bills/records checklist for later settlement support.',
      ],
    },
    {
      order: 4,
      title: 'Records & settlement readiness',
      window: 'Week 8+',
      summary:
        'Package the medical story for counsel; align on reductions and global resolution where applicable.',
      owner: 'Coordinator + counsel',
      steps: [
        'Finalize outstanding records and itemized billing.',
        'Support attorney requests for chronology-friendly updates.',
        'Plan handoff to lien resolution / global reduction workflows as appropriate.',
      ],
    },
  ]

  const checkpoints = [
    { label: 'Coordinator assigned', when: 'Day 0–1' },
    { label: 'Initial treating plan in motion', when: 'Week 1' },
    { label: 'Record completeness review', when: 'Week 6–10' },
    { label: 'Settlement packaging (as directed by counsel)', when: 'Case-dependent' },
  ]

  return {
    horizon: 'Illustrative first ~90 days; real timelines vary by jurisdiction and severity.',
    phases,
    checkpoints,
  }
}

/**
 * @param {{ themes: string[], urgency: string }} signals
 * @param {string} text
 */
function summarizeCase(signals, text) {
  const bits = []
  if (signals.themes.includes('motor_vehicle')) bits.push('motor-vehicle-related injury')
  if (signals.themes.includes('premises')) bits.push('premises/fall context')
  if (signals.themes.includes('neuro')) bits.push('possible neuro involvement')
  if (signals.themes.includes('musculoskeletal')) bits.push('MSK symptoms')
  if (signals.urgency === 'urgent') bits.push('urgency flagged in narrative')

  const themes = bits.length ? bits.join('; ') : 'general injury coordination'
  const snippet = text.trim().slice(0, 160).replace(/\s+/g, ' ')
  return `POC read of your narrative suggests ${themes}. Opening text: “${snippet}${text.trim().length > 160 ? '…' : ''}”`
}

/**
 * @param {string} description
 */
export function generateCarePlan(description) {
  const text = description.trim()
  const signals = extractSignals(text)

  const coordinators = rankPool(COORDINATORS, signals, text).slice(0, 3)
  const attorneys = rankPool(ATTORNEYS, signals, text).slice(0, 3)
  const carePlan = buildCarePlan(signals)

  return {
    poc: true,
    disclaimer:
      'Demonstration only. This POC does not provide medical or legal advice, does not access real provider or law firm data, and uses fictional names. A production system would integrate CRM/EHR, verified rosters, consent, and clinician-directed pathways.',
    algorithm: {
      id: ALGO_ID,
      method: ALGO_METHOD,
    },
    extractedSignals: {
      themes: signals.themes,
      urgency: signals.urgency,
      regionHint: signals.regionHint,
    },
    caseSummary: summarizeCase(signals, text),
    coordinators,
    attorneys,
    carePlan,
  }
}
