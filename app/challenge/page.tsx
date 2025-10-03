"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from 'next/image';
import Link from 'next/link';

export default function Challenge() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const eventsRef = useRef<HTMLElement>(null);
  const challengeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize animations immediately
    const initPageAnimations = () => {
      const nav = navRef.current;
      const heroBackground = heroRef.current?.querySelector('.hero-background');
      const heroTitle = heroRef.current?.querySelector('.hero-title');
      const heroSubtext = heroRef.current?.querySelector('.hero-subtext');
      const heroButton = heroRef.current?.querySelector('.hero-button');
      const eventsTitle = eventsRef.current?.querySelector('.events-title');
      const challengeTitle = challengeRef.current?.querySelector('.challenge-title');

      // Filter out null/undefined elements
      const allElements = [nav, heroBackground, heroTitle, heroSubtext, heroButton, eventsTitle, challengeTitle].filter(Boolean);
      const contentElements = [heroTitle, heroSubtext, heroButton, eventsTitle, challengeTitle].filter(Boolean);
      const heroContentElements = [heroSubtext, heroButton].filter(Boolean);

      if (allElements.length === 0) return;

      // Set initial states
      gsap.set(allElements, {
        opacity: 0,
      });

      // Additional initial states for content elements
      if (contentElements.length > 0) {
        gsap.set(contentElements, {
          y: 30,
        });
      }

      // Hero background gets a scale effect
      if (heroBackground) {
        gsap.set(heroBackground, {
          scale: 1.1,
        });
      }

      // Create timeline for smooth sequential animations with minimal delay
      const tl = gsap.timeline({ delay: 0.1 });

      if (nav) {
        tl.to(nav, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      if (heroBackground) {
        tl.to(heroBackground, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
        }, "-=0.6");
      }

      if (heroTitle) {
        tl.to(heroTitle, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.4");
      }

      if (heroContentElements.length > 0) {
        tl.to(heroContentElements, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        }, "-=0.3");
      }

      if (eventsTitle) {
        tl.to(eventsTitle, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.2");
      }

      if (challengeTitle) {
        tl.to(challengeTitle, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.1");
      }
    };

    initPageAnimations();
  }, []);
  return (
    <div className="bg-white relative min-h-screen font-['Montserrat',sans-serif] overflow-x-hidden">
      {/* Navigation */}
      <nav ref={navRef} className="relative md:fixed md:top-0 md:left-0 w-full z-50 bg-white md:bg-white/95 md:backdrop-blur-[10px] px-4 py-8 md:px-16 opacity-0">
        <div className={`${isMobile ? 'flex justify-between items-center' : 'grid grid-cols-3 items-center'}`}>
          <div className="flex items-center justify-self-start">
            <Link href="/">
              {isMobile ? (
                <Image src="/hero-logo.svg" alt="Poker Pal" width={120} height={30} />
              ) : (
                <Image src="/hero-logo.svg" alt="Poker Pal" width={198} height={50} />
              )}
            </Link>
          </div>
          
          {/* Mobile Hamburger Menu - Right Side */}
          {isMobile && (
            <button 
              className="flex flex-col justify-around w-[30px] h-6 bg-transparent border-none cursor-pointer p-0 z-20"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="w-full h-[3px] bg-[#121212] rounded-sm transition-all duration-300"></span>
              <span className="w-full h-[3px] bg-[#121212] rounded-sm transition-all duration-300"></span>
              <span className="w-full h-[3px] bg-[#121212] rounded-sm transition-all duration-300"></span>
            </button>
          )}
          
          {!isMobile && (
            <>
              <div className="flex gap-8 justify-self-center">
                <Link href="/challenge" className="text-[#121212] underline underline-offset-[3px] font-medium text-base hover:opacity-70 transition-opacity duration-300">
                  Challenge
                </Link>
                <a href="#about-us" className="text-[#121212] no-underline font-medium text-base hover:opacity-70 transition-opacity duration-300">
                  About Us
                </a>
              </div>
              
              <Link 
                href="/intake" 
                className="bg-[#121212] text-white border-none px-6 py-3 rounded-[5rem] font-semibold text-sm no-underline justify-self-end hover:bg-gray-700 transition-colors duration-300"
              >
                APPLY NOW
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex items-stretch justify-end" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-screen h-screen flex flex-col animate-[slideInRight_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end items-center p-4 relative z-10">
              <button 
                className="bg-none border-none text-xl cursor-pointer text-[#121212] w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 relative z-20 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center px-6 gap-12 -translate-y-16">
              <div className="mb-4">
                <Image src="/pokerpal-logomark.svg" alt="Poker Pal" width={32} height={32} />
              </div>
              <Link href="/challenge" className="text-lg font-medium text-[#121212] no-underline hover:opacity-70 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                Challenge
              </Link>
              <a href="#about-us" className="text-lg font-medium text-[#121212] no-underline hover:opacity-70 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                About Us
              </a>
              <Link href="/intake" className="bg-[#121212] text-white border-none px-8 py-4 rounded-[50px] font-semibold text-base cursor-pointer hover:bg-gray-700 transition-colors duration-300 tracking-[0.5px] whitespace-nowrap no-underline" onClick={() => setIsMobileMenuOpen(false)}>
                APPLY NOW
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden flex items-center min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-240px)] mt-0 md:mt-[120px]">
        <div className="hero-background absolute inset-0 z-0 opacity-0">
          <Image 
            src="/hero-image.png" 
            alt="Hero Background" 
            fill
            className="object-cover"
            style={{ objectPosition: 'center center' }}
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute bottom-6 left-6 md:bottom-[42px] md:left-[42px] z-10 flex flex-col gap-4 md:gap-6 max-w-[calc(100vw-48px)] md:max-w-[725px]">
          <h1 className="hero-title text-[48px] md:text-[92px] font-bold leading-[1.1] md:leading-[103px] text-black tracking-[-1.5px] md:tracking-[-2.575px] uppercase opacity-0">
            OUR MEMBERS<br />LAST LONGER
          </h1>
          <p className="hero-subtext text-[18px] md:text-[28px] font-medium text-black tracking-[-0.18px] md:tracking-[-0.28px] leading-[1.2] md:leading-[1.02] opacity-0">
            Founding Members Are Built to Endure.
          </p>
          <Link 
            href="/intake" 
            className="hero-button bg-black text-white border-none px-6 py-3 rounded-[65px] font-semibold text-sm md:text-base no-underline cursor-pointer transition-colors duration-300 inline-flex items-center justify-center tracking-[-0.16px] uppercase h-[48px] md:h-[52px] w-full md:w-40 hover:bg-gray-700 opacity-0"
          >
            APPLY NOW
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <section ref={eventsRef} className="pt-16 md:pt-[100px] pb-16 bg-white">
        <div className="max-w-[1288px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="events-title text-[32px] md:text-[62px] font-bold text-black mb-8 md:mb-16 tracking-[-0.32px] md:tracking-[-0.62px] uppercase leading-[0.9] opacity-0">
            ELIGIBLE UPCOMING EVENTS
          </h2>
          
          {/* First Event */}
          <div className="mb-8 md:mb-10">
            <div className="flex flex-row justify-between items-center mb-6 md:mb-10 gap-3 md:gap-4">
              <div className="border border-[#b9b9b9] py-2 md:py-3 rounded-full h-[40px] md:h-[52px] flex items-center justify-center w-fit">
                <p className="font-semibold text-xs md:text-base text-black text-center tracking-[-0.12px] md:tracking-[-0.16px] uppercase px-3 md:px-8">
                  CALGARY, AB
                </p>
              </div>
              <div className="border border-[#b9b9b9] py-2 md:py-3 rounded-full h-[40px] md:h-[52px] flex items-center justify-center w-fit">
                <p className="font-semibold text-xs md:text-base text-black text-center tracking-[-0.12px] md:tracking-[-0.16px] uppercase px-3 md:px-8">
                  OCT 1-13, 2025
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 md:gap-6 uppercase">
              <h3 className="text-[24px] md:text-[32px] font-semibold text-black tracking-[-0.24px] md:tracking-[-0.32px] leading-[1.1] md:leading-[1.02]">
                WORLD SERIES OF POKER CIRCUIT
              </h3>
              <div className="text-[18px] md:text-[24px] text-black tracking-[-0.18px] md:tracking-[-0.24px]">
                <p className="leading-[1.6] md:leading-[1.82] mb-0">
                  <span className="font-bold">Event:</span> Main Event only
                </p>
                <p className="leading-[1.6] md:leading-[1.82]">
                  <span className="font-bold">Grand Prize:</span> $1,700 CAD
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#b9b9b9] my-8 md:my-10 w-full"></div>

          {/* Second Event */}
          <div>
            <div className="flex flex-row justify-between items-center mb-6 md:mb-10 gap-3 md:gap-4">
              <div className="border border-[#b9b9b9] py-2 md:py-3 rounded-full h-[40px] md:h-[52px] flex items-center justify-center w-fit">
                <p className="font-semibold text-xs md:text-base text-black text-center tracking-[-0.12px] md:tracking-[-0.16px] uppercase px-3 md:px-8">
                  WYNN LAS VEGAS, USA
                </p>
              </div>
              <div className="border border-[#b9b9b9] py-2 md:py-3 rounded-full h-[40px] md:h-[52px] flex items-center justify-center w-fit">
                <p className="font-semibold text-xs md:text-base text-black text-center tracking-[-0.12px] md:tracking-[-0.16px] uppercase px-3 md:px-8">
                  DEC 2-22, 2025
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 md:gap-6 uppercase">
              <h3 className="text-[24px] md:text-[32px] font-semibold text-black tracking-[-0.24px] md:tracking-[-0.32px] leading-[1.1] md:leading-[1.02]">
                WPT WORLD CHAMPIONSHIP
              </h3>
              <div className="text-[18px] md:text-[24px] text-black tracking-[-0.18px] md:tracking-[-0.24px]">
                <p className="leading-[1.6] md:leading-[1.82] mb-0">
                  <span className="font-bold">Event:</span> Main Event only
                </p>
                <p className="leading-[1.6] md:leading-[1.82]">
                  <span className="font-bold">Grand Prize:</span> $10,400 USD
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side Images Section */}
      <section className="relative bg-[#f9f9f9] flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 aspect-square md:h-[877px] overflow-hidden">
          <Image 
            src="/leftside.png" 
            alt="Left Side Image" 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="relative w-full md:w-1/2 aspect-square md:h-[877px] overflow-hidden">
          <Image 
            src="/rightside.png" 
            alt="Right Side Image" 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Challenge Details Section */}
      <section ref={challengeRef} className="py-12 md:py-16 bg-white">
        <div className="max-w-[1288px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start mb-8 md:mb-10">
            <div className="flex-1 flex flex-col gap-4 md:gap-6">
              <h2 className="challenge-title text-[32px] md:text-[62px] font-bold text-black tracking-[-0.32px] md:tracking-[-0.62px] uppercase leading-[0.9] m-0 opacity-0">
                LAST LONGER CHALLENGE
              </h2>
              <p className="text-base md:text-lg font-medium text-black tracking-[-0.16px] md:tracking-[-0.18px] leading-[1.5] md:leading-[1.44] m-0">
                Take your shot to win a seat at the main event!
              </p>
              <div className="backdrop-blur-[22.7px] bg-black flex items-center rounded-[166px] w-full md:w-fit">
                <Link href="/intake" className="border border-black px-6 py-3 rounded-[65px] h-[48px] md:h-[52px] flex items-center justify-center font-semibold text-sm md:text-base text-center text-white tracking-[-0.14px] md:tracking-[-0.16px] uppercase no-underline w-full">
                  APPLY NOW
                </Link>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col gap-3 text-black w-full">
                <h3 className="text-[18px] md:text-[22px] font-semibold tracking-[-0.18px] md:tracking-[-0.22px] uppercase leading-[1.3] w-full">
                  ENTRY REQUIREMENTS
                </h3>
                <ul className="block font-medium text-base md:text-lg tracking-[-0.16px] md:tracking-[-0.18px] w-full list-none p-0 m-0">
                  <li className="mb-0 ml-6 md:ml-7 relative leading-[1.5] md:leading-[1.42] before:content-['•'] before:absolute before:-left-6 md:before:-left-7 before:text-black before:font-bold">
                    Must be officially registered in the Main Event of the designated live tournament.
                  </li>
                  <li className="mb-0 ml-6 md:ml-7 relative leading-[1.5] md:leading-[1.42] before:content-['•'] before:absolute before:-left-6 md:before:-left-7 before:text-black before:font-bold">
                    Must be an approved PokerPal Founding Member.
                  </li>
                  <li className="ml-6 md:ml-7 relative leading-[1.5] md:leading-[1.42] before:content-['•'] before:absolute before:-left-6 md:before:-left-7 before:text-black before:font-bold">
                    Entry is <span className="font-bold">FREE</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 text-black w-full">
                <h3 className="text-[18px] md:text-[22px] font-semibold tracking-[-0.18px] md:tracking-[-0.22px] uppercase leading-[1.3] w-full">
                  HOW TO REGISTER
                </h3>
                <ul className="block font-medium text-base md:text-lg tracking-[-0.16px] md:tracking-[-0.18px] w-full list-none p-0 m-0">
                  <li className="mb-0 ml-6 md:ml-7 relative leading-[1.5] md:leading-[1.42] before:content-['•'] before:absolute before:-left-6 md:before:-left-7 before:text-black before:font-bold">
                    PokerPal will email all eligible members before event.
                  </li>
                  <li className="mb-0 ml-6 md:ml-7 relative leading-[1.5] md:leading-[1.42] before:content-['•'] before:absolute before:-left-6 md:before:-left-7 before:text-black before:font-bold">
                    Participant must confirm through registration form.
                  </li>
                  <li className="ml-6 md:ml-7 relative leading-[1.5] md:leading-[1.42] before:content-['•'] before:absolute before:-left-6 md:before:-left-7 before:text-black before:font-bold">
                    If the event allows re-entries/rebuys, you remain eligible until your final elimination.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 text-black w-full">
                <h3 className="text-[18px] md:text-[22px] font-semibold tracking-[-0.18px] md:tracking-[-0.22px] uppercase leading-[1.3] w-full">
                  CHALLENGE RULES
                </h3>
                <ul className="block font-medium text-base md:text-lg tracking-[-0.16px] md:tracking-[-0.18px] w-full list-none p-0 m-0">
                  <li className="mb-0 ml-6 md:ml-7 relative leading-[1.5] md:leading-[1.42] before:content-['•'] before:absolute before:-left-6 md:before:-left-7 before:text-black before:font-bold">
                    Last remaining PokerPal member in the field wins.
                  </li>
                  <li className="ml-6 md:ml-7 relative leading-[1.5] md:leading-[1.42] before:content-['•'] before:absolute before:-left-6 md:before:-left-7 before:text-black before:font-bold">
                    Official tournament reporting determines finishing positions.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#b9b9b9] my-8 md:my-10 w-full"></div>

          <div className="mt-6 md:mt-10">
            <p className="text-xs md:text-xs font-normal text-black tracking-[-0.12px] leading-[1.6] md:leading-[1.45] m-0">
              Disclaimer: The PokerPal Last Longer Challenge is a free promotional challenge and not a gambling product. No additional entry fees are required beyond official tournament buy-ins. Participation is open only to approved PokerPal Founding Members in good standing and subject to applicable laws. Official tournament reporting will be used to determine eligibility and results. Prizes are awarded only if a registered member finishes &ldquo;in the money.&rdquo; Full terms and conditions, including eligibility and prize details, will be published and apply to all entrants. By entering, you agree that PokerPal may share updates and tag you in social media, leaderboards, and marketing.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3f88c5] h-[52px] flex items-center justify-center">
        <span className="text-base font-normal text-white tracking-[-0.16px] leading-[1.45]">
          PokerPal.ai
        </span>
      </footer>
    </div>
  );
}
