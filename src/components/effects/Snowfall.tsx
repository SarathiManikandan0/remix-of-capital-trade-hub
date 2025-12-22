import { useEffect, useRef, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Snowflake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function Snowfall() {
  const prefersReducedMotion = useReducedMotion();
  
  const snowflakes = useMemo(() => {
    // Reduce density for reduced motion preference
    const count = prefersReducedMotion ? 15 : 35;
    
    return Array.from({ length: count }, (_, i): Snowflake => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    // Static subtle dots for reduced motion
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {snowflakes.slice(0, 10).map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-foreground/5"
            style={{
              left: `${flake.x}%`,
              top: `${Math.random() * 100}%`,
              width: flake.size,
              height: flake.size,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full"
          style={{
            left: `${flake.x}%`,
            width: flake.size,
            height: flake.size,
            background: `radial-gradient(circle, hsl(var(--foreground) / ${flake.opacity}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${flake.size * 2}px hsl(var(--foreground) / ${flake.opacity * 0.5})`,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: ['0vh', '105vh'],
            x: [0, Math.sin(flake.id) * 30],
            opacity: [0, flake.opacity, flake.opacity, 0],
          }}
          transition={{
            y: {
              duration: flake.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: flake.delay,
            },
            x: {
              duration: flake.duration * 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: flake.delay,
            },
            opacity: {
              duration: flake.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: flake.delay,
              times: [0, 0.1, 0.9, 1],
            },
          }}
        />
      ))}
    </div>
  );
}
