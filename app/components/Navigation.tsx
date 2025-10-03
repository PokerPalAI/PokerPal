"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../animation.css";

interface NavigationProps {
  onApplyClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isChallengePage?: boolean;
}

export default function Navigation({ onApplyClick, isChallengePage = false }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onApplyClick) {
      onApplyClick(e);
    }
  };

  return (
    <>
      <nav className={`hero-nav ${isChallengePage ? 'challenge-nav-override' : ''}`}>
        {/* Mobile Hamburger Menu - Left Side */}
        {isMobile && (
          <button 
            className="hamburger-menu"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
        
        <div className="nav-logo">
          <Link href="/">
            {isMobile ? (
              <Image src="/hero-logo-text.svg" alt="Poker Pal" width={100} height={24} />
            ) : (
              <Image src="/hero-logo.svg" alt="Poker Pal" width={120} height={40} />
            )}
          </Link>
        </div>
        
        <div className="nav-links">
          {/* <Link href="/team-perks">Team Perks</Link> */}
          <Link href="/challenge">Challenge</Link>
          <a href="#about-us">About Us</a>
        </div>
        
        <Link href="/intake" className="nav-cta" onClick={handleApplyClick}>APPLY NOW</Link>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <button 
                className="close-menu"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="mobile-menu-content">
              <div className="mobile-menu-logo">
                <Image src="/pokerpal-logomark.svg" alt="Poker Pal" width={32} height={32} />
              </div>
              {/* <Link href="/team-perks" onClick={() => setIsMobileMenuOpen(false)}>Team Perks</Link> */}
              <Link href="/challenge" onClick={() => setIsMobileMenuOpen(false)}>Challenge</Link>
              <a href="#about-us" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
              <Link href="/intake" className="mobile-apply-btn" onClick={(e) => { setIsMobileMenuOpen(false); handleApplyClick(e); }}>
                APPLY NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
