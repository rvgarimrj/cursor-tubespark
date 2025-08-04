"use client";

import { useEffect } from 'react';

export function LandingAnimations() {
  useEffect(() => {
    // Smooth scroll for navigation links
    const setupSmoothScroll = () => {
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href')!);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    };

    // Header background change on scroll
    const setupHeaderScroll = () => {
      const header = document.querySelector('header');
      const handleScroll = () => {
        if (!header) return;
        
        if (window.scrollY > 100) {
          header.style.background = 'rgba(17, 24, 39, 0.95)';
        } else {
          header.style.background = 'rgba(17, 24, 39, 0.8)';
        }
      };

      window.addEventListener('scroll', handleScroll);
      
      // Cleanup function
      return () => window.removeEventListener('scroll', handleScroll);
    };

    // Intersection Observer for fade-in animations
    const setupIntersectionObserver = () => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      // Observe feature cards for stagger animation
      const featureCards = document.querySelectorAll('.feature-card');
      featureCards.forEach((card, index) => {
        const element = card as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
      });

      // Observe other animated elements
      const animatedElements = document.querySelectorAll('.problem-highlight, .solution-highlight, .stats-card');
      animatedElements.forEach((element, index) => {
        const el = element as HTMLElement;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
      });

      // Cleanup function
      return () => observer.disconnect();
    };

    // Initialize all animations
    setupSmoothScroll();
    const cleanupHeaderScroll = setupHeaderScroll();
    const cleanupIntersectionObserver = setupIntersectionObserver();

    // Cleanup function for useEffect
    return () => {
      cleanupHeaderScroll?.();
      cleanupIntersectionObserver?.();
    };
  }, []);

  return null; // This component doesn't render anything
}