import type { ChatMessage } from './api'

// Crisis phrase detection. Deliberately errs toward catching things, a false
// positive just surfaces real help resources, which is a safe failure mode.
const CRISIS_PATTERNS: RegExp[] = [
  /\bkill(?:ing)?\s+my ?self\b/i,
  /\bkms\b/i,
  /\bend(?:ing)?\s+(?:my|it)\s+(?:life|all)\b/i,
  /\b(?:want|wanna|going|gonna)\s+to?\s+die\b/i,
  /\bdon'?t\s+want\s+to\s+(?:be here|live|exist)\b/i,
  /\bsuicid(?:e|al)\b/i,
  /\bself[-\s]?harm\b/i,
  /\bhurt(?:ing)?\s+my ?self\b/i,
  /\bcut(?:ting)?\s+my ?self\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
]

export function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text))
}

export const CRISIS_REPLY =
  "I'm really glad you told me this, and I want to make sure you're safe. This sounds serious, and " +
  'you deserve real support right now, more than an AI can give you. Please reach out to the 988 ' +
  'Suicide & Crisis Lifeline (call or text 988), or text HOME to 741741 for the Crisis Text Line. ' +
  "If you're in immediate danger, call 911. You can also tap the “I need help right now” " +
  "button on this page. I'll stay here with you, but please reach out to one of those now."

// ---------------------------------------------------------------------------
// Scripted demo responder. Not a real model, but varied and topic-aware so it
// doesn't obviously loop. The UI labels this "Demo mode" so it's never passed
// off as a live language model. Design: acknowledgement + topic-aware
// follow-up, chosen from large pools and de-duplicated against the last reply.
// ---------------------------------------------------------------------------

type Topic = {
  test: RegExp
  reflections: string[]
  questions: string[]
}

const TOPICS: Topic[] = [
  {
    test: /school|class|teacher|grade|exam|test|homework|college|study|fail/i,
    reflections: [
      'School piling up like that is genuinely exhausting, not something to just "push through".',
      'It makes sense school is getting to you. There\'s a lot riding on it and not much room to breathe.',
      'That pressure around school is real, even when adults act like it shouldn\'t be a big deal.',
    ],
    questions: [
      'Is it more the workload, or the people around it: teachers, classmates, expectations?',
      'When does it feel the heaviest: mornings, before a specific class, at night?',
      'If one part of it eased up tomorrow, which part would you pick?',
    ],
  },
  {
    test: /friend|lonely|alone|left out|group|fake|betray|ignored|fit in/i,
    reflections: [
      'Friend stuff cuts deep, even when people pretend it\'s "just drama".',
      'Feeling on the outside of your own group is a specific kind of lonely. I hear that.',
      'It\'s hard when the people who are supposed to have your back are the ones hurting you.',
    ],
    questions: [
      'Did something happen recently, or has this been building for a while?',
      'Is there anyone in your life right now who does feel safe to be around?',
      'What do you wish they understood about how it landed on you?',
    ],
  },
  {
    test: /fam|mom|mum|dad|parent|home|sister|brother|step|house|guardian/i,
    reflections: [
      'Home is supposed to be the one place you can exhale, and it\'s so hard when it isn\'t.',
      'Family stuff is heavy precisely because you can\'t just walk away from it.',
      'It takes a lot to carry that at home and still show up for everything else.',
    ],
    questions: [
      'Is it one person at home, or more the whole atmosphere right now?',
      'Do you get any space that feels like just yours?',
      'What would "a little better" actually look like at home for you?',
    ],
  },
  {
    test: /bull(y|ied|ying)|mean|picked on|threaten|rumou?r|harass|made fun/i,
    reflections: [
      'No one deserves to be treated like that. Full stop. This isn\'t you being "too sensitive".',
      'Being targeted like that wears you down even if you look fine on the outside.',
      'That\'s not something you should have to just tolerate or handle alone.',
    ],
    questions: [
      'How long has this been going on?',
      'Is it happening in person, online, or both?',
      'Has any adult you trust seen or heard about it yet?',
    ],
  },
  {
    test: /anx|stress|panic|overwhelm|can'?t sleep|worried|scared|pressure|burn/i,
    reflections: [
      'That kind of constant pressure is draining in a way people underestimate.',
      'Feeling wound that tight all the time isn\'t something you should have to just live with.',
      'Anxiety like that is real and physical. It\'s not you overreacting.',
    ],
    questions: [
      'When it hits hardest, where do you feel it: your chest, your head, your stomach?',
      'Is there anything, even small, that takes the edge off for a bit?',
      'Has it been steady lately, or does it come in waves?',
    ],
  },
]

