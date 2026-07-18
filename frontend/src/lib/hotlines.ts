// Crisis resources by country. Only numbers that are well-established and
// verifiable are hard-coded here; for anywhere not listed we point to the
// findahelpline.com international directory rather than risk a wrong number.

export type Hotline = {
  title: string
  subtitle: string
  href: string
  primary?: boolean
}

export type Country = {
  code: string
  name: string
  lines: Hotline[]
}

export const COUNTRIES: Country[] = [
  {
    code: 'US',
    name: 'United States',
    lines: [
      {
        title: 'Call or text 988',
        subtitle: 'Suicide & Crisis Lifeline, free, 24/7',
        href: 'tel:988',
        primary: true,
      },
      { title: 'Text HOME to 741741', subtitle: 'Crisis Text Line', href: 'sms:741741?&body=HOME' },
      { title: 'Call 911', subtitle: 'If someone is in immediate danger', href: 'tel:911' },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    lines: [
      {
        title: 'Call or text 988',
        subtitle: 'Suicide Crisis Helpline, free, 24/7',
        href: 'tel:988',
        primary: true,
      },
      { title: 'Call 911', subtitle: 'If someone is in immediate danger', href: 'tel:911' },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    lines: [
      {
        title: 'Call 116 123',
        subtitle: 'Samaritans, free, 24/7',
        href: 'tel:116123',
        primary: true,
      },
      { title: 'Text SHOUT to 85258', subtitle: 'Shout crisis text line', href: 'sms:85258?&body=SHOUT' },
      { title: 'Call 999', subtitle: 'If someone is in immediate danger', href: 'tel:999' },
    ],
  },
  {
    code: 'IE',
    name: 'Ireland',
    lines: [
      {
        title: 'Call 116 123',
        subtitle: 'Samaritans, free, 24/7',
        href: 'tel:116123',
        primary: true,
      },
      { title: 'Text HELLO to 50808', subtitle: 'Crisis text line', href: 'sms:50808?&body=HELLO' },
      { title: 'Call 112 or 999', subtitle: 'If someone is in immediate danger', href: 'tel:112' },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    lines: [
      { title: 'Call 13 11 14', subtitle: 'Lifeline, 24/7', href: 'tel:131114', primary: true },
      { title: 'Call 1800 55 1800', subtitle: 'Kids Helpline (ages 5-25)', href: 'tel:1800551800' },
      { title: 'Call 000', subtitle: 'If someone is in immediate danger', href: 'tel:000' },
    ],
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    lines: [
      {
        title: 'Call or text 1737',
        subtitle: 'Need to talk? Free, 24/7',
        href: 'tel:1737',
        primary: true,
      },
      { title: 'Call 111', subtitle: 'If someone is in immediate danger', href: 'tel:111' },
    ],
  },
  {
    code: 'IN',
    name: 'India',
    lines: [
      {
        title: 'Call 1800-599-0019',
        subtitle: 'KIRAN mental health helpline, 24/7',
        href: 'tel:18005990019',
        primary: true,
      },
      { title: 'Call 112', subtitle: 'If someone is in immediate danger', href: 'tel:112' },
    ],
  },
]

// Universal fallback for any country not listed above.
export const OTHER_COUNTRY: Country = {
  code: 'OTHER',
  name: 'Somewhere else / not listed',
  lines: [
    {
      title: 'Find a helpline in your country',
      subtitle: 'findahelpline.com, free, confidential lines worldwide',
      href: 'https://findahelpline.com',
      primary: true,
    },
    {
      title: 'Call your local emergency number',
      subtitle: 'If someone is in immediate danger right now',
      href: 'https://www.findahelpline.com',
    },
  ],
}
