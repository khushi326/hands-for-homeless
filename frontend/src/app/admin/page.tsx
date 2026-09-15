'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAdminStats } from '@/lib/api';
import { RefreshCw, Users, FileText, Heart, Megaphone, ClipboardList, Shield, ArrowRight, User, LogOut, BarChart3, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile, session, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

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
    { label: 'User Management', desc: 'View all users, change roles & permissions', href: '/admin/users', icon: Users, color: 'border-blue-500/20 hover:border-blue-500' },
    { label: 'Volunteer Management', desc: 'Manage registered volunteers & field network', href: '/admin/users', icon: Shield, color: 'border-teal-500/20 hover:border-teal-500' },
    { label: 'Case Management & Assignments', desc: 'View reports, assign volunteers & update status', href: '/admin/cases', icon: FileText, color: 'border-amber-500/20 hover:border-amber-500' },
    { label: 'Requests Management', desc: 'Track & fulfill citizen assistance requests', href: '/admin/requests', icon: ClipboardList, color: 'border-purple-500/20 hover:border-purple-500' },
    { label: 'Donations Management', desc: 'Monitor monetary funds & item collections', href: '/admin/donations', icon: Heart, color: 'border-green-500/20 hover:border-green-500' },
    { label: 'Campaign Management', desc: 'Create, launch & monitor fundraising drives', href: '/admin/campaigns', icon: Megaphone, color: 'border-rose-500/20 hover:border-rose-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500/10 via-background to-purple-500/10 border border-rose-500/20 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl shadow-foreground/[0.005]">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-7 h-7 text-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-sm text-muted">
            Welcome, <span className="font-semibold text-foreground">{profile?.full_name}</span> &mdash; Central platform control, cases, volunteers, and reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/profile"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-border/20 text-sm font-semibold text-foreground transition-all shadow-sm"
          >
            <User className="w-4 h-4 text-rose-500" />
            <span>My Profile</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-sm font-semibold text-red-500 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Basic Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span>Platform Key Metrics</span>
        </h3>
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
      </div>

      {/* Management Navigation Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Management Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navLinks.map((n) => (
            <Link key={n.label} href={n.href}
              className={`bg-card border-2 ${n.color} rounded-2xl p-6 flex items-center space-x-4 hover:-translate-y-0.5 transition-all shadow-sm`}>
              <n.icon className="w-6 h-6 text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground">{n.label}</h4>
                <p className="text-[11px] text-muted mt-0.5">{n.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Reports & Summary Section */}
      <div className="bg-card border border-border/40 rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Operational Reports & Status Summary</h3>
            <p className="text-xs text-muted mt-0.5">Real-time system overview and health check</p>
          </div>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All Systems Operational</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2 p-4 rounded-2xl bg-muted/20 border border-border/40">
            <p className="font-semibold text-foreground">User & Volunteer Coverage</p>
            <p className="text-xs text-muted leading-relaxed">
              Users registered across citizen, volunteer, and admin roles. Volunteers can accept pending cases immediately.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-muted/20 border border-border/40">
            <p className="font-semibold text-foreground">Case Resolution Rate</p>
            <p className="text-xs text-muted leading-relaxed">
              Reported homeless cases are tracked from Pending to Assigned and Resolved with timestamped audits.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-muted/20 border border-border/40">
            <p className="font-semibold text-foreground">Donation & Campaign Audits</p>
            <p className="text-xs text-muted leading-relaxed">
              Monetary funds and item collections are recorded and automatically update active campaign targets.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
