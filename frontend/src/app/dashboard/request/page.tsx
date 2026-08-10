'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createAssistanceRequest } from '@/lib/api';
import { ArrowLeft, Send, AlertCircle, CheckCircle2, RefreshCw, HelpCircle } from 'lucide-react';

export default function RequestAssistance() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();

  const [reqType, setReqType] = useState('');
  const [description, setDescription] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!reqType || !description || !locationAddress) {
      setErrorMsg('Type, Description, and Location are required.');
      return;
    }
    if (!session?.access_token) {
      setErrorMsg('Session expired. Please log in again.');
      return;
    }
    setLoading(true);
    try {
      await createAssistanceRequest({ type: reqType, description, location_address: locationAddress, urgency }, session.access_token);
      setSuccessMsg('Assistance request submitted! A volunteer will be assigned shortly.');
      setReqType('');
      setDescription('');
      setLocationAddress('');
      setUrgency('medium');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <Link href="/dashboard" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-hover mb-4">
          <ArrowLeft className="w-4 h-4" /><span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Request Assistance</h1>
        <p className="text-sm text-muted mt-1">Tell us what kind of help is needed and where.</p>
      </div>

      <div className="bg-card border border-border/40 p-8 sm:p-12 rounded-3xl shadow-xl shadow-foreground/[0.01]">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /><span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="type" className="text-xs font-semibold uppercase tracking-wider text-muted">Request Type *</label>
            <select id="type" required value={reqType} onChange={(e) => setReqType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all">
              <option value="">Select type of assistance</option>
              <option value="food">Food</option>
              <option value="clothing">Clothing</option>
              <option value="hygiene">Hygiene Products</option>
              <option value="blankets">Blankets</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="desc" className="text-xs font-semibold uppercase tracking-wider text-muted">Description *</label>
            <textarea id="desc" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what is needed and the number of people affected..."
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all resize-none" />
          </div>

          <div className="space-y-2">
            <label htmlFor="loc" className="text-xs font-semibold uppercase tracking-wider text-muted">Location Address *</label>
            <input id="loc" type="text" required value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} placeholder="Street address, landmark, or area"
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all" />
          </div>

          <div className="space-y-2">
            <label htmlFor="urgency" className="text-xs font-semibold uppercase tracking-wider text-muted">Urgency Level</label>
            <select id="urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High — Immediate attention needed</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50">
            <Send className="w-4 h-4" /><span>{loading ? 'Submitting...' : 'Submit Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
