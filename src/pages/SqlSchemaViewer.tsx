import React, { useState } from 'react';
import { Copy, Check, Database, Code } from 'lucide-react';

export const SqlSchemaViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- =====================================================================
-- Smart Tutor Network - Supabase PostgreSQL Database Schema & RLS Policies
-- =====================================================================

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0
);

-- 3. Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  city TEXT DEFAULT 'Dhaka',
  active BOOLEAN DEFAULT TRUE
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT
);

-- 5. Tuition Posts Table
CREATE TABLE IF NOT EXISTS tuition_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tuition_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  medium TEXT NOT NULL,
  tutor_gender TEXT NOT NULL,
  tutor_background TEXT NOT NULL,
  class_level TEXT NOT NULL,
  subjects TEXT[] NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  salary INTEGER NOT NULL,
  days_per_week INTEGER NOT NULL,
  hours_per_day NUMERIC(3,1) NOT NULL,
  student_gender TEXT,
  student_class TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 6. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'Smart Tutor Network',
  contact_whatsapp TEXT DEFAULT '01823067428',
  site_description TEXT,
  contact_email TEXT,
  office_address TEXT
);

-- 7. High Performance Database Indexes
CREATE INDEX IF NOT EXISTS idx_tuition_published_at ON tuition_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_tuition_status ON tuition_posts(status);
CREATE INDEX IF NOT EXISTS idx_tuition_medium ON tuition_posts(medium);
CREATE INDEX IF NOT EXISTS idx_tuition_location ON tuition_posts(location);
CREATE INDEX IF NOT EXISTS idx_tuition_salary ON tuition_posts(salary);
CREATE INDEX IF NOT EXISTS idx_tuition_slug ON tuition_posts(slug);
CREATE INDEX IF NOT EXISTS idx_tuition_code ON tuition_posts(tuition_code);

-- 8. Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tuition_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published tuition posts, categories, locations, subjects
CREATE POLICY "Public read published tuition" ON tuition_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (active = true);
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

-- Admin and Editor write access
CREATE POLICY "Admin/Editor full tuition management" ON tuition_posts 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admin full category management" ON categories 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Supabase SQL Migration Schema</h2>
          <p className="text-xs text-gray-600">Copy and run this SQL script in your Supabase SQL Editor to provision all tables, indexes, and RLS security policies.</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-xs"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg">
        <div className="bg-gray-800 px-4 py-2.5 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-blue-400" />
            supabase_migration_v1.sql
          </span>
          <span>PostgreSQL 15+</span>
        </div>
        <pre className="p-6 text-gray-200 text-xs font-mono overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{sqlCode}</code>
        </pre>
      </div>
    </div>
  );
};
