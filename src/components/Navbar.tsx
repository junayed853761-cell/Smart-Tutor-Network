import React, { useState } from 'react';
import { Menu, X, MessageCircle, User, Shield, BookOpen, Home, Search, PhoneCall, Info } from 'lucide-react';
import { UserProfile, SiteSettings } from '../types';
import { SiteLogo } from './SiteLogo';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  settings?: SiteSettings;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, currentUser, settings, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappNumber = settings?.contact_whatsapp || '01823067428';
  const whatsappUrl = `https://wa.me/8801823067428?text=Hello%20Smart%20Tutor%20Network`;

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <SiteLogo
            logoUrl={settings?.logo_url || '/logo.jpg'}
            siteName={settings?.site_name || 'Smart Tutor Network'}
            size="md"
            onClick={() => handleNav('/')}
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('/')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/tuition')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/tuition' || currentPath.startsWith('/tuition/') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Find Tuition
            </button>
            <button
              onClick={() => handleNav('/become-a-tutor')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/become-a-tutor' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Become a Tutor
            </button>
            <button
              onClick={() => handleNav('/about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/about' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/contact' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xs transition-all hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{whatsappNumber}</span>
            </a>

            {currentUser && (
              <div className="flex items-center gap-2">
                {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className="flex items-center gap-1 bg-gray-900 hover:bg-gray-800 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="bg-emerald-600 text-white p-2.5 rounded-lg shadow-xs"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-xl transition-all">
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <Home className="w-5 h-5 text-blue-600" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNav('/tuition')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <Search className="w-5 h-5 text-blue-600" />
            <span>Find Tuition</span>
          </button>
          <button
            onClick={() => handleNav('/become-a-tutor')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Become a Tutor</span>
          </button>
          <button
            onClick={() => handleNav('/about')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <Info className="w-5 h-5 text-blue-600" />
            <span>About Us</span>
          </button>
          <button
            onClick={() => handleNav('/contact')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <PhoneCall className="w-5 h-5 text-blue-600" />
            <span>Contact</span>
          </button>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {currentUser && (
              <>
                {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-4 py-3 rounded-lg text-base font-medium"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg text-base font-medium"
                >
                  <span>Logout ({currentUser.email})</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
