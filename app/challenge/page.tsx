import Image from 'next/image';
import Link from 'next/link';
import './challenge.css';

export default function Challenge() {
  return (
    <div className="challenge-page">
      {/* Navigation */}
      <nav className="challenge-nav">
        <div className="nav-content">
          <Link href="/" className="nav-logo">
            <Image src="/hero-logo.svg" alt="Poker Pal" width={120} height={40} />
          </Link>
          <div className="nav-links">
            {/* <Link href="/team-perks" className="nav-link">Team Perks</Link> */}
            <Link href="/challenge" className="nav-link active">Challenge</Link>
            <Link href="#about-us" className="nav-link">About Us</Link>
          </div>
          <Link href="/intake" className="nav-cta">APPLY NOW</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="challenge-badge">
            <span className="fire-emoji">🔥</span>
          </div>
          <h1>PokerPal Sponsored Free<br />Last Longer Challenge</h1>
          <p className="hero-subtitle">
            Compete against fellow Founding Members in live tournaments for cash prizes and exclusive recognition.
            Entry is completely free — just register and outlast the competition.
          </p>
          <div className="prize-highlight">
            <span className="prize-amount">$1,000</span>
            <span className="prize-label">Grand Prize + Founders' Kit</span>
          </div>
        </div>
      </section>

      {/* Challenge Details */}
      <section className="details-section">
        <div className="details-container">
          
          {/* Entry Requirements */}
          <div className="detail-card">
            <div className="card-header">
              <span className="card-number">1</span>
              <h3>Entry Requirements</h3>
            </div>
            <ul>
              <li>Must be officially registered in the Main Event of the designated live tournament</li>
              <li>Must be an approved Founding Team Member of PokerPal</li>
              <li>Entry is free — no additional cost to participate</li>
            </ul>
            <div className="future-note">
              <strong>Future contests:</strong> Will require downloading the PokerPal app and creating an account before tournament start.
            </div>
          </div>

          {/* Registration Process */}
          <div className="detail-card">
            <div className="card-header">
              <span className="card-number">2</span>
              <h3>Registration Process</h3>
            </div>
            <ul>
              <li>PokerPal will send an email to all eligible members ahead of each tournament</li>
              <li>Members must confirm participation via the provided registration form</li>
              <li>Registration closes when late registration for the tournament ends</li>
              <li>If the tournament allows re-entries/rebuys, all confirmed entrants remain eligible until eliminated</li>
            </ul>
          </div>

          {/* Contest Rules */}
          <div className="detail-card">
            <div className="card-header">
              <span className="card-number">3</span>
              <h3>Contest Rules</h3>
            </div>
            <ul>
              <li>The last remaining player among registered entrants is declared the winner</li>
              <li>Only players who cash in the tournament are eligible for prizes. If no entrant cashes, no prize will be awarded</li>
              <li>Official tournament reporting (e.g., WSOP, WPT, circuit operator) will be used to determine finishing places</li>
              <li>By entering, contestants agree to allow PokerPal to post updates and tag them on social media, in-app leaderboards, and marketing materials</li>
            </ul>
          </div>

          {/* Prize Structure */}
          <div className="detail-card featured">
            <div className="card-header">
              <span className="card-number">4</span>
              <h3>Prize Structure</h3>
            </div>
            <div className="prize-breakdown">
              <div className="grand-prize">
                <span className="prize-title">Grand Prize</span>
                <span className="prize-value">$1,000</span>
                <span className="prize-sponsor">(sponsored)</span>
              </div>
              <div className="all-entrants-prize">
                <span className="prize-title">All Entrants</span>
                <span className="prize-description">PokerPal Founders' Kit</span>
                <span className="prize-details">(merch + exclusive member perks)</span>
              </div>
            </div>
          </div>

          {/* Marketing Tie-In */}
          <div className="detail-card">
            <div className="card-header">
              <span className="card-number">5</span>
              <h3>Marketing Tie-In <span className="future-tag">(Future)</span></h3>
            </div>
            <div className="marketing-features">
              <div className="feature">
                <strong>Live Leaderboard:</strong> Track entrants in the PokerPal app (updates after each break)
              </div>
              <div className="feature">
                <strong>Push Notifications:</strong> "🔥 25 left in the Last Longer — who's still standing?"
              </div>
              <div className="feature">
                <strong>Social Spotlights:</strong> Entrants featured on PokerPal social (with permission)
              </div>
              <div className="feature">
                <strong>Winner Feature:</strong> Full spotlight story in the PokerPal app and channels
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="detail-card">
            <div className="card-header">
              <span className="card-number">6</span>
              <h3>Compliance</h3>
            </div>
            <ul>
              <li>This is a free promotional contest, not a gambling product</li>
              <li>PokerPal will publish clear terms & conditions, including eligibility, prize details, and winner determination</li>
              <li>Open only to Founding Team Members in good standing and subject to applicable laws</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Example Contest */}
      <section className="example-section">
        <div className="example-content">
          <div className="example-header">
            <span className="fire-emoji">🔥</span>
            <h2>Example Contest Setup</h2>
          </div>
          <div className="example-details">
            <div className="example-item">
              <strong>Name:</strong> PokerPal Last Longer Challenge
            </div>
            <div className="example-item">
              <strong>Prize:</strong> $1,000 + app feature + Founders' Kit
            </div>
            <div className="example-item">
              <strong>Entry:</strong> Free with app signup + registration before Day 1
            </div>
            <div className="example-item">
              <strong>Updates:</strong> Live in the PokerPal app + on social channels
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Join the Challenge?</h2>
          <p>Become a Founding Member and get exclusive access to our Last Longer Challenges.</p>
          <Link href="/intake" className="cta-button">
            BECOME A FOUNDING MEMBER
          </Link>
          <p className="cta-note">Free entry • Cash prizes • Exclusive perks</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="challenge-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Image src="/pokerpal-logomark.svg" alt="Poker Pal" width={32} height={32} />
            <span>pokerpal.ai</span>
          </div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            {/* <Link href="/team-perks">Team Perks</Link> */}
            <Link href="/challenge">Challenge</Link>
            <Link href="#about-us">About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
