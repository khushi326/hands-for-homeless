'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { User, Phone, Save, ShieldAlert, Award, Calendar, RefreshCw } from 'lucide-react';

export default function Profile() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (profile) {
      setFullName(profile.full_name || '');
      setPhoneNumber(profile.phone_number || '');
    }
  }, [user, profile, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('hf_access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          phone_number: phoneNumber || null,
        })
      });
      
      const data = await res.json();

      if (!res.ok) {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to update profile.' });
      } else {
        setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
        
        // Update local storage user
        const storedUser = localStorage.getItem('hf_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.full_name = fullName;
          parsed.phone_number = phoneNumber || null;
          localStorage.setItem('hf_user', JSON.stringify(parsed));
        }
        
        await refreshProfile();
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center space-x-2">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
        <span className="text-sm font-semibold text-muted">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12">
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          My Account
        </h1>
        <p className="text-sm text-muted">
          Manage your personal details and view your account role
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Summary Card */}
        <div className="bg-card border border-border/40 p-6 rounded-3xl space-y-6 flex flex-col justify-between shadow-xl shadow-foreground/[0.005]">
          <div className="space-y-4 text-center py-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{profile?.full_name || 'User'}</h3>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-border/40 pt-4 space-y-4 text-sm text-muted">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-1.5 font-medium">
                <Award className="w-4 h-4 text-primary" />
                <span>Role:</span>
              </span>
              <span className="font-semibold text-foreground bg-primary/10 text-primary px-2.5 py-0.5 rounded-full capitalize text-xs">
                {profile?.role || 'citizen'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-1.5 font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Joined:</span>
              </span>
              <span className="text-foreground text-xs font-semibold">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="md:col-span-2 bg-card border border-border/40 p-6 sm:p-8 rounded-3xl shadow-xl shadow-foreground/[0.005]">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">Edit Details</h3>
            
            {statusMsg.text && (
              <div
                className={`p-4 rounded-xl text-sm flex items-start space-x-2 border ${
                  statusMsg.type === 'error'
                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                    : 'bg-green-500/10 border-green-500/20 text-green-500'
                }`}
              >
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{statusMsg.text}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{updating ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
