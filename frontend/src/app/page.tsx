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
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Compassion in Action</span>
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Helping Hands,<br />
              <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                Hopeful Hearts
              </span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Hands For Homeless (HFH) is a humanitarian digital platform developed to connect homeless individuals with volunteers, donors, and support organizations. Together, we can rebuild lives.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-medium hover:bg-primary-hover shadow-xl shadow-primary/25 hover:shadow-primary/35 transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-border/80 text-foreground font-medium hover:bg-card hover:border-foreground/20 transition-all text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
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
