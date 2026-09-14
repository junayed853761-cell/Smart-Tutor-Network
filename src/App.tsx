import React, { useState, useEffect } from 'react';
import { 
  getStoredUsers, saveStoredUsers, 
  getCurrentUser, setCurrentUser 
} from './lib/storage';
import { 
  fetchTuitionPosts, saveTuitionPostDb, saveMultipleTuitionsDb, deleteTuitionPostDb,
  fetchCategories, saveCategoryDb, deleteCategoryDb,
  fetchLocations, saveLocationDb, deleteLocationDb,
  fetchSubjects, saveSubjectDb, deleteSubjectDb,
  fetchSettings, saveSettingsDb,
  seedSupabaseIfNeeded
} from './lib/supabaseDb';
import { diagnoseSupabaseConnection } from './lib/supabase';
import { TuitionPost, Category, LocationItem, SubjectItem, UserProfile, SiteSettings, TuitionStatus } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Toast } from './components/Toast';

import { Home } from './pages/Home';
import { TuitionList } from './pages/TuitionList';
import { TuitionDetail } from './pages/TuitionDetail';
import { BecomeATutor } from './pages/BecomeATutor';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [tuitionPosts, setTuitionPosts] = useState<TuitionPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>(getStoredUsers());
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Smart Tutor Network',
    contact_whatsapp: '01823067428',
    site_description: '',
    contact_email: '',
    office_address: ''
  });
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(getCurrentUser());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const primaryColor = settings.primary_color || '#2563eb';
    const styleId = 'dynamic-primary-color';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `
      :root {
        --primary-color: ${primaryColor};
      }
      .bg-blue-600 { background-color: ${primaryColor} !important; }
      .hover\\:bg-blue-700:hover { background-color: ${primaryColor}dd !important; }
      .text-blue-600 { color: ${primaryColor} !important; }
      .hover\\:text-blue-700:hover { color: ${primaryColor}dd !important; }
      .border-blue-600 { border-color: ${primaryColor} !important; }
      .focus\\:ring-blue-500:focus { --tw-ring-color: ${primaryColor} !important; }
    `;
  }, [settings.primary_color]);

  useEffect(() => {
    async function loadAllData() {
      await diagnoseSupabaseConnection();
      await seedSupabaseIfNeeded();
      const [posts, cats, locs, subs, sets] = await Promise.all([
        fetchTuitionPosts(),
        fetchCategories(),
        fetchLocations(),
        fetchSubjects(),
        fetchSettings()
      ]);

      const knownLocations = ['Uttara', 'Mirpur', 'Dhanmondi', 'Gulshan', 'Banani', 'Mohammadpur', 'Khilgaon', 'Banasree', 'Rampura', 'Bashundhara', 'Motijheel', 'Mohakhali', 'Farmgate', 'Malibagh', 'Uttarkhan', 'Dakshinkhan', 'Cantonment', 'Pallabi', 'Kafrul', 'Tejgaon', 'Badda', 'Khilkhet', 'Baridhara'];
      const sanitizedPosts = posts.map(p => {
        if (p.location === 'Uttara' && p.title) {
          const tLower = (p.title + ' ' + (p.description || '')).toLowerCase();
          for (const loc of knownLocations) {
            if (loc !== 'Uttara' && tLower.includes(loc.toLowerCase())) {
              return { ...p, location: loc, area: loc };
            }
          }
        }
        return p;
      });

      setTuitionPosts(sanitizedPosts);
      setCategories(cats);
      setLocations(locs);
      setSubjects(subs);
      setSettings(sets);
    }
    loadAllData();
  }, []);

  // Handle browser back/forward buttons & hash / secret shortcut
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'login' || hash === 'admin') {
        setCurrentPath('/login');
      } else {
        setCurrentPath(window.location.pathname);
      }
    };

    if (window.location.hash === '#login' || window.location.hash === '#admin') {
      setCurrentPath('/login');
    }

    window.addEventListener('popstate', handlePopState);

    // Secret shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to go to login
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo('/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper to auto-register new locations/subjects from tuition posts
  const autoRegisterMetadata = async (post: TuitionPost) => {
    if (post.location) {
      const locName = post.location.trim();
      const exists = locations.some(l => l.name.toLowerCase() === locName.toLowerCase());
      if (!exists && locName) {
        const newLoc: LocationItem = {
          id: `loc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: locName,
          city: 'Dhaka',
          active: true
        };
        setLocations(prev => [...prev, newLoc]);
        await saveLocationDb(newLoc);
      }
    }
    if (post.subjects && Array.isArray(post.subjects)) {
      for (const subjName of post.subjects) {
        const sName = subjName.trim();
        const exists = subjects.some(s => s.name.toLowerCase() === sName.toLowerCase());
        if (!exists && sName) {
          const newSub: SubjectItem = {
            id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: sName,
            category: 'General'
          };
          setSubjects(prev => [...prev, newSub]);
          await saveSubjectDb(newSub);
        }
      }
    }
  };

  // CRUD Handlers (Admin & Editor via Supabase DB)
  const handleSaveTuition = async (post: TuitionPost) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can create or edit tuition posts.');
      return;
    }
    const existingIndex = tuitionPosts.findIndex((p) => p.id === post.id);
    let updated: TuitionPost[];
    if (existingIndex >= 0) {
      updated = [...tuitionPosts];
      updated[existingIndex] = post;
      showToast(`Tuition #${post.tuition_code} updated successfully.`);
    } else {
      updated = [post, ...tuitionPosts];
      showToast(`Tuition #${post.tuition_code} created successfully.`);
    }
    setTuitionPosts(updated);
    await saveTuitionPostDb(post);
    await autoRegisterMetadata(post);
  };

  const handleSaveMultipleTuitions = async (posts: TuitionPost[]) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can create tuition posts.');
      return;
    }
    const updated = [...posts, ...tuitionPosts];
    setTuitionPosts(updated);
    showToast(`Successfully imported ${posts.length} tuition posts.`);
    await saveMultipleTuitionsDb(posts);
    for (const p of posts) {
      await autoRegisterMetadata(p);
    }
  };

  const handleDeleteTuition = async (id: string) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can delete tuition posts.');
      return;
    }
    const updated = tuitionPosts.filter((p) => p.id !== id);
    setTuitionPosts(updated);
    await deleteTuitionPostDb(id);
    showToast('Tuition post deleted successfully.');
  };

  const handleUpdateStatus = async (id: string, status: TuitionStatus) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can update tuition status.');
      return;
    }
    const now = new Date().toISOString();
    let targetPost: TuitionPost | null = null;
    const updated = tuitionPosts.map((p) => {
      if (p.id === id) {
        const isNowPublished = status === 'published';
        targetPost = {
          ...p,
          status,
          published_at: isNowPublished ? (p.published_at || now) : p.published_at
        };
        return targetPost;
      }
      return p;
    });
    setTuitionPosts(updated);
    if (targetPost) {
      await saveTuitionPostDb(targetPost);
    }
    showToast(`Tuition status changed to ${status}.`);
  };

  const handleSaveCategory = async (cat: Category) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can manage categories.');
      return;
    }
    const updated = [...categories.filter(c => c.id !== cat.id), cat];
    setCategories(updated);
    await saveCategoryDb(cat);
    showToast('Category saved.');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can manage categories.');
      return;
    }
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    await deleteCategoryDb(id);
    showToast('Category deleted.');
  };

  const handleSaveLocation = async (loc: LocationItem) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can manage locations.');
      return;
    }
    const updated = [...locations.filter(l => l.id !== loc.id), loc];
    setLocations(updated);
    await saveLocationDb(loc);
    showToast('Location saved.');
  };

  const handleDeleteLocation = async (id: string) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can manage locations.');
      return;
    }
    const updated = locations.filter((l) => l.id !== id);
    setLocations(updated);
    await deleteLocationDb(id);
    showToast('Location deleted.');
  };

  const handleSaveSubject = async (sub: SubjectItem) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can manage subjects.');
      return;
    }
    const updated = [...subjects.filter(s => s.id !== sub.id), sub];
    setSubjects(updated);
    await saveSubjectDb(sub);
    showToast('Subject saved.');
  };

  const handleDeleteSubject = async (id: string) => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
      showToast('Access Denied: Only administrators and editors can manage subjects.');
      return;
    }
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    await deleteSubjectDb(id);
    showToast('Subject deleted.');
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Access Denied: Only administrators can update site settings.');
      return;
    }
    setSettings(newSettings);
    await saveSettingsDb(newSettings);
    showToast('Site settings updated successfully.');
  };

  const handleUpdateUserRole = (userId: string, role: 'admin' | 'editor' | 'user') => {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Access Denied: Only administrators can manage user roles.');
      return;
    }
    const updated = users.map((u) => u.id === userId ? { ...u, role } : u);
    setUsers(updated);
    saveStoredUsers(updated);
    showToast('User role updated.');
  };

  const handleSaveUser = (user: UserProfile) => {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Access Denied: Only administrators can add users.');
      return;
    }
    const updated = [user, ...users.filter(u => u.id !== user.id && u.email.toLowerCase() !== user.email.toLowerCase())];
    setUsers(updated);
    saveStoredUsers(updated);
    showToast('New user/admin profile created successfully.');
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.full_name}!`);
  };

  const handleLogout = () => {
    setCurrentUserState(null);
    setCurrentUser(null);
    showToast('Logged out successfully.');
    navigateTo('/');
  };

  // Router resolution
  const renderPage = () => {
    if (currentPath.startsWith('/admin')) {
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
        return <Login users={users} onLogin={handleLogin} onNavigate={navigateTo} />;
      }
      return (
        <AdminDashboard
          currentUser={currentUser}
          tuitionPosts={tuitionPosts}
          categories={categories}
          locations={locations}
          subjects={subjects}
          users={users}
          settings={settings}
          onSaveTuition={handleSaveTuition}
          onSaveMultipleTuitions={handleSaveMultipleTuitions}
          onDeleteTuition={handleDeleteTuition}
          onUpdateStatus={handleUpdateStatus}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onSaveLocation={handleSaveLocation}
          onDeleteLocation={handleDeleteLocation}
          onSaveSubject={handleSaveSubject}
          onDeleteSubject={handleDeleteSubject}
          onSaveSettings={handleSaveSettings}
          onUpdateUserRole={handleUpdateUserRole}
          onSaveUser={handleSaveUser}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath.startsWith('/tuition/')) {
      const slug = currentPath.replace('/tuition/', '');
      return (
        <TuitionDetail
          slug={slug}
          tuitionPosts={tuitionPosts}
          onNavigate={navigateTo}
          onViewDetails={(s) => navigateTo(`/tuition/${s}`)}
        />
      );
    }

    if (currentPath === '/tuition' || currentPath.startsWith('/tuition?')) {
      return (
        <TuitionList
          tuitionPosts={tuitionPosts}
          locationsList={locations.map((l) => l.name)}
          subjectsList={subjects.map((s) => s.name)}
          onNavigate={navigateTo}
          onViewDetails={(s) => navigateTo(`/tuition/${s}`)}
        />
      );
    }

    if (currentPath === '/become-a-tutor') {
      return <BecomeATutor onNavigate={navigateTo} />;
    }

    if (currentPath === '/about') {
      return <About onNavigate={navigateTo} />;
    }

    if (currentPath === '/contact') {
      return <Contact onNavigate={navigateTo} />;
    }

    if (currentPath === '/login') {
      return <Login users={users} onLogin={handleLogin} onNavigate={navigateTo} />;
    }

    // Default Home
    return (
      <Home
        tuitionPosts={tuitionPosts}
        categories={categories}
        locations={locations}
        onNavigate={navigateTo}
        onViewDetails={(s) => navigateTo(`/tuition/${s}`)}
      />
    );
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      {!isAdminRoute && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigateTo}
          currentUser={currentUser}
          settings={settings}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1">
        {renderPage()}
      </main>

      {!isAdminRoute && <Footer onNavigate={navigateTo} />}
      {!isAdminRoute && <WhatsAppButton />}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
