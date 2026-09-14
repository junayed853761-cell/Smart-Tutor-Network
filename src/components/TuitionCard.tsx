import React from 'react';
import { TuitionPost } from '../types';
import { MapPin, Clock, BookOpen, GraduationCap, DollarSign, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface TuitionCardProps {
  post: TuitionPost;
  onViewDetails: (slug: string) => void;
}

export const TuitionCard: React.FC<TuitionCardProps> = ({ post, onViewDetails }) => {
  // Check if published within last 24 hours to display NEW badge
  const isNew = post.published_at 
    ? (Date.now() - new Date(post.published_at).getTime()) < 24 * 60 * 60 * 1000 
    : false;

  // Format time ago
  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const diffMin = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60));
    if (diffMin < 60) return `${Math.max(1, diffMin)} mins ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden ${
      post.featured ? 'border-amber-400 ring-1 ring-amber-400/30 shadow-md' : 'border-gray-200 hover:border-blue-300'
    }`}>
      
      {/* Top Header Bar */}
      <div className="p-5 pb-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 tracking-wide font-mono">
            #{post.tuition_code}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {post.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Featured
              </span>
            )}
            {isNew && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white animate-pulse">
                NEW
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
              {post.medium}
            </span>
          </div>
        </div>

        <h3 
          onClick={() => onViewDetails(post.slug)}
          className="text-base font-bold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug transition-colors"
          title={post.title}
        >
          {post.title}
        </h3>
      </div>

      {/* Card Body Details */}
      <div className="p-5 space-y-3 flex-1">
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium text-gray-800 truncate">{post.class_level}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
            <span className="font-medium text-gray-800 truncate">{post.location} ({post.area})</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-medium text-gray-800 truncate">{post.tutor_background} Pref.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-blue-50 text-blue-700 text-center text-xs font-bold leading-4 shrink-0">👤</span>
            <span className="font-medium text-gray-800 truncate">{post.tutor_gender} Tutor</span>
          </div>
        </div>

        {/* Subjects list tags */}
        <div className="pt-1">
          <div className="flex flex-wrap gap-1">
            {post.subjects.slice(0, 3).map((sub, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700 font-medium">
                {sub}
              </span>
            ))}
            {post.subjects.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-xs bg-gray-100 text-gray-500 font-medium">
                +{post.subjects.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Salary & schedule info */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">Salary</span>
            <span className="text-base font-extrabold text-emerald-700">
              ৳{post.salary.toLocaleString()} <span className="text-xs font-normal text-gray-500">/mo</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Schedule</span>
            <span className="text-xs font-semibold text-gray-800">
              {post.days_per_week} Days/wk • {post.hours_per_day}h
            </span>
          </div>
        </div>
      </div>

      {/* Footer action */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {getTimeAgo(post.published_at || post.created_at)}
        </span>
        <button
          onClick={() => onViewDetails(post.slug)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-xs group"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

    </div>
  );
};
