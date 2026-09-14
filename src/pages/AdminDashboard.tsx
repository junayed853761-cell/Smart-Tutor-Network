import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, PlusCircle, FolderTree, MapPin, ListTree, Users, Settings, 
  LogOut, Shield, Search, Edit3, Trash2, Eye, ExternalLink, CheckCircle, Clock, Archive, Sparkles, Menu, X, ArrowLeft
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import { TuitionPost, Category, LocationItem, SubjectItem, UserProfile, SiteSettings, TuitionStatus } from '../types';
import { SqlSchemaViewer } from './SqlSchemaViewer';

interface AdminDashboardProps {
  currentUser: UserProfile;
  tuitionPosts: TuitionPost[];
  categories: Category[];
  locations: LocationItem[];
  subjects: SubjectItem[];
  users: UserProfile[];
  settings: SiteSettings;
  onSaveTuition: (post: TuitionPost) => void;
  onSaveMultipleTuitions: (posts: TuitionPost[]) => void;
  onDeleteTuition: (id: string) => void;
  onUpdateStatus: (id: string, status: TuitionStatus) => void;
  onSaveCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  onSaveLocation: (loc: LocationItem) => void;
  onDeleteLocation: (id: string) => void;
  onSaveSubject: (sub: SubjectItem) => void;
  onDeleteSubject: (id: string) => void;
  onSaveSettings: (settings: SiteSettings) => void;
  onUpdateUserRole: (userId: string, role: 'admin' | 'editor' | 'user') => void;
  onSaveUser: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  tuitionPosts,
  categories,
  locations,
  subjects,
  users,
  settings,
  onSaveTuition,
  onSaveMultipleTuitions,
  onDeleteTuition,
  onUpdateStatus,
  onSaveCategory,
  onDeleteCategory,
  onSaveLocation,
  onDeleteLocation,
  onSaveSubject,
  onDeleteSubject,
  onSaveSettings,
  onUpdateUserRole,
  onSaveUser,
  onLogout,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tuition-list' | 'tuition-form' | 'categories' | 'locations' | 'subjects' | 'users' | 'settings' | 'security-logs'>('dashboard');
  const [editingTuition, setEditingTuition] = useState<TuitionPost | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'single' | 'bulk'>('single');
  const [bulkText, setBulkText] = useState('');
  const [bulkStatus, setBulkStatus] = useState<TuitionStatus>('published');
  const [previewPost, setPreviewPost] = useState<TuitionPost | null>(null);
  const [quickViewPost, setQuickViewPost] = useState<TuitionPost | null>(null);
  const [formTab, setFormTab] = useState<'general' | 'seo'>('general');
  const [compactMode, setCompactMode] = useState(false);
  const [bulkActionTargetStatus, setBulkActionTargetStatus] = useState<TuitionStatus | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor' | 'user'>('admin');

