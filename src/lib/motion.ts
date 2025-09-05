// Motion utilities and configuration for DriveEase
import { useEffect, useRef } from 'react';

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if device is low-power (basic heuristic)
export const isLowPowerDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for low-end device indicators
  const connection = (navigator as any).connection;
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  
  return (
    hardwareConcurrency <= 2 ||
    deviceMemory <= 2 ||
    (connection && connection.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType))
  );
};

// Smooth scroll configuration
export const lenisConfig = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
};

// Scroll animation hook
export const useScrollAnimation = (target: React.RefObject<HTMLElement>, options?: {
  offset?: number;
  threshold?: number;
}) => {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    
    const element = target.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
        });
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: `${options?.offset || -50}px`,
      }
    );

    // Initial state
    element.style.opacity = '0';
    element.style.transform = 'translateY(18px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

    observer.observe(element);

    return () => observer.disconnect();
  }, [target, options]);
};

// Parallax scroll hook
export const useParallax = (target: React.RefObject<HTMLElement>, strength: number = 0.5) => {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    
    const element = target.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const bounds = element.getBoundingClientRect();
      const centerY = bounds.top + bounds.height / 2;
      const windowCenterY = window.innerHeight / 2;
      const distanceFromCenter = centerY - windowCenterY;
      const parallaxValue = distanceFromCenter * strength;
      
      element.style.transform = `translateY(${parallaxValue}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [target, strength]);
};

// Stagger animation utility
export const staggerChildren = (
  container: HTMLElement,
  delay: number = 0.08,
  animationClass: string = 'animate-fade-in'
) => {
  if (prefersReducedMotion()) return;
  
  const children = Array.from(container.children) as HTMLElement[];
  children.forEach((child, index) => {
    setTimeout(() => {
      child.classList.add(animationClass);
    }, index * delay * 1000);
  });
};

// 3D performance check
export const should3DRender = () => {
  if (isLowPowerDevice()) return false;
  
  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
  
  if (!gl) return false;
  
  // Check for discrete GPU (better performance indicator)
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    // Basic check for integrated vs discrete GPU
    return !/(Intel|Integrated|SwiftShader)/i.test(renderer);
  }
  
  return true;
};