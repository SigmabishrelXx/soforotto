import { Link } from 'react-router-dom'

const EXPLORE = [
  { label: 'The Wall', href: '/wall', router: true },
  { label: 'Community weather', href: '/weather', router: true },
  { label: 'Resources', href: '/#resources', router: false },
  { label: 'About', href: '/#about', router: false },
  { label: 'Volunteer', href: '/#volunteer', router: false },
]

const SUPPORT = [
  { label: 'Get in touch', href: '/#inquiry', router: false },
  { label: 'Your privacy', href: '/#privacy', router: false },
  { label: 'Privacy Policy', href: '/privacy-policy', router: true },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="lk-footer">
      <div className="lk-footer-inner">
        <div className="lk-footer-brand">
          <div className="lk-logo">
            <span className="lk-logo-text">Soforotto</span>
            <span className="lk-logo-mark">&trade;</span>
          </div>
          <p className="lk-footer-tagline">
            An anonymous space for teens to be heard. Not a crisis service.
          </p>
        </div>

        <div className="lk-footer-col">
          <p className="lk-footer-heading">Explore</p>
          {EXPLORE.map((link) =>
            link.router ? (
              <Link key={link.label} to={link.href}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ),
          )}
        </div>

        <div className="lk-footer-col">
          <p className="lk-footer-heading">Support &amp; safety</p>
          {SUPPORT.map((link) =>
            link.router ? (
              <Link key={link.label} to={link.href}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ),
          )}
        </div>
      </div>

      <div className="lk-footer-crisis">
        In a crisis? Call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline), text{' '}
        <strong>HOME to 741741</strong>, or call <strong>911</strong> if someone is in immediate
        danger.
      </div>

      <div className="lk-footer-bottom">
        <span>
          &copy; {year} Soforotto, a student project, not a licensed counseling service.
        </span>
        <div className="lk-footer-meta">
          <Link to="/built-with" className="lk-built-with">
            Built with <strong>Sub0</strong> + <strong>LingoQL</strong>
          </Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}
