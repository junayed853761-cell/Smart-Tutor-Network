import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const iconSize = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    hero: 'w-16 h-16 text-lg'
  }[size];

  if (imgError) {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <div className={`rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm ${iconSize}`}>
          STN
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-white text-sm sm:text-base leading-tight tracking-tight">
            Smart Tutor Network
          </span>
          <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            Trusted Tutor Service
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className={`rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm shrink-0 ${iconSize}`}>
          STN
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-white text-sm sm:text-base leading-tight tracking-tight">
            Smart Tutor Network
          </span>
          <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            Trusted Tutor Service
          </span>
        </div>
      </div>
      <img
        src="/logo.jpg"
        alt="Smart Tutor Network"
        className="hidden"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

