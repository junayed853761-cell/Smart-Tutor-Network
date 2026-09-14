import React, { useState } from 'react';
import { Shield, User, Lock, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  users: UserProfile[];
  onLogin: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const targetEmail = email.trim().toLowerCase();
    if (targetEmail === 'junayed853761@gmail.com') {
      const adminUser: UserProfile = users.find(u => u.email.toLowerCase() === targetEmail) || {
        id: 'user-junayed-admin',
        email: 'junayed853761@gmail.com',
        full_name: 'Junayed (Admin)',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      onLogin(adminUser);
      onNavigate('/admin');
      return;
    }

    const found = users.find((u) => u.email.toLowerCase() === targetEmail);
    if (found) {
      onLogin(found);
      onNavigate('/admin');
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            STN
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin & Editor Portal</h1>
          <p className="text-xs text-gray-500">Smart Tutor Network Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smarttutor.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="pt-4 text-center">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>

      </div>
    </div>
  );
};
