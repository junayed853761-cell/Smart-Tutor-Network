import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const whatsappNumber = '01823067428';
  const whatsappUrl = `https://wa.me/8801823067428?text=Hello%20Smart%20Tutor%20Network`;

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="bg-white/5 p-3 rounded-2xl border border-gray-800 inline-block">
              <Logo size="md" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bangladesh&apos;s leading daily tuition media and tutor marketplace platform connecting verified students, parents, and professional tutors.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp: {whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide border-b border-gray-800 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-blue-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tuition')} className="hover:text-blue-400 transition-colors">
                  Find Tuition (Latest Jobs)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/become-a-tutor')} className="hover:text-blue-400 transition-colors">
                  Become a Tutor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-blue-400 transition-colors">
                  About Smart Tutor Network
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-blue-400 transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Tuition Categories */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide border-b border-gray-800 pb-2">
              Tuition Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/tuition?medium=English+Medium')} className="hover:text-blue-400 transition-colors">
                  English Medium Tuitions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tuition?medium=Bangla+Medium')} className="hover:text-blue-400 transition-colors">
                  Bangla Medium Tuitions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tuition?background=BUET')} className="hover:text-blue-400 transition-colors">
                  BUET Preferred Tutors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tuition?medium=English+Version')} className="hover:text-blue-400 transition-colors">
                  English Version Tuitions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tuition?category=online-tuition')} className="hover:text-blue-400 transition-colors">
                  Online Tuitions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Office */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide border-b border-gray-800 pb-2">
              Head Office
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>39/7-A East Rampura, dhaka-1219., Dhaka, Bangladesh, 1219</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>WhatsApp: {whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <span>tutornetworksmart@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs text-gray-400">Verified & Secure Tuition Provider</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p 
            title="Smart Tutor Network" 
            className="cursor-default select-none"
            onDoubleClick={() => onNavigate('/login')}
          >
            © {new Date().getFullYear()} Smart Tutor Network. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/contact')} className="hover:text-gray-300">Privacy Policy</button>
            <button onClick={() => onNavigate('/contact')} className="hover:text-gray-300">Terms of Service</button>
            <span className="flex items-center gap-1 text-gray-400">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Bangladesh Education
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
