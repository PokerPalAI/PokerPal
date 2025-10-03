"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";

// For now, we'll create a simple SplitText alternative since the original uses a premium plugin
const splitTextIntoWords = (element: HTMLElement) => {
  const text = element.textContent || "";
  const words = text.split(" ");
  element.innerHTML = words
    .map((word) => `<span class="word">${word}</span>`)
    .join(" ");
  return element.querySelectorAll(".word");
};

export default function SpotlightAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation for Apply button clicks
  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (isTransitioning) return;
    setIsTransitioning(true);

    const heroLogo = document.querySelector(".hero-logo img") as HTMLElement;
    const heroContent = document.querySelector(".hero-content") as HTMLElement;
    const heroNav = document.querySelector(".hero-nav") as HTMLElement;

    if (!heroLogo || !heroContent) return;

    // Create a cloned logo for the animation
    const logoClone = heroLogo.cloneNode(true) as HTMLElement;
    logoClone.style.position = "fixed";
    logoClone.style.zIndex = "9999";
    logoClone.style.pointerEvents = "none";
    
    // Get the original logo position
    const logoRect = heroLogo.getBoundingClientRect();
    logoClone.style.left = logoRect.left + "px";
    logoClone.style.top = logoRect.top + "px";
    logoClone.style.width = logoRect.width + "px";
    logoClone.style.height = logoRect.height + "px";
    
    document.body.appendChild(logoClone);

    // Create transition overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "white";
    overlay.style.zIndex = "9998";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    document.body.appendChild(overlay);

    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Navigate to intake page
        window.location.href = "/intake";
      }
    });

    // Fade out other elements
    tl.to([heroContent, heroNav], {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    })
    // Scale and center the logo
    .to(logoClone, {
      x: (window.innerWidth / 2) - (logoRect.left + logoRect.width / 2),
      y: (window.innerHeight / 2) - (logoRect.top + logoRect.height / 2),
      scale: 3,
      rotation: 360,
      duration: 1.2,
      ease: "power2.inOut"
    }, "-=0.3")
    // Fade in overlay
    .to(overlay, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut"
    }, "-=0.6")
    // Final logo animation
    .to(logoClone, {
      scale: 0.5,
      rotation: 720,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    }, "-=0.2");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Hero loading animation
    const initHeroAnimation = () => {
      const heroNav = document.querySelector(".hero-nav");
      const heroLogo = document.querySelector(".hero-logo");
      const heroHeading = document.querySelector(".intro h1");
      const heroSubtext = document.querySelector(".hero-subtext");
      const heroCta = document.querySelector(".hero-cta");

      // Set initial states
      gsap.set([heroNav, heroLogo, heroHeading, heroSubtext, heroCta], {
        opacity: 0,
        y: 30,
      });

      // Create timeline for smooth sequential animations
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(heroNav, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .to(heroLogo, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4")
      .to(heroHeading, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.3")
      .to([heroSubtext, heroCta], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4");
    };

    const initSpotlightAnimations = () => {
      const images = document.querySelectorAll(".img");
      const coverImg = document.querySelector(".spotlight-cover-img");
      const introHeader = document.querySelector(".spotlight-intro-header h1") as HTMLElement;
      const outroHeader = document.querySelector(".spotlight-outro-header h1") as HTMLElement;

      let introHeaderWords: NodeListOf<Element> | null = null;
      let outroHeaderWords: NodeListOf<Element> | null = null;

      if (introHeader) {
        introHeaderWords = splitTextIntoWords(introHeader);
        gsap.set(introHeaderWords, { opacity: 1 });
      }

      if (outroHeader) {
        outroHeaderWords = splitTextIntoWords(outroHeader);
        gsap.set(outroHeaderWords, { opacity: 0 });
        gsap.set(outroHeader, { opacity: 1 });
      }

      const scatterDirections = [
        { x: 1.3, y: 0.7 },
        { x: -1.5, y: 1.0 },
        { x: 1.1, y: -1.3 },
        { x: -1.7, y: -0.8 },
        { x: 0.8, y: 1.5 },
        { x: -1.0, y: -1.4 },
        { x: 1.6, y: 0.3 },
        { x: -0.7, y: 1.7 },
        { x: 1.2, y: -1.6 },
        { x: -1.4, y: 0.9 },
        { x: 1.8, y: -0.5 },
        { x: -1.1, y: -1.8 },
      ];

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = window.innerWidth < 1000;
      const scatterMultiplier = isMobile ? 2.5 : 0.5;

      const startPositions = Array.from(images).map(() => ({
        x: 0,
        y: 0,
        z: -1000,
        scale: 0,
      }));

      const endPositions = scatterDirections.map((dir) => ({
        x: dir.x * screenWidth * scatterMultiplier,
        y: dir.y * screenHeight * scatterMultiplier,
        z: 2000,
        scale: 1,
      }));

      images.forEach((img, index) => {
        gsap.set(img, startPositions[index]);
      });

      gsap.set(coverImg, {
        z: -1000,
        scale: 0,
        x: 0,
        y: 0,
      });

      ScrollTrigger.create({
        trigger: ".spotlight",
        start: "top top",
        end: `+=${window.innerHeight * 10}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          images.forEach((img, index) => {
            const staggerDelay = index * 0.03;
            const scaleMultiplier = isMobile ? 4 : 2;

            const imageProgress = Math.max(0, (progress - staggerDelay) * 4);

            const start = startPositions[index];
            const end = endPositions[index];

            const zValue = gsap.utils.interpolate(start.z, end.z, imageProgress);
            const scaleValue = gsap.utils.interpolate(
              start.scale,
              end.scale,
              imageProgress * scaleMultiplier
            );
            const xValue = gsap.utils.interpolate(start.x, end.x, imageProgress);
            const yValue = gsap.utils.interpolate(start.y, end.y, imageProgress);

            gsap.set(img, {
              z: zValue,
              scale: scaleValue,
              x: xValue,
              y: yValue,
            });
          });

          const coverProgress = Math.max(0, (progress - 0.7) * 4);
          const coverZValue = -1000 + 1000 * coverProgress;
          const coverScaleValue = Math.min(1, coverProgress * 2);

          gsap.set(coverImg, {
            z: coverZValue,
            scale: coverScaleValue,
            x: 0,
            y: 0,
          });

          if (introHeaderWords && introHeaderWords.length > 0) {
            if (progress >= 0.6 && progress <= 0.75) {
              const introFadeProgress = (progress - 0.6) / 0.15;
              const totalWords = introHeaderWords.length;

              introHeaderWords.forEach((word, index) => {
                const wordFadeProgress = index / totalWords;
                const fadeRange = 0.1;

                if (introFadeProgress >= wordFadeProgress + fadeRange) {
                  gsap.set(word, { opacity: 0 });
                } else if (introFadeProgress <= wordFadeProgress) {
                  gsap.set(word, { opacity: 1 });
                } else {
                  const wordOpacity =
                    1 - (introFadeProgress - wordFadeProgress) / fadeRange;
                  gsap.set(word, { opacity: wordOpacity });
                }
              });
            } else if (progress < 0.6) {
              gsap.set(introHeaderWords, { opacity: 1 });
            } else if (progress > 0.75) {
              gsap.set(introHeaderWords, { opacity: 0 });
            }
          }

          if (outroHeaderWords && outroHeaderWords.length > 0) {
            if (progress >= 0.8 && progress <= 0.95) {
              const outroRevealProgress = (progress - 0.8) / 0.15;
              const totalWords = outroHeaderWords.length;

              outroHeaderWords.forEach((word, index) => {
                const wordRevealProgress = index / totalWords;
                const fadeRange = 0.1;

                if (outroRevealProgress >= wordRevealProgress + fadeRange) {
                  gsap.set(word, { opacity: 1 });
                } else if (outroRevealProgress <= wordRevealProgress) {
                  gsap.set(word, { opacity: 0 });
                } else {
                  const wordOpacity =
                    (outroRevealProgress - wordRevealProgress) / fadeRange;
                  gsap.set(word, { opacity: wordOpacity });
                }
              });
            } else if (progress < 0.8) {
              gsap.set(outroHeaderWords, { opacity: 0 });
            } else if (progress > 0.95) {
              gsap.set(outroHeaderWords, { opacity: 1 });
            }
          }

          // Animate background image desaturation and darkening when outro text appears
          if (progress >= 0.8) {
            const desaturationProgress = Math.min(1, (progress - 0.8) / 0.15);
            const saturation = 100 - (desaturationProgress * 100); // 100% to 0%
            const brightness = 100 - (desaturationProgress * 50); // 100% to 50%
            
            gsap.set(coverImg, {
              filter: `saturate(${saturation}%) brightness(${brightness}%)`,
            });
          } else {
            gsap.set(coverImg, {
              filter: "saturate(100%) brightness(100%)",
            });
          }
        },
      });
    };

    initHeroAnimation();
    initSpotlightAnimations();
    window.addEventListener("resize", initSpotlightAnimations);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", initSpotlightAnimations);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <section className="intro">
        <nav className="hero-nav">
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
            {isMobile ? (
              <Image src="/hero-logo-text.svg" alt="Poker Pal" width={100} height={24} />
            ) : (
              <Image src="/hero-logo.svg" alt="Poker Pal" width={120} height={40} />
            )}
          </div>
                  <div className="nav-links">
                    {/* <a href="/team-perks">Team Perks</a> */}
                    <a href="/challenge">Challenge</a>
                    <a href="#about-us">About Us</a>
                  </div>
          <a href="/intake" className="nav-cta" onClick={handleApplyClick}>APPLY NOW</a>
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
                        {/* <a href="/team-perks" onClick={() => setIsMobileMenuOpen(false)}>Team Perks</a> */}
                        <a href="/challenge" onClick={() => setIsMobileMenuOpen(false)}>Challenge</a>
                        <a href="#about-us" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
                <a href="/intake" className="mobile-apply-btn" onClick={(e) => { setIsMobileMenuOpen(false); handleApplyClick(e); }}>
                  APPLY NOW
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="hero-content">
          <div className="hero-logo">
            <Image src="/pokerpal-logomark.svg" alt="Poker Pal Logo" width={80} height={79} />
          </div>
          <h1>POKER IS A SPORT. TRAIN LIKE AN ATHLETE.</h1>
          <p className="hero-subtext">
            Join the world&apos;s fire community built for poker athletes. Where preparation, mindset, and performance matter as much as the cards.
          </p>
          <a href="/intake" className="hero-cta" onClick={handleApplyClick}>BECOME A FOUNDING MEMBER</a>
        </div>
      </section>
      <section className="spotlight">
        <div className="spotlight-images">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="img">
              <Image src={`/img_${i + 1}.jpg`} alt="" fill sizes="500px" />
            </div>
          ))}
        </div>
        <div className="spotlight-cover-img">
          <Image src="/spotlight_cover.jpg" alt="" fill sizes="100vw" />
        </div>
        <div className="spotlight-intro-header">
          <h1>THE GAME HAS CHANGED. WILL YOU?</h1>
        </div>
        <div className="spotlight-outro-header ">
          <h1>GREATNESS DOESN&apos;T WAIT. NEITHER SHOULD YOU.</h1>
        </div>
      </section>
      <section className="outro">
        <div className="outro-content ">
          <h1>BECOME<br/>TOMORROW&apos;S<br/>CHAMPION</h1>
          
          <div className="footer-hero">
            <div className="footer-background">
              <Image src="/cubes-footer.png" alt="" fill sizes="100vw" />
            </div>
            <div className="footer-logo">
              <Image src="/pokerpal-logomark.svg" alt="Poker Pal Logo" width={120} height={118} />
              <p>Change the game</p>
            </div>
          </div>

          <div className="subscription-section">
            <div className="subscription-card">
              <div className="subscription-heading">
                <span>Subscribe for </span>
                <span className="bold">weekly</span>
                <span> insights on the best poker game strategies</span>
              </div>
              <div className="email-input-wrapper">
                <input 
                  type="email" 
                  placeholder="What's your email?" 
                  className="styled-email-input"
                />
                <button className="styled-subscribe-btn">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <nav className="footer-nav">
            {/* <a href="/team-perks">Team Perks</a> */}
            <a href="/challenge">Challenge</a>
            <a href="#about-us">About Us</a>
            <a href="/intake" onClick={handleApplyClick}>Apply now</a>
          </nav>

          <div className="social-links">
            <a href="#" aria-label="Twitter">
              <Image src="/Twitter.svg" alt="Twitter" width={24} height={24} />
            </a>
            <a href="#" aria-label="Telegram">
              <Image src="/Telegram.svg" alt="Telegram" width={24} height={24} />
            </a>
            <a href="#" aria-label="YouTube">
              <Image src="/YouTube.svg" alt="YouTube" width={24} height={24} />
            </a>
            <a href="#" aria-label="Instagram">
              <Image src="/Instagram.svg" alt="Instagram" width={24} height={24} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>PokerPal.ai</span>
        </div>
      </section>
    </div>
  );
}
