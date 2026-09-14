import React, { useState } from 'react';
import { Search, ArrowRight, MessageCircle, BookOpen, MapPin, ShieldCheck, CheckCircle2, Award, Users, Sparkles } from 'lucide-react';
import { TuitionPost, Category, LocationItem } from '../types';
import { TuitionCard } from '../components/TuitionCard';
import { HomepageSearch } from '../components/HomepageSearch';

interface HomeProps {
  tuitionPosts: TuitionPost[];
  categories: Category[];
  locations: LocationItem[];
  onNavigate: (path: string) => void;
  onViewDetails: (slug: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  tuitionPosts,
  categories,
  locations,
  onNavigate,
  onViewDetails
}) => {
  const whatsappNumber = '01823067428';
  const whatsappUrl = `https://wa.me/8801823067428?text=Hello%20Smart%20Tutor%20Network`;

  const defaultCategories: Category[] = [
    { id: 'cat-bm', name: 'Bangla Medium', slug: 'bangla-medium', active: true, order_index: 1 },
    { id: 'cat-em', name: 'English Medium', slug: 'english-medium', active: true, order_index: 2 },
    { id: 'cat-ev', name: 'English Version', slug: 'english-version', active: true, order_index: 3 },
    { id: 'cat-buet', name: 'BUET Tutor', slug: 'buet-tutor', active: true, order_index: 4 },
    { id: 'cat-med', name: 'Medical Tutor', slug: 'medical-tutor', active: true, order_index: 5 },
    { id: 'cat-adm', name: 'Admission Test', slug: 'admission-test', active: true, order_index: 6 },
    { id: 'cat-online', name: 'Online Tuition', slug: 'online-tuition', active: true, order_index: 7 },
    { id: 'cat-madrasa', name: 'Madrasa Medium', slug: 'madrasa-medium', active: true, order_index: 8 }
  ];

  const defaultLocations: LocationItem[] = [
    { id: 'loc-1', name: 'Uttara', city: 'Dhaka', active: true },
    { id: 'loc-2', name: 'Mirpur', city: 'Dhaka', active: true },
    { id: 'loc-3', name: 'Dhanmondi', city: 'Dhaka', active: true },
    { id: 'loc-4', name: 'Gulshan', city: 'Dhaka', active: true },
    { id: 'loc-5', name: 'Banani', city: 'Dhaka', active: true },
    { id: 'loc-6', name: 'Mohammadpur', city: 'Dhaka', active: true }
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;
  const displayLocations = (locations && locations.length > 0 ? locations : defaultLocations).slice(0, 6);

  // Published posts sorted by published_at DESC
  const publishedPosts = tuitionPosts
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

  const latestPosts = publishedPosts.slice(0, 6);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-700/60 text-blue-200 text-xs sm:text-sm font-medium border border-blue-600/50 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Bangladesh&apos;s Trusted Daily Tuition Media & Tutor Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find the Right Tuition. <br className="hidden sm:inline" />
            <span className="text-blue-300">Connect with the Right Tutor.</span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Smart Tutor Network publishes verified tuition opportunities daily across Dhaka and major cities. Reliable for parents, students, and professional tutors.
          </p>

          {/* Search Box on Hero */}
          <div className="max-w-2xl mx-auto pt-4">
            <HomepageSearch
              tuitionPosts={tuitionPosts}
              onSearch={(q) => onNavigate(q.trim() ? `/tuition?search=${encodeURIComponent(q)}` : '/tuition')}
              onNavigate={onNavigate}
            />
          </div>

          {/* Quick stats banner */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center border-t border-blue-700/50 mt-12">
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">500+</span>
              <span className="text-xs sm:text-sm text-blue-200">Daily Active Tuition</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">10,000+</span>
              <span className="text-xs sm:text-sm text-blue-200">Verified Tutors</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">Dhaka</span>
              <span className="text-xs sm:text-sm text-blue-200">All Major Locations</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">100%</span>
              <span className="text-xs sm:text-sm text-blue-200">Verified & Secure</span>
            </div>
          </div>

        </div>
      </section>

      {/* Latest Tuition Feed Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live Updates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Latest Tuition Opportunities
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Newly published tuition opportunities ordered chronologically (Newest first).
            </p>
          </div>
          <button
            onClick={() => onNavigate('/tuition')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <span>View All Tuition Posts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {latestPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <p className="text-gray-500 text-base">No active tuition posts found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <TuitionCard key={post.id} post={post} onViewDetails={onViewDetails} />
            ))}
          </div>
        )}
      </section>

      {/* Browse Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Browse Tuition by Category
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Select your preferred medium or tutor specialization to find matching tuition posts.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/tuition?medium=${encodeURIComponent(cat.name)}`)}
              className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold text-lg mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {cat.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Browse Locations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Popular Dhaka Locations
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Explore active tuition postings across prime residential and educational hubs in Dhaka.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {displayLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => onNavigate(`/tuition?location=${encodeURIComponent(loc.name)}`)}
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xs cursor-pointer transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                {loc.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              How Smart Tutor Network Works
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Three simple steps to secure your desired tuition or find an expert tutor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Browse & Filter Tuition</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Explore daily updated tuition posts. Filter by medium, class, subject, tutor background, and location.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Select Your Match</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Check tuition details, salary, days per week, and student requirements to ensure a perfect fit.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Contact via WhatsApp</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Click our official WhatsApp contact button (01823067428) with the tuition code to confirm your application instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Tutor & WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-800 text-blue-200">
              <Users className="w-4 h-4 text-blue-300" />
              For Tutors & Educators
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Looking for Quality Tuition Opportunities?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Join thousands of verified tutors from BUET, DU, Medical colleges, and top universities across Bangladesh. Get daily tuition leads directly on WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button
              onClick={() => onNavigate('/become-a-tutor')}
              className="bg-white hover:bg-gray-100 text-blue-900 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md"
            >
              Become a Tutor
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp: {whatsappNumber}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
