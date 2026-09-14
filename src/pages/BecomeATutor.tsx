import React from 'react';
import { MessageCircle, CheckCircle2, Award, Users, BookOpen, ShieldCheck } from 'lucide-react';

interface BecomeATutorProps {
  onNavigate: (path: string) => void;
}

export const BecomeATutor: React.FC<BecomeATutorProps> = ({ onNavigate }) => {
  const whatsappNumber = '01823067428';
  const whatsappUrl = `https://wa.me/8801823067428?text=Hello%20Smart%20Tutor%20Network,%20I%20want%20to%20register%20as%20a%20verified%20tutor.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          <Award className="w-4 h-4 text-blue-600" />
          Join Bangladesh&apos;s Elite Tutor Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Become a Verified Tutor with Smart Tutor Network
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Are you a university student, graduate, or professional educator from BUET, DU, Medical, or top institutions looking for reliable tuition opportunities in Dhaka? Connect with us today.
        </p>
      </div>

      {/* Benefits grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Daily Tuition Posts</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Access dozens of verified tuition jobs published daily across Dhaka with transparent salaries and schedules.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">100% Secure & Trusted</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every tuition opportunity is vetted by our administration team to ensure security and reliability for tutors.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Direct WhatsApp Support</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Quick communication and fast confirmation through our official WhatsApp helpline (01823067428).
          </p>
        </div>
      </div>

      {/* Registration Steps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 space-y-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">How to Register as a Tutor</h2>
        <ul className="space-y-4 text-sm sm:text-base text-gray-700">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <span>Prepare your educational credentials (University ID, HSC/SSC certificates, department).</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <span>Browse our latest tuition feed and note down the tuition codes (e.g. #STN1025) you wish to apply for.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <span>Send your CV and details directly to our official WhatsApp number: <strong>{whatsappNumber}</strong>.</span>
          </li>
        </ul>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 rounded-xl font-bold text-base text-center shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Register via WhatsApp ({whatsappNumber})</span>
          </a>
          <button
            onClick={() => onNavigate('/tuition')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-bold text-base text-center transition-colors shadow-md"
          >
            Browse Available Tuition
          </button>
        </div>
      </div>

    </div>
  );
};
