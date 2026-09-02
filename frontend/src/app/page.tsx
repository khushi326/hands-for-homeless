'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Shield, Users, MapPin, ArrowRight } from 'lucide-react';

export default function Home() {
  const stats = [
    { value: '1,200+', label: 'Assisted Individuals' },
    { value: '450+', label: 'Active Volunteers' },
    { value: '98%', label: 'Response Rate' },
    { value: '15+', label: 'Partner Shelters' },
  ];

  const coreCards = [
    {
      title: 'Report Homeless Individuals',
      description: 'Found someone in need of assistance? Report their location and condition to notify nearby volunteers instantly.',
      icon: MapPin,
      cta: 'Report Now',
      href: '/register',
      color: 'border-primary/20 hover:border-primary',
    },
    {
      title: 'Request Assistance',
      description: 'Are you or someone you know struggling? Request support for food, shelter, blankets, or medical aid.',
      icon: Shield,
      cta: 'Request Help',
      href: '/login',
      color: 'border-amber-500/20 hover:border-amber-500',
    },
    {
      title: 'Become a Volunteer',
      description: 'Be the boots on the ground. Accept cases in your area, coordinate with local centers, and deliver aid directly.',
      icon: Users,
      cta: 'Join Network',
      href: '/register',
      color: 'border-primary/20 hover:border-primary',
    },
  ];

  return (
    <div className="flex flex-col space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 opacity-50 blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase border border-primary/20 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Live Humanitarian Platform</span>
            </span>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Empowering <br />
              <span className="bg-gradient-to-r from-primary via-teal-400 to-amber-500 bg-clip-text text-transparent">
                Communities
              </span>
            </h1>
            
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed font-medium">
              Hands For Homeless (HFH) is a full-stack humanitarian ecosystem. Report cases, and coordinate volunteer efforts in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-hover shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.7)] hover:-translate-y-1 transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-border/80 text-foreground font-bold hover:bg-card hover:border-primary/50 hover:text-primary transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 shadow-xl shadow-foreground/[0.02]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Actions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Our Core Initiatives
          </h2>
          <p className="text-muted leading-relaxed">
            Choose how you want to make an impact. The platform simplifies coordination between reporter, responder, and donor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`bg-card border-2 ${card.color} rounded-3xl p-8 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 shadow-lg shadow-foreground/[0.01]`}
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="pt-8">
                  <Link
                    href={card.href}
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-hover"
                  >
                    <span>{card.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-primary to-amber-600 rounded-3xl p-8 sm:p-16 text-center text-white space-y-6 shadow-2xl shadow-primary/20 relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10">
            Ready to Make a Difference?
          </h2>
          <p className="max-w-xl mx-auto text-white/85 text-sm sm:text-base leading-relaxed relative z-10">
            Every report, donation, or volunteer hour contributes to giving someone back their dignity. Join Hands For Homeless today.
          </p>
          <div className="pt-4 relative z-10">
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-white text-primary hover:bg-slate-50 font-bold rounded-2xl shadow-lg transition-all"
            >
              Sign Up Now
            </Link>
          </div>
          
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-xl" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-xl" />
        </div>
      </section>

    </div>
  );
}
