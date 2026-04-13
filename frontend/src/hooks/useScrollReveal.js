import { useEffect, useRef } from 'react';

/**
 * Hook that uses Intersection Observer to add a 'revealed' class
 * when elements with '.reveal', '.reveal-left', or '.reveal-scale' scroll into view.
 * Call once in a layout/page component, passing the container ref.
 */
export function useScrollReveal(deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current || document;
    const targets = root.querySelectorAll('.reveal, .reveal-left, .reveal-scale');

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, deps);

  return containerRef;
}
