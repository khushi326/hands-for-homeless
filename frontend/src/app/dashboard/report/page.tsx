'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createCase } from '@/lib/api';
import { ArrowLeft, Upload, Send, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ReportCase() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [file, setFile] = useState<File | null>(null);
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
    if (!description || !locationAddress) {
      setErrorMsg('Description and Location are required.');
      return;
    }
    if (!session?.access_token) {
      setErrorMsg('Session expired. Please log in again.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('location_address', locationAddress);
      if (condition) formData.append('condition', condition);
      if (file) formData.append('photo', file);

      await createCase(formData, session.access_token);
      setSuccessMsg('Case reported successfully! Our team will review it shortly.');
      setDescription('');
      setCondition('');
      setLocationAddress('');
      setFile(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report.');
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
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Report Homeless Person</h1>
        <p className="text-sm text-muted mt-1">Provide location and details so volunteers can respond quickly.</p>
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
            <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted">Description *</label>
            <textarea id="description" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the person's situation, appearance, and any immediate needs..."
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all resize-none" />
          </div>

          <div className="space-y-2">
            <label htmlFor="condition" className="text-xs font-semibold uppercase tracking-wider text-muted">Condition</label>
            <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all">
              <option value="">Select condition (optional)</option>
              <option value="Needs medical attention">Needs medical attention</option>
              <option value="Cold weather exposure">Cold weather exposure</option>
              <option value="Malnourished">Malnourished</option>
              <option value="Needs shelter">Needs shelter</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider text-muted">Location Address *</label>
            <input id="location" type="text" required value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} placeholder="Street address, landmark, or area description"
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Photo (Optional)</label>
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/40 cursor-pointer transition-all">
              <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
              <p className="text-xs text-muted">{file ? file.name : 'Click to upload a photo of the location or person'}</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50">
            <Send className="w-4 h-4" /><span>{loading ? 'Submitting...' : 'Submit Report'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
