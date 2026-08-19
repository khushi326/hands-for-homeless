'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAllCases, updateCaseStatus } from '@/lib/api';
import { ArrowLeft, RefreshCw, FileText, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  assigned: 'bg-blue-500/10 text-blue-600',
  in_progress: 'bg-purple-500/10 text-purple-600',
  resolved: 'bg-green-500/10 text-green-600',
  closed: 'bg-gray-500/10 text-gray-500',
};

export default function AdminCases() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && profile && profile.role !== 'admin') router.push('/dashboard');
  }, [user, profile, authLoading, router]);

  const loadCases = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const data = await fetchAllCases(session.access_token);
      setCases(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (session) loadCases(); }, [session]);

  const handleStatusChange = async (caseId: string, newStatus: string) => {
    if (!session?.access_token) return;
    setUpdating(caseId);
    setError('');
    setSuccess('');
    try {
      await updateCaseStatus(caseId, newStatus, session.access_token);
      setSuccess('Case status updated!');
      await loadCases();
    } catch (e: any) {
      setError(e.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? cases : cases.filter((c: any) => c.status === filter);

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
          <FileText className="w-6 h-6 text-amber-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Case Management</h1>
        </div>
        <p className="text-sm text-muted mt-1">View and manage all reported cases.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'assigned', 'in_progress', 'resolved', 'closed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${filter === f ? 'bg-primary text-white border-primary' : 'border-border/60 text-muted hover:border-primary/40'}`}>
            {f === 'all' ? `All (${cases.length})` : `${f.replace('_', ' ')} (${cases.filter((c: any) => c.status === f).length})`}
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
        <p className="text-center text-sm text-muted py-12">No cases found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((c: any) => (
            <div key={c.id} className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{c.description}</p>
                <p className="text-xs text-muted flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{c.location_address}</span></p>
                {c.condition && <p className="text-xs text-muted">Condition: {c.condition}</p>}
                <p className="text-[10px] text-muted">ID: {c.id?.slice(0, 8)}... | {new Date(c.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[c.status] || 'bg-gray-500/10 text-gray-500'}`}>{c.status?.replace('_', ' ')}</span>
                <select value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value)} disabled={updating === c.id}
                  className="px-3 py-1.5 rounded-lg border border-border/60 bg-card text-xs focus:outline-none focus:border-primary/80 transition-all disabled:opacity-50">
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
