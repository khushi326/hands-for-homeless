'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAllDonations } from '@/lib/api';
import { ArrowLeft, RefreshCw, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  completed: 'bg-green-500/10 text-green-600',
  failed: 'bg-red-500/10 text-red-500',
  pending_pickup: 'bg-amber-500/10 text-amber-600',
  picked_up: 'bg-blue-500/10 text-blue-600',
  distributed: 'bg-green-500/10 text-green-600',
};

export default function AdminDonations() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'monetary' | 'item'>('all');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && profile && profile.role !== 'admin') router.push('/dashboard');
  }, [user, profile, authLoading, router]);

  const loadDonations = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const data = await fetchAllDonations(session.access_token);
      setDonations(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) loadDonations();
  }, [session]);

  const filtered = filter === 'all' 
    ? donations 
    : donations.filter((d: any) => d.donation_type === filter);

  const totalAmount = donations
    .filter((d: any) => d.donation_type === 'monetary')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <Link href="/admin" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-hover mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin</span>
        </Link>
        <div className="flex items-center space-x-3">
          <Heart className="w-6 h-6 text-green-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Donations Management</h1>
        </div>
        <p className="text-sm text-muted mt-1">Monitor financial and item contributions across the platform.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-muted font-semibold uppercase">Total Monetary Contributions</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-muted font-semibold uppercase">Total Donations Count</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{donations.length}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-muted font-semibold uppercase">Item Donations</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">
            {donations.filter(d => d.donation_type === 'item').length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-border/40 pb-2">
        {(['all', 'monetary', 'item'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              filter === f ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground hover:bg-border/20'
            }`}
          >
            {f === 'all' ? 'All Donations' : f === 'monetary' ? 'Monetary' : 'Items'}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border/40 rounded-3xl p-12 text-center">
          <p className="text-sm text-muted">No donations found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((d: any) => (
            <div key={d.id} className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.donation_type === 'monetary' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
                    {d.donation_type}
                  </span>
                  <span className="text-xs text-muted">ID: {d.id?.slice(0, 8)}...</span>
                </div>
                <p className="text-base font-bold text-foreground mt-1">
                  {d.donation_type === 'monetary' ? `₹${Number(d.amount)?.toLocaleString('en-IN')}` : `${d.item_name || 'Item'} (${d.item_category || 'General'})`}
                </p>
                {d.pickup_address && (
                  <p className="text-xs text-muted">Pickup: {d.pickup_address}</p>
                )}
                {d.item_quantity && (
                  <p className="text-xs text-muted">Quantity: {d.item_quantity}</p>
                )}
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[d.status] || 'bg-gray-500/10 text-gray-500'}`}>
                  {d.status?.replace('_', ' ')}
                </span>
                <span className="text-xs text-muted">
                  {new Date(d.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
