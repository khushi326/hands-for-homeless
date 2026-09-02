'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAdminRequests, updateAdminRequestStatus } from '@/lib/api';
import { ArrowLeft, RefreshCw, ClipboardList, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  in_progress: 'bg-purple-500/10 text-purple-600',
  fulfilled: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-500',
};

export default function AdminRequests() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && profile && profile.role !== 'admin') router.push('/dashboard');
  }, [user, profile, authLoading, router]);

  const loadRequests = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const data = await fetchAdminRequests(session.access_token);
      setRequests(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (session) loadRequests(); }, [session]);

  const handleStatusChange = async (reqId: string, newStatus: string) => {
    if (!session?.access_token) return;
    setUpdating(reqId);
    setError('');
    setSuccess('');
    try {
      await updateAdminRequestStatus(reqId, newStatus, session.access_token);
      setSuccess('Request status updated!');
      await loadRequests();
    } catch (e: any) {
      setError(e.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter((r: any) => r.status === filter);

  if (authLoading || !user) {
    return <div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <Link href="/admin" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-hover mb-4">
          <ArrowLeft className="w-4 h-4" /><span>Back to Admin</span>
        </Link>
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-6 h-6 text-purple-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Requests Management</h1>
        </div>
        <p className="text-sm text-muted mt-1">View and manage all assistance requests from users.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'in_progress', 'fulfilled', 'cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${filter === f ? 'bg-primary text-white border-primary' : 'border-border/60 text-muted hover:border-primary/40'}`}>
            {f === 'all' ? `All (${requests.length})` : `${f.replace('_', ' ')} (${requests.filter((r: any) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /><span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-muted py-12">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((r: any) => (
            <div key={r.id} className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground capitalize">{r.type}: <span className="font-normal text-muted">{r.description}</span></p>
                <p className="text-xs text-muted flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{r.location_address}</span></p>
                <p className="text-[10px] text-muted">ID: {r.id?.slice(0, 8)}... | {new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${r.urgency === 'high' ? 'bg-red-500/10 text-red-500' : r.urgency === 'medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'}`}>{r.urgency}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[r.status] || 'bg-gray-500/10 text-gray-500'}`}>{r.status?.replace('_', ' ')}</span>
                <select value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)} disabled={updating === r.id}
                  className="px-3 py-1.5 rounded-lg border border-border/60 bg-card text-xs focus:outline-none focus:border-primary/80 transition-all disabled:opacity-50">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
