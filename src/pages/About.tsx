import React from 'react';
import { ShieldCheck, BookOpen, Users, Award, Heart } from 'lucide-react';

interface AboutProps {
  onNavigate: (path: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          About Smart Tutor Network
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Bangladesh&apos;s premier daily tuition media platform and tutor marketplace, bridging the gap between quality education seekers and exceptional educators.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Our Mission & Vision</h2>
          <p className="text-gray-700 leading-relaxed text-base">
            Smart Tutor Network was founded with a singular purpose: to provide a reliable, transparent, and efficient daily tuition media service across Dhaka and Bangladesh. We empower students and parents with verified tuition postings while creating trustworthy earning and teaching opportunities for talented tutors from BUET, DU, Medical colleges, and top universities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-2">
            <h3 className="font-bold text-blue-900 text-lg">For Parents & Students</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Find verified home tutors and online tutors matching your exact medium, class, and budget requirements with zero hassle.
            </p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 space-y-2">
            <h3 className="font-bold text-emerald-900 text-lg">For Professional Tutors</h3>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Access genuine daily tuition opportunities ordered chronologically with direct WhatsApp communication channels (01823067428).
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Why Trust Smart Tutor Network?</h2>
          <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
            <li className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Real-time published tuition feed with verified codes (#STN1025).</span>
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Advanced multi-filter support for precise matching.</span>
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Dedicated administrative team managing postings daily.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};
