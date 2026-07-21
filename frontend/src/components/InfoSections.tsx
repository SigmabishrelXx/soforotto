import { useState } from 'react'
import { motion } from 'motion/react'
import {
  HeartPulse,
  ShieldCheck,
  LifeBuoy,
  MessageCircleHeart,
  ArrowUpRight,
  Flame,
  Award,
} from 'lucide-react'
import { VolunteerModal } from './VolunteerModal'
import { RoleJourney } from './RoleJourney'
import { ScrollScaleReveal } from './ui/scroll-scale-reveal'

const RESOURCES = [
  {
    icon: HeartPulse,
    title: 'Feeling anxious or low',
    blurb: 'What anxiety and low moods can feel like, and small things that actually help.',
    href: 'https://jedfoundation.org/mental-health-resource-center/',
    fg: '#c85a34',
    tint: '#fbe6dc',
  },
  {
    icon: ShieldCheck,
    title: 'Dealing with bullying',
    blurb: 'How to recognize bullying and cyberbullying, and what you can do about it.',
    href: 'https://www.stopbullying.gov/',
    fg: '#3f77b3',
    tint: '#e3edf7',
  },
  {
    icon: LifeBuoy,
    title: 'Thoughts of self-harm',
    blurb: 'If things feel unbearable, trained counselors are there 24/7, free and confidential.',
    href: 'https://988lifeline.org/',
    fg: '#c0504d',
    tint: '#f7e4e3',
  },
  {
    icon: MessageCircleHeart,
    title: 'Just need to talk',
    blurb: 'Teen-to-teen support lines where someone will actually listen, no judgment.',
    href: 'https://www.teenline.org/',
    fg: '#4e8c63',
    tint: '#e4f1e9',
  },
]

const VOLUNTEER_ROLES = [
  {
    role: 'Peer Listener',
    blurb: 'For older teens and young adults trained to read messages and respond with care.',
  },
  {
    role: 'Community Moderator',
    blurb: 'Helps keep response times fast and flags anything that needs a professional referral.',
  },
]

const PRIVACY_POINTS = [
  'You never have to give your name, email, or any account to use this. It works with none of that.',
  'We don’t ask for or store anything that could identify you unless you choose to leave an email.',
  'If you choose to leave an email, it’s used only to send you a reply, and only volunteer moderators can see it, never shared with schools, parents, platforms, or anyone else.',
  'Messages are never posted publicly, screenshotted, or shared outside the small team that responds to them.',
]

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 sm:mb-12 md:mb-14">
      <p className="text-xs uppercase tracking-[0.2em] text-[#544b43] mb-3">{eyebrow}</p>
      <h2
        className="font-bold tracking-tight text-[#2b2420] leading-[1.05]"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
      >
        {title}
      </h2>
    </div>
  )
}

