"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

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
        },
      });
    };

    initSpotlightAnimations();
    window.addEventListener("resize", initSpotlightAnimations);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", initSpotlightAnimations);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <section className="intro">
        <nav className="hero-nav">
          <div className="nav-logo">
            <span>Poker Pal</span>
          </div>
          <div className="nav-links">
            <a href="#team-perks">Team Perks</a>
            <a href="#about-us">About Us</a>
          </div>
          <button className="nav-cta">APPLY NOW</button>
        </nav>
        
        <div className="hero-content">
          <div className="hero-logo">
            <Image src="/pokerpal-logomark.svg" alt="Poker Pal Logo" width={80} height={79} />
          </div>
          <h1>POKER IS A SPORT. TRAIN LIKE AN ATHLETE.</h1>
          <p className="hero-subtext">
            Join the world&apos;s fire community built for poker athletes. Where preparation, mindset, and performance matter as much as the cards.
          </p>
          <button className="hero-cta">BECOME A FOUNDING MEMBER</button>
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
        <div className="spotlight-outro-header">
          <h1>GREATNESS DOESN&apos;T WAIT. NEITHER SHOULD YOU.</h1>
        </div>
      </section>
      <section className="outro">
        <h1>STEP INTO THE FUTURE OF YOUR GAME</h1>
      </section>
    </div>
  );
}
