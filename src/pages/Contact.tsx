import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactProps {
  onNavigate: (path: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const whatsappNumber = '01823067428';
  const whatsappUrl = `https://wa.me/8801823067428?text=Hello%20Smart%20Tutor%20Network,%20I%20would%20like%20to%20get%20in%20touch.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Contact Smart Tutor Network
        </h1>
        <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
          Get in touch with our support team or chat directly via WhatsApp for quick response regarding tuition postings and tutor verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">Head Office & Support</h2>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Address</strong>
                <span>House 42, Road 11, Uttara Model Town, Dhaka 1230, Bangladesh</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block text-gray-900">WhatsApp Helpline</strong>
                <span className="font-bold text-emerald-700">{whatsappNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <strong className="block text-gray-900">Email Address</strong>
                <span>support@smarttutornetwork.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Office Hours</strong>
                <span>Saturday – Thursday: 9:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Direct CTA Card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              Instant WhatsApp Support
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight">Chat with Us Instantly</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Have questions about a tuition post or need assistance finding a tutor? Our WhatsApp team is active and ready to help.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 rounded-xl font-bold text-base text-center shadow-md transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Open WhatsApp ({whatsappNumber})</span>
          </a>
        </div>

      </div>

    </div>
  );
};
