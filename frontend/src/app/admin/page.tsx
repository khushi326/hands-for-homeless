'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAdminStats } from '@/lib/api';
import { RefreshCw, Users, FileText, Heart, Megaphone, ClipboardList, Shield, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && profile && profile.role !== 'admin') router.push('/dashboard');
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    async function load() {
      if (!session?.access_token) return;
      try {
        const data = await fetchAdminStats(session.access_token);
        setStats(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    if (session) load();
  }, [session]);

  if (authLoading || !user || !profile) {
    return <div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats?.total_users ?? '—', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Cases', value: stats?.total_cases ?? '—', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Donations (₹)', value: stats ? `₹${stats.total_donations_amount?.toLocaleString('en-IN')}` : '—', icon: Heart, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Requests', value: stats?.total_requests ?? '—', icon: ClipboardList, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Active Campaigns', value: stats?.active_campaigns ?? '—', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const navLinks = [
    { label: 'User Management', desc: 'View all users, change roles', href: '/admin/users', icon: Users, color: 'border-blue-500/20 hover:border-blue-500' },
    { label: 'Case Management', desc: 'View all cases, update status', href: '/admin/cases', icon: FileText, color: 'border-amber-500/20 hover:border-amber-500' },
    { label: 'Campaign Management', desc: 'Create & manage campaigns', href: '/admin/campaigns', icon: Megaphone, color: 'border-rose-500/20 hover:border-rose-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500/10 to-purple-500/10 border border-rose-500/10 rounded-3xl p-8 sm:p-10">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-7 h-7 text-rose-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-muted">
          Welcome, <span className="font-semibold text-foreground">{profile?.full_name}</span> &mdash; Manage the entire platform from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card border border-border/40 rounded-2xl p-5 text-center shadow-lg shadow-foreground/[0.005]">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-extrabold text-foreground">{loading ? '—' : s.value}</p>
            <p className="text-[11px] text-muted font-medium uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {navLinks.map((n) => (
          <Link key={n.href} href={n.href}
            className={`bg-card border-2 ${n.color} rounded-2xl p-6 flex items-center space-x-4 hover:-translate-y-0.5 transition-all`}>
            <n.icon className="w-6 h-6 text-muted shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-foreground">{n.label}</h4>
              <p className="text-[11px] text-muted">{n.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
