'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { Map, RefreshCw, MapPin, AlertCircle, Filter } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Dynamically import map to avoid SSR issues
const CasesMap = dynamic(() => import('@/components/CasesMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-card rounded-2xl">
      <div className="flex flex-col items-center space-y-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted">Loading map...</p>
      </div>
    </div>
  ),
});

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  pending:     { label: 'Pending',     color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', dot: 'bg-yellow-500' },
  assigned:    { label: 'Assigned',    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',       dot: 'bg-blue-500'   },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', dot: 'bg-purple-500' },
  resolved:    { label: 'Resolved',    color: 'bg-green-500/10 text-green-600 border-green-500/20',    dot: 'bg-green-500'  },
  closed:      { label: 'Closed',      color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',       dot: 'bg-gray-400'   },
};

export default function MapPage() {
  const { session } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      if (!session?.access_token) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/cases/all`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) throw new Error('Failed to load cases');
        const data = await res.json();
        setCases(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load cases');
      } finally {
        setLoading(false);
      }
    };
    if (session) load();
  }, [session]);

  const filtered = filter === 'all' ? cases : cases.filter((c: any) => c.status === filter);

  const counts: Record<string, number> = {};
  cases.forEach((c: any) => { counts[c.status] = (counts[c.status] || 0) + 1; });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Map className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Live Case Map</h1>
            <p className="text-sm text-muted">Track all reported cases across locations in real-time</p>
          </div>
        </div>
        <Link href="/admin/cases" className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-hover transition-all">
          <span>→ Manage Cases</span>
        </Link>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
            ${filter === 'all' ? 'bg-primary text-white border-primary' : 'border-border/60 text-muted hover:border-primary/40'}`}>
          <Filter className="w-3 h-3" />
          <span>All ({cases.length})</span>
        </button>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
              ${filter === key ? cfg.color + ' border-current' : 'border-border/60 text-muted hover:border-primary/40'}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span>{cfg.label} ({counts[key] || 0})</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* Map + Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-4" style={{ height: '580px' }}>
        {/* Map */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-border/40 shadow-md bg-card" style={{ minHeight: '400px' }}>
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-primary animate-spin" />
            </div>
          ) : (
            <CasesMap cases={filtered} />
          )}
        </div>

        {/* Cases Sidebar */}
        <div className="lg:w-80 flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40 bg-card">
            <p className="text-sm font-semibold text-foreground">
              {filtered.length} Case{filtered.length !== 1 ? 's' : ''} Shown
            </p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/30">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-muted py-10">No cases found.</p>
            ) : (
              filtered.map((c: any) => {
                const cfg = statusConfig[c.status] || statusConfig.closed;
                return (
                  <div key={c.id} className="p-3 hover:bg-border/10 transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-foreground line-clamp-2 flex-1">{c.description}</p>
                      <span className={`shrink-0 flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span>{cfg.label}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-muted flex items-center space-x-1">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{c.location_address}</span>
                    </p>
                    <p className="text-[10px] text-muted/70 mt-0.5">{new Date(c.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Info note */}
      <p className="text-xs text-muted text-center">
        📍 Cases without exact GPS coordinates are shown with approximate North India locations for demonstration.
      </p>
    </div>
  );
}
