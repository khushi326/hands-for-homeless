'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, KeyRound, Mail, User as UserIcon, AlertCircle, CheckCircle2, RefreshCw, Shield, Info } from 'lucide-react';

function LoginForm() {
  const { user, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const getRedirectPath = (role?: string) => {
    if (role === 'admin') return '/admin';
    if (role === 'volunteer') return '/volunteer';
    return '/dashboard';
  };

  useEffect(() => {
    // If user is already logged in, redirect to role-specific dashboard
    if (user) {
      router.push(getRedirectPath(user.role));
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

    // Input Validations
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!cleanPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    const { data, error } = await signIn(cleanEmail, cleanPassword);

    if (error) {
      setErrorMsg('Invalid email or password. Please check your credentials.');
      setLoading(false);
    } else {
      const userRole = data?.user?.role;
      router.push(getRedirectPath(userRole));
    }
  };

  // Quick fill helper for demo evaluation
  const setDemoCredentials = (demoEmail: string, demoUsername: string) => {
    setEmail(demoEmail);
    setUsername(demoUsername);
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-card border border-border/40 p-8 sm:p-12 rounded-3xl shadow-xl shadow-foreground/[0.01]">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome Back
        </h2>
        <p className="text-sm text-muted">
          Sign in to access your HFH role dashboard
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          
          {/* Username (Optional / Profile Identifier) */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-muted">
              Username / Name <span className="text-[10px] text-muted font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or khushi"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted">
              Email Address <span className="text-red-500">*</span>
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

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted">
                Password <span className="text-red-500">*</span>
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

      {/* Demo Credentials Quick Switcher */}
      <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2.5">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-foreground">
          <Info className="w-3.5 h-3.5 text-primary" />
          <span>Quick Demo Logins (Password: admin123)</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setDemoCredentials('citizen@test.com', 'citizen')}
            className="p-2 rounded-lg bg-card border border-border/60 hover:border-primary text-center font-medium text-foreground transition-all"
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('volunteer@test.com', 'volunteer')}
            className="p-2 rounded-lg bg-card border border-border/60 hover:border-blue-500 text-center font-medium text-foreground transition-all"
          >
            Volunteer
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('admin@test.com', 'admin')}
            className="p-2 rounded-lg bg-card border border-border/60 hover:border-rose-500 text-center font-medium text-foreground transition-all"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-sm text-muted">
          Don&apos;t have an account?{' '}
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
