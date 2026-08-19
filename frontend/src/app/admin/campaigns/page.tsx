'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchCampaigns, createCampaign, updateCampaign } from '@/lib/api';
import { ArrowLeft, RefreshCw, Megaphone, Plus, TrendingUp, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function AdminCampaigns() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && profile && profile.role !== 'admin') router.push('/dashboard');
  }, [user, profile, authLoading, router]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { loadCampaigns(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token || !title || !targetAmount) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await createCampaign({ title, description, target_amount: parseFloat(targetAmount) }, session.access_token);
      setSuccess('Campaign created successfully!');
      setTitle('');
      setDescription('');
      setTargetAmount('');
      setShowForm(false);
      await loadCampaigns();
    } catch (e: any) {
      setError(e.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (campaignId: string, currentStatus: string) => {
    if (!session?.access_token) return;
    setUpdating(campaignId);
    setError('');
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await updateCampaign(campaignId, { status: newStatus }, session.access_token);
      setSuccess(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'}!`);
      await loadCampaigns();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUpdating(null);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-hover mb-4">
            <ArrowLeft className="w-4 h-4" /><span>Back to Admin</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Megaphone className="w-6 h-6 text-rose-500" />
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Campaign Management</h1>
          </div>
          <p className="text-sm text-muted mt-1">Create and manage fundraising campaigns.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 flex items-center space-x-1.5 transition-all">
          {showForm ? <><X className="w-3.5 h-3.5" /><span>Cancel</span></> : <><Plus className="w-3.5 h-3.5" /><span>New Campaign</span></>}
        </button>
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

      {/* Create Form */}
      {showForm && (
        <div className="bg-card border border-border/40 rounded-2xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-base font-bold text-foreground mb-5">Create New Campaign</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Campaign Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Winter Blanket Drive 2026"
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the campaign goal and impact..."
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Target Amount (₹) *</label>
              <input type="number" min="1" required value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="50000"
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all" />
            </div>
            <button type="submit" disabled={submitting}
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 flex items-center space-x-2 transition-all disabled:opacity-50">
              <Plus className="w-4 h-4" /><span>{submitting ? 'Creating...' : 'Create Campaign'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>
      ) : campaigns.length === 0 ? (
        <div className="bg-card border border-border/40 rounded-3xl p-12 text-center">
          <Megaphone className="w-10 h-10 text-primary/20 mx-auto mb-3" />
          <p className="text-sm text-muted">No campaigns yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c: any) => {
            const progress = c.target_amount ? Math.min(100, Math.round((c.current_amount || 0) / c.target_amount * 100)) : 0;
            return (
              <div key={c.id} className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base font-bold text-foreground">{c.title}</h3>
                    {c.description && <p className="text-xs text-muted line-clamp-2">{c.description}</p>}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-500'}`}>{c.status}</span>
                    <button onClick={() => handleToggleStatus(c.id, c.status)} disabled={updating === c.id}
                      className="px-3 py-1.5 rounded-lg border border-border/60 text-xs font-semibold text-muted hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-50">
                      {updating === c.id ? '...' : c.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">₹{(c.current_amount || 0).toLocaleString('en-IN')} raised</span>
                    <span className="font-semibold text-foreground">₹{(c.target_amount || 0).toLocaleString('en-IN')} goal</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] text-muted">
                    <TrendingUp className="w-3 h-3" /><span>{progress}% funded</span>
                    <span className="ml-2">| Created: {new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
