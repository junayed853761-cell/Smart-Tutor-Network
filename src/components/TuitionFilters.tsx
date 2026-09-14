import React, { useState } from 'react';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { FilterState } from '../types';

interface TuitionFiltersProps {
  filters: FilterState;
  onChange: (newFilters: Partial<FilterState>) => void;
  onClear: () => void;
  locationsList: string[];
  subjectsList: string[];
  classesList?: string[];
}

export const TuitionFilters: React.FC<TuitionFiltersProps> = ({
  filters,
  onChange,
  onClear,
  locationsList,
  subjectsList,
  classesList = []
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const mediumOptions = ['Bangla Medium', 'English Medium', 'English Version', 'Madrasa', 'Other'];
  const genderOptions = ['Male', 'Female', 'Any'];
  const backgroundOptions = ['BUET', 'DU', 'Medical', 'NSU', 'BRAC University', 'Other University', 'Experienced Tutor'];
  const defaultClasses = ['Play', 'Nursery', 'KG', 'Class 1-10', 'SSC', 'Class 11', 'Class 12', 'HSC', 'Admission'];
  const classOptions = classesList.length > 0 ? classesList : defaultClasses;
  const salaryOptions = [
    { label: 'Below ৳5,000', value: 'below_5000' },
    { label: '৳5,000 – ৳10,000', value: '5000_10000' },
    { label: '৳10,000 – ৳15,000', value: '10000_15000' },
    { label: '৳15,000 – ৳20,000', value: '15000_20000' },
    { label: 'Above ৳20,000', value: 'above_20000' }
  ];
  const daysOptions = ['2', '3', '4', '5', '6', '7'];

  const FilterContent = () => (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter Tuitions
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* General Search Input (Class, Location, Subject, Code, etc.) */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Search Keywords (Class, Subject, Location...)</label>
        <div className="relative">
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Type class, location, subject..."
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Medium */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Medium</label>
        <select
          value={filters.medium}
          onChange={(e) => onChange({ medium: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">All Mediums</option>
          {mediumOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Tutor Gender */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Tutor Gender</label>
        <div className="grid grid-cols-3 gap-1.5">
          {genderOptions.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onChange({ tutor_gender: filters.tutor_gender === g ? '' : g })}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                filters.tutor_gender === g 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Tutor Background */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Tutor Background</label>
        <select
          value={filters.tutor_background}
          onChange={(e) => onChange({ tutor_background: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">Any Background / Preferred</option>
          {backgroundOptions.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Class Level */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Class Level</label>
        <select
          value={filters.class_level}
          onChange={(e) => onChange({ class_level: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">All Classes</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Subject</label>
        <select
          value={filters.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">All Subjects</option>
          {subjectsList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Location (Dhaka)</label>
        <select
          value={filters.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">All Locations</option>
          {locationsList.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Salary Range */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Salary Range</label>
        <select
          value={filters.salary_range}
          onChange={(e) => onChange({ salary_range: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">Any Salary</option>
          {salaryOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Days Per Week */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">Days Per Week</label>
        <div className="grid grid-cols-6 gap-1">
          {daysOptions.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onChange({ days_per_week: filters.days_per_week === d ? '' : d })}
              className={`py-2 text-center text-xs font-semibold rounded-md border transition-all ${
                filters.days_per_week === d 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Trigger Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium shadow-sm transition-all"
        >
          <Filter className="w-5 h-5" />
          <span>Open Filter Drawer</span>
        </button>
      </div>

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block bg-white p-6 rounded-xl border border-gray-200 shadow-xs sticky top-24">
        <FilterContent />
      </div>

      {/* Mobile Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Filter Tuitions
              </h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex-1">
              <FilterContent />
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0 flex gap-3">
              <button
                onClick={() => {
                  onClear();
                  setMobileDrawerOpen(false);
                }}
                className="w-1/2 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
