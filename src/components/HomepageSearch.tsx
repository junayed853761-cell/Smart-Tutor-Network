import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, BookOpen, GraduationCap, FileText } from 'lucide-react';
import { TuitionPost } from '../types';

interface HomepageSearchProps {
  tuitionPosts: TuitionPost[];
  onSearch: (query: string) => void;
  onNavigate: (path: string) => void;
}

export const HomepageSearch: React.FC<HomepageSearchProps> = ({ tuitionPosts, onSearch, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute autocomplete suggestions based on fuzzy matching
  const suggestions = React.useMemo(() => {
    if (!query || query.trim().length < 1) return { locations: [], subjects: [], classes: [], posts: [] };

    const q = query.toLowerCase().trim();

    const locSet = new Set<string>();
    const subjSet = new Set<string>();
    const classSet = new Set<string>();
    const matchedPosts: TuitionPost[] = [];

    tuitionPosts.forEach(p => {
      if (p.status !== 'published') return;

      const loc = p.location || p.area || '';
      if (loc && (loc.toLowerCase().includes(q) || q.includes(loc.toLowerCase()))) {
        locSet.add(loc);
      }

      if (p.subjects) {
        p.subjects.forEach(s => {
          if (s && (s.toLowerCase().includes(q) || q.includes(s.toLowerCase()))) {
            subjSet.add(s);
          }
        });
      }

      const cls = p.class_level || p.student_class || '';
      if (cls && (cls.toLowerCase().includes(q) || q.includes(cls.toLowerCase()))) {
        classSet.add(cls);
      }

      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchCode = (p.tuition_code || '').toLowerCase().includes(q);
      if ((matchTitle || matchCode) && matchedPosts.length < 4) {
        matchedPosts.push(p);
      }
    });

    return {
      locations: Array.from(locSet).slice(0, 4),
      subjects: Array.from(subjSet).slice(0, 4),
      classes: Array.from(classSet).slice(0, 4),
      posts: matchedPosts
    };
  }, [query, tuitionPosts]);

  const handleSelectSuggestion = (type: 'location' | 'subject' | 'class' | 'general', val: string) => {
    setQuery(val);
    setIsOpen(false);
    if (type === 'location') {
      onNavigate(`/tuition?location=${encodeURIComponent(val)}`);
    } else if (type === 'subject') {
      onNavigate(`/tuition?subject=${encodeURIComponent(val)}`);
    } else if (type === 'class') {
      onNavigate(`/tuition?class=${encodeURIComponent(val)}`);
    } else {
      onSearch(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    onSearch(query);
  };

  const hasSuggestions = suggestions.locations.length > 0 || suggestions.subjects.length > 0 || suggestions.classes.length > 0 || suggestions.posts.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative flex items-center">
          <span className="absolute left-3 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search class (e.g. Class 9), subject (Math), or location (Uttara)..."
            className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-900 text-sm sm:text-base focus:outline-hidden"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          <Search className="w-5 h-5" />
          <span>Search Tuition</span>
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && hasSuggestions && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-96 overflow-y-auto divide-y divide-gray-50 text-left">
          {suggestions.locations.length > 0 && (
            <div className="p-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Locations
              </span>
              <div className="space-y-1">
                {suggestions.locations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleSelectSuggestion('location', loc)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                  >
                    <span>{loc}</span>
                    <span className="text-xs text-gray-400">Location in Dhaka</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.subjects.length > 0 && (
            <div className="p-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Subjects
              </span>
              <div className="space-y-1">
                {suggestions.subjects.map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => handleSelectSuggestion('subject', subj)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-between"
                  >
                    <span>{subj}</span>
                    <span className="text-xs text-gray-400">Subject</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.classes.length > 0 && (
            <div className="p-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> Classes & Levels
              </span>
              <div className="space-y-1">
                {suggestions.classes.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => handleSelectSuggestion('class', cls)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
                  >
                    <span>{cls}</span>
                    <span className="text-xs text-gray-400">Class Level</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.posts.length > 0 && (
            <div className="p-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" /> Matching Tuition Posts
              </span>
              <div className="space-y-1">
                {suggestions.posts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => onNavigate(`/tuition/${post.slug}`)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate pr-2">{post.title}</span>
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded shrink-0">#{post.tuition_code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
