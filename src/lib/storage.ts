import { TuitionPost, Category, LocationItem, SubjectItem, SiteSettings, UserProfile } from '../types';
import { INITIAL_TUITION_POSTS, INITIAL_CATEGORIES, INITIAL_LOCATIONS, INITIAL_SUBJECTS, INITIAL_SITE_SETTINGS, INITIAL_USERS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  TUITION: 'stn_tuition_posts_v1',
  CATEGORIES: 'stn_categories_v1',
  LOCATIONS: 'stn_locations_v1',
  SUBJECTS: 'stn_subjects_v1',
  SETTINGS: 'stn_settings_v1',
  USERS: 'stn_users_v1',
  CURRENT_USER: 'stn_current_user_v1'
};

export function getStoredTuition(): TuitionPost[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TUITION);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TUITION, JSON.stringify(INITIAL_TUITION_POSTS));
      return INITIAL_TUITION_POSTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_TUITION_POSTS;
  }
}

export function saveStoredTuition(posts: TuitionPost[]) {
  localStorage.setItem(STORAGE_KEYS.TUITION, JSON.stringify(posts));
}

export function getStoredCategories(): Category[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveStoredCategories(categories: Category[]) {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

export function getStoredLocations(): LocationItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_LOCATIONS));
      return INITIAL_LOCATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_LOCATIONS;
  }
}

export function saveStoredLocations(locations: LocationItem[]) {
  localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
}

export function getStoredSubjects(): SubjectItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
      return INITIAL_SUBJECTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SUBJECTS;
  }
}

export function saveStoredSubjects(subjects: SubjectItem[]) {
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
}

export function getStoredSettings(): SiteSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
      return INITIAL_SITE_SETTINGS;
    }
    const parsed = JSON.parse(data);
    if (parsed.contact_email === 'support@smarttutornetwork.com' || !parsed.contact_email) {
      parsed.contact_email = INITIAL_SITE_SETTINGS.contact_email;
    }
    if (parsed.office_address?.includes('Uttara') || !parsed.office_address) {
      parsed.office_address = INITIAL_SITE_SETTINGS.office_address;
    }
    return parsed;
  } catch {
    return INITIAL_SITE_SETTINGS;
  }
}

export function saveStoredSettings(settings: SiteSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: UserProfile[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
}
