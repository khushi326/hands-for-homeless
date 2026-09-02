'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchMyCases, fetchMyRequests, fetchMyDonations } from '@/lib/api';
import { MapPin, HelpCircle, Heart, FileText, RefreshCw, ClipboardList, ArrowRight, AlertCircle } from 'lucide-react';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  assigned: 'bg-blue-500/10 text-blue-600',
  accepted: 'bg-blue-500/10 text-blue-600',
  in_progress: 'bg-purple-500/10 text-purple-600',
  resolved: 'bg-green-500/10 text-green-600',
  completed: 'bg-green-500/10 text-green-600',
  closed: 'bg-gray-500/10 text-gray-500',
  cancelled: 'bg-red-500/10 text-red-500',
  failed: 'bg-red-500/10 text-red-500',
  pending_pickup: 'bg-amber-500/10 text-amber-600',
  picked_up: 'bg-blue-500/10 text-blue-600',
  distributed: 'bg-green-500/10 text-green-600',
};

export default function Dashboard() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'requests' | 'donations'>('reports');
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadData() {
      if (!session?.access_token) return;
      setDataLoading(true);
      try {
        const [c, r, d] = await Promise.all([
          fetchMyCases(session.access_token).catch(() => []),
          fetchMyRequests(session.access_token).catch(() => []),
          fetchMyDonations(session.access_token).catch(() => []),
        ]);
        setCases(c);
        setRequests(r);
        setDonations(d);
      } catch (e: any) {
        setError(e.message || 'Failed to load data');
      } finally {
        setDataLoading(false);
      }
    }
    if (session) loadData();
  }, [session]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: 'reports' as const, label: 'My Reports', count: cases.length },
    { key: 'requests' as const, label: 'My Requests', count: requests.length },
    { key: 'donations' as const, label: 'My Donations', count: donations.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-10">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/10 rounded-3xl p-8 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, <span className="text-primary">{profile?.full_name || 'User'}</span>
        </h1>
        <p className="text-sm text-muted mt-2">
          Role: <span className="font-semibold text-foreground capitalize">{profile?.role || 'citizen'}</span> &mdash; Use your dashboard to report, request, and track impact.
        </p>
      </div>

      {/* Stats + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Stat Cards */}
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          {[
            { label: 'Reports', value: cases.length, icon: FileText },
            { label: 'Requests', value: requests.length, icon: ClipboardList },
            { label: 'Donations', value: donations.length, icon: Heart },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border/40 rounded-2xl p-5 text-center shadow-lg shadow-foreground/[0.005]">
              <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-foreground">{dataLoading ? '—' : s.value}</p>
              <p className="text-[11px] text-muted font-medium uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Action Tiles */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
          <Link href="/dashboard/report" className="bg-card border-2 border-primary/20 hover:border-primary rounded-2xl p-5 flex items-center space-x-4 hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0"><MapPin className="w-5 h-5" /></div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-foreground">Report Homeless Person</h4>
              <p className="text-[11px] text-muted">Submit location, photos & details</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted" />
          </Link>
          <Link href="/dashboard/request" className="bg-card border-2 border-amber-500/20 hover:border-amber-500 rounded-2xl p-5 flex items-center space-x-4 hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/5 text-amber-500 flex items-center justify-center shrink-0"><HelpCircle className="w-5 h-5" /></div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-foreground">Request Assistance</h4>
              <p className="text-[11px] text-muted">Food, shelter, clothing & more</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div>
        <div className="flex space-x-1 border-b border-border/40">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-5 py-3 text-sm font-medium transition-all ${activeTab === t.key ? 'border-b-2 border-primary text-primary' : 'text-muted hover:text-foreground'}`}>
              {t.label} <span className="ml-1 text-xs opacity-70">({t.count})</span>
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {dataLoading ? (
            <div className="flex items-center justify-center py-16"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>
          ) : (
            <>
              {activeTab === 'reports' && (cases.length === 0 ? (
                <p className="text-center text-sm text-muted py-12">You haven&apos;t reported any cases yet.</p>
              ) : cases.map((c: any) => (
                <div key={c.id} className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.description}</p>
                    <p className="text-xs text-muted flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{c.location_address}</span></p>
                    {c.photo_url && (
                      <div className="mt-2">
                        <img src={c.photo_url} alt="Case photo" className="w-full max-w-[120px] h-auto rounded-lg border border-border/40 object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[c.status] || 'bg-gray-500/10 text-gray-500'}`}>{c.status?.replace('_', ' ')}</span>
                    <span className="text-[10px] text-muted">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )))}

              {activeTab === 'requests' && (requests.length === 0 ? (
                <p className="text-center text-sm text-muted py-12">You haven&apos;t made any assistance requests yet.</p>
              ) : requests.map((r: any) => (
                <div key={r.id} className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground capitalize">{r.type}: <span className="font-normal text-muted">{r.description}</span></p>
                    <p className="text-xs text-muted">{r.location_address}</p>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${r.urgency === 'high' ? 'bg-red-500/10 text-red-500' : r.urgency === 'medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'}`}>{r.urgency}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[r.status] || 'bg-gray-500/10 text-gray-500'}`}>{r.status?.replace('_', ' ')}</span>
                    <span className="text-[10px] text-muted">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )))}

              {activeTab === 'donations' && (donations.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-10 h-10 text-primary/20 mx-auto" />
                  <p className="text-sm text-muted">No donations yet. Your generosity can make a difference!</p>
                  <Link href="/dashboard/donations" className="text-xs font-semibold text-primary hover:text-primary-hover">View Donation Options →</Link>
                </div>
              ) : donations.map((d: any) => (
                <div key={d.id} className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.donation_type === 'monetary' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>{d.donation_type}</span>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {d.donation_type === 'monetary' ? `₹${d.amount}` : `${d.item_name} (${d.item_category})`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[d.status] || 'bg-gray-500/10 text-gray-500'}`}>{d.status?.replace('_', ' ')}</span>
                    <span className="text-[10px] text-muted">{new Date(d.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
