const TRUST_ITEMS = [
  "You're never alone",
  'Always anonymous',
  'Real people respond',
  'Free for teens',
  'No sign-up needed',
]

export function TrustSection() {
  return (
    <div className="lk-trust">
      <p className="lk-trust-label">Why teens trust Soforotto</p>
      <div className="lk-trust-marquee">
        <div className="lk-trust-track">
          {Array.from({ length: 4 }, (_, row) => (
            <div className="lk-trust-row" key={row}>
              {TRUST_ITEMS.map((item) => (
                <span className="lk-trust-item" key={`${row}-${item}`}>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
