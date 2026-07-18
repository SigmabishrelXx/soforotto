import { Link } from 'react-router-dom'
import { AI_DEMO_MODE } from '../lib/api'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold tracking-tight text-[#2b2420] mb-3">{title}</h2>
      <div className="flex flex-col gap-3 text-[#3f3f3f] leading-relaxed text-[15px]">{children}</div>
    </section>
  )
}

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen font-sans px-6 pt-28 pb-16 max-w-2xl mx-auto">
      <Link to="/" className="text-sm text-[#544b43] hover:opacity-70 transition-opacity">
        &larr; Back to Soforotto
      </Link>

      <h1 className="text-4xl md:text-5xl font-medium tracking-tight mt-6 mb-2">Privacy Policy</h1>
      <p className="text-sm text-[#544b43] mb-10">Last updated: July 2026</p>

      <div className="rounded-2xl border border-[#e4e9ef] bg-[#fffdf9]/70 px-6 py-5 mb-12">
        <p className="text-sm font-semibold text-[#2b2420] mb-2">The short version</p>
        <p className="text-sm text-[#3f3f3f] leading-relaxed">
          You can use Soforotto without giving your name, an email, or creating an account. We
          only store an email if you choose to leave one so a volunteer can reply. We don&apos;t
          run ads, sell data, or track you across the web. This is a student project, not a
          crisis service. If you&apos;re in danger, call or text 988, or call 911.
        </p>
      </div>

      <Section title="Who this is for">
        <p>
          Soforotto is an anonymous space where teens can share what they&apos;re going through
          and have a trained volunteer read it and respond. This policy explains, in plain
          language, what information is and isn&apos;t collected when you use it.
        </p>
      </Section>

      <Section title="What we ask you for">
        <p>
          Nothing is required to send a message. The topic tags and your message are the only
          things you need. Two fields are optional:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong>Nickname</strong> is optional, and it can be anything. It&apos;s only there so
            a reply can feel less anonymous if you want that.
          </li>
          <li>
            <strong>Email</strong> is optional. If you leave one, it&apos;s used only to send you a
            reply. If you leave it blank, there is no way for us to contact you, and that&apos;s
            fine.
          </li>
        </ul>
      </Section>

      <Section title="What we don't do">
        <p>
          We don&apos;t require accounts or passwords from the people we&apos;re here to help. We
          don&apos;t run advertising, we don&apos;t sell or rent any information, and we
          don&apos;t use third-party analytics or cross-site tracking cookies.
        </p>
      </Section>

      <Section title="What happens to your message">
        <p>
          Messages are stored so that a small, trained volunteer team can read and respond to
          them from a private dashboard. Only that team can see submissions and any optional
          email you left. Messages are never posted publicly, screenshotted, or shared outside
          that team, unless you explicitly choose to share one on The Wall.
        </p>
      </Section>

      <Section title="The Wall">
        <p>
          If you turn on &ldquo;Share on The Wall,&rdquo; your message is reviewed by a volunteer
          before anything appears publicly. When it&apos;s posted, only the topic tags, the
          message text, reaction counts, and a timestamp are shown. Your nickname and email
          are never included. The public feed is built so it structurally cannot return those
          fields.
        </p>
      </Section>

      <Section title="The AI chat">
        {AI_DEMO_MODE ? (
          <p>
            This deployment is running the AI chat in <strong>demo mode</strong>: replies are
            scripted and generated on your device, so your chat messages are not sent to any
            outside AI provider.
          </p>
        ) : (
          <p>
            When you use the AI chat, the messages you type are sent to a third-party AI provider
            (Anthropic) to generate a response. Don&apos;t share anything in the chat you
            wouldn&apos;t want processed by that provider. The AI is clearly labeled as an AI, not
            a human, and it will always point you to real crisis resources if you describe being
            in danger.
          </p>
        )}
      </Section>

      <Section title="Server logs (the honest part)">
        <p>
          Soforotto runs on third-party infrastructure (Sub0 and LingoQL). Like almost all web
          services, those providers may keep standard technical logs (for example, IP addresses
          in access logs) for security and reliability. We don&apos;t use those logs to identify
          you or link them to your message, and we don&apos;t control the providers&apos; own log
          retention. We mention this because promising &ldquo;we log absolutely nothing&rdquo;
          would not be truthful for any real website.
        </p>
      </Section>

      <Section title="Keeping data around">
        <p>
          Messages are kept only as long as needed to respond and to keep The Wall meaningful. If
          you left an email and want your submission removed, contact us and we&apos;ll delete it.
        </p>
      </Section>

      <Section title="Emergencies">
        <p>
          Soforotto is for everyday support, not emergencies, and it is not monitored around the
          clock. If you or someone else is in immediate danger, contact your local emergency
          number (911 in the US), call or text the 988 Suicide &amp; Crisis Lifeline, or text HOME
          to 741741 for the Crisis Text Line.
        </p>
      </Section>

      <Section title="Changes & contact">
        <p>
          If this policy changes, the date at the top will change with it. Questions about your
          privacy can be sent through the form on the home page.
        </p>
        <p className="text-[#544b43] text-sm">
          Soforotto is a student hackathon project and is not a licensed counseling or medical
          service.
        </p>
      </Section>
    </div>
  )
}
