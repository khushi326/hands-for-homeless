'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Heart,
  Shield,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Navigation,
  Quote,
  Sparkles,
  HelpCircle,
  Clock,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                          Smooth Animated Counter                            */
/* -------------------------------------------------------------------------- */
function AnimatedStat({
  target,
  suffix = '',
  label,
}: {
  target: number;
  suffix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setCount(target);
        setStarted(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          const duration = 1600; // ms
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeOut = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(easeOut * target);

            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [target, started]);

  return (
    <div ref={elementRef} className="space-y-2 transition-transform hover:scale-105 duration-300">
      <p className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight tabular-nums">
        {count.toLocaleString('en-US')}
        {suffix}
      </p>
      <p className="text-xs sm:text-sm text-muted font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

export default function Home() {
  // How it works active step state
  const [activeStep, setActiveStep] = useState(0);

  // Success stories carousel active index
  const [storyIndex, setStoryIndex] = useState(0);

  // Smooth scroll helper
  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const coreCards = [
    {
      title: 'Report Homeless Individuals',
      description:
        'Found someone in need of assistance? Report their location and condition to notify nearby volunteers instantly.',
      icon: MapPin,
      cta: 'Report Case Now',
      href: '/dashboard/report',
      color: 'border-primary/20 hover:border-primary',
      badge: 'Immediate Action',
    },
    {
      title: 'Request Assistance',
      description:
        'Are you or someone you know struggling? Request support for food, shelter, blankets, or emergency medical aid.',
      icon: HelpCircle,
      cta: 'Request Assistance',
      href: '/dashboard/request',
      color: 'border-amber-500/20 hover:border-amber-500',
      badge: 'Direct Relief',
    },
    {
      title: 'Become a Volunteer',
      description:
        'Be the boots on the ground. Accept cases in your area, coordinate with local shelters, and deliver aid directly.',
      icon: Users,
      cta: 'Join Volunteer Network',
      href: '/register',
      color: 'border-teal-500/20 hover:border-teal-500',
      badge: 'Community Heroes',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Report a Case',
      shortDesc: 'Citizen spots someone in need and shares details.',
      fullDesc:
        'A citizen spots an unhoused individual or someone requiring critical aid. Using our simple mobile-ready form, they submit the location address, condition (e.g., medical, cold weather), and an optional photo.',
      icon: Navigation,
      highlight: 'Submissions are verified and geolocated in real time.',
    },
    {
      step: '02',
      title: 'Volunteer Accepts',
      shortDesc: 'Nearby responder claims the assignment.',
      fullDesc:
        'The case appears on the active Volunteer Dashboard. Available volunteers in the immediate geographic radius receive notifications and can claim the case with a single click.',
      icon: ClipboardList,
      highlight: 'Zero administrative delays — rapid local response.',
    },
    {
      step: '03',
      title: 'Assistance Provided',
      shortDesc: 'Relief items, food, or shelter coordinated.',
      fullDesc:
        'The assigned volunteer navigates to the location, assesses the situation compassionately, and delivers hot food, warm clothing, emergency supplies, or coordinates shelter transportation.',
      icon: Shield,
      highlight: 'Dignity, empathy, and safety at every interaction.',
    },
    {
      step: '04',
      title: 'Case Resolved',
      shortDesc: 'Status is updated with transparent verification.',
      fullDesc:
        'Once assistance is delivered, the volunteer updates the case status to Resolved with brief verification notes. The platform updates metrics so donors and reporters see verified impact.',
      icon: CheckCircle2,
      highlight: 'Full accountability and closed-loop reporting.',
    },
  ];

  const stories = [
    {
      name: 'Mohan Lal',
      location: 'Connaught Place, New Delhi',
      story:
        'Mohan was spotted shivering in the cold winter rains near the railway station. A citizen reported his case on HFH. Within 20 minutes, a nearby volunteer arrived with hot food, blankets, and coordinated with a local shelter. Today, Mohan has a night shelter placement and is enrolled in a vocational rehabilitation course.',
      volunteer: 'Rahul Verma',
      date: 'July 2026',
      impact: 'Warmth, Meals & Rehabilitation Enrollment',
    },
    {
      name: 'Geeta & Daughter',
      location: 'Gomti Nagar, Lucknow',
      story:
        'Struggling after losing her job, Geeta was forced to live on the streets with her 5-year-old child. A local store owner used HFH to request urgent shelter and food assistance. Volunteers secured immediate temporary housing within 3 hours. Community donations subsequently funded a deposit for a small rental apartment.',
      volunteer: 'Pooja Sharma',
      date: 'June 2026',
      impact: 'Emergency Safe Housing & Rental Security',
    },
    {
      name: 'Prakash Rao',
      location: 'Sector 22, Chandigarh',
      story:
        'Prakash was living in sub-human conditions with severe foot injuries. An HFH case report brought volunteers who immediately transported him to the local general hospital. After medical treatment and shelter admission, Prakash now works part-time at a community garden.',
      volunteer: 'Khushi Yadav',
      date: 'May 2026',
      impact: 'Emergency Healthcare & Livelihood Support',
    },
  ];

  const nextStory = () => {
    setStoryIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <div className="flex flex-col space-y-24 pb-24 scroll-smooth">

      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO SECTION                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-background pt-24 pb-28">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 opacity-50 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase border border-primary/20 shadow-sm">
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
              Hands For Homeless (HFH) connects citizens, volunteers, and donors to provide rapid, transparent assistance to people experiencing homelessness.
            </p>

            {/* Interactive Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-hover shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.7)] hover:-translate-y-1 transition-all text-center flex items-center justify-center space-x-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-border/80 text-foreground font-bold hover:bg-card hover:border-primary/50 hover:text-primary transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Learn How It Works</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. INTERACTIVE STATISTICS WITH ANIMATED COUNTERS                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 shadow-xl shadow-foreground/[0.02] relative overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-border/30">
            <AnimatedStat target={1200} suffix="+" label="Assisted Individuals" />
            <AnimatedStat target={450} suffix="+" label="Active Volunteers" />
            <AnimatedStat target={98} suffix="%" label="Response Rate" />
            <AnimatedStat target={15} suffix="+" label="Partner Shelters" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. CORE INITIATIVES (FUNCTIONAL CARDS)                            */}
      {/* ------------------------------------------------------------------ */}
      <section id="initiatives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Direct Action</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Our Core Initiatives
          </h2>
          <p className="text-muted leading-relaxed text-sm sm:text-base">
            Choose how you want to make an impact. The platform simplifies coordination between reporter, responder, and donor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group bg-card border-2 ${card.color} rounded-3xl p-8 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 shadow-lg shadow-foreground/[0.01] hover:shadow-2xl cursor-pointer`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="pt-8 border-t border-border/30 mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary group-hover:text-primary-hover">
                    {card.cta}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. INTERACTIVE "HOW IT WORKS" 4-STEP SECTION                       */}
      {/* ------------------------------------------------------------------ */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="text-muted leading-relaxed text-sm sm:text-base">
            Click on any step below to explore how Hands For Homeless coordinates care from initial report to verified outcome.
          </p>
        </div>

        {/* 4 Interactive Step Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const isSelected = activeStep === index;
            return (
              <button
                key={stepItem.title}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`p-6 rounded-3xl text-left border-2 transition-all duration-300 flex flex-col justify-between space-y-4 relative ${
                  isSelected
                    ? 'bg-card border-primary ring-2 ring-primary/20 shadow-xl -translate-y-1'
                    : 'bg-card/60 border-border/40 hover:border-border hover:bg-card text-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-muted/40 text-muted'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-2xl font-black font-mono transition-colors ${
                      isSelected ? 'text-primary' : 'text-muted/30'
                    }`}
                  >
                    {stepItem.step}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className={`text-base font-bold transition-colors ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                    {stepItem.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    {stepItem.shortDesc}
                  </p>
                </div>

                <div className="pt-2">
                  <span
                    className={`text-[11px] font-bold inline-flex items-center space-x-1 ${
                      isSelected ? 'text-primary' : 'text-muted/60'
                    }`}
                  >
                    <span>{isSelected ? 'Active Step' : 'Click to view'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Expanded View for Selected Step */}
        <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 shadow-xl shadow-foreground/[0.01] space-y-6 relative overflow-hidden transition-all animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                {steps[activeStep].step}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Step Details</span>
                <h3 className="text-2xl font-extrabold text-foreground">{steps[activeStep].title}</h3>
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-600 text-xs font-bold self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{steps[activeStep].highlight}</span>
            </div>
          </div>

          <p className="text-base text-muted leading-relaxed max-w-3xl">
            {steps[activeStep].fullDesc}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={`h-2 rounded-full transition-all ${
                    activeStep === i ? 'w-8 bg-primary' : 'w-2 bg-border/60 hover:bg-muted'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl border border-border/60 text-xs font-bold text-foreground hover:bg-muted/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>
              <button
                type="button"
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. INTERACTIVE SUCCESS STORIES (CAROUSEL SLIDER)                   */}
      {/* ------------------------------------------------------------------ */}
      <section id="success-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Real Impact</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Success Stories
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Every report and volunteer action changes a life. Browse real cases resolved through our community.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={prevStory}
              className="p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/40 text-foreground transition-all shadow-sm hover:scale-105 active:scale-95"
              aria-label="Previous Story"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-xs font-mono font-bold text-muted px-2">
              {storyIndex + 1} / {stories.length}
            </div>
            <button
              type="button"
              onClick={nextStory}
              className="p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/40 text-foreground transition-all shadow-sm hover:scale-105 active:scale-95"
              aria-label="Next Story"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Story Card */}
        <div className="bg-card border border-border/40 p-8 sm:p-12 rounded-3xl shadow-xl shadow-foreground/[0.01] relative overflow-hidden transition-all duration-500">
          <Quote className="w-16 h-16 text-primary/10 absolute top-6 right-6 pointer-events-none" />

          <div className="space-y-6 max-w-4xl relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {stories[storyIndex].impact}
              </span>
              <span className="text-xs text-muted flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{stories[storyIndex].location}</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {stories[storyIndex].name}
            </h3>

            <p className="text-base sm:text-lg text-muted leading-relaxed italic">
              &ldquo;{stories[storyIndex].story}&rdquo;
            </p>

            <div className="pt-6 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {stories[storyIndex].volunteer.slice(0, 1)}
                </div>
                <div>
                  <p className="text-xs text-muted">Assisting Volunteer</p>
                  <p className="text-sm font-bold text-foreground">{stories[storyIndex].volunteer}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xs font-medium text-muted">{stories[storyIndex].date}</span>
                <Link
                  href="/success-stories"
                  className="text-xs font-bold text-primary hover:text-primary-hover flex items-center space-x-1"
                >
                  <span>View All Stories</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stories.map((st, i) => (
            <button
              key={st.name}
              type="button"
              onClick={() => setStoryIndex(i)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                storyIndex === i
                  ? 'bg-card border-primary shadow-md'
                  : 'bg-card/40 border-border/40 hover:bg-card text-muted hover:text-foreground'
              }`}
            >
              <p className="text-xs font-bold text-foreground">{st.name}</p>
              <p className="text-[11px] text-muted truncate mt-0.5">{st.impact}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. CALL TO ACTION BANNER                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-primary to-amber-600 rounded-3xl p-8 sm:p-16 text-center text-white space-y-6 shadow-2xl shadow-primary/20 relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10">
            Ready to Make a Difference?
          </h2>
          <p className="max-w-xl mx-auto text-white/85 text-sm sm:text-base leading-relaxed relative z-10">
            Every report, donation, or volunteer hour contributes to giving someone back their dignity. Join Hands For Homeless today.
          </p>
          <div className="pt-4 relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary hover:bg-slate-50 font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Sign Up Now
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white/80 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
            >
              Sign In to Dashboard
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
