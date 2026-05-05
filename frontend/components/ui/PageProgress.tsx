'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PageProgress() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);

    // Simulate progress increase
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    // Complete progress after a short delay
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent">
      <div
        className="h-full bg-accent transition-all duration-200 ease-out"
        style={{
          width: `${Math.min(progress, 100)}%`,
          opacity: isLoading ? 1 : 0,
          transition: 'width 0.2s ease-out, opacity 0.2s ease-out',
        }}
      />
    </div>
  );
}
