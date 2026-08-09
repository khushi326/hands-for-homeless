'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { UserPlus, User as UserIcon, Mail, Phone, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { user, signUp } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, {
      full_name: fullName,
      phone_number: phoneNumber || undefined,
      role,
    });

    if (error) {
      setErrorMsg(error.message || 'Failed to register. Please try again.');
      setLoading(false);
    } else {
      setSuccessMsg('Registration successful! Please check your email inbox to verify your account.');
      setLoading(false);
      // Clear fields
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('citizen');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card border border-border/40 p-8 sm:p-12 rounded-3xl shadow-xl shadow-foreground/[0.01]">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Create Account
          </h2>
          <p className="text-sm text-muted">
            Join Hands For Homeless and make an impact
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
            
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-muted">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-xs font-semibold uppercase tracking-wider text-muted">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted">
                I want to join as a
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
              >
                <option value="citizen">Citizen (Reporter)</option>
                <option value="volunteer">Volunteer (Responder)</option>
                <option value="donor">Donor (Financial/Item contributor)</option>
              </select>
            </div>

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
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
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
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-primary hover:text-primary-hover"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
