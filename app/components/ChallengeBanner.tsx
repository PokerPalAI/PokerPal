'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ChallengeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      // Update the parent container padding
      const parentDiv = document.querySelector('[style*="paddingTop: 48px"]') as HTMLElement;
      if (parentDiv) {
        parentDiv.style.paddingTop = '0px';
        parentDiv.style.transition = 'padding-top 0.3s ease';
      }
      
      // Update home page navigation
      const heroNav = document.querySelector('.hero-nav') as HTMLElement;
      if (heroNav) {
        heroNav.style.top = '0px';
        heroNav.style.transition = 'top 0.3s ease';
      }
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="challenge-banner">
      <div className="banner-content">
        <Link href="/challenge" className="banner-link">
          🔥 Enter our Free Last Longer Challenge happening Dec 15-22, 2024 🔥
        </Link>
        <button 
          className="banner-close"
          onClick={handleClose}
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
      
      <style jsx>{`
        .challenge-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(90deg, #87CEEB, #4682B4, #1e3a8a);
          color: white;
          z-index: 1000;
          font-family: "Montserrat", sans-serif;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transform: ${isClosing ? 'translateY(-100%)' : 'translateY(0)'};
          transition: transform 0.3s ease;
        }

        .banner-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .banner-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          text-align: center;
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        }

        .banner-link:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }

        .banner-close {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .banner-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
          }
          50% { 
            opacity: 0.8; 
          }
        }

        @media (max-width: 768px) {
          .banner-content {
            padding: 10px 1rem;
          }

          .banner-link {
            font-size: 0.875rem;
            padding-right: 40px;
          }

          .banner-close {
            right: 0.5rem;
            width: 28px;
            height: 28px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .banner-link {
            font-size: 0.75rem;
            line-height: 1.3;
          }
        }
      `}</style>
    </div>
  );
}
