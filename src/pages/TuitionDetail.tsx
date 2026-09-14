import React, { useEffect } from 'react';
import { TuitionPost } from '../types';
import { MapPin, Clock, BookOpen, GraduationCap, DollarSign, Calendar, MessageCircle, ArrowLeft, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { TuitionCard } from '../components/TuitionCard';

interface TuitionDetailProps {
  slug: string;
  tuitionPosts: TuitionPost[];
  onNavigate: (path: string) => void;
  onViewDetails: (slug: string) => void;
}

export const TuitionDetail: React.FC<TuitionDetailProps> = ({
  slug,
  tuitionPosts,
  onNavigate,
  onViewDetails
}) => {
  const post = tuitionPosts.find((p) => p.slug === slug || p.tuition_code.toLowerCase() === slug.toLowerCase());

  useEffect(() => {
    if (post) {
      const pageTitle = post.seo_title || `${post.title} | Smart Tutor Network (#${post.tuition_code})`;
      const pageDesc = post.seo_description || `Tuition Opportunity #${post.tuition_code}: ${post.description.substring(0, 150)}... Salary: ৳${post.salary}/month in ${post.location}.`;
      
      document.title = pageTitle;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', pageDesc);

      const updateOgTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      updateOgTag('og:title', pageTitle);
      updateOgTag('og:description', pageDesc);
      if (post.seo_og_image) {
        updateOgTag('og:image', post.seo_og_image);
      }
    }
    return () => {
      document.title = 'Smart Tutor Network - #1 Tuition Provider in Dhaka';
    };
  }, [post]);

  const whatsappNumber = '01823067428';
  const whatsappUrl = post 
    ? `https://wa.me/8801823067428?text=${encodeURIComponent(`Hello Smart Tutor Network, I am interested in tuition ${post.tuition_code} (${post.title}). Please let me know the procedure to apply.`)}`
    : `https://wa.me/8801823067428?text=${encodeURIComponent(`Hello Smart Tutor Network, I want to inquire about tuition opportunities.`)}`;

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Tuition Post Not Found</h1>
        <p className="text-gray-600 text-sm">The tuition posting you are looking for may have been archived or removed.</p>
        <button
          onClick={() => onNavigate('/tuition')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors"
        >
          Browse All Tuition
        </button>
      </div>
    );
  }

  // Related tuition (same medium or location, excluding current)
  const relatedPosts = tuitionPosts
    .filter((p) => p.id !== post.id && p.status === 'published' && (p.medium === post.medium || p.location === post.location))
    .slice(0, 3);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('/tuition')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tuition List</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 sm:p-8 text-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-blue-700 text-white tracking-wide font-mono">
              #{post.tuition_code}
            </span>
            <div className="flex items-center gap-2">
              {post.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-gray-900">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Tuition
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-800 text-blue-200">
                {post.medium}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-blue-100 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-300" />
              Posted: {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" />
              Location: {post.location} ({post.area})
            </span>
          </div>
        </div>

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200 text-center">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 block mb-1">Monthly Salary</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-700">
              ৳{post.salary.toLocaleString()}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 block mb-1">Days Per Week</span>
            <span className="text-lg sm:text-xl font-extrabold text-blue-700">
              {post.days_per_week} Days
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 block mb-1">Duration</span>
            <span className="text-lg sm:text-xl font-extrabold text-indigo-700">
              {post.hours_per_day} Hours/day
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 block mb-1">Class Level</span>
            <span className="text-lg sm:text-xl font-extrabold text-gray-900">
              {post.class_level}
            </span>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Tuition Description & Requirements</h2>
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {post.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Tuition Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Tuition Code</span>
                <span className="font-mono font-bold text-blue-600">#{post.tuition_code}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Medium</span>
                <span className="font-semibold text-gray-800">{post.medium}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Class Level</span>
                <span className="font-semibold text-gray-800">{post.class_level}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Required Subjects</span>
                <span className="font-semibold text-gray-800">{post.subjects.join(', ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Location / Area</span>
                <span className="font-semibold text-gray-800">{post.location}, {post.area}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Tutor Gender Preference</span>
                <span className="font-semibold text-gray-800">{post.tutor_gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Educational Background</span>
                <span className="font-semibold text-gray-800">{post.tutor_background} Preferred</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Student Gender</span>
                <span className="font-semibold text-gray-800">{post.student_gender}</span>
              </div>
            </div>
          </div>

          {/* Prominent WhatsApp Apply CTA Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white mb-1 shadow-md">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Apply for Tuition #{post.tuition_code}</h3>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Contact Smart Tutor Network directly via WhatsApp to confirm your application and tutor profile verification.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg transition-all hover:scale-105"
              >
                <MessageCircle className="w-6 h-6 fill-current" />
                <span>Contact Smart Tutor Network on WhatsApp: {whatsappNumber}</span>
              </a>
            </div>
            <span className="text-xs text-gray-500 block pt-1">
              Mention tuition code <strong>#{post.tuition_code}</strong> in your message.
            </span>
          </div>

        </div>

      </div>

      {/* Related Tuition Section */}
      {relatedPosts.length > 0 && (
        <div className="pt-8 space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-900">Related Tuition Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <TuitionCard key={rel.id} post={rel} onViewDetails={onViewDetails} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
