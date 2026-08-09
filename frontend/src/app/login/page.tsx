'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, KeyRound, Mail, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

function LoginForm() {
  const { user, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to profile dashboard
    if (user) {
      router.push('/profile');
    }
    // Check if redirecting from password reset email
    if (searchParams.get('recovery') === 'true') {
      setSuccessMsg('Verification link confirmed. You can now login.');
    }
  }, [user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setErrorMsg(error.message || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-card border border-border/40 p-8 sm:p-12 rounded-3xl shadow-xl shadow-foreground/[0.01]">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome Back
        </h2>
        <p className="text-sm text-muted">
          Sign in to access your HFH dashboard
        </p>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary hover:text-primary-hover"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
        </button>
      </form>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-bold text-primary hover:text-primary-hover"
          >
            Sign Up
          </Link>
        </p>
      </div>

    </div>
  );
}

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="max-w-md w-full p-8 sm:p-12 rounded-3xl border border-border/40 bg-card text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted font-medium">Loading sign-in interface...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