export function InfoSections() {
  const [volunteerRole, setVolunteerRole] = useState<string | null>(null)

  return (
    <div className="relative z-10 w-full">
      <motion.section
        id="resources"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 border-t border-[#ece2d9]"
      >
        <SectionHeading eyebrow="Help & info" title="Resources" />
        <p className="text-base sm:text-lg text-[#544b43] max-w-2xl -mt-6 mb-12 leading-relaxed">
          Whatever you&apos;re dealing with, you don&apos;t have to figure it out alone. These are
          trusted places to learn more or get help right away.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {RESOURCES.map((r, index) => {
            const Icon = r.icon
            return (
              <motion.a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex gap-5 rounded-3xl border border-[#ece2d9] bg-[#fffdf9] p-6 sm:p-7 shadow-[0_4px_18px_rgba(120,80,50,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(120,80,50,0.12)]"
              >
                <span
                  className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: r.tint }}
                >
                  <Icon size={26} style={{ color: r.fg }} />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-semibold text-[#2b2420]">{r.title}</h3>
                    <ArrowUpRight
                      size={18}
                      className="text-[#544b43] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </div>
                  <p className="text-sm text-[#544b43] mt-1.5 leading-relaxed">{r.blurb}</p>
                  <span
                    className="inline-block text-xs font-semibold uppercase tracking-widest mt-4"
                    style={{ color: r.fg }}
                  >
                    Learn more &rarr;
                  </span>
                </div>
              </motion.a>
            )
          })}
        </div>
      </motion.section>

      <motion.section
        id="about"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 border-t border-[#ece2d9]"
      >
        <SectionHeading eyebrow="Why this exists" title="About" />
        <p className="text-lg sm:text-xl text-[#544b43] leading-relaxed max-w-2xl">
          Most teens don&apos;t have someone easy to talk to who isn&apos;t a parent, a teacher, or
          a scheduled therapy appointment. Soforotto is a small group of trained volunteers and
          counselors-in-training who read every message that comes in and respond with care, not
          a form that disappears into a void. The AI is there for instant company when you need it
          right now; it&apos;s never a replacement for the humans reading what you send.
        </p>

        <ScrollScaleReveal className="mt-16 sm:mt-20">
          <div
            className="rounded-[2rem] px-8 py-20 sm:py-28 text-center shadow-[0_24px_60px_rgba(120,80,50,0.12)]"
            style={{
              background:
                'linear-gradient(135deg, #ffe0cf 0%, #fbccd7 45%, #e7d6ff 100%)',
            }}
          >
            <p
              className="font-serif italic text-[#2b2420] leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.4rem)' }}
            >
              “You deserve to be heard.”
            </p>
            <p className="text-[#544b43] mt-5 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
              You don&apos;t have to be in crisis to reach out. Everyday hard is reason enough.
            </p>
          </div>
        </ScrollScaleReveal>
      </motion.section>

      <motion.section
        id="volunteer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 border-t border-[#ece2d9]"
      >
        <SectionHeading eyebrow="Join us" title="Volunteer" />
        <div className="flex flex-col">
          {VOLUNTEER_ROLES.map((opening, index) => (
            <motion.div
              key={opening.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="grid sm:grid-cols-2 items-center gap-6 sm:gap-12 py-8 sm:py-10 border-b border-[#ece2d9] last:border-b-0"
            >
              <div>
                <p
                  className="font-medium uppercase tracking-tight text-[#2b2420]"
                  style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}
                >
                  {opening.role}
                </p>
                <p className="text-sm sm:text-base text-[#544b43] mt-1 max-w-md">
                  {opening.blurb}
                </p>
                <button
                  type="button"
                  onClick={() => setVolunteerRole(opening.role)}
                  className="mt-4 inline-block text-[#2b2420] uppercase text-xs font-medium tracking-widest hover:opacity-70 transition-opacity"
                >
                  Apply &rarr;
                </button>
              </div>
              <RoleJourney role={opening.role as 'Peer Listener' | 'Community Moderator'} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-12 sm:mt-16 bg-[#f7f0e9] border border-[#ece2d9] rounded-2xl p-6 sm:p-8 max-w-2xl"
        >
          <p className="text-xs uppercase tracking-widest text-[#544b43] mb-3">
            How we keep this safe
          </p>
          <ul className="flex flex-col gap-3 text-sm sm:text-base text-[#544b43] leading-relaxed">
            <li>
              Every volunteer completes screening and crisis-response training before they can
              read incoming messages. Nobody gets access on day one.
            </li>
            <li>
              Messages are checked multiple times a day. If you left a way to reach you and
              haven&apos;t heard back within 24 hours, use the emergency button instead of
              waiting.
            </li>
            <li>
              Anything showing signs of real risk gets flagged immediately for a professional
              referral. It doesn&apos;t sit with a single volunteer to handle alone.
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 rounded-3xl border border-[#ece2d9] bg-[#fffdf9] p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6">
            <p className="text-xs uppercase tracking-widest text-[#544b43]">
              What listening adds up to
            </p>
            <span
              className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: '#f0e7dd', color: '#8a7d72' }}
            >
              Example
            </span>
            <p className="text-[11px] text-[#8a7d72]">
              an illustration of one listener&apos;s impact page
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#f7f0e9] border border-[#ece2d9] p-5">
              <Flame size={18} className="text-[#c85a34] mb-2" />
              <p className="text-2xl font-black text-[#2b2420] tabular-nums">12 weeks</p>
              <p className="text-xs text-[#544b43] mt-1 leading-relaxed">
                check-in streak: showed up at least once every week
              </p>
            </div>
            <div className="rounded-2xl bg-[#f7f0e9] border border-[#ece2d9] p-5">
              <MessageCircleHeart size={18} className="text-[#4e8c63] mb-2" />
              <p className="text-2xl font-black text-[#2b2420] tabular-nums">312</p>
              <p className="text-xs text-[#544b43] mt-1 leading-relaxed">
                notes read and answered with care
              </p>
            </div>
            <div className="rounded-2xl bg-[#f7f0e9] border border-[#ece2d9] p-5">
              <HeartPulse size={18} className="text-[#3f77b3] mb-2" />
              <p className="text-2xl font-black text-[#2b2420] tabular-nums">1,204</p>
              <p className="text-xs text-[#544b43] mt-1 leading-relaxed">
                &ldquo;you&apos;re not alone&rdquo; reactions on posts they supported
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#ece2d9]">
            <div className="flex items-center justify-between mb-2">
              <p className="flex items-center gap-2 text-xs font-semibold text-[#2b2420]">
                <Award size={14} className="text-[#c85a34]" /> Trusted Listener
              </p>
              <p className="text-[11px] text-[#8a7d72]">38 more notes to Anchor</p>
            </div>
            <div className="h-2 rounded-full bg-[#f0e6da] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: '72%', background: 'linear-gradient(90deg, #e8734a, #c85a34)' }}
              />
            </div>
            <p className="text-[11px] text-[#8a7d72] mt-3 leading-relaxed">
              Levels unlock nothing but trust: more training, then mentoring newer listeners.
              There is no leaderboard here on purpose. Care isn&apos;t a competition.
            </p>
          </div>
        </motion.div>

        <ScrollScaleReveal className="mt-16 sm:mt-20">
          <div
            className="rounded-[2rem] px-8 py-20 sm:py-28 text-center shadow-[0_24px_60px_rgba(120,80,50,0.12)]"
            style={{
              background:
                'linear-gradient(135deg, #e4f1e9 0%, #ffe8c6 50%, #ffe0cf 100%)',
            }}
          >
            <p
              className="font-serif italic text-[#2b2420] leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.4rem)' }}
            >
              “It takes one person to make someone feel less alone.”
            </p>
            <p className="text-[#544b43] mt-5 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
              That person could be you. A few hours a week is enough to change how someone&apos;s
              week goes.
            </p>
          </div>
        </ScrollScaleReveal>
      </motion.section>

      <motion.section
        id="privacy"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 border-t border-[#ece2d9]"
      >
        <SectionHeading eyebrow="The important part" title="Your privacy" />
        <ul className="flex flex-col gap-6 max-w-2xl">
          {PRIVACY_POINTS.map((point, index) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-3 text-[#544b43] leading-relaxed text-base sm:text-lg"
            >
              <span className="text-[#2b2420] mt-1 shrink-0">&#10003;</span>
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
        <p className="text-sm text-[#544b43] mt-10 max-w-2xl">
          If what you&apos;re going through feels like an emergency (you or someone else is in
          immediate danger), please contact local emergency services or a crisis line (like 988 in
          the US) right away. This site is for everyday support, not emergency response.
        </p>
      </motion.section>

      <VolunteerModal role={volunteerRole} onClose={() => setVolunteerRole(null)} />
    </div>
  )
}
