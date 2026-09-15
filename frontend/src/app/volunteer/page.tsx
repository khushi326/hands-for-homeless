'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAvailableCases, acceptCase, fetchMyAssignments } from '@/lib/api';
import { RefreshCw, MapPin, CheckCircle2, Clock, AlertCircle, Users, ClipboardList, ArrowRight, Shield, User, LogOut, Play, Check } from 'lucide-react';
import { updateAssignment } from '@/lib/api';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  assigned: 'bg-blue-500/10 text-blue-600',
  accepted: 'bg-blue-500/10 text-blue-600',
  in_progress: 'bg-purple-500/10 text-purple-600',
  completed: 'bg-green-500/10 text-green-600',
  resolved: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-500',
};

export default function VolunteerDashboard() {
  const { user, profile, session, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [availableCases, setAvailableCases] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'assignments' | 'available'>('assignments');

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

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
      const [cases, assigns] = await Promise.all([
        fetchAvailableCases(session.access_token).catch(() => []),
        fetchMyAssignments(session.access_token).catch(() => []),
      ]);
      setAvailableCases(cases);
      setAssignments(assigns);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  const handleAcceptCase = async (caseId: string) => {
    if (!session?.access_token) return;
    setAccepting(caseId);
    setError('');
    setSuccess('');
    try {
      await acceptCase(caseId, session.access_token);
      setSuccess('Case accepted! It has been added to your assignments.');
      await loadData();
    } catch (e: any) {
      setError(e.message || 'Failed to accept case');
    } finally {
      setAccepting(null);
    }
  };

  const handleQuickStatusUpdate = async (assignmentId: string, newStatus: string) => {
    if (!session?.access_token) return;
    setUpdatingId(assignmentId);
    setError('');
    setSuccess('');
    try {
      await updateAssignment(assignmentId, { status: newStatus }, session.access_token);
      setSuccess(`Assignment status updated to "${newStatus.replace('_', ' ')}"!`);
      await loadData();
    } catch (e: any) {
      setError(e.message || 'Failed to update assignment status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  const activeCases = assignments.filter((a: any) => a.status !== 'completed' && a.status !== 'cancelled');
  const completedCases = assignments.filter((a: any) => a.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-background to-primary/10 border border-blue-500/20 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl shadow-foreground/[0.005]">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-7 h-7 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Volunteer Dashboard</h1>
          </div>
          <p className="text-sm text-muted">
            Welcome, <span className="font-semibold text-foreground">{profile?.full_name || 'Volunteer'}</span> &mdash; Accept cases, attend assignments, and update status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/profile"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-border/20 text-sm font-semibold text-foreground transition-all shadow-sm"
          >
            <User className="w-4 h-4 text-blue-500" />
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Assignments', value: assignments.length, icon: ClipboardList, color: 'text-blue-500' },
          { label: 'Active Cases', value: activeCases.length, icon: Clock, color: 'text-amber-500' },
          { label: 'Completed', value: completedCases.length, icon: CheckCircle2, color: 'text-green-500' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/40 rounded-2xl p-5 text-center shadow-lg shadow-foreground/[0.005]">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
            <p className="text-2xl font-extrabold text-foreground">{loading ? '—' : s.value}</p>
            <p className="text-[11px] text-muted font-medium uppercase tracking-wider mt-1">{s.label}</p>
          </div>
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

      {/* Tabs */}
      <div>
        <div className="flex space-x-1 border-b border-border/40">
          <button onClick={() => setActiveTab('assignments')}
            className={`px-5 py-3 text-sm font-medium transition-all ${activeTab === 'assignments' ? 'border-b-2 border-primary text-primary' : 'text-muted hover:text-foreground'}`}>
            My Assignments <span className="ml-1 text-xs opacity-70">({assignments.length})</span>
          </button>
          <button onClick={() => setActiveTab('available')}
            className={`px-5 py-3 text-sm font-medium transition-all ${activeTab === 'available' ? 'border-b-2 border-primary text-primary' : 'text-muted hover:text-foreground'}`}>
            Available Cases <span className="ml-1 text-xs opacity-70">({availableCases.length})</span>
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>
          ) : activeTab === 'assignments' ? (
            assignments.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Users className="w-10 h-10 text-primary/20 mx-auto" />
                <p className="text-sm text-muted">No assignments yet. Go to &quot;Available Cases&quot; to accept one!</p>
              </div>
            ) : assignments.map((a: any) => (
              <div key={a.id} className="bg-card border border-border/40 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{a.cases?.description || 'Case details loading...'}</p>
                    <p className="text-xs text-muted flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{a.cases?.location_address || '—'}</span></p>
                    {a.cases?.condition && <p className="text-xs text-muted">Condition: {a.cases.condition}</p>}
                    {a.cases?.photo_url && (
                      <div className="mt-2">
                        <img src={a.cases.photo_url} alt="Case photo" className="w-full max-w-[120px] h-auto rounded-lg border border-border/40 object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[a.status] || 'bg-gray-500/10 text-gray-500'}`}>{a.status?.replace('_', ' ')}</span>
                    <span className="text-[10px] text-muted">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {a.status !== 'completed' && a.status !== 'cancelled' && (
                  <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {a.status === 'accepted' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(a.id, 'in_progress')}
                          disabled={updatingId === a.id}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{updatingId === a.id ? 'Updating...' : 'Start (In Progress)'}</span>
                        </button>
                      )}

                      {a.status === 'in_progress' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(a.id, 'completed')}
                          disabled={updatingId === a.id}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{updatingId === a.id ? 'Completing...' : 'Mark Resolved / Completed'}</span>
                        </button>
                      )}
                    </div>

                    <Link href={`/volunteer/assignments?id=${a.id}`}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:text-primary-hover">
                      <span>Full Case Details & Notes</span><ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            availableCases.length === 0 ? (
              <p className="text-center text-sm text-muted py-12">No available cases at the moment. Check back later!</p>
            ) : availableCases.map((c: any) => (
              <div key={c.id} className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{c.description}</p>
                  <p className="text-xs text-muted flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{c.location_address}</span></p>
                  {c.condition && <p className="text-xs text-muted">Condition: {c.condition}</p>}
                  {c.photo_url && (
                    <div className="mt-2">
                      <img src={c.photo_url} alt="Case photo" className="w-full max-w-[120px] h-auto rounded-lg border border-border/40 object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[c.status]}`}>{c.status}</span>
                  <button onClick={() => handleAcceptCase(c.id)} disabled={accepting === c.id}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all disabled:opacity-50">
                    {accepting === c.id ? 'Accepting...' : 'Accept Case'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
