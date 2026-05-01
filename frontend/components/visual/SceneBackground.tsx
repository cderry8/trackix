'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/cn';

const PARTICLES = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 13) % 100}%`,
  top: `${(i * 23 + 7) % 100}%`,
  size: 1 + (i % 3),
  delay: (i % 9) * 0.7,
  duration: 16 + (i % 11),
}));

export function SceneBackground({ className }: { className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 20 });
  const smy = useSpring(my, { stiffness: 40, damping: 20 });
  const shiftX = useTransform(smx, (v) => v * 0.04);
  const shiftY = useTransform(smy, (v) => v * 0.04);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mx.set(e.clientX - cx);
      my.set(e.clientY - cy);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        className
      )}
      aria-hidden
    >
      <motion.div style={{ x: shiftX, y: shiftY }} className="absolute inset-[-12%]">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-muted to-surface dark:from-black dark:via-zinc-950 dark:to-black" />
        <motion.div
          className="absolute -left-[20%] top-[10%] h-[55%] w-[55%] rounded-full bg-accent/10 blur-[120px] dark:bg-accent/15"
          animate={{ opacity: [0.25, 0.45, 0.3] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[5%] right-[-10%] h-[45%] w-[45%] rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-400/10"
          animate={{ opacity: [0.2, 0.4, 0.25] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <div
          className="absolute inset-0 animate-grid-drift bg-[length:120px_120px] bg-grid-fade opacity-[0.18] dark:opacity-[0.12]"
          style={{ maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 72%)' }}
        />
        <div className="absolute inset-0 opacity-[0.14] dark:opacity-[0.2]">
          <div className="absolute inset-x-0 top-[20%] h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-pulse" />
          <div className="absolute inset-x-0 bottom-[30%] h-px bg-gradient-to-r from-transparent via-ink/20 to-transparent" />
          <motion.div
            className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent"
            animate={{ opacity: [0.2, 0.55, 0.25] }}
            transition={{ duration: 14, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-1/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-ink/15 to-transparent dark:via-white/10"
            animate={{ opacity: [0.15, 0.4, 0.2] }}
            transition={{ duration: 17, repeat: Infinity, delay: 1 }}
          />
        </div>
        <div className="absolute inset-0">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                opacity: 0.15 + (p.id % 5) * 0.02,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
