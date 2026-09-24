'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserCheck,
  Zap,
  Shield,
  Clock,
  HelpCircle,
} from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Reporting or Requesting',
      shortTitle: 'Report / Request',
      description:
        'A citizen spots someone in need and submits a report with location, photos, and status. Alternatively, individuals request assistance (food, shelter, clothes) directly.',
      whatHappens:
        'Citizens can report a person needing help or request assistance for food, shelter, clothing or medical support.',
      actor: 'Citizens & Individuals in Need',
      action: 'Submitting location coordinates, condition details, and urgent needs.',
      outcome: 'A new case is logged into the live queue in real time.',
      icon: Navigation,
      badge: 'Step 1 of 4',
    },
    {
      num: '02',
      title: 'Verification & Assignment',
      shortTitle: 'Verification',
      description:
        'Platform administrators review the report or request. Valid cases are immediately matched and assigned to active volunteers in the local radius.',
      whatHappens:
        'Administrators verify the submitted information and assign the case to a suitable available volunteer.',
      actor: 'System Administrators & Automated Dispatch',
      action: 'Validating submission details and alerting nearby responders.',
      outcome: 'Case is broadcasted and made available on the volunteer dashboard.',
      icon: ClipboardList,
      badge: 'Step 2 of 4',
    },
    {
      num: '03',
      title: 'Volunteer Intervention',
      shortTitle: 'Direct Aid Delivery',
      description:
        'The assigned volunteer accepts the case, navigates to the location, assesses the situation, and provides/delivers the requested aid or takes them to a shelter.',
      whatHappens:
        'The assigned volunteer accepts the case, visits the location and provides or coordinates the required assistance.',
      actor: 'Verified Field Volunteers',
      action: 'Reaching the location, distributing food, blankets, or coordinating shelter admission.',
      outcome: 'Immediate physical relief and compassionate support delivered.',
      icon: ShieldCheck,
      badge: 'Step 3 of 4',
    },
    {
      num: '04',
      title: 'Completion & Status Updates',
      shortTitle: 'Resolution & Audit',
      description:
        'The volunteer marks the assignment as completed, adding status notes and photos. The reporter receives a notification, ensuring transparency.',
      whatHappens:
        'The volunteer marks the case as completed and adds relevant updates. The reporter can see the updated case status.',
      actor: 'Volunteers, Reporters & Donors',
      action: 'Updating status to Resolved with outcome notes and audit timestamps.',
      outcome: 'Full closed-loop transparency with real-time status update.',
      icon: CheckCircle2,
      badge: 'Step 4 of 4',
    },
  ];

  const handleNext = () => {
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const currentStep = steps[activeStep];
  const CurrentIcon = currentStep.icon;

  return (
    <div className="py-16 sm:py-24 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-block border border-primary/20">
          Interactive Flow
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          How It <span className="text-primary">Works</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
          Click any step below to explore how Hands For Homeless coordinates care from initial report to verified outcome.
        </p>
      </section>

      {/* Interactive 4-Step Cards Grid */}
      <section className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`text-left p-7 rounded-3xl relative flex flex-col justify-between space-y-6 transition-all duration-300 border-2 cursor-pointer group ${
                  isSelected
                    ? 'bg-card border-primary ring-2 ring-primary/20 shadow-xl -translate-y-1.5'
                    : 'bg-card border-border/40 hover:border-border hover:shadow-lg hover:-translate-y-1'
                }`}
                aria-pressed={isSelected}
              >
                {/* Step Number Badge in Background */}
                <div
                  className={`absolute top-4 right-6 text-5xl font-black tracking-tight transition-colors select-none ${
                    isSelected ? 'text-primary/20' : 'text-foreground/5 group-hover:text-primary/10'
                  }`}
                >
                  {step.num}
                </div>

                <div className="space-y-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105'
                        : 'bg-primary/5 text-primary group-hover:bg-primary/10 group-hover:scale-105'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className={`text-lg font-bold transition-colors ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
                    {step.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Selected Indicator Pill */}
                <div className="pt-2 border-t border-border/30 flex items-center justify-between relative z-10">
                  <span
                    className={`text-[11px] font-bold inline-flex items-center space-x-1.5 transition-colors ${
                      isSelected ? 'text-primary' : 'text-muted/70 group-hover:text-foreground'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary animate-ping' : 'bg-muted/40'}`} />
                    <span>{isSelected ? 'Active Step' : 'Click to inspect'}</span>
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-primary translate-x-0.5' : 'text-muted/40 group-hover:translate-x-0.5'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Panel: "What happens at this step?" */}
        <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 shadow-xl shadow-foreground/[0.01] space-y-8 relative overflow-hidden transition-all duration-300">
          
          {/* Header & Step Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center font-black text-xl shrink-0">
                {currentStep.num}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Step {activeStep + 1} of 4
                  </span>
                  <span className="text-muted/40">•</span>
                  <span className="text-xs font-semibold text-muted">
                    {currentStep.shortTitle}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            {/* Quick Step Indicator Pills */}
            <div className="flex items-center space-x-2 self-start sm:self-auto bg-muted/20 p-1.5 rounded-2xl border border-border/40">
              {steps.map((s, idx) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeStep === idx
                      ? 'bg-card text-primary shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {s.num}
                </button>
              ))}
            </div>
          </div>

          {/* Core Explanation Block */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>What happens at this step?</span>
            </div>
            <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
              &ldquo;{currentStep.whatHappens}&rdquo;
            </p>
          </div>

          {/* 3 Detail Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-1.5">
              <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider">
                <UserCheck className="w-4 h-4" />
                <span>Primary Actors</span>
              </div>
              <p className="font-semibold text-foreground text-sm">{currentStep.actor}</p>
            </div>

            <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Key Action</span>
              </div>
              <p className="text-xs text-muted leading-relaxed font-medium">{currentStep.action}</p>
            </div>

            <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-1.5">
              <div className="flex items-center space-x-2 text-green-500 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Expected Outcome</span>
              </div>
              <p className="text-xs text-muted leading-relaxed font-medium">{currentStep.outcome}</p>
            </div>
          </div>

          {/* Navigation Controls & Progress Bar */}
          <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Progress Dots / Bar */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
              <span className="text-xs font-mono font-bold text-muted">
                Step {activeStep + 1} of 4
              </span>
              <div className="flex space-x-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStep === i
                        ? 'w-8 bg-primary'
                        : 'w-2.5 bg-border hover:bg-muted'
                    }`}
                    aria-label={`Jump to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={handlePrev}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-foreground hover:bg-muted/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                disabled={activeStep === steps.length - 1}
                onClick={handleNext}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-primary/20"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Transparency Focus (Kept Unchanged & Visually Connected) */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">A Focus on Security and Dignity</h3>
          <p className="text-sm text-muted leading-relaxed max-w-3xl mx-auto">
            All user profiles and volunteer registrations are verified by administrators. Case reporters coordinates details anonymously if requested, respecting the privacy and dignity of every human being on the platform.
          </p>
        </div>
      </section>

    </div>
  );
}
