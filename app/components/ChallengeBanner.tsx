'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ChallengeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Start with true to prevent flicker

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check mobile status immediately on mount to prevent flicker
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      
      // Update home page navigation (only if not on challenge page)
      const heroNav = document.querySelector('.hero-nav:not(.challenge-nav-override)') as HTMLElement;
      if (heroNav) {
        heroNav.style.top = '0px';
        heroNav.style.transition = 'top 0.3s ease';
      }
      
      // Ensure hero content maintains its spacing - the CSS will handle the 10vh padding automatically
    }, 300);
  };

  // Don't render anything on mobile to prevent flicker
  if (isMobile) return null;
  
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 h-12 bg-gradient-to-r from-sky-300 via-blue-600 to-blue-800 text-white z-[1000] font-['Montserrat',sans-serif] shadow-lg transition-transform duration-300 ease-in-out ${
        isClosing ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="w-full h-full flex items-center justify-center relative px-8 md:px-4">
        <Link 
          href="/challenge" 
          className="text-white no-underline font-semibold text-base text-center transition-all duration-300 ease-in-out hover:opacity-90 hover:scale-105 md:text-sm sm:text-xs sm:leading-tight"
        >
          <span className="hidden md:inline">🔥 Enter our Free Last Longer Challenge happening Dec 15-22, 2025 🔥</span>
          <span className="md:hidden">🔥 Join the Last Longer Challenge 🔥</span>
        </Link>
        <button 
          className="absolute right-4 bg-transparent border-none text-white text-lg cursor-pointer w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:bg-white/20 md:right-2 md:w-7 md:h-7 md:text-base sm:text-sm"
          onClick={handleClose}
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}