export type TuitionStatus = 'published' | 'draft' | 'archived';

export interface TuitionPost {
  id: string;
  tuition_code: string;
  title: string;
  slug: string;
  description: string;
  medium: string; // Bangla Medium, English Medium, English Version, Madrasa, Other
  tutor_gender: string; // Male, Female, Any
  tutor_background: string; // BUET, DU, Medical, NSU, BRAC University, Other University, Experienced Tutor
  class_level: string; // Play, Nursery, KG, Class 1-10, SSC, Class 11, Class 12, HSC, Admission
  subjects: string[]; // Mathematics, Physics, Chemistry, Biology, English, Bangla, ICT, etc.
  location: string; // Uttara, Mirpur, Dhanmondi, Gulshan, Banani, Banasree, Rampura, Bashundhara, Mohammadpur, Motijheel
  area: string;
  salary: number; // in BDT
  days_per_week: number; // 2 to 7
  hours_per_day: number; // 1.5, 2, etc.
  student_gender: string; // Male, Female, Any
  student_class: string;
  category_id?: string;
  status: TuitionStatus;
  featured: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_og_image?: string;
  internal_notes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  order_index: number;
}

export interface LocationItem {
  id: string;
  name: string;
  city: string;
  active: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  category: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'user';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  site_name: string;
  contact_whatsapp: string;
  site_description: string;
  logo_url?: string;
  contact_email: string;
  office_address: string;
  primary_color?: string;
}

export interface FilterState {
  search: string;
  medium: string;
  tutor_gender: string;
  tutor_background: string;
  class_level: string;
  subject: string;
  location: string;
  salary_range: string;
  days_per_week: string;
  sort_by: 'newest' | 'oldest' | 'salary_asc' | 'salary_desc';
}
