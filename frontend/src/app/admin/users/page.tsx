'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAllUsers, updateUserRole } from '@/lib/api';
import { ArrowLeft, RefreshCw, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

const roleColor: Record<string, string> = {
  citizen: 'bg-gray-500/10 text-gray-500',
  volunteer: 'bg-blue-500/10 text-blue-600',
  ngo: 'bg-purple-500/10 text-purple-600',
  admin: 'bg-rose-500/10 text-rose-500',
};

export default function AdminUsers() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && profile && profile.role !== 'admin') router.push('/dashboard');
  }, [user, profile, authLoading, router]);

  const loadUsers = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const data = await fetchAllUsers(session.access_token);
      setUsers(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (session) loadUsers(); }, [session]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!session?.access_token) return;
    setUpdating(userId);
    setError('');
    setSuccess('');
    try {
      await updateUserRole(userId, newRole, session.access_token);
      setSuccess('Role updated successfully!');
      await loadUsers();
    } catch (e: any) {
      setError(e.message || 'Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

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
          <Users className="w-6 h-6 text-blue-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">User Management</h1>
        </div>
        <p className="text-sm text-muted mt-1">View all registered users and manage their roles.</p>
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
      ) : (
        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-background/50">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted">Name</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted">Email</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted">Role</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted">Joined</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-border/20 hover:bg-background/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground">{u.full_name || '—'}</td>
                    <td className="px-5 py-4 text-muted">{u.email || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${roleColor[u.role] || 'bg-gray-500/10 text-gray-500'}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4 text-muted text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4">
                      <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} disabled={updating === u.id}
                        className="px-3 py-1.5 rounded-lg border border-border/60 bg-card text-xs focus:outline-none focus:border-primary/80 transition-all disabled:opacity-50">
                        <option value="citizen">Citizen</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="ngo">NGO</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && <p className="text-center text-sm text-muted py-10">No users found.</p>}
        </div>
      )}
    </div>
  );
}
