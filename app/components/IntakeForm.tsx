"use client";

import { useState, useEffect, KeyboardEvent, useRef, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';

// Form Field Types
type FormData = {
  name: string;
  email: string;
  experience: string;
  training: string[];
  trainingOther?: string;
  highlight: string;
  success: string;
  alignment: string;
};

export default function IntakeForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [emailValidationAttempted, setEmailValidationAttempted] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState<{[key: number]: boolean}>({});
  const welcomeRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const otherFieldRef = useRef<HTMLDivElement>(null);
  
  // Focus welcome screen on initial load and detect mobile
  useEffect(() => {
    if (step === 1 && welcomeRef.current) {
      welcomeRef.current.focus();
    }

    // Entrance animation from transition
    if (step === 1) {
      // Wait for DOM to be ready then animate
      const animateEntrance = () => {
        const logo = document.querySelector('.pokerpal-logo-intake');
        const welcomeHeader = document.querySelector('#welcome-header');
        const welcomeText = document.querySelector('#welcome-section p');
        const welcomeButtons = document.querySelector('.welcome-buttons');
        const timeMessage = document.querySelector('.time-message');

        // Only proceed if all elements are found
        if (logo && welcomeHeader && welcomeText && welcomeButtons && timeMessage) {
          // Set initial states immediately
          gsap.set([logo, welcomeHeader, welcomeText, welcomeButtons, timeMessage], {
            opacity: 0,
            y: 20
          });

          // Animate in with a nice stagger
          const tl = gsap.timeline({ delay: 0.1 });
          
          tl.to(logo, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          })
          .to(welcomeHeader, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          }, "-=0.6")
          .to(welcomeText, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          }, "-=0.4")
          .to(welcomeButtons, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          }, "-=0.3")
          .to(timeMessage, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
          }, "-=0.2");
        }
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(animateEntrance);
      });
    }
    
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Handle click outside dropdown
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [step, isDropdownOpen]);
  
  // Handle Enter key press to navigate to next step
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLDivElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Only handle enter for steps before the final submission
      if (step < 9) {
        handleNextStep();
      } else if (step === 9) {
        handleSubmit(onSubmit)();
      }
    }
  };
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      experience: '',
      training: [],
      trainingOther: '',
      highlight: '',
      success: '',
      alignment: ''
    }
  });

  // Watch training field for "Other" animation
  const trainingSelection = watch('training');
  const [otherFieldVisible, setOtherFieldVisible] = useState(false);

  // Animate "Other" field when it appears/disappears
  useEffect(() => {
    const showOtherField = trainingSelection?.includes('other') || false;
    
    // Only animate if the "Other" field visibility actually changed
    if (showOtherField !== otherFieldVisible) {
      setOtherFieldVisible(showOtherField);
      
      if (otherFieldRef.current) {
        if (showOtherField) {
          // Set the height to auto temporarily to measure actual height
          const element = otherFieldRef.current;
          element.style.height = 'auto';
          const targetHeight = element.scrollHeight;
          
          // Animate in
          gsap.fromTo(element, 
            {
              opacity: 0,
              height: 0,
              y: -10
            },
            {
              opacity: 1,
              height: targetHeight,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
              onComplete: () => {
                // Set height back to auto after animation
                element.style.height = 'auto';
              }
            }
          );
        } else {
          // Animate out
          gsap.to(otherFieldRef.current, {
            opacity: 0,
            height: 0,
            y: -10,
            duration: 0.3,
            ease: "power2.in"
          });
        }
      }
    }
  }, [trainingSelection, otherFieldVisible]);

  const trainingOptions = [
    { id: 'hand-solver-analysis', label: 'Hand Analysis & Solver Study (GTO)' },
    { id: 'book-reading', label: 'Reading Poker Books' },
    { id: 'video-training', label: 'Training Videos & Courses' },
    { id: 'bankroll-management', label: 'Bankroll Management' },
    { id: 'live-coaching', label: 'Live Coaching Sessions' },
    { id: 'physical-fitness', label: 'Physical Fitness & Health' },
    { id: 'meditation', label: 'Meditation & Mindfulness' },
    { id: 'other', label: 'Other' }
  ];

  const nextStep = () => {
    setStep(step + 1);
    // Reset validation states when entering new steps
    if (step + 1 === 3) {
      setEmailValidationAttempted(false);
    }
    setValidationAttempted(prev => ({ ...prev, [step + 1]: false }));
  };
  const prevStep = () => {
    setStep(step - 1);
    // Reset validation states when returning to steps
    if (step - 1 === 3) {
      setEmailValidationAttempted(false);
    }
    setValidationAttempted(prev => ({ ...prev, [step - 1]: false }));
  };
  
  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  
  // Handle input changes to reset validation states
  const handleInputChange = (stepNumber: number) => {
    if (validationAttempted[stepNumber]) {
      setValidationAttempted(prev => ({ ...prev, [stepNumber]: false }));
    }
  };

  // Handle next step with validation
  const handleNextStep = () => {
    // Mark validation as attempted for current step
    setValidationAttempted(prev => ({ ...prev, [step]: true }));
    
    // Step 2: Name validation
    if (step === 2) {
      const currentName = watch('name') || '';
      if (!currentName.trim()) {
        return; // Block if name is empty
      }
    }
    
    // Step 3: Email validation
    if (step === 3) {
      setEmailValidationAttempted(true);
      const currentEmail = watch('email') || '';
      if (!currentEmail.trim() || !isValidEmail(currentEmail)) {
        return; // Block if email is empty or invalid
      }
    }
    
    // Step 4: Poker Journey validation (50 character minimum)
    if (step === 4) {
      const currentExperience = watch('experience') || '';
      if (!currentExperience.trim() || currentExperience.trim().length < 50) {
        return; // Block if empty or less than 50 characters
      }
    }
    
    // Step 5: Training validation
    if (step === 5) {
      const currentTraining = watch('training') || [];
      if (currentTraining.length === 0) {
        return; // Block if no training methods selected
      }
    }
    
    // Step 6: Career Highlight validation
    if (step === 6) {
      const currentHighlight = watch('highlight') || '';
      if (!currentHighlight.trim()) {
        return; // Block if empty
      }
    }
    
    // Step 7: Success Definition validation
    if (step === 7) {
      const currentSuccess = watch('success') || '';
      if (!currentSuccess.trim()) {
        return; // Block if empty
      }
    }
    
    // Step 8: Alignment validation (50 character minimum)
    if (step === 8) {
      const currentAlignment = watch('alignment') || '';
      if (!currentAlignment.trim() || currentAlignment.trim().length < 50) {
        return; // Block if empty or less than 50 characters
      }
    }
    
    nextStep();
  };

  // Handle dropdown selection
  const handleTrainingSelection = (optionId: string) => {
    const currentTraining = watch('training') || [];
    const isSelected = currentTraining.includes(optionId);
    
    if (isSelected) {
      // Remove if already selected
      const newTraining = currentTraining.filter(id => id !== optionId);
      setValue('training', newTraining);
    } else {
      // Add if not selected
      const newTraining = [...currentTraining, optionId];
      setValue('training', newTraining);
    }
  };

  const onSubmit = async (data: FormData) => {
    // Only attempt to submit if we're on the final step
    if (step !== 9) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Redirect to success page or back to home with success message
        window.location.href = '/?application=submitted';
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for framer-motion
  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -30 }
  };

  const pageTransition = {
    duration: 0.5
  };

  // Function to capitalize first letter for inputs
  const capitalizeFirstLetterInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (input.value.length === 1) {
      input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
    }
  };

  return (
    <div className="text-black bg-white h-screen w-screen overflow-hidden overflow-y-hidden relative flex flex-col items-center justify-center" style={{ fontFamily: 'Futura, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}>
      {/* Particles Background */}
      <div id="particles-js" className="fixed inset-0 z-[-4]"></div>
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[8px] bg-gray-200 z-[2000]">
        <div 
          className="h-full transition-all duration-300 ease-out" 
          style={{
            width: `${Math.max(((step - 1) / 8) * 100, 0)}%`,
            backgroundColor: '#121212'
          }}
        />
      </div>
      
      {/* Exit Button - Moved to top right */}
      <Link href="/" className="absolute top-[4%] right-[4%] bg-transparent border border-gray-300 rounded-full p-3 text-black text-lg cursor-pointer z-[2000] hover:bg-gray-100 transition-colors">
        <span className="flex items-center justify-center">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      </Link>
      
      {/* Navigation Buttons - Only show back button */}
      {step > 1 && (
        <div className="absolute top-[4%] left-[4%] flex z-[2000] gap-3">
          <button 
            type="button" 
            onClick={prevStep}
            className="bg-transparent border border-gray-300 rounded-full p-3 text-black cursor-pointer hover:bg-gray-100 transition-colors flex justify-center items-center"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>
      )}
      
      {/* Form Container - centered on screen */}
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto z-[1000] p-5">
        {/* Logo - only show on welcome screen */}
        {step === 1 && (
          <Image 
            src="/pokerpal-logomark.svg" 
            alt="PokerPal" 
            width={80} 
            height={79} 
            className="mb-5 pokerpal-logo-intake"
            style={{ opacity: 0 }}
          />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="w-full relative z-[1000] flex flex-col items-center">
          {/* Welcome Step - centered */}
          {step === 1 && (
            <motion.div
              className="flex flex-col items-center text-center justify-center w-full outline-none"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              id="welcome-section"
              onKeyDown={handleKeyDown}
              tabIndex={0}
              ref={welcomeRef}
            >
              <h1 
                id="welcome-header" 
                className="text-[3rem] md:text-[4rem] lg:text-[5rem] font-bold leading-[90%] tracking-[-6px] mb-6 text-black text-center"
                style={{ opacity: 0 }}
              >
                POKERPAL FOUNDING TEAM APPLICATION
              </h1>
              <p className="text-gray-600 text-xl md:text-2xl font-medium mb-8 md:mb-10 w-[90%] sm:w-[70%] md:w-[90%] max-w-3xl mx-auto lg:mx-0" style={{ opacity: 0 }}>
                We&apos;re looking for poker players who embody discipline, resilience, and the athlete&apos;s mindset. As a Founding Member, you&apos;ll help shape PokerPal from the ground up while representing what it means to treat poker as a sport.
              </p>
              
              <div className="flex gap-3 welcome-buttons items-center justify-center" style={{ opacity: 0 }}>
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="relative z-[1000] py-3 md:py-4 px-10 md:px-[51px] text-lg md:text-xl bg-black text-white border-none rounded-[46.55px] cursor-pointer hover:bg-gray-800 hover:shadow-lg transition-all duration-300 welcome-btn flex items-center justify-center font-semibold group"
                >
                  Let&apos;s go!
                  <svg 
                    width="13" 
                    height="13" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="ml-3 transform transition-transform duration-300 group-hover:translate-x-2"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                
                <span className="text-sm ml-[10px] text-gray-500 enter-message flex items-center">
                  Press enter <span className="mx-1 text-lg">↵</span>
                </span>
              </div>
              
              <div className="flex items-center justify-center text-sm mt-6 text-black time-message" style={{ opacity: 0 }}>
                <span className="mr-[5px] flex items-center clock-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                Takes 3 mins
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Name - left aligned */}
          {step === 2 && (
            <motion.div
              className="flex flex-col items-start text-left w-full"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] mb-2 font-normal question">Let&apos;s start with an introduction</h2>
              <p className="text-xl text-gray-500 mb-6 subheader">What&apos;s your name?</p>
              
              <input
                type="text"
                placeholder="Type your name here..."
                autoFocus
                autoCapitalize="words"
                onKeyDown={handleKeyDown}
onInput={capitalizeFirstLetterInput}
                {...register('name', { required: 'Please fill out required information' })}
                className="text-[24px] md:text-[32px] border-0 border-b border-b-black w-full py-[10px] px-[10px] my-5 bg-transparent text-black outline-none transition-all duration-300 input-field focus:border-b-black text-left"
              />
              
              {/* Desktop: Error messages above button */}
              <div className="hidden md:block text-[#ff4c4c] text-base error-message text-center" style={{ minHeight: '24px', marginTop: '0px' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (validationAttempted[2] && !watch('name')?.trim()) || errors.name ? 1 : 0
                  }}
                >
                  {validationAttempted[2] && !watch('name')?.trim() && 'Please enter your name'}
                  {errors.name && errors.name.message}
                </span>
              </div>
              
              <div className="w-full flex flex-col md:flex-row gap-3 md:items-center mt-4">
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="w-full md:w-auto py-3 px-[42px] text-lg bg-black text-white border-none rounded-[50px] cursor-pointer hover:bg-gray-800 transition-all duration-300 font-semibold"
                >
                  OK
                </button>
                
                <span className="text-sm text-center md:text-left md:ml-[10px] text-gray-500 enter-message flex items-center justify-center md:justify-start">
                  Press enter <span className="mx-1 text-lg">↵</span>
                </span>
              </div>
              
              {/* Mobile: Error messages below button, center aligned */}
              <div className="block md:hidden text-[#ff4c4c] text-sm error-message text-center" style={{ minHeight: '24px', marginTop: '16px', textAlign: 'center', width: '100%' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (validationAttempted[2] && !watch('name')?.trim()) || errors.name ? 1 : 0
                  }}
                >
                  {validationAttempted[2] && !watch('name')?.trim() && 'Please enter your name'}
                  {errors.name && errors.name.message}
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Email - left aligned */}
          {step === 3 && (
            <motion.div
              className="flex flex-col items-start text-left w-full"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] mb-2 font-normal question">Where can we reach you with next steps?</h2>
              <p className="text-xl text-gray-500 mb-6 subheader">Enter your email</p>
              
              <input
                type="email"
                placeholder="Type your email here..."
                autoFocus
                onKeyDown={handleKeyDown}
onInput={capitalizeFirstLetterInput}
                {...register('email', { 
                  required: 'Please fill out required information',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="text-[24px] md:text-[32px] border-0 border-b border-b-black w-full py-[10px] px-[10px] my-5 bg-transparent text-black outline-none transition-all duration-300 input-field focus:border-b-black text-left"
              />
              
              {/* Desktop: Error messages above button */}
              <div className="hidden md:block text-[#ff4c4c] text-base error-message text-center" style={{ minHeight: '24px', marginTop: '0px' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (emailValidationAttempted && watch('email') && !isValidEmail(watch('email') || '')) || 
                             (emailValidationAttempted && !watch('email')) || 
                             errors.email ? 1 : 0
                  }}
                >
                  {emailValidationAttempted && watch('email') && !isValidEmail(watch('email') || '') && 'Please enter a valid email address'}
                  {emailValidationAttempted && !watch('email') && 'Please enter your email address'}
                  {errors.email && errors.email.message}
                </span>
              </div>
              
              <div className="w-full flex flex-col md:flex-row gap-3 md:items-center mt-4">
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="w-full md:w-auto py-3 px-[42px] text-lg bg-black text-white border-none rounded-[50px] cursor-pointer hover:bg-gray-800 transition-all duration-300 font-semibold"
                >
                  OK
                </button>
                
                <span className="text-sm text-center md:text-left md:ml-[10px] text-gray-500 enter-message flex items-center justify-center md:justify-start">
                  Press enter <span className="mx-1 text-lg">↵</span>
                </span>
              </div>
              
              {/* Mobile: Error messages below button, center aligned */}
              <div className="block md:hidden text-[#ff4c4c] text-sm error-message text-center" style={{ minHeight: '24px', marginTop: '16px', textAlign: 'center', width: '100%' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (emailValidationAttempted && watch('email') && !isValidEmail(watch('email') || '')) || 
                             (emailValidationAttempted && !watch('email')) || 
                             errors.email ? 1 : 0
                  }}
                >
                  {emailValidationAttempted && watch('email') && !isValidEmail(watch('email') || '') && 'Please enter a valid email address'}
                  {emailValidationAttempted && !watch('email') && 'Please enter your email address'}
                  {errors.email && errors.email.message}
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Step 4: Your Poker Journey - left aligned */}
          {step === 4 && (
            <motion.div
              className="flex flex-col items-start text-left w-full"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] mb-2 font-normal question">Tell us about your poker journey</h2>
              <p className="text-xl text-gray-500 mb-6 subheader">What games, formats, or stakes do you primarily play?</p>
              
              <textarea
                placeholder="Type your answer here..."
                autoFocus
                onKeyDown={handleKeyDown}
                {...register('experience', { 
                  required: 'Please fill out required information',
                  onChange: () => handleInputChange(4)
                })}
                className="text-[24px] md:text-[32px] border-0 border-b border-b-black w-full py-[10px] px-[10px] my-5 bg-transparent text-black outline-none transition-all duration-300 input-field focus:border-b-black text-left resize-none"
                rows={1}
                style={{
                  minHeight: 'auto',
                  overflow: 'hidden',
                  maxHeight: '280px' // Approximately 7 lines with responsive font size
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const newHeight = Math.min(target.scrollHeight, 280);
                  target.style.height = newHeight + 'px';
                  target.style.overflowY = newHeight >= 280 ? 'scroll' : 'hidden';
                  handleInputChange(4);
                }}
              />
              
              {/* Desktop: Character count and error message */}
              <div className="hidden md:flex w-full justify-between items-start" style={{ marginTop: '0px', marginBottom: '0px', minHeight: '20px' }}>
                <div className="text-sm text-[#ff4c4c]" style={{ minHeight: '20px' }}>
                  <span 
                    className="transition-opacity duration-300 ease-in-out"
                    style={{ 
                      opacity: (validationAttempted[4] && !watch('experience')?.trim()) || 
                               (validationAttempted[4] && watch('experience')?.trim() && (watch('experience')?.trim().length || 0) < 50) ? 1 : 0
                    }}
                  >
                    {validationAttempted[4] && !watch('experience')?.trim() && 'Please tell us about your poker journey'}
                    {validationAttempted[4] && watch('experience')?.trim() && (watch('experience')?.trim().length || 0) < 50 && 'Please provide at least 50 characters about your poker journey'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {(watch('experience') || '').length}/50 characters minimum
                </div>
              </div>
              
              {/* Mobile: Character count center aligned */}
              <div className="block md:hidden text-center text-sm text-gray-500" style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
                {(watch('experience') || '').length}/50 characters minimum
              </div>
              
              <div className="w-full flex flex-col md:flex-row gap-3 md:items-center" style={{ marginTop: '18px' }}>
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="w-full md:w-auto py-3 px-[42px] text-lg bg-black text-white border-none rounded-[50px] cursor-pointer hover:bg-gray-800 transition-all duration-300 font-semibold"
                >
                  OK
                </button>
                
                <span className="text-sm text-center md:text-left md:ml-[10px] text-gray-500 enter-message flex items-center justify-center md:justify-start">
                  Press enter <span className="mx-1 text-lg">↵</span>
                </span>
              </div>
              
              {/* Mobile: Error messages below button, center aligned */}
              <div className="block md:hidden text-[#ff4c4c] text-sm error-message text-center" style={{ minHeight: '24px', marginTop: '16px', textAlign: 'center', width: '100%' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (validationAttempted[4] && !watch('experience')?.trim()) || 
                             (validationAttempted[4] && watch('experience')?.trim() && (watch('experience')?.trim().length || 0) < 50) ||
                             errors.experience ? 1 : 0
                  }}
                >
                  {validationAttempted[4] && !watch('experience')?.trim() && 'Please tell us about your poker journey'}
                  {validationAttempted[4] && watch('experience')?.trim() && (watch('experience')?.trim().length || 0) < 50 && 'Please provide at least 50 characters about your poker journey'}
                  {errors.experience && errors.experience.message}
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Step 5: Preparation & Training - Multi-select (checkboxes on desktop, dropdown on mobile) */}
          {step === 5 && (
            <motion.div
              className="flex flex-col items-start text-left w-full"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] mb-2 font-normal question">How do you prepare for poker?</h2>
              <p className="text-xl text-gray-500 mb-6 subheader">(Select all that apply)</p>
              
              {/* Desktop: Pill-style Multi-select */}
              {!isMobile && (
                <div className="w-full mb-6">
                  <input type="hidden" {...register('training', { required: 'Please select at least one option' })} />
                  
                  <div className="flex flex-col gap-4">
                    {trainingOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleTrainingSelection(option.id)}
                        className="flex items-center justify-between w-full px-6 py-2 text-lg border rounded-[30px] transition-all duration-300 cursor-pointer bg-white text-black border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <span className="font-medium">{option.label}</span>
                        {watch('training')?.includes(option.id) && (
                          <div className="checkmark">
                            <svg 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="black" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Other field for desktop */}
                  <div 
                    ref={otherFieldRef}
                    className="w-full mt-4" 
                    style={{ 
                      opacity: 0,
                      height: 0,
                      overflow: 'hidden'
                    }}
                  >
                    <textarea
                      placeholder="Please specify your other training methods..."
                      {...register('trainingOther')}
                      className="text-[24px] md:text-[32px] border-0 border-b border-b-black w-full py-[10px] px-[10px] my-3 bg-transparent text-black outline-none transition-all duration-300 input-field focus:border-b-black text-left resize-none"
                      rows={1}
                      style={{
                        minHeight: 'auto',
                        overflow: 'hidden',
                        maxHeight: '280px'
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        const newHeight = Math.min(target.scrollHeight, 280);
                        target.style.height = newHeight + 'px';
                        target.style.overflowY = newHeight >= 280 ? 'scroll' : 'hidden';
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Mobile: Dropdown */}
              {isMobile && (
                <div className="relative w-full mb-4" ref={dropdownRef}>
                  <input type="hidden" {...register('training', { required: 'Please select at least one option' })} />
                  
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-6 py-4 text-lg border border-gray-300 rounded-[32px] bg-white hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:border-black"
                  >
                    <span className="text-black">
                      {watch('training')?.length > 0 
                        ? `${watch('training').length} training method${watch('training').length > 1 ? 's' : ''} selected`
                        : 'Select training methods...'
                      }
                    </span>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded-[16px] shadow-lg z-10 max-h-60 overflow-y-auto">
                      {trainingOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleTrainingSelection(option.id)}
                          className={`flex items-center justify-between w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-[16px] last:rounded-b-[16px] ${
                            watch('training')?.includes(option.id) ? 'bg-gray-100' : ''
                          }`}
                        >
                          <span className="text-black text-lg">{option.label}</span>
                          {watch('training')?.includes(option.id) && (
                            <svg 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="text-black"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Desktop: Error messages above button */}
              <div className="hidden md:block text-[#ff4c4c] text-base error-message text-center" style={{ minHeight: '24px', marginTop: '0px' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (validationAttempted[5] && (!watch('training') || watch('training')?.length === 0)) || errors.training ? 1 : 0
                  }}
                >
                  {validationAttempted[5] && (!watch('training') || watch('training')?.length === 0) && 'Please select at least one training method'}
                  {errors.training && errors.training.message}
                </span>
              </div>
              
              <div className="w-full flex flex-col md:flex-row gap-3 md:items-center mt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    if (isMobile) setIsDropdownOpen(false);
                    handleNextStep();
                  }} 
                  className="w-full md:w-auto py-3 px-[42px] text-lg bg-black text-white border-none rounded-[50px] cursor-pointer hover:bg-gray-800 transition-all duration-300 font-semibold"
                >
                  OK
                </button>
                
                <span className="text-sm text-center md:text-left md:ml-[10px] text-gray-500 enter-message flex items-center justify-center md:justify-start">
                  Press enter <span className="mx-1 text-lg">↵</span>
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Step 6: Career Highlight - left aligned */}
          {step === 6 && (
            <motion.div
              className="flex flex-col items-start text-left w-full"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] mb-2 font-normal question">Share your proudest poker moment</h2>
              <p className="text-xl text-gray-500 mb-6 subheader">What would you consider your proudest or most defining moment in poker so far?</p>
              
              <textarea
                placeholder="Tell us about your career highlight..."
                autoFocus
                onKeyDown={handleKeyDown}
                {...register('highlight', { required: 'Please fill out required information' })}
                className="text-[24px] md:text-[32px] border-0 border-b border-b-black w-full py-[10px] px-[10px] my-5 bg-transparent text-black outline-none transition-all duration-300 input-field focus:border-b-black text-left resize-none"
                rows={1}
                style={{
                  minHeight: 'auto',
                  overflow: 'hidden',
                  maxHeight: '280px' // Approximately 7 lines with responsive font size
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const newHeight = Math.min(target.scrollHeight, 280);
                  target.style.height = newHeight + 'px';
                  target.style.overflowY = newHeight >= 280 ? 'scroll' : 'hidden';
                }}
              />
              
              {/* Reserved space for error messages */}
              <div className="text-[#ff4c4c] text-base error-message text-center" style={{ minHeight: '24px', marginTop: '0px' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (validationAttempted[6] && !watch('highlight')?.trim()) || errors.highlight ? 1 : 0
                  }}
                >
                  {validationAttempted[6] && !watch('highlight')?.trim() && 'Please share your proudest poker moment'}
                  {errors.highlight && errors.highlight.message}
                </span>
              </div>
              
              <div className="w-full flex flex-col md:flex-row gap-3 md:items-center mt-4">
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="w-full md:w-auto py-3 px-[42px] text-lg bg-black text-white border-none rounded-[50px] cursor-pointer hover:bg-gray-800 transition-all duration-300 font-semibold"
                >
                  OK
                </button>
                
                <span className="text-sm text-center md:text-left md:ml-[10px] text-gray-500 enter-message flex items-center justify-center md:justify-start">
                  Press enter <span className="mx-1 text-lg">↵</span>
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Step 7: Defining Success - left aligned */}
          {step === 7 && (
            <motion.div
              className="flex flex-col items-start text-left w-full"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] mb-2 font-normal question">What does success mean to you?</h2>
              <p className="text-xl text-gray-500 mb-6 subheader">What does success in poker mean to you, beyond just money or titles?</p>
              
              <textarea
                placeholder="Share your definition of success..."
                autoFocus
                onKeyDown={handleKeyDown}
                {...register('success', { required: 'Please fill out required information' })}
                className="text-[24px] md:text-[32px] border-0 border-b border-b-black w-full py-[10px] px-[10px] my-5 bg-transparent text-black outline-none transition-all duration-300 input-field focus:border-b-black text-left resize-none"
                rows={1}
                style={{
                  minHeight: 'auto',
                  overflow: 'hidden',
                  maxHeight: '280px' // Approximately 7 lines with responsive font size
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const newHeight = Math.min(target.scrollHeight, 280);
                  target.style.height = newHeight + 'px';
                  target.style.overflowY = newHeight >= 280 ? 'scroll' : 'hidden';
                }}
              />
              
              {/* Reserved space for error messages */}
              <div className="text-[#ff4c4c] text-base error-message text-center" style={{ minHeight: '24px', marginTop: '0px' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (validationAttempted[7] && !watch('success')?.trim()) || errors.success ? 1 : 0
                  }}
                >
                  {validationAttempted[7] && !watch('success')?.trim() && 'Please share what success means to you'}
                  {errors.success && errors.success.message}
                </span>
              </div>
              
              <div className="w-full flex flex-col md:flex-row gap-3 md:items-center mt-4">
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="w-full md:w-auto py-3 px-[42px] text-lg bg-black text-white border-none rounded-[50px] cursor-pointer hover:bg-gray-800 transition-all duration-300 font-semibold"
                >
                  OK
                </button>
                
                <span className="text-sm text-center md:text-left md:ml-[10px] text-gray-500 enter-message flex items-center justify-center md:justify-start">
                  Press enter <span className="mx-1 text-lg">↵</span>
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Step 8: Alignment with PokerPal */}
          {step === 8 && (
            <motion.div
              className="flex flex-col items-start text-left w-full"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] mb-2 font-normal question">Why would you make a strong Founding Member of PokerPal?</h2>
              <p className="text-xl text-gray-500 mb-6 subheader">How do you personally represent the idea that poker is a sport?</p>
              
              <textarea
                placeholder="Share your thoughts here..."
                autoFocus
                {...register('alignment', { 
                  required: 'Please fill out required information',
                  onChange: () => handleInputChange(8)
                })}
                className="text-[24px] md:text-[32px] border-0 border-b border-b-black w-full py-[10px] px-[10px] my-5 bg-transparent text-black outline-none transition-all duration-300 input-field focus:border-b-black text-left resize-none"
                rows={1}
                style={{
                  minHeight: 'auto',
                  overflow: 'hidden',
                  maxHeight: '320px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const newHeight = Math.min(target.scrollHeight, 320);
                  target.style.height = newHeight + 'px';
                  target.style.overflowY = newHeight >= 320 ? 'scroll' : 'hidden';
                  handleInputChange(8);
                }}
              />
              
              {/* Desktop: Character count and error message */}
              <div className="hidden md:flex w-full justify-between items-start" style={{ marginTop: '0px', marginBottom: '0px', minHeight: '20px' }}>
                <div className="text-sm text-[#ff4c4c]" style={{ minHeight: '20px' }}>
                  <span 
                    className="transition-opacity duration-300 ease-in-out"
                    style={{ 
                      opacity: (validationAttempted[8] && !watch('alignment')?.trim()) || 
                               (validationAttempted[8] && watch('alignment')?.trim() && (watch('alignment')?.trim().length || 0) < 50) ? 1 : 0
                    }}
                  >
                    {validationAttempted[8] && !watch('alignment')?.trim() && 'Please explain why you\'d make a strong Founding Member'}
                    {validationAttempted[8] && watch('alignment')?.trim() && (watch('alignment')?.trim().length || 0) < 50 && 'Please provide at least 50 characters about your alignment with PokerPal'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {(watch('alignment') || '').length}/50 characters minimum
                </div>
              </div>
              
              {/* Mobile: Character count center aligned */}
              <div className="block md:hidden text-center text-sm text-gray-500" style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
                {(watch('alignment') || '').length}/50 characters minimum
              </div>
              
              <div className="w-full flex flex-col md:flex-row gap-3 md:items-center" style={{ marginTop: '18px' }}>
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="w-full md:w-auto py-3 px-[42px] text-lg bg-black text-white border-none rounded-[50px] cursor-pointer hover:bg-gray-800 transition-all duration-300 font-semibold"
                >
                  OK
                </button>
                
                <span className="text-sm text-center md:text-left md:ml-[10px] text-gray-500 enter-message flex items-center justify-center md:justify-start">
                  Press enter <span className="mx-1 text-lg">↵</span>
                </span>
              </div>
              
              {/* Mobile: Error messages below button, center aligned */}
              <div className="block md:hidden text-[#ff4c4c] text-sm error-message text-center" style={{ minHeight: '24px', marginTop: '16px', textAlign: 'center', width: '100%' }}>
                <span 
                  className="transition-opacity duration-300 ease-in-out text-center"
                  style={{ 
                    textAlign: 'center',
                    display: 'block',
                    width: '100%',
                    opacity: (validationAttempted[8] && !watch('alignment')?.trim()) || 
                             (validationAttempted[8] && watch('alignment')?.trim() && (watch('alignment')?.trim().length || 0) < 50) ||
                             errors.alignment ? 1 : 0
                  }}
                >
                  {validationAttempted[8] && !watch('alignment')?.trim() && 'Please explain why you\'d make a strong Founding Member'}
                  {validationAttempted[8] && watch('alignment')?.trim() && (watch('alignment')?.trim().length || 0) < 50 && 'Please provide at least 50 characters about your alignment with PokerPal'}
                  {errors.alignment && errors.alignment.message}
                </span>
              </div>
              
            </motion.div>
          )}

          {/* Step 9: Final Congratulations & Submit */}
          {step === 9 && (
            <motion.div
              className="flex flex-col items-center text-center w-full"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              id="final-submit"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] mb-8 font-normal question text-center">
                Thank you for sharing your poker journey with us!
              </h2>
              <p className="text-xl text-gray-500 mb-6 md:mb-8 w-[90%] sm:w-[70%] md:w-[90%] max-w-3xl mx-auto">
                We&apos;re excited to learn more about dedicated poker athletes like you. Your application will be reviewed, and we&apos;ll be in touch soon about joining the PokerPal founding team.
              </p>
              
              <p className="text-sm text-gray-400 mb-6 md:mb-8 w-[90%] sm:w-[70%] md:w-[90%] max-w-2xl mx-auto text-center">
                📧 By submitting, you&apos;ll also be added to our newsletter to stay updated on PokerPal&apos;s development and founding member opportunities.
              </p>
              
              <div className="w-full flex justify-center mt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="relative z-[1000] py-3 md:py-4 px-10 md:px-[51px] text-lg md:text-xl bg-black text-white border-none rounded-[46.55px] cursor-pointer hover:bg-gray-800 hover:shadow-lg transition-all duration-300 submit-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold group"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <svg 
                    width="13" 
                    height="13" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="ml-3 transform transition-transform duration-300 group-hover:translate-x-2"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
              
              {error && (
                <p className="text-[#ff4c4c] text-base mt-4 text-center">{error}</p>
              )}
            </motion.div>
          )}
        </form>
      </div>
      
      {/* Custom Styles for Elements Not Easily Done with Tailwind */}
      <style jsx global>{`
        /* Make sure body and html don't scroll */
        html, body {
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
        
        /* Remove focus outline */
        *:focus {
          outline: none !important;
        }
        
        /* Checkbox style adjustments */
        .checkmark {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 10px;
        }
        
        .check-icon {
          filter: brightness(0) invert(1);
        }
        
        /* Fix for checkbox clicking in forms */
        label.cursor-pointer {
          display: block;
          width: 100%;
        }
        
        /* Custom radio button style */
        .custom-radio::before {
          content: '';
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 1px solid #242424;
          border-radius: 50%;
          margin-right: 12px;
          transition: border-color 0.3s ease;
        }
        
        .custom-radio.checked::before {
          background-color: rgba(251, 251, 251, 0.4);
        }
        
        /* Remove placeholder when valid */
        .input-field:valid::placeholder {
          color: transparent;
        }
        
        /* Ensure all form steps are centered */
        .form-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        /* Add responsive styles */
        @media screen and (max-width: 990px) {
          #welcome-header {
            font-size: 3rem;
            height: auto;
            margin-bottom: 24px;
            white-space: normal;
          }
        }
        
        @media screen and (max-width: 500px) {
          .pokerpal-logo-intake {
            width: 64px;
            height: auto;
          }
          
          #welcome-header {
            font-size: 54px;
            margin: 0px;
            margin-bottom: 20px;
            box-sizing: border-box;
            width: inherit;
            padding: 0px 12px;
          }
          
          .welcome-buttons {
            display: flex;
            margin-left: 0px;
            gap: 12px;
            align-items: center;
            flex-direction: column;
          }
          
          .enter-message {
            display: none;
          }
          
          .question {
            font-size: 1.75rem;
          }
          
          .subheader {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 