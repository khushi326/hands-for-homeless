'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Heart, User as UserIcon, LogOut, Compass, Shield, MapPin } from 'lucide-react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/logo.jpeg" alt="HFH Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground leading-tight">
                  Hands For <span className="text-primary font-extrabold">Homeless</span>
                </span>
                <span className="text-[10px] text-muted tracking-widest uppercase font-semibold">
                  Sipheron Initiative
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-border/20 transition-all focus:outline-none">
                    <UserIcon className="w-4 h-4 text-primary" />
                    <span className="max-w-[120px] truncate">
                      {profile?.full_name || user.email}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                      {profile?.role || 'citizen'}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-1 w-56 bg-card border border-border/40 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="p-2 space-y-1">
                      <Link href="/dashboard" className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                        Citizen Dashboard
                      </Link>
                      
                      {profile?.role === 'admin' && (
                        <Link href="/admin" className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-rose-500/10 hover:text-rose-600 rounded-lg transition-colors">
                          Admin Panel
                        </Link>
                      )}
                      
                      {profile?.role === 'volunteer' && (
                        <Link href="/volunteer" className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-green-500/10 hover:text-green-600 rounded-lg transition-colors">
                          Volunteer Dashboard
                        </Link>
                      )}
                      
                      <div className="h-px bg-border/40 my-1"></div>
                      
                      <Link href="/profile" className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                        Profile Settings
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center space-x-2 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-200"
                >
                  Get Involved
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-foreground hover:bg-border/20 transition-all focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/5 font-semibold'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border/40 pt-4 mt-4 px-4 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 py-2 text-base font-medium text-primary"
                  >
                    <Compass className="w-5 h-5" />
                    <span>User Dashboard</span>
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 py-2 text-base font-medium text-rose-500"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  {profile?.role === 'volunteer' && (
                    <Link
                      href="/volunteer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 py-2 text-base font-medium text-green-500"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Volunteer Dashboard</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 py-2 text-base font-medium text-foreground"
                  >
                    <UserIcon className="w-5 h-5 text-muted" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex w-full items-center space-x-3 py-2 text-base font-medium text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl border border-border/60 text-sm font-medium text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-primary text-white text-sm font-medium shadow-md shadow-primary/20"
                  >
                    Get Involved
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
