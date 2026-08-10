'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchMyDonations } from '@/lib/api';
import { ArrowLeft, Heart, RefreshCw, DollarSign, Package } from 'lucide-react';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  completed: 'bg-green-500/10 text-green-600',
  failed: 'bg-red-500/10 text-red-500',
  pending_pickup: 'bg-amber-500/10 text-amber-600',
  picked_up: 'bg-blue-500/10 text-blue-600',
  distributed: 'bg-green-500/10 text-green-600',
};

export default function MyDonations() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    async function load() {
      if (!session?.access_token) return;
      try {
        const data = await fetchMyDonations(session.access_token);
        setDonations(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    if (session) load();
  }, [session]);

  if (authLoading || !user) {
    return <div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <Link href="/dashboard" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-hover mb-4">
          <ArrowLeft className="w-4 h-4" /><span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Donations</h1>
        <p className="text-sm text-muted mt-1">Track the status of all your monetary and item contributions.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>
      ) : donations.length === 0 ? (
        <div className="bg-card border border-border/40 rounded-3xl p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-primary/20 mx-auto" />
          <h3 className="text-xl font-bold text-foreground">No Donations Yet</h3>
          <p className="text-sm text-muted max-w-md mx-auto">Your generosity can make a difference! When you make donations through campaigns or item contributions, they will appear here for tracking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((d: any) => (
            <div key={d.id} className="bg-card border border-border/40 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${d.donation_type === 'monetary' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
                  {d.donation_type === 'monetary' ? <DollarSign className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.donation_type === 'monetary' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>{d.donation_type}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {d.donation_type === 'monetary' ? `₹${parseFloat(d.amount).toLocaleString('en-IN')}` : `${d.item_name}`}
                    {d.donation_type === 'item' && d.item_quantity && <span className="text-muted font-normal"> × {d.item_quantity}</span>}
                  </p>
                  {d.donation_type === 'item' && d.item_category && (
                    <p className="text-xs text-muted capitalize">Category: {d.item_category}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[d.status] || 'bg-gray-500/10 text-gray-500'}`}>{d.status?.replace('_', ' ')}</span>
                <span className="text-[10px] text-muted">{new Date(d.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