const OPENING_ACKS = [
  "Thanks for trusting me with that. I'm an AI, not a person, but I'm here and I'm actually listening.",
  "I'm glad you said it out loud. You don't have to have any of it figured out to talk here.",
  "That took something to put into words. I'm an AI, so I can't fix it, but I can think it through with you.",
  "I'm really glad you're here. Whatever made you type that, it counts.",
  "However much or little you want to get into is okay with me.",
]

const GENERIC_ACKS = [
  "I hear you.",
  "That's a lot to be holding.",
  "Thank you for explaining that.",
  "That makes sense given everything you've said.",
  "You're not overreacting for feeling this way.",
  "None of this makes you a burden, for what it's worth.",
  "That sounds genuinely hard, and it's okay that it's getting to you.",
  "I can tell this has been weighing on you.",
  "It's okay if you don't have the words for all of it yet.",
]

const GENERIC_QUESTIONS = [
  'What\'s been the hardest part of it lately?',
  'Do you want to tell me a bit more about what happened?',
  'How long have you been carrying this on your own?',
  'What do you wish someone would say to you right now?',
  'Is this something you\'ve been able to tell anyone else?',
  'What would even a small step forward look like from here?',
  'What was going through your head when it happened?',
  'How are you feeling about it right now, in this moment?',
  'Is there a part of this you haven\'t said out loud yet?',
]

const REASSURANCE = [
  'Whatever you decide to do next, you deserve support with it.',
  "You've gotten through hard days before, even when it didn't feel like it.",
  "You don't have to sort this all out tonight.",
  "Feeling this doesn't mean you're doing anything wrong.",
  "You're allowed to take up space here.",
]

// Small deterministic hash so replies vary with content, not just turn count.
function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export function demoReply(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  const text = lastUser?.content ?? ''

  if (detectCrisis(text)) return CRISIS_REPLY

  // Never reuse a line we've already sent this conversation, so the demo doesn't
  // visibly loop. When a pool is exhausted we fall back to the next pool, and only
  // if everything is used do we seed-pick. (A real model, via the ai-chat endpoint,
  // replaces all of this once an Anthropic key is configured on the backend.)
  const priorReplies = messages
    .filter((m) => m.role === 'assistant')
    .map((m) => m.content)
    .join('\n')
  const isUsed = (line: string) => priorReplies.includes(line)
  const pickFresh = (pools: string[][], s: number): string => {
    for (const pool of pools) {
      const unused = pool.filter((line) => !isUsed(line))
      if (unused.length) return unused[s % unused.length]
    }
    const flat = pools.flat()
    return flat[s % flat.length]
  }

  const userTurns = messages.filter((m) => m.role === 'user').length
  const seed = hash(text) + userTurns * 101
  const topic = TOPICS.find((t) => t.test.test(text))
  const topicQuestions = topic ? topic.questions : []
  const topicReflections = topic ? topic.reflections : []

  // First reply: a warm opener + a question (topic-aware if we can tell).
  if (userTurns <= 1) {
    const ack = pickFresh([OPENING_ACKS], seed)
    const question = pickFresh([topicQuestions, GENERIC_QUESTIONS], seed)
    return `${ack} ${question}`
  }

  // Later replies: reflection + a fresh question, topic-aware first, then generic.
  const reflection = pickFresh([topicReflections, GENERIC_ACKS], seed)
  const question = pickFresh([topicQuestions, GENERIC_QUESTIONS], seed + 37)
  // Occasionally fold in a gentle line so it doesn't feel like pure Q&A.
  const reassure = userTurns % 3 === 0 ? ` ${pickFresh([REASSURANCE], seed + 5)}` : ''

  return `${reflection}${reassure} ${question}`
}