  const formatRelativeTime = (timestamp: string) => {
    if (!timestamp) return 'Recently';
    if (timestamp === 'Just now' || timestamp === 'Recent') return timestamp;
    const time = new Date(timestamp).getTime();
    if (isNaN(time)) return timestamp;
    const seconds = Math.floor((Date.now() - time) / 1000);
    if (seconds < 15) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const [activityLogs, setActivityLogs] = useState<{ id: string; action: string; timestamp: string }[]>(() => {
    try {
      const saved = localStorage.getItem('admin_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: '1', action: 'System initialized and connected to database', timestamp: new Date().toISOString() },
      { id: '2', action: 'Admin dashboard loaded successfully', timestamp: new Date().toISOString() }
    ];
  });

  const logActivity = (action: string) => {
    const newLog = {
      id: `act-${Date.now()}-${Math.random()}`,
      action,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...activityLogs].slice(0, 15);
    setActivityLogs(updated);
    try {
      localStorage.setItem('admin_activity_logs', JSON.stringify(updated));
    } catch (e) {}
  };

  const [securityLogs, setSecurityLogs] = useState<{
    id: string;
    email: string;
    ip: string;
    userAgent: string;
    status: 'success' | 'failed' | 'warning';
    timestamp: string;
  }[]>(() => {
    try {
      const saved = localStorage.getItem('admin_security_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'sec-1', email: currentUser.email, ip: '192.168.1.45', userAgent: 'Chrome / Windows 11', status: 'success', timestamp: new Date(Date.now() - 60000).toISOString() },
      { id: 'sec-2', email: 'admin@smarttutor.com', ip: '10.0.0.128', userAgent: 'Safari / macOS', status: 'success', timestamp: new Date(Date.now() - 600000).toISOString() },
      { id: 'sec-3', email: 'suspicious.bot@crawler.net', ip: '203.0.113.42', userAgent: 'Python-Requests/2.28', status: 'failed', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 'sec-4', email: 'editor.rahim@gmail.com', ip: '172.16.0.25', userAgent: 'Firefox / Ubuntu', status: 'success', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 'sec-5', email: 'unknown.user@outlook.com', ip: '198.51.100.14', userAgent: 'Edge / Windows 10', status: 'warning', timestamp: new Date(Date.now() - 14400000).toISOString() }
    ];
  });

  const simulateLoginAttempt = (success = true) => {
    const emails = [currentUser.email, 'admin@smarttutor.com', 'tutor.anik@gmail.com', 'unknown.attempt@hack.org', 'editor.sultana@gmail.com'];
    const ips = ['192.168.1.' + Math.floor(10 + Math.random() * 89), '10.0.4.' + Math.floor(1 + Math.random() * 250), '203.0.113.' + Math.floor(1 + Math.random() * 250)];
    const agents = ['Chrome / Windows 11', 'Safari / iOS 17', 'Firefox / Linux', 'Edge / Windows 10', 'Mobile App / Android'];
    const email = emails[Math.floor(Math.random() * emails.length)];
    const ip = ips[Math.floor(Math.random() * ips.length)];
    const userAgent = agents[Math.floor(Math.random() * agents.length)];
    const status: 'success' | 'failed' | 'warning' = success ? (email.includes('hack') ? 'failed' : 'success') : 'failed';

    const newLog = {
      id: `sec-${Date.now()}-${Math.random()}`,
      email,
      ip,
      userAgent,
      status,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...securityLogs];
    setSecurityLogs(updated);
    try {
      localStorage.setItem('admin_security_logs', JSON.stringify(updated));
    } catch (e) {}
    logActivity(`Security audit: Login attempt (${status}) for ${email} from IP ${ip}`);
  };

  const handleUpdateStatusLogged = (id: string, status: TuitionStatus) => {
    const post = tuitionPosts.find(p => p.id === id);
    onUpdateStatus(id, status);
    logActivity(`Status updated to ${status} for #${post?.tuition_code || id}`);
  };

  const handleDeleteTuitionLogged = (id: string) => {
    const post = tuitionPosts.find(p => p.id === id);
    onDeleteTuition(id);
    logActivity(`Tuition post #${post?.tuition_code || id} deleted`);
  };

  const confirmBulkStatus = () => {
    if (bulkActionTargetStatus) {
      selectedPostIds.forEach(id => {
        handleUpdateStatusLogged(id, bulkActionTargetStatus);
      });
      logActivity(`Bulk updated ${selectedPostIds.length} posts to status: ${bulkActionTargetStatus}`);
      setSelectedPostIds([]);
    }
    setBulkActionTargetStatus(null);
  };

  // Tuition Form State
  const [formState, setFormState] = useState<Partial<TuitionPost>>({
    tuition_code: `STN${Math.floor(1000 + Math.random() * 9000)}`,
    title: '',
    medium: 'English Medium',
    tutor_gender: 'Any',
    tutor_background: 'BUET',
    class_level: 'Class 9',
    subjects: ['Mathematics'],
    location: locations[0]?.name || 'Uttara',
    area: 'Sector 1',
    salary: 10000,
    days_per_week: 3,
    hours_per_day: 1.5,
    student_gender: 'Any',
    student_class: 'Class 9',
    description: '',
    status: 'draft',
    featured: false
  });

  const handleOpenNewForm = () => {
    setEditingTuition(null);
    setFormTab('general');
    setFormState({
      tuition_code: `STN${Math.floor(1000 + Math.random() * 9000)}`,
      title: '',
      medium: 'English Medium',
      tutor_gender: 'Any',
      tutor_background: 'BUET',
      class_level: 'Class 9',
      subjects: ['Mathematics'],
      location: locations[0]?.name || 'Uttara',
      area: 'Sector 1',
      salary: 10000,
      days_per_week: 3,
      hours_per_day: 1.5,
      student_gender: 'Any',
      student_class: 'Class 9',
      description: '',
      status: 'draft',
      featured: false,
      seo_title: '',
      seo_description: '',
      seo_og_image: '',
      internal_notes: ''
    });
    setActiveTab('tuition-form');
  };

  const handleOpenEditForm = (post: TuitionPost) => {
    setEditingTuition(post);
    setFormTab('general');
    setFormState({ ...post });
    setActiveTab('tuition-form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.location || !formState.location.trim()) {
      alert('Validation Error: Location is required. Please select or enter a valid location.');
      return;
    }
    const now = new Date().toISOString();
    const slug = formState.title
      ? `${formState.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${formState.tuition_code?.toLowerCase()}`
      : `tuition-${formState.tuition_code?.toLowerCase()}`;

    const isPublishedNow = formState.status === 'published';
    const existingPublishedAt = editingTuition?.published_at;
    const publishedAt = isPublishedNow 
      ? (existingPublishedAt || now) 
      : (formState.published_at || undefined);

    const postToSave: TuitionPost = {
      id: editingTuition ? editingTuition.id : `t-${Date.now()}`,
      tuition_code: formState.tuition_code || 'STN1000',
      title: formState.title || 'Untitled Tuition Post',
      slug,
      description: formState.description || '',
      medium: formState.medium || 'English Medium',
      tutor_gender: formState.tutor_gender || 'Any',
      tutor_background: formState.tutor_background || 'BUET',
      class_level: formState.class_level || 'Class 9',
      subjects: formState.subjects || ['Mathematics'],
      location: formState.location.trim(),
      area: formState.area || 'Sector 1',
      salary: Number(formState.salary) || 10000,
      days_per_week: Number(formState.days_per_week) || 3,
      hours_per_day: Number(formState.hours_per_day) || 1.5,
      student_gender: formState.student_gender || 'Any',
      student_class: formState.student_class || 'Class 9',
      category_id: formState.category_id,
      status: (formState.status as TuitionStatus) || 'draft',
      featured: Boolean(formState.featured),
      created_by: currentUser.id,
      created_at: editingTuition ? editingTuition.created_at : now,
      updated_at: now,
      published_at: publishedAt,
      seo_title: formState.seo_title || '',
      seo_description: formState.seo_description || '',
      seo_og_image: formState.seo_og_image || ''
    };

    onSaveTuition(postToSave);
    logActivity(`Tuition post #${postToSave.tuition_code} ${editingTuition ? 'updated' : 'created'}`);
    setActiveTab('tuition-list');
  };

  const handleBulkImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const newPosts: TuitionPost[] = [];
    const now = new Date().toISOString();

    lines.forEach((line, index) => {
      let tuitionCode = `STN${Math.floor(1000 + Math.random() * 9000)}`;
      let cleanLine = line;

      // Extract code if present at start (e.g. #STN-EM-M1076 or STN1234)
      const codeMatch = line.match(/^(#[A-Za-z0-9\-]+|[A-Za-z0-9\-]{4,12})/);
      if (codeMatch && (line.includes('#') || line.startsWith('STN') || line.startsWith('stn'))) {
        tuitionCode = codeMatch[1].replace('#', '');
        cleanLine = line.replace(codeMatch[1], '').trim();
      }

      // Medium detection
      let medium = 'English Medium';
      const lower = cleanLine.toLowerCase();
      if (lower.includes('bangla medium') || lower.includes('bangla')) medium = 'Bangla Medium';
      else if (lower.includes('english version')) medium = 'English Version';
      else if (lower.includes('madrasa')) medium = 'Madrasa';
      else if (lower.includes('english medium')) medium = 'English Medium';

      // Tutor Gender
      let tutorGender = 'Any';
      if (lower.includes('male tutor') || (lower.includes('male') && !lower.includes('female'))) tutorGender = 'Male';
      else if (lower.includes('female tutor') || lower.includes('female')) tutorGender = 'Female';

      // Class Level
      let classLevel = 'Class 9';
      const classReg = cleanLine.match(/class\s*([0-9]+(?:-[0-9]+)?)/i) || cleanLine.match(/(hsc|ssc|o-level|a-level|admission|degree)/i);
      if (classReg) {
        classLevel = classReg[0];
        classLevel = classLevel.charAt(0).toUpperCase() + classLevel.slice(1);
      }

      // Location detection
      const knownLocations = ['Uttara', 'Mirpur', 'Dhanmondi', 'Gulshan', 'Banani', 'Mohammadpur', 'Khilgaon', 'Banasree', 'Rampura', 'Bashundhara', 'Motijheel', 'Mohakhali', 'Farmgate', 'Malibagh', 'Uttarkhan', 'Dakshinkhan', 'Cantonment', 'Pallabi', 'Kafrul', 'Tejgaon', 'Badda', 'Khilkhet', 'Baridhara', 'Eskaton', 'Paltan', 'Segunbagicha', 'Wari', 'Lalbagh', 'Hazaribagh', 'Shyamoli', 'Agargaon'];
      let locationName = locations[0]?.name || 'Uttara';
      
      for (const loc of locations) {
        if (cleanLine.toLowerCase().includes(loc.name.toLowerCase())) {
          locationName = loc.name;
          break;
        }
      }

      if (locationName === 'Uttara' && !cleanLine.toLowerCase().includes('uttara')) {
        for (const loc of knownLocations) {
          if (cleanLine.toLowerCase().includes(loc.toLowerCase())) {
            locationName = loc;
            break;
          }
        }
      }

      if (locationName === 'Uttara' && !cleanLine.toLowerCase().includes('uttara')) {
        const inMatch = cleanLine.match(/(?:in|at)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
        if (inMatch && inMatch[1]) {
          const raw = inMatch[1].trim();
          if (raw.length > 2 && !['class', 'tutor', 'student', 'medium', 'male', 'female'].includes(raw.toLowerCase())) {
            locationName = raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
        }
      }

      // Subjects detection
      let subjects = ['Mathematics'];
      const foundSubjects: string[] = [];
      ['math', 'mathematics', 'physics', 'chemistry', 'biology', 'english', 'bangla', 'ict', 'science', 'accounting', 'finance', 'economics', 'higher math'].forEach(sub => {
        if (lower.includes(sub)) {
          foundSubjects.push(sub.charAt(0).toUpperCase() + sub.slice(1));
        }
      });
      if (foundSubjects.length > 0) {
        subjects = Array.from(new Set(foundSubjects));
      }

      const title = cleanLine || 'Tutor Needed';
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${tuitionCode.toLowerCase()}`;

      const newPost: TuitionPost = {
        id: `t-bulk-${Date.now()}-${index}`,
        tuition_code: tuitionCode,
        title,
        slug,
        description: `Requirement posting for ${title}. Location: ${locationName}.`,
        medium,
        tutor_gender: tutorGender,
        tutor_background: 'BUET / Dhaka University',
        class_level: classLevel,
        subjects,
        location: locationName,
        area: locationName,
        salary: 10000,
        days_per_week: 3,
        hours_per_day: 1.5,
        student_gender: 'Any',
        student_class: classLevel,
        status: 'published',
        featured: false,
        created_by: currentUser.id,
        created_at: now,
        updated_at: now,
        published_at: now
      };

      newPosts.push(newPost);
    });

    if (newPosts.length > 0) {
      onSaveMultipleTuitions(newPosts);
      logActivity(`Bulk imported ${newPosts.length} tuition posts`);
      setBulkText('');
      setActiveTab('tuition-list');
    }
  };

  // Stats calculation
  const totalPosts = tuitionPosts.length;
  const publishedPostsCount = tuitionPosts.filter((p) => p.status === 'published').length;
  const draftPostsCount = tuitionPosts.filter((p) => p.status === 'draft').length;
  const archivedPostsCount = tuitionPosts.filter((p) => p.status === 'archived').length;
  const editorsCount = users.filter((u) => u.role === 'editor').length;

  const todayStr = new Date().toDateString();
  const todaysPostsCount = tuitionPosts.filter((p) => new Date(p.created_at).toDateString() === todayStr).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Toggle */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
            STN
          </div>
          <span className="font-bold text-gray-900 text-sm">Admin Dashboard</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform transform ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-base">
              STN
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Smart Tutor Network</span>
              <span className="text-xs text-blue-400 capitalize">{currentUser.role} Portal</span>
            </div>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto text-sm">
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('tuition-list'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'tuition-list' || activeTab === 'tuition-form' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tuition Posts</span>
          </button>

          <button
            onClick={() => { handleOpenNewForm(); setMobileSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium hover:bg-gray-800 text-blue-400 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Tuition</span>
          </button>

          {currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => { setActiveTab('categories'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'categories' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => { setActiveTab('locations'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'locations' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Locations</span>
              </button>

              <button
                onClick={() => { setActiveTab('subjects'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'subjects' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <ListTree className="w-4 h-4" />
                <span>Subjects</span>
              </button>

              <button
                onClick={() => { setActiveTab('users'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Users & Roles</span>
              </button>

              <button
                onClick={() => { setActiveTab('security-logs'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'security-logs' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security Logs</span>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings & SQL</span>
              </button>
            </>
          )}
        </nav>

        {/* User profile & logout */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-sm">
              {currentUser.email.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="font-semibold text-white text-xs block truncate">{currentUser.full_name}</span>
              <span className="text-gray-400 text-xs truncate block">{currentUser.email}</span>
            </div>
          </div>
          <button
            onClick={() => { onNavigate('/'); }}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-xl text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white py-2 rounded-xl text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 sm:p-10 overflow-y-auto">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Admin Overview</h1>
                <p className="text-sm text-gray-600">Welcome back, {currentUser.full_name}. Here is your daily tuition media summary.</p>
              </div>
              <button
                onClick={handleOpenNewForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center gap-2 self-start"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create New Tuition Post</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Total Tuition Posts</span>
                <span className="text-3xl font-extrabold text-gray-900 block">{totalPosts}</span>
                <span className="text-xs text-blue-600 font-medium">All database entries</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Published Live</span>
                <span className="text-3xl font-extrabold text-emerald-600 block">{publishedPostsCount}</span>
                <span className="text-xs text-emerald-700 font-medium">Active on public feed</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Drafts & Archived</span>
                <span className="text-3xl font-extrabold text-amber-600 block">{draftPostsCount + archivedPostsCount}</span>
                <span className="text-xs text-gray-500 font-medium">{draftPostsCount} drafts, {archivedPostsCount} archived</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Today&apos;s New Posts</span>
                <span className="text-3xl font-extrabold text-indigo-600 block">{todaysPostsCount}</span>
                <span className="text-xs text-indigo-700 font-medium">Published today</span>
              </div>
            </div>

            {/* Recharts Summary Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 mb-4">Tuition Status Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Published', value: publishedPostsCount, color: '#10b981' },
                          { name: 'Draft', value: draftPostsCount, color: '#f59e0b' },
                          { name: 'Archived', value: archivedPostsCount, color: '#6b7280' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent, value }) => value > 0 && percent > 0.03 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                      >
                        {[
                          { color: '#10b981' },
                          { color: '#f59e0b' },
                          { color: '#6b7280' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity Trends Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 mb-4">Recent Activity Trends (Posts Created)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(() => {
                      const trendMap: Record<string, number> = {};
                      tuitionPosts.forEach(p => {
                        const d = new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        trendMap[d] = (trendMap[d] || 0) + 1;
                      });
                      return Object.keys(trendMap).slice(-7).map(date => ({
                        date,
                        Posts: trendMap[date]
                      }));
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="Posts" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Location Demands Summary Cards */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Tuition Demands by Location
                  </h3>
                  <p className="text-xs text-gray-500">Total number of tuition posts originating per location</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {locations.length} Active Hubs
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {(() => {
                  const counts: Record<string, number> = {};
                  tuitionPosts.forEach(p => {
                    const loc = p.location || 'Other';
                    counts[loc] = (counts[loc] || 0) + 1;
                  });
                  return Object.entries(counts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([locName, count]) => (
                      <div key={locName} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-blue-50/50 transition-colors space-y-1">
                        <span className="text-xs font-bold text-gray-900 truncate block">{locName}</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-extrabold text-blue-600">{count}</span>
                          <span className="text-[10px] text-gray-500 font-medium">{count === 1 ? 'Post' : 'Posts'}</span>
                        </div>
                      </div>
                    ));
                })()}
              </div>
            </div>

            {/* Recent Activity Panel */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
                    <p className="text-xs text-gray-500">Live platform audit log and actions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActivityLogs([]);
                      try {
                        localStorage.removeItem('admin_activity_logs');
                      } catch (e) {}
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Clear History
                  </button>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full hidden sm:inline-block">
                    Live
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {activityLogs.length === 0 ? (
                  <p className="py-4 text-sm text-gray-400 text-center">No recent activity recorded yet.</p>
                ) : (
                  activityLogs.map((log) => (
                    <div key={log.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="text-sm font-medium text-gray-900">{log.action}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-400 whitespace-nowrap">{formatRelativeTime(log.timestamp)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Tuition Posts Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Tuition Posts</h3>
                <button
                  onClick={() => setActiveTab('tuition-list')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  View All ({totalPosts})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 text-xs uppercase tracking-wider">
                      <th className="p-4">Code</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Salary</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tuitionPosts.slice(0, 5).map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-600">#{post.tuition_code}</td>
                        <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                        <td className="p-4 text-gray-600">{post.location}</td>
                        <td className="p-4 font-bold text-emerald-700">৳{post.salary.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            post.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                            post.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => onNavigate(`/tuition/${post.slug}`)}
                            title="View on site"
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditForm(post)}
                            title="Edit post"
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TUITION LIST TAB */}
        {activeTab === 'tuition-list' && (() => {
          const filteredPosts = tuitionPosts.filter((p) => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  p.tuition_code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  p.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
          });

          const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
              setSelectedPostIds(filteredPosts.map(p => p.id));
            } else {
              setSelectedPostIds([]);
            }
          };

          const handleToggleSelectPost = (id: string) => {
            if (selectedPostIds.includes(id)) {
              setSelectedPostIds(selectedPostIds.filter(i => i !== id));
            } else {
              setSelectedPostIds([...selectedPostIds, id]);
            }
          };

          const handleBulkStatus = (status: TuitionStatus) => {
            setBulkActionTargetStatus(status);
          };

          const handleBulkDelete = () => {
            if (window.confirm(`Are you sure you want to delete ${selectedPostIds.length} selected tuition posts?`)) {
              selectedPostIds.forEach(id => {
                handleDeleteTuitionLogged(id);
              });
              setSelectedPostIds([]);
            }
          };

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">Tuition Posts Management</h1>
                  <p className="text-sm text-gray-600">Create, publish, edit, archive or delete tuition postings.</p>
                </div>
                <button
                  onClick={handleOpenNewForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center gap-2 self-start"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Add New Tuition</span>
                </button>
              </div>

              {/* Bulk Actions Toolbar */}
              {selectedPostIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      {selectedPostIds.length}
                    </span>
                    <span>posts selected</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      onClick={() => handleBulkStatus('published')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      Publish Selected
                    </button>
                    <button
                      onClick={() => handleBulkStatus('draft')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      Set as Draft
                    </button>
                    <button
                      onClick={() => handleBulkStatus('archived')}
                      className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      Archive Selected
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      Delete Selected
                    </button>
                    <button
                      onClick={() => setSelectedPostIds([])}
                      className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by code, title, location..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                    <button
                      type="button"
                      onClick={() => setCompactMode(!compactMode)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                        compactMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                      title="Toggle Compact Mode"
                    >
                      <span>Compact Mode ({compactMode ? 'On' : 'Off'})</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Filter Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3.5 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      >
                        <option value="all">All Statuses ({tuitionPosts.length})</option>
                        <option value="published">Published Live</option>
                        <option value="draft">Drafts</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className={`bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 text-xs uppercase tracking-wider ${compactMode ? 'text-[11px]' : ''}`}>
                        <th className={`${compactMode ? 'py-2 px-3' : 'p-4'} w-12 text-center`}>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            checked={filteredPosts.length > 0 && selectedPostIds.length === filteredPosts.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className={`${compactMode ? 'py-2 px-3' : 'p-4'}`}>Code</th>
                        <th className={`${compactMode ? 'py-2 px-3' : 'p-4'}`}>Title</th>
                        <th className={`${compactMode ? 'py-2 px-3' : 'p-4'}`}>Medium</th>
                        <th className={`${compactMode ? 'py-2 px-3' : 'p-4'}`}>Location</th>
                        <th className={`${compactMode ? 'py-2 px-3' : 'p-4'}`}>Salary</th>
                        <th className={`${compactMode ? 'py-2 px-3' : 'p-4'}`}>Status</th>
                        <th className={`${compactMode ? 'py-2 px-3' : 'p-4'} text-right`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredPosts.map((post) => (
                          <tr key={post.id} className={`hover:bg-gray-50/50 transition-colors ${selectedPostIds.includes(post.id) ? 'bg-blue-50/40' : ''}`}>
                            <td className={`${compactMode ? 'py-2 px-3' : 'p-4'} text-center`}>
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                checked={selectedPostIds.includes(post.id)}
                                onChange={() => handleToggleSelectPost(post.id)}
                              />
                            </td>
                            <td className={`${compactMode ? 'py-2 px-3' : 'p-4'} font-mono font-bold text-blue-600`}>
                              <div className="flex items-center gap-1.5">
                                <span>#{post.tuition_code}</span>
                                {post.internal_notes && (
                                  <span title={`Internal Notes: ${post.internal_notes}`} className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-amber-200 cursor-help">
                                    Notes
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className={`${compactMode ? 'py-2 px-3' : 'p-4'} font-medium text-gray-900 max-w-xs truncate`}>{post.title}</td>
                            <td className={`${compactMode ? 'py-2 px-3' : 'p-4'} text-gray-600`}>{post.medium}</td>
                            <td className={`${compactMode ? 'py-2 px-3' : 'p-4'} text-gray-600`}>{post.location}</td>
                            <td className={`${compactMode ? 'py-2 px-3' : 'p-4'} font-bold text-emerald-700`}>৳{post.salary.toLocaleString()}</td>
                            <td className={`${compactMode ? 'py-2 px-3' : 'p-4'}`}>
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                post.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                                post.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'
                              }`}>
                                {post.status}
                              </span>
                            </td>
                            <td className={`${compactMode ? 'py-2 px-3' : 'p-4'} text-right space-x-1.5`}>
                              {post.status !== 'published' ? (
                                <button
                                  onClick={() => handleUpdateStatusLogged(post.id, 'published')}
                                  title="Publish"
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium"
                                >
                                  Publish
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatusLogged(post.id, 'draft')}
                                  title="Unpublish"
                                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium"
                                >
                                  Unpublish
                                </button>
                              )}
                              <button
                                onClick={() => setQuickViewPost(post)}
                                title="Quick View Summary"
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Quick View</span>
                              </button>
                              <button
                                onClick={() => setPreviewPost(post)}
                                title="Preview on public site"
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg inline-block"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditForm(post)}
                                title="Edit"
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg inline-block"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTuitionLogged(post.id)}
                                title="Delete"
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg inline-block"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TUITION FORM TAB (Create / Edit) */}
        {activeTab === 'tuition-form' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  {editingTuition ? `Edit Tuition #${editingTuition.tuition_code}` : 'Create New Tuition Post'}
                </h1>
                <p className="text-sm text-gray-600">Fill out the form below or use bulk paste to create tuition opportunities.</p>
              </div>
              <button
                onClick={() => setActiveTab('tuition-list')}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-xl border border-gray-200"
              >
                Cancel
              </button>
            </div>

            {!editingTuition && (
              <div className="flex bg-gray-100 p-1.5 rounded-xl gap-2 w-fit">
                <button
                  type="button"
                  onClick={() => setImportMode('single')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${importMode === 'single' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Single Post Form
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('bulk')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${importMode === 'bulk' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  ⚡ Bulk Text Import (Paste Multiple)
                </button>
              </div>
            )}

            {((importMode === 'single' && !editingTuition) || editingTuition) && (
              <div className="flex bg-gray-100 p-1.5 rounded-xl gap-2 w-fit">
                <button
                  type="button"
                  onClick={() => setFormTab('general')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${formTab === 'general' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  General Information
                </button>
                <button
                  type="button"
                  onClick={() => setFormTab('seo')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${formTab === 'seo' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  🔍 SEO Settings & Open Graph
                </button>
              </div>
            )}

            {importMode === 'bulk' && !editingTuition ? (
              <form onSubmit={handleBulkImportSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Bulk Paste Tuition Posts</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Paste multiple tuition lines below (one per line). Each line can include code (e.g. <code>#STN-EM-M1076</code>), medium, class, subjects, and location. Our smart parser will automatically extract and categorize everything!
                  </p>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Pasted Tuition Lines</label>
                  <textarea
                    rows={8}
                    required
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="#STN-EM-M1076 English Medium Male Tutor Needed for Class 8 Math & Physics in Mirpur&#10;#STN-BM-F1077 Bangla Medium Female Tutor Needed for Class 5 English & Bangla in Uttara"
                    className="w-full p-4 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Default Import Status for All</label>
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value as TuitionStatus)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="published">Published (Live on Feed)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('tuition-list')}
                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Import All Tuitions</span>
                  </button>
                </div>
              </form>
            ) : formTab === 'seo' ? (
              <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6 shadow-sm">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-blue-900 text-sm space-y-1">
                  <h4 className="font-bold flex items-center gap-2">
                    <span>✨ Search Engine Optimization (SEO) & Open Graph Settings</span>
                  </h4>
                  <p className="text-xs text-blue-700">
                    Define custom meta titles, descriptions, and social preview images for this tuition post to rank higher on Google and display rich preview cards when shared on Facebook, WhatsApp, and LinkedIn.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Page Title</label>
                  <input
                    type="text"
                    value={formState.seo_title || ''}
                    onChange={(e) => setFormState({ ...formState, seo_title: e.target.value })}
                    placeholder={formState.title ? `${formState.title} | Smart Tutor Network` : 'e.g. English Medium Math Tutor in Uttara | Smart Tutor Network'}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">Recommended length: 50-60 characters.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={formState.seo_description || ''}
                    onChange={(e) => setFormState({ ...formState, seo_description: e.target.value })}
                    placeholder="e.g. Looking for an experienced English Medium math tutor in Uttara, Dhaka. Salary ৳15,000. Apply now via WhatsApp."
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">Recommended length: 150-160 characters for optimal Google snippet display.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Open Graph (OG) Social Share Image</label>
                  <div className="flex items-center gap-4">
                    {formState.seo_og_image && (
                      <div className="w-24 h-16 bg-gray-50 border border-gray-200 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={formState.seo_og_image} alt="OG preview" className="max-h-full max-w-full object-cover rounded-lg" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              const result = uploadEvent.target?.result as string;
                              if (result) {
                                setFormState({ ...formState, seo_og_image: result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder="Or paste Social Share Image URL"
                        value={formState.seo_og_image || ''}
                        onChange={(e) => setFormState({ ...formState, seo_og_image: e.target.value })}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('tuition-list')}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md"
                  >
                    {editingTuition ? 'Update Tuition' : 'Save & Publish'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6 shadow-sm">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tuition Code</label>
                  <input
                    type="text"
                    required
                    value={formState.tuition_code || ''}
                    onChange={(e) => setFormState({ ...formState, tuition_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formState.status || 'draft'}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="draft">Draft (Private)</option>
                    <option value="published">Published (Live on Feed)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tuition Title</label>
                <input
                  type="text"
                  required
                  value={formState.title || ''}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="e.g. English Medium Class 9 Math & Physics Tutor Needed in Uttara"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Medium</label>
                  <select
                    value={formState.medium || 'English Medium'}
                    onChange={(e) => setFormState({ ...formState, medium: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="English Medium">English Medium</option>
                    <option value="Bangla Medium">Bangla Medium</option>
                    <option value="English Version">English Version</option>
                    <option value="Madrasa">Madrasa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Class Level Requirement</label>
                  <input
                    type="text"
                    required
                    value={formState.class_level || ''}
                    onChange={(e) => setFormState({ ...formState, class_level: e.target.value })}
                    placeholder="e.g. Class 9-10, HSC Year 1, O-Level, Admission"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] text-gray-500 self-center mr-1">Suggestions:</span>
                    {['Class 9-10', 'HSC Year 1', 'Class 9', 'Class 10', 'O-Level', 'A-Level', 'Admission', 'Class 5', 'Class 8'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setFormState({ ...formState, class_level: suggestion })}
                        className="text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 px-2 py-0.5 rounded-md transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subjects (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={formState.subjects ? formState.subjects.join(', ') : ''}
                    onChange={(e) => setFormState({ ...formState, subjects: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    placeholder="Mathematics, Physics"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location (Dhaka)</label>
                  <select
                    value={formState.location || 'Uttara'}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Area / Sector</label>
                  <input
                    type="text"
                    value={formState.area || ''}
                    onChange={(e) => setFormState({ ...formState, area: e.target.value })}
                    placeholder="e.g. Sector 7, Road 11"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Salary (BDT ৳)</label>
                  <input
                    type="number"
                    required
                    value={formState.salary || 10000}
                    onChange={(e) => setFormState({ ...formState, salary: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Days Per Week</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    required
                    value={formState.days_per_week || 3}
                    onChange={(e) => setFormState({ ...formState, days_per_week: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hours Per Day</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formState.hours_per_day || 1.5}
                    onChange={(e) => setFormState({ ...formState, hours_per_day: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tutor Gender Preference</label>
                  <select
                    value={formState.tutor_gender || 'Any'}
                    onChange={(e) => setFormState({ ...formState, tutor_gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tutor Educational Background</label>
                  <select
                    value={formState.tutor_background || 'BUET'}
                    onChange={(e) => setFormState({ ...formState, tutor_background: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="BUET">BUET</option>
                    <option value="DU">DU (Dhaka University)</option>
                    <option value="Medical">Medical College</option>
                    <option value="NSU">NSU / BRAC / Private</option>
                    <option value="University Tutor">Any Public University</option>
                    <option value="Experienced Tutor">Experienced Tutor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Description & Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={formState.description || ''}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Enter specific requirements, student grade expectations, timing..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Internal Notes (Admin Only - Not visible on public site)</label>
                <textarea
                  rows={2}
                  value={formState.internal_notes || ''}
                  onChange={(e) => setFormState({ ...formState, internal_notes: e.target.value })}
                  placeholder="Enter confidential admin notes, guardian contact details, fee tracking..."
                  className="w-full px-3.5 py-2.5 border border-amber-300 bg-amber-50/50 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={Boolean(formState.featured)}
                  onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="featured-check" className="text-sm font-medium text-gray-800">
                  Mark as Featured Tuition
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('tuition-list')}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md"
                >
                  {editingTuition ? 'Update Tuition' : 'Save & Publish'}
                </button>
              </div>

            </form>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-900">Dynamic Categories Management</h1>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                      <span className="text-xs text-gray-500 font-mono">slug: {cat.slug}</span>
                    </div>
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOCATIONS TAB */}
        {activeTab === 'locations' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-900">Dhaka Locations Management</h1>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((loc) => (
                  <div key={loc.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{loc.name}</h3>
                      <span className="text-xs text-gray-500">{loc.city}</span>
                    </div>
                    <button
                      onClick={() => onDeleteLocation(loc.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBJECTS TAB */}
        {activeTab === 'subjects' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-900">Subjects Management</h1>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{sub.name}</h3>
                      <span className="text-xs text-blue-600">{sub.category}</span>
                    </div>
                    <button
                      onClick={() => onDeleteSubject(sub.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS & ROLES TAB */}
        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">User Profiles & Role Management</h1>
                <p className="text-sm text-gray-600">Manage platform users, editors, and administrators (or add new admins/buyers).</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2 self-start"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New User / Admin</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 text-xs uppercase">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="p-4 font-semibold text-gray-900">{u.full_name}</td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateUserRole(u.id, e.target.value as any)}
                          className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-800"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-lg font-extrabold text-gray-900">Add New User or Administrator</h3>
                    <button type="button" onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newUserEmail.trim() || !newUserFullName.trim()) return;
                    onSaveUser({
                      id: `user-${Date.now()}`,
                      email: newUserEmail.trim(),
                      full_name: newUserFullName.trim(),
                      role: newUserRole,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    });
                    setNewUserEmail('');
                    setNewUserFullName('');
                    setNewUserRole('admin');
                    setShowAddUserModal(false);
                  }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newUserFullName}
                        onChange={(e) => setNewUserFullName(e.target.value)}
                        placeholder="e.g. John Doe / Buyer Admin"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="e.g. buyer@example.com"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="admin">Admin (Full Access / Buyer)</option>
                        <option value="editor">Editor (Manage Tuitions)</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
                      >
                        Create User / Admin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECURITY LOGS TAB */}
        {activeTab === 'security-logs' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Security & Login Audit Logs</h1>
                <p className="text-sm text-gray-600">Track authentication attempts, IP identifiers, and security events across the platform.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => simulateLoginAttempt(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Simulate Success Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => simulateLoginAttempt(false)}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Simulate Failed Attempt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSecurityLogs([]);
                    try { localStorage.removeItem('admin_security_logs'); } catch (e) {}
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-600">
                <span>Total Recorded Attempts: {securityLogs.length}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Live Platform Firewall Active
                </span>
              </div>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 text-xs uppercase">
                    <th className="p-4">Status</th>
                    <th className="p-4">User Identifier</th>
                    <th className="p-4">IP Address (Placeholder)</th>
                    <th className="p-4">Device / Client Agent</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {securityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                        No security logs recorded yet. Click "Simulate Login Attempt" above to generate sample events.
                      </td>
                    </tr>
                  ) : (
                    securityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            log.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                            log.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'success' ? 'bg-emerald-600' :
                              log.status === 'failed' ? 'bg-red-600' : 'bg-amber-600'
                            }`}></span>
                            <span className="capitalize">{log.status}</span>
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs font-semibold text-gray-900">{log.email}</td>
                        <td className="p-4 font-mono text-xs text-blue-600 font-bold">{log.ip}</td>
                        <td className="p-4 text-gray-600 text-xs">{log.userAgent}</td>
                        <td className="p-4 text-right text-xs font-mono text-gray-500">
                          {formatRelativeTime(log.timestamp)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS & SQL TAB */}
        {activeTab === 'settings' && currentUser.role === 'admin' && (
          <div className="space-y-10">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Site Settings & Supabase Configuration</h1>
              <p className="text-sm text-gray-600">Manage global site settings and view Supabase SQL migration schema.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Global Settings</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                onSaveSettings(settings);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) => onSaveSettings({ ...settings, site_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Site Logo</label>
                  <div className="flex items-center gap-4">
                    {settings.logo_url && (
                      <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-xl p-1 flex items-center justify-center shrink-0">
                        <img src={settings.logo_url} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              const result = uploadEvent.target?.result as string;
                              if (result) {
                                onSaveSettings({ ...settings, logo_url: result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder="Or paste Logo Image URL"
                        value={settings.logo_url || ''}
                        onChange={(e) => onSaveSettings({ ...settings, logo_url: e.target.value })}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Helpline Number</label>
                  <input
                    type="text"
                    value={settings.contact_whatsapp}
                    onChange={(e) => onSaveSettings({ ...settings, contact_whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primary_color || '#2563eb'}
                      onChange={(e) => onSaveSettings({ ...settings, primary_color: e.target.value })}
                      className="w-12 h-10 rounded-xl cursor-pointer border border-gray-300 p-1 bg-white"
                    />
                    <span className="text-sm font-mono font-medium text-gray-700">{settings.primary_color || '#2563eb'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {[
                      { label: 'Blue', color: '#2563eb' },
                      { label: 'Indigo', color: '#4f46e5' },
                      { label: 'Emerald', color: '#059669' },
                      { label: 'Violet', color: '#7c3aed' },
                      { label: 'Rose', color: '#e11d48' },
                      { label: 'Amber', color: '#d97706' }
                    ].map((preset) => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => onSaveSettings({ ...settings, primary_color: preset.color })}
                        className="w-6 h-6 rounded-full border border-gray-300 shadow-xs transition-transform hover:scale-110"
                        style={{ backgroundColor: preset.color }}
                        title={preset.label}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs"
                >
                  Save Settings
                </button>
              </form>
            </div>

            {/* Supabase SQL Schema Viewer */}
            <SqlSchemaViewer />
          </div>
        )}

      </main>

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-mono text-xs font-bold rounded-full border border-blue-200">
                  #{previewPost.tuition_code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  previewPost.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {previewPost.status.toUpperCase()} (Live Preview Mode)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {previewPost.status !== 'published' && (
                  <button
                    onClick={() => {
                      handleUpdateStatusLogged(previewPost.id, 'published');
                      setPreviewPost({ ...previewPost, status: 'published' });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                  >
                    Publish Now
                  </button>
                )}
                <button
                  onClick={() => setPreviewPost(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                  {previewPost.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                    {previewPost.medium}
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                    {previewPost.class_level}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
                    {previewPost.location} ({previewPost.area})
                  </span>
                </div>
              </div>

              {/* Salary & Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div>
                  <span className="block text-xs font-medium text-gray-500">Monthly Salary</span>
                  <span className="text-lg font-bold text-emerald-600">৳{previewPost.salary.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500">Tutoring Days</span>
                  <span className="text-base font-bold text-gray-900">{previewPost.days_per_week} Days / Week</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500">Duration</span>
                  <span className="text-base font-bold text-gray-900">{previewPost.hours_per_day} Hours / Day</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500">Tutor Preference</span>
                  <span className="text-base font-bold text-gray-900">{previewPost.tutor_gender} ({previewPost.tutor_background})</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tuition Details & Requirements</h3>
                <div className="p-5 bg-white rounded-2xl border border-gray-200 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {previewPost.description}
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Required Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {previewPost.subjects.map((subj, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold">
                      {subj}
                    </span>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  This is exactly how tutors will view this post on the public site.
                </div>
                <a
                  href={`https://wa.me/8801823067428?text=I%20want%20to%20apply%20for%20Tuition%20Code:%20${previewPost.tuition_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <span>Apply via WhatsApp ({settings.contact_whatsapp})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW SUMMARY POPOVER MODAL */}
      {quickViewPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold font-mono">
                  #{quickViewPost.tuition_code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  quickViewPost.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {quickViewPost.status}
                </span>
              </div>
              <button
                onClick={() => setQuickViewPost(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">{quickViewPost.title}</h2>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600 font-medium">
                <span className="bg-gray-100 px-2.5 py-1 rounded-lg">Medium: {quickViewPost.medium}</span>
                <span className="bg-gray-100 px-2.5 py-1 rounded-lg">Class: {quickViewPost.class_level}</span>
                <span className="bg-gray-100 px-2.5 py-1 rounded-lg">Location: {quickViewPost.location} ({quickViewPost.area})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl">
              <div>
                <span className="text-[11px] text-gray-500 block">Salary</span>
                <span className="text-sm font-bold text-emerald-700">৳{quickViewPost.salary.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">Schedule</span>
                <span className="text-sm font-bold text-gray-800">{quickViewPost.days_per_week} days/wk ({quickViewPost.hours_per_day}h)</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">Tutor Pref</span>
                <span className="text-sm font-bold text-gray-800">{quickViewPost.tutor_gender}</span>
              </div>
            </div>

            {quickViewPost.internal_notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-bold text-amber-900 block flex items-center gap-1.5">
                  <span>🔒 Internal Notes (Admin Only)</span>
                </span>
                <p className="text-xs text-amber-800 whitespace-pre-line leading-relaxed">{quickViewPost.internal_notes}</p>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Subjects</span>
              <div className="flex flex-wrap gap-1.5">
                {quickViewPost.subjects.map((sub, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setQuickViewPost(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const postToEdit = quickViewPost;
                  setQuickViewPost(null);
                  handleOpenEditForm(postToEdit);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Edit Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK STATUS UPDATE CONFIRMATION MODAL */}
      {bulkActionTargetStatus && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-extrabold text-gray-900">Confirm Bulk Status Update</h3>
              <button
                onClick={() => setBulkActionTargetStatus(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                Are you sure you want to change the status of <span className="font-bold text-gray-900">{selectedPostIds.length} selected post(s)</span> to <span className="font-bold text-blue-600 uppercase">'{bulkActionTargetStatus}'</span>?
              </p>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                This action will update all selected tuition posts in the database.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBulkActionTargetStatus(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBulkStatus}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Confirm & Update ({selectedPostIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
