import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, prefix, suffix, decimals, style }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const start = 0;
        const end = Number(value);
        const duration = 800;
        const startTime = performance.now();
        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(start + (end - start) * eased);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const fmt = decimals !== undefined ? Number(display).toFixed(decimals) : Math.round(display).toLocaleString();

  return <span ref={ref} style={style}>{prefix}{fmt}{suffix}</span>;
}
