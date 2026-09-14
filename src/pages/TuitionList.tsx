import React, { useState, useEffect, useMemo } from 'react';
import { TuitionPost, FilterState } from '../types';
import { TuitionCard } from '../components/TuitionCard';
import { TuitionFilters } from '../components/TuitionFilters';
import { SearchBar } from '../components/SearchBar';
import { ArrowUpDown, Search, RotateCcw } from 'lucide-react';

// Fuzzy matching helpers with Levenshtein distance and tokenization for typo tolerance
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyMatch(text: string, query: string): boolean {
  if (!text || !query) return false;
  const t = text.toLowerCase().trim();
  const q = query.toLowerCase().trim();
  if (t.includes(q) || q.includes(t)) return true;

  const tWords = t.split(/\s+/);
  const qWords = q.split(/\s+/);

  return qWords.every(qWord => {
    if (qWord.length <= 2) {
      return tWords.some(tWord => tWord.includes(qWord) || levenshtein(tWord, qWord) <= 1);
    }
    return tWords.some(tWord => {
      if (tWord.includes(qWord) || qWord.includes(tWord)) return true;
      const maxDist = qWord.length <= 4 ? 1 : qWord.length <= 7 ? 2 : 3;
      return levenshtein(tWord, qWord) <= maxDist;
    });
  });
}

interface TuitionListProps {
  tuitionPosts: TuitionPost[];
  locationsList: string[];
  subjectsList: string[];
  onNavigate: (path: string) => void;
  onViewDetails: (slug: string) => void;
  initialQuery?: string;
}

