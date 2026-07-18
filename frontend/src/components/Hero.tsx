import { MessageCircle } from 'lucide-react'

const TICKER_ITEMS = ['School Stress', 'Friendships', 'Family Stuff', 'Feeling Alone', 'Just Venting']

const LEFT_LINES = Array.from({ length: 20 }, (_, i) => ({
  width: 60 + i * 10,
  delay: i * 0.25,
}))

const RIGHT_LINES = Array.from({ length: 20 }, (_, i) => ({
  width: 60 + i * 10,
  delay: i * 0.25,
}))

type HeroProps = {
  onShare: () => void
  onOpenChat: () => void
}

export function Hero({ onShare, onOpenChat }: HeroProps) {
  return (
    <section className="lk-hero">
      <div className="lk-curved-lines" aria-hidden="true">
        {LEFT_LINES.map((line, i) => (
          <div
            key={`left-${i}`}
            className="lk-curved-line left"
            style={{ width: line.width, animationDelay: `${line.delay}s` }}
          />
        ))}
        {RIGHT_LINES.map((line, i) => (
          <div
            key={`right-${i}`}
            className="lk-curved-line right"
            style={{ width: line.width, animationDelay: `${line.delay}s` }}
          />
        ))}
      </div>

      <div className="lk-curved-lines-top" aria-hidden="true">
        {LEFT_LINES.map((line, i) => (
          <div
            key={`top-${i}`}
            className="lk-curved-line-top"
            style={{ height: line.width, animationDelay: `${line.delay}s` }}
          />
        ))}
      </div>

      <div className="lk-ticker">
        <div className="lk-ticker-track">
          {Array.from({ length: 4 }, (_, row) => (
            <div className="lk-ticker-row" key={row}>
              {TICKER_ITEMS.map((item) => (
                <span className="lk-ticker-item" key={`${row}-${item}`}>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <h1 className="lk-hero-title">
        Someone to talk to, <span className="serif-italic">quietly</span>
        <sup>&reg;</sup>
      </h1>

      <p className="lk-hero-subtitle">
        A quiet, anonymous space for teens dealing with school, friends, or family stuff, no
        names, no accounts, just someone who&apos;ll listen.
      </p>

      <div className="lk-cta-row">
        <button type="button" className="lk-btn-primary" onClick={onShare}>
          Share, anonymously
        </button>

        <button type="button" className="lk-btn-book" onClick={onOpenChat}>
          <span className="lk-btn-book-icon">
            <MessageCircle size={18} />
          </span>
          <span className="lk-btn-book-text">
            <span className="lk-btn-book-primary">Talk to Soforotto AI</span>
            <span className="lk-btn-book-secondary">
              <span className="lk-green-dot" />
              AI, not a human. Instant, always on
            </span>
          </span>
        </button>
      </div>

      <div className="lk-hero-blur" aria-hidden="true" />
    </section>
  )
}
