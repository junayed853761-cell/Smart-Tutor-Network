import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  tuitionCode?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ tuitionCode, className = '' }) => {
  const whatsappNumber = '01823067428';
  const internationalNumber = '8801823067428';
  const message = tuitionCode 
    ? encodeURIComponent(`Hello Smart Tutor Network, I am interested in tuition ${tuitionCode}. Please provide details.`)
    : encodeURIComponent('Hello Smart Tutor Network, I want to know about available tuition opportunities.');

  const whatsappUrl = `https://wa.me/${internationalNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-700"></span>
        </span>
      </div>
      <span className="font-medium text-sm hidden sm:inline-block">WhatsApp: {whatsappNumber}</span>
    </a>
  );
};