export const TuitionList: React.FC<TuitionListProps> = ({
  tuitionPosts,
  locationsList,
  subjectsList,
  onNavigate,
  onViewDetails,
  initialQuery = ''
}) => {
  // Parse URL search params for initial filters
  const urlParams = new URLSearchParams(window.location.search);

  const [filters, setFilters] = useState<FilterState>({
    search: urlParams.get('search') || initialQuery,
    medium: urlParams.get('medium') || '',
    tutor_gender: urlParams.get('gender') || urlParams.get('tutor_gender') || '',
    tutor_background: urlParams.get('background') || urlParams.get('tutor_background') || '',
    class_level: urlParams.get('class') || urlParams.get('class_level') || '',
    subject: urlParams.get('subject') || '',
    location: urlParams.get('location') || '',
    salary_range: urlParams.get('salary_range') || '',
    days_per_week: urlParams.get('days') || urlParams.get('days_per_week') || '',
    sort_by: (urlParams.get('sort') as any) || 'newest'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Update URL query parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.medium) params.set('medium', filters.medium);
    if (filters.tutor_gender) params.set('gender', filters.tutor_gender);
    if (filters.tutor_background) params.set('background', filters.tutor_background);
    if (filters.class_level) params.set('class', filters.class_level);
    if (filters.subject) params.set('subject', filters.subject);
    if (filters.location) params.set('location', filters.location);
    if (filters.salary_range) params.set('salary_range', filters.salary_range);
    if (filters.days_per_week) params.set('days', filters.days_per_week);
    if (filters.sort_by && filters.sort_by !== 'newest') params.set('sort', filters.sort_by);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  const handleFilterChange = (newValues: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newValues }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      medium: '',
      tutor_gender: '',
      tutor_background: '',
      class_level: '',
      subject: '',
      location: '',
      salary_range: '',
      days_per_week: '',
      sort_by: 'newest'
    });
    setCurrentPage(1);
  };

  // Dynamic lists for filters
  const dynamicLocations = useMemo(() => {
    const set = new Set<string>(locationsList);
    tuitionPosts.forEach(p => {
      if (p.location) set.add(p.location.trim());
      if (p.area) set.add(p.area.trim());
    });
    return Array.from(set).filter(Boolean).sort();
  }, [locationsList, tuitionPosts]);

  const dynamicSubjects = useMemo(() => {
    const set = new Set<string>(subjectsList);
    tuitionPosts.forEach(p => {
      if (p.subjects) {
        p.subjects.forEach(s => { if (s) set.add(s.trim()); });
      }
    });
    return Array.from(set).filter(Boolean).sort();
  }, [subjectsList, tuitionPosts]);

  const dynamicClasses = useMemo(() => {
    const defaultClasses = ['Play', 'Nursery', 'KG', 'Class 1-10', 'SSC', 'Class 11', 'Class 12', 'HSC', 'Admission', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'O Level', 'A Level'];
    const set = new Set<string>(defaultClasses);
    tuitionPosts.forEach(p => {
      if (p.class_level) set.add(p.class_level.trim());
      if (p.student_class) set.add(p.student_class.trim());
    });
    return Array.from(set).filter(Boolean).sort();
  }, [tuitionPosts]);
  const filteredPosts = useMemo(() => {
    return tuitionPosts.filter((post) => {
      if (post.status !== 'published') return false;

      // Search term (code, title, description, location, area, subjects, etc. with fuzzy matching)
      if (filters.search) {
        const q = filters.search;
        const matchesCode = fuzzyMatch(post.tuition_code || '', q) || fuzzyMatch((post.tuition_code || '').replace(/^#/, ''), q);
        const matchesTitle = fuzzyMatch(post.title || '', q);
        const matchesDesc = fuzzyMatch(post.description || '', q);
        const matchesLoc = fuzzyMatch(post.location || '', q) || fuzzyMatch(post.area || '', q);
        const matchesMedium = fuzzyMatch(post.medium || '', q);
        const matchesBg = fuzzyMatch(post.tutor_background || '', q);
        const matchesSubj = (post.subjects || []).some((s) => fuzzyMatch(s || '', q));
        const matchesClass = fuzzyMatch(post.class_level || '', q) || fuzzyMatch(post.student_class || '', q);

        if (!matchesCode && !matchesTitle && !matchesDesc && !matchesLoc && !matchesMedium && !matchesBg && !matchesSubj && !matchesClass) {
          return false;
        }
      }

      // Medium
      if (filters.medium && filters.medium.toLowerCase() !== 'any' && filters.medium !== 'All Mediums') {
        if (!fuzzyMatch(post.medium || '', filters.medium)) {
          return false;
        }
      }

      // Tutor Gender
      if (filters.tutor_gender && filters.tutor_gender.toLowerCase() !== 'any') {
        const fGender = filters.tutor_gender.toLowerCase(); // 'male' or 'female'
        const pGender = (post.tutor_gender || 'any').toLowerCase();

        const textContent = `${post.title || ''} ${post.description || ''} ${post.tuition_code || ''}`.toLowerCase();
        
        // Detect explicit gender markers
        const isFemaleExplicit = textContent.includes('female') || textContent.includes('girl') || /\b(f\d{3,4}|-f\b)/i.test(post.tuition_code || '');
        const isMaleExplicit = (textContent.includes('male') && !textContent.includes('female')) || textContent.includes('boy') || /\b(m\d{3,4}|-m\b)/i.test(post.tuition_code || '');

        if (fGender === 'male') {
          if (pGender === 'female' || isFemaleExplicit) {
            return false;
          }
        } else if (fGender === 'female') {
          if (pGender === 'male' || (isMaleExplicit && !isFemaleExplicit)) {
            return false;
          }
        }
      }

      // Tutor Background
      if (filters.tutor_background) {
        if (!fuzzyMatch(post.tutor_background || '', filters.tutor_background)) {
          return false;
        }
      }

      // Class Level
      if (filters.class_level) {
        const matchesCl = fuzzyMatch(post.class_level || '', filters.class_level) || fuzzyMatch(post.student_class || '', filters.class_level);
        if (!matchesCl) {
          return false;
        }
      }

      // Subject
      if (filters.subject) {
        const hasSubj = (post.subjects || []).some(s => fuzzyMatch(s || '', filters.subject));
        if (!hasSubj) {
          return false;
        }
      }

      // Location
      if (filters.location) {
        const matchesL = fuzzyMatch(post.location || '', filters.location) || fuzzyMatch(post.area || '', filters.location);
        if (!matchesL) {
          return false;
        }
      }

      // Salary Range
      if (filters.salary_range) {
        const salary = Number(post.salary) || 0;
        if (filters.salary_range === 'below_5000' && salary >= 5000) return false;
        if (filters.salary_range === '5000_10000' && (salary < 5000 || salary > 10000)) return false;
        if (filters.salary_range === '10000_15000' && (salary < 10000 || salary > 15000)) return false;
        if (filters.salary_range === '15000_20000' && (salary < 15000 || salary > 20000)) return false;
        if (filters.salary_range === 'above_20000' && salary <= 20000) return false;
      }

      // Days per week
      if (filters.days_per_week) {
        const postDays = Number(post.days_per_week) || 0;
        const filterDays = Number(filters.days_per_week) || 0;
        if (filterDays > 0 && postDays !== filterDays) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.published_at || a.created_at).getTime() || 0;
      const timeB = new Date(b.published_at || b.created_at).getTime() || 0;
      const salA = Number(a.salary) || 0;
      const salB = Number(b.salary) || 0;

      if (filters.sort_by === 'newest') {
        return timeB - timeA;
      }
      if (filters.sort_by === 'oldest') {
        return timeA - timeB;
      }
      if (filters.sort_by === 'salary_asc') {
        return salA - salB;
      }
      if (filters.sort_by === 'salary_desc') {
        return salB - salA;
      }
      return 0;
    });
  }, [tuitionPosts, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title & Search Bar header */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Find Tuition Jobs
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse verified daily tuition posts in Dhaka. Use filters to narrow down by location, medium, subject, and salary.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-96">
            <SearchBar
              value={filters.search}
              onChange={(val) => handleFilterChange({ search: val })}
              placeholder="Search code, subject, Uttara, BUET..."
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">Sort:</span>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange({ sort_by: e.target.value as any })}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="newest">Newest First (Default)</option>
                <option value="oldest">Oldest First</option>
                <option value="salary_desc">Salary High → Low</option>
                <option value="salary_asc">Salary Low → High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar / Mobile Drawer */}
        <div className="lg:col-span-1">
          <TuitionFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            locationsList={dynamicLocations}
            subjectsList={dynamicSubjects}
            classesList={dynamicClasses}
          />
        </div>

        {/* Right Tuition Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 text-xs text-gray-600">
            <span>Showing <strong className="text-gray-900">{filteredPosts.length}</strong> tuition posts matching your criteria</span>
            {(filters.medium || filters.location || filters.search || filters.class_level || filters.subject || filters.tutor_gender || filters.tutor_background || filters.salary_range || filters.days_per_week) && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset filters
              </button>
            )}
          </div>

          {paginatedPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No matching tuition found</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                We couldn&apos;t find any tuition posts matching your exact filters. Try clearing some filters or searching for different keywords.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((post) => (
                <TuitionCard key={post.id} post={post} onViewDetails={onViewDetails} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-600 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
