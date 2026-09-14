import React, { useEffect } from 'react';
import { extractDominantColor } from '../lib/colorExtractor';

interface SiteLogoProps {
  logoUrl?: string;
  siteName?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  onClick?: () => void;
  className?: string;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({
  logoUrl = '/logo.jpg',
  siteName = 'Smart Tutor Network',
  size = 'md',
  onClick,
  className = ''
}) => {
  const dimensions = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    hero: 'h-20'
  }[size];

  useEffect(() => {
    if (logoUrl) {
      extractDominantColor(logoUrl, (color) => {
        document.documentElement.style.setProperty('--brand-primary', color);
      });
    }
  }, [logoUrl]);

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      <div className={`relative flex items-center ${dimensions} w-auto bg-white rounded-xl p-1 border border-gray-100 shadow-2xs transition-transform group-hover:scale-102`}>
        <img
          src={logoUrl}
          alt={siteName}
          className="h-full w-auto object-contain"
          onError={(e) => {
            // Fallback rendering if image fails
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-badge')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallback-badge flex items-center gap-2 px-2';
              fallback.innerHTML = '<div class="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">STN</div>';
              parent.appendChild(fallback);
            }
          }}
        />
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-gray-900 tracking-tight text-base sm:text-lg leading-tight group-hover:text-[var(--brand-primary, #1D4ED8)] transition-colors">
          {siteName}
        </span>
        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">
          Trusted Tutor Service
        </span>
      </div>
    </div>
  );
};
