import Image from 'next/image';
import Link from 'next/link';
import './team-perks.css';

export default function TeamPerks() {
  return (
    <div className="team-perks-page">
      {/* Navigation */}
      <nav className="team-perks-nav">
        <div className="nav-content">
          <Link href="/" className="nav-logo">
            <Image src="/hero-logo.svg" alt="Poker Pal" width={120} height={40} />
          </Link>
          <div className="nav-links">
            <Link href="/team-perks" className="nav-link active">Team Perks</Link>
            <Link href="/challenge" className="nav-link">Long Laster Challenge</Link>
            {/* <Link href="#about-us" className="nav-link">About Us</Link> */}
          </div>
          <Link href="/intake" className="nav-cta">APPLY NOW</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="founding-badge">
            <Image src="/pokerpal-logomark.svg" alt="Poker Pal" width={60} height={60} />
          </div>
          <h1>Founding Member Rewards</h1>
          <p className="hero-subtitle">
            Becoming a PokerPal Founding Team Member means more than early access — it&apos;s lifetime recognition, 
            exclusive perks, and entry into our sponsored Last Longer Contests.
          </p>
          <div className="limited-spots">
            <span className="spots-badge">Only accepting <strong>100</strong> founding members</span>
          </div>
        </div>
      </section>

      {/* Rewards Grid */}
      <section className="rewards-section">
        <div className="rewards-container">
          {/* Exclusive Recognition */}
          <div className="reward-card">
            <div className="reward-icon">
              <div className="icon-badge">👑</div>
            </div>
            <h3>Exclusive Recognition</h3>
            <ul>
              <li>Founding Badge & Title on your in-app profile (e.g., &quot;OG #001&quot;)</li>
              <li>Lifetime Founding Member Tier with permanent perks</li>
              <li>Your name featured on the Founders Wall inside the app and website</li>
            </ul>
          </div>

          {/* Financial & Value Perks */}
          <div className="reward-card">
            <div className="reward-icon">
              <div className="icon-badge">💰</div>
            </div>
            <h3>Financial & Value Perks</h3>
            <ul>
              <li>Founders-only freerolls with guaranteed prize pools</li>
              <li>Exclusive access to high-value tournaments</li>
              <li>Priority in sponsored events and contests</li>
            </ul>
          </div>

          {/* Access & Exclusivity */}
          <div className="reward-card">
            <div className="reward-icon">
              <div className="icon-badge">🚀</div>
            </div>
            <h3>Access & Exclusivity</h3>
            <ul>
              <li>Early access to app + new features before public release</li>
              <li>Beta tester privileges — your feedback shapes the app</li>
              <li>VIP Support Line for faster service</li>
              <li>Private Founders Lounge chat group</li>
            </ul>
          </div>

          {/* Real-World Rewards */}
          <div className="reward-card">
            <div className="reward-icon">
              <div className="icon-badge">🎁</div>
            </div>
            <h3>Real-World Rewards</h3>
            <ul>
              <li>Founders Merch Pack (hoodie, hat, custom cards, chip set)</li>
              <li>Discounts on partnered live events & tournaments</li>
              <li>Access to exclusive wellness experiences with pros & influencers</li>
            </ul>
          </div>

          {/* Prestige & Gamification */}
          <div className="reward-card">
            <div className="reward-icon">
              <div className="icon-badge">🏆</div>
            </div>
            <h3>Prestige & Gamification</h3>
            <ul>
              <li>Founders-only avatars, table themes, animations</li>
              <li>Lifetime Founders Ranking Board to compete with peers</li>
              <li>Unlockable achievement badges reserved for early adopters</li>
            </ul>
          </div>

          {/* Big Ticket Incentives */}
          <div className="reward-card featured">
            <div className="reward-icon">
              <div className="icon-badge">💎</div>
            </div>
            <h3>Big Ticket Incentives</h3>
            <ul>
              <li>Founders-only annual freeroll (e.g., $10k prize pool)</li>
              <li>Seat giveaways for WSOP / WPT events</li>
              <li>Exclusive access to championship tournaments</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Become a Founding Member?</h2>
          <p>Join the exclusive group of 100 founding members and unlock lifetime benefits.</p>
          <Link href="/intake" className="cta-button">
            SECURE YOUR SPOT
          </Link>
          <p className="spots-remaining">Limited spots remaining</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="team-perks-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Image src="/pokerpal-logomark.svg" alt="Poker Pal" width={32} height={32} />
            <span>pokerpal.live</span>
          </div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/team-perks">Team Perks</Link>
            {/* <Link href="#about-us">About Us</Link> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
