'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchMyAssignments, updateAssignment } from '@/lib/api';
import { ArrowLeft, RefreshCw, MapPin, CheckCircle2, AlertCircle, Play, XCircle, Send } from 'lucide-react';

const statusColor: Record<string, string> = {
  accepted: 'bg-blue-500/10 text-blue-600',
  in_progress: 'bg-purple-500/10 text-purple-600',
  completed: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-500',
};

const statusOptions = [
  { value: 'in_progress', label: 'Mark In Progress', icon: Play, color: 'bg-purple-500 hover:bg-purple-600' },
  { value: 'completed', label: 'Mark Completed', icon: CheckCircle2, color: 'bg-green-500 hover:bg-green-600' },
  { value: 'cancelled', label: 'Cancel', icon: XCircle, color: 'bg-red-500 hover:bg-red-600' },
];

function AssignmentsContent() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && profile && profile.role !== 'volunteer' && profile.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, profile, authLoading, router]);

  const loadData = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const data = await fetchMyAssignments(session.access_token);
      setAssignments(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  const handleUpdate = async (assignmentId: string, newStatus: string) => {
    if (!session?.access_token) return;
    setUpdating(assignmentId);
    setError('');
    setSuccess('');
    try {
      await updateAssignment(assignmentId, { status: newStatus, notes: notes[assignmentId] || '' }, session.access_token);
      setSuccess(`Assignment updated to "${newStatus.replace('_', ' ')}"`);
      await loadData();
    } catch (e: any) {
      setError(e.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <Link href="/volunteer" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-hover mb-4">
          <ArrowLeft className="w-4 h-4" /><span>Back to Volunteer Dashboard</span>
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Assignments</h1>
        <p className="text-sm text-muted mt-1">View details and update the status of your assigned cases.</p>
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
      ) : assignments.length === 0 ? (
        <div className="bg-card border border-border/40 rounded-3xl p-12 text-center">
          <p className="text-sm text-muted">No assignments found. Accept a case from the volunteer dashboard first.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map((a: any) => (
            <div key={a.id} className={`bg-card border rounded-2xl p-6 space-y-4 transition-all ${highlightId === a.id ? 'border-primary/60 shadow-lg shadow-primary/10' : 'border-border/40'}`}>
              {/* Case Info */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <p className="text-base font-bold text-foreground">{a.cases?.description || 'No description'}</p>
                  <p className="text-xs text-muted flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{a.cases?.location_address || '—'}</span></p>
                  {a.cases?.condition && <p className="text-xs text-muted">Condition: <span className="font-medium text-foreground">{a.cases.condition}</span></p>}
                  {a.cases?.photo_url && (
                    <img src={a.cases.photo_url} alt="Case photo" className="mt-2 rounded-xl max-h-48 object-cover border border-border/40" />
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColor[a.status] || 'bg-gray-500/10 text-gray-500'}`}>{a.status?.replace('_', ' ')}</span>
                  <span className="text-[10px] text-muted">{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Update Actions */}
              {a.status !== 'completed' && a.status !== 'cancelled' && (
                <div className="border-t border-border/30 pt-4 space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted">Notes (optional)</label>
                    <textarea rows={2} value={notes[a.id] || ''} onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })}
                      placeholder="Add progress notes..."
                      className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all resize-none" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions
                      .filter((opt) => {
                        if (a.status === 'accepted') return opt.value !== 'cancelled' || true;
                        if (a.status === 'in_progress') return opt.value !== 'in_progress';
                        return true;
                      })
                      .map((opt) => (
                        <button key={opt.value} onClick={() => handleUpdate(a.id, opt.value)} disabled={updating === a.id}
                          className={`${opt.color} text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50`}>
                          <opt.icon className="w-3.5 h-3.5" /><span>{updating === a.id ? 'Updating...' : opt.label}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>}>
      <AssignmentsContent />
    </Suspense>
  );
}
