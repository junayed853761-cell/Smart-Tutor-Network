import { TuitionPost, Category, LocationItem, SubjectItem, SiteSettings } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { 
  getStoredTuition, saveStoredTuition,
  getStoredCategories, saveStoredCategories,
  getStoredLocations, saveStoredLocations,
  getStoredSubjects, saveStoredSubjects,
  getStoredSettings, saveStoredSettings
} from './storage';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitizePost(post: TuitionPost) {
  const clean = { ...post };
  if (clean.id && !UUID_REGEX.test(clean.id)) {
    delete (clean as any).id;
  }
  if (clean.created_by && !UUID_REGEX.test(clean.created_by)) {
    clean.created_by = undefined;
  }
  if (clean.category_id && !UUID_REGEX.test(clean.category_id)) {
    clean.category_id = undefined;
  }
  return clean;
}

function sanitizeGeneric(item: any) {
  const clean = { ...item };
  if (clean.id && !UUID_REGEX.test(clean.id)) {
    delete clean.id;
  }
  return clean;
}

export async function seedSupabaseIfNeeded(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data: postsData } = await supabase.from('tuition_posts').select('id').limit(1);
    if (!postsData || postsData.length === 0) {
      const localPosts = getStoredTuition();
      if (localPosts.length > 0) {
        const sanitizedList = localPosts.map(sanitizePost);
        await supabase.from('tuition_posts').upsert(sanitizedList, { onConflict: 'tuition_code' });
      }
    }

    const { data: catData } = await supabase.from('categories').select('id').limit(1);
    if (!catData || catData.length === 0) {
      const localCats = getStoredCategories();
      if (localCats.length > 0) {
        const sanitizedList = localCats.map(sanitizeGeneric);
        await supabase.from('categories').upsert(sanitizedList, { onConflict: 'slug' });
      }
    }

    const { data: locData } = await supabase.from('locations').select('id').limit(1);
    if (!locData || locData.length === 0) {
      const localLocs = getStoredLocations();
      if (localLocs.length > 0) {
        const sanitizedList = localLocs.map(sanitizeGeneric);
        await supabase.from('locations').upsert(sanitizedList, { onConflict: 'name' });
      }
    }

    const { data: subData } = await supabase.from('subjects').select('id').limit(1);
    if (!subData || subData.length === 0) {
      const localSubs = getStoredSubjects();
      if (localSubs.length > 0) {
        const sanitizedList = localSubs.map(sanitizeGeneric);
        await supabase.from('subjects').upsert(sanitizedList, { onConflict: 'name' });
      }
    }
  } catch (e) {
    console.warn('seedSupabaseIfNeeded error:', e);
  }
}

export async function fetchTuitionPosts(): Promise<TuitionPost[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      await seedSupabaseIfNeeded();
      const { data, error } = await supabase.from('tuition_posts').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        saveStoredTuition(data as TuitionPost[]);
        return data as TuitionPost[];
      }
    } catch (e) {
      console.warn('Supabase fetchTuitionPosts error:', e);
    }
  }
  return getStoredTuition();
}

export async function saveTuitionPostDb(post: TuitionPost): Promise<void> {
  const existing = getStoredTuition();
  const updated = [post, ...existing.filter(p => p.id !== post.id && p.tuition_code !== post.tuition_code)];
  saveStoredTuition(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const sanitized = sanitizePost(post);
      const { error } = await supabase.from('tuition_posts').upsert(sanitized, { onConflict: 'tuition_code' });
      if (error) {
        if (error.code === '42501') {
          console.warn('Supabase RLS policy restriction (42501). Data saved locally. Run `ALTER TABLE tuition_posts DISABLE ROW LEVEL SECURITY;` in Supabase SQL Editor to enable cloud sync.');
        } else {
          console.error('Supabase saveTuitionPostDb error:', error);
        }
      }
    } catch (e) {
      console.warn('Supabase saveTuitionPostDb exception:', e);
    }
  }
}

export async function saveMultipleTuitionsDb(posts: TuitionPost[]): Promise<void> {
  const existing = getStoredTuition();
  const postCodes = new Set(posts.map(p => p.tuition_code));
  const filtered = existing.filter(p => !postCodes.has(p.tuition_code));
  saveStoredTuition([...posts, ...filtered]);

  if (isSupabaseConfigured && supabase) {
    try {
      const sanitizedList = posts.map(sanitizePost);
      const { error } = await supabase.from('tuition_posts').upsert(sanitizedList, { onConflict: 'tuition_code' });
      if (error) {
        if (error.code === '42501') {
          console.warn('Supabase RLS policy restriction (42501). Data saved locally.');
        } else {
          console.error('Supabase saveMultipleTuitionsDb error:', error);
        }
      }
    } catch (e) {
      console.warn('Supabase saveMultipleTuitionsDb exception:', e);
    }
  }
}

