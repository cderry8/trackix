'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export function Card({
  className,
  children,
  tilt = true,
}: {
  className?: string;
  children: React.ReactNode;
  tilt?: boolean;
}) {
  return (
    <motion.div
      className={cn('glass-panel p-5', className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={tilt ? { y: -4, transition: { type: 'spring', stiffness: 260, damping: 22 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