export async function deleteTuitionPostDb(id: string): Promise<void> {
  const allPosts = getStoredTuition();
  const postToDelete = allPosts.find(p => p.id === id || p.tuition_code === id);
  const updated = allPosts.filter(p => p.id !== id && p.tuition_code !== id && (postToDelete ? p.tuition_code !== postToDelete.tuition_code : true));
  saveStoredTuition(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const tuitionCode = postToDelete?.tuition_code || id;
      if (tuitionCode) {
        await supabase.from('tuition_posts').delete().eq('tuition_code', tuitionCode);
      }
      if (id && UUID_REGEX.test(id)) {
        await supabase.from('tuition_posts').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase deleteTuitionPostDb exception:', e);
    }
  }
}

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      await seedSupabaseIfNeeded();
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) {
        saveStoredCategories(data as Category[]);
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase fetchCategories error:', e);
    }
  }
  return getStoredCategories();
}

export async function saveCategoryDb(category: Category): Promise<void> {
  const cats = [...getStoredCategories().filter(c => c.id !== category.id && c.slug !== category.slug), category];
  saveStoredCategories(cats);

  if (isSupabaseConfigured && supabase) {
    try {
      const sanitized = sanitizeGeneric(category);
      await supabase.from('categories').upsert(sanitized, { onConflict: 'slug' });
    } catch (e) {
      console.warn('Supabase saveCategoryDb error:', e);
    }
  }
}

export async function deleteCategoryDb(id: string): Promise<void> {
  const allCats = getStoredCategories();
  const catToDelete = allCats.find(c => c.id === id || c.slug === id || c.name === id);
  const updated = allCats.filter(c => c.id !== id && c.slug !== id && (catToDelete ? c.slug !== catToDelete.slug : true));
  saveStoredCategories(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const slug = catToDelete?.slug || id;
      await supabase.from('categories').delete().eq('slug', slug);
      if (id && UUID_REGEX.test(id)) {
        await supabase.from('categories').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase deleteCategoryDb exception:', e);
    }
  }
}

export async function fetchLocations(): Promise<LocationItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      await seedSupabaseIfNeeded();
      const { data, error } = await supabase.from('locations').select('*');
      if (!error && data && data.length > 0) {
        saveStoredLocations(data as LocationItem[]);
        return data as LocationItem[];
      }
    } catch (e) {
      console.warn('Supabase fetchLocations error:', e);
    }
  }
  return getStoredLocations();
}

export async function saveLocationDb(location: LocationItem): Promise<void> {
  const locs = [...getStoredLocations().filter(l => l.id !== location.id && l.name !== location.name), location];
  saveStoredLocations(locs);

  if (isSupabaseConfigured && supabase) {
    try {
      const sanitized = sanitizeGeneric(location);
      await supabase.from('locations').upsert(sanitized, { onConflict: 'name' });
    } catch (e) {
      console.warn('Supabase saveLocationDb error:', e);
    }
  }
}

export async function deleteLocationDb(id: string): Promise<void> {
  const allLocs = getStoredLocations();
  const locToDelete = allLocs.find(l => l.id === id || l.name === id);
  const updated = allLocs.filter(l => l.id !== id && l.name !== id && (locToDelete ? l.name !== locToDelete.name : true));
  saveStoredLocations(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const locName = locToDelete?.name || id;
      await supabase.from('locations').delete().eq('name', locName);
      if (id && UUID_REGEX.test(id)) {
        await supabase.from('locations').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase deleteLocationDb exception:', e);
    }
  }
}

export async function fetchSubjects(): Promise<SubjectItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      await seedSupabaseIfNeeded();
      const { data, error } = await supabase.from('subjects').select('*');
      if (!error && data && data.length > 0) {
        saveStoredSubjects(data as SubjectItem[]);
        return data as SubjectItem[];
      }
    } catch (e) {
      console.warn('Supabase fetchSubjects error:', e);
    }
  }
  return getStoredSubjects();
}

export async function saveSubjectDb(subject: SubjectItem): Promise<void> {
  const subs = [...getStoredSubjects().filter(s => s.id !== subject.id && s.name !== subject.name), subject];
  saveStoredSubjects(subs);

  if (isSupabaseConfigured && supabase) {
    try {
      const sanitized = sanitizeGeneric(subject);
      await supabase.from('subjects').upsert(sanitized, { onConflict: 'name' });
    } catch (e) {
      console.warn('Supabase saveSubjectDb error:', e);
    }
  }
}

export async function deleteSubjectDb(id: string): Promise<void> {
  const allSubs = getStoredSubjects();
  const subToDelete = allSubs.find(s => s.id === id || s.name === id);
  const updated = allSubs.filter(s => s.id !== id && s.name !== id && (subToDelete ? subToDelete.name !== s.name : true));
  saveStoredSubjects(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const subName = subToDelete?.name || id;
      await supabase.from('subjects').delete().eq('name', subName);
      if (id && UUID_REGEX.test(id)) {
        await supabase.from('subjects').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase deleteSubjectDb exception:', e);
    }
  }
}

export async function fetchSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      await seedSupabaseIfNeeded();
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) {
        return data as SiteSettings;
      }
    } catch (e) {
      console.warn('Supabase fetchSettings error:', e);
    }
  }
  return getStoredSettings();
}

export async function saveSettingsDb(settings: SiteSettings): Promise<void> {
  saveStoredSettings(settings);
  if (isSupabaseConfigured && supabase) {
    try {
      const sanitized = sanitizeGeneric(settings);
      await supabase.from('site_settings').upsert({ id: '00000000-0000-0000-0000-000000000001', ...sanitized });
    } catch (e) {
      console.warn('Supabase saveSettingsDb error:', e);
    }
  }
}
