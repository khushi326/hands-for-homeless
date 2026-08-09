import React from 'react';
import { ShieldCheck, ClipboardList, CheckCircle2, Navigation } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Reporting or Requesting',
      description: 'A citizen spots someone in need and submits a report with location, photos, and status. Alternatively, individuals request assistance (food, shelter, clothes) directly.',
      icon: Navigation,
    },
    {
      num: '02',
      title: 'Verification & Assignment',
      description: 'Platform administrators review the report or request. Valid cases are immediately matched and assigned to active volunteers in the local radius.',
      icon: ClipboardList,
    },
    {
      num: '03',
      title: 'Volunteer Intervention',
      description: 'The assigned volunteer accepts the case, navigates to the location, assesses the situation, and provides/delivers the requested aid or takes them to a shelter.',
      icon: ShieldCheck,
    },
    {
      num: '04',
      title: 'Completion & Status Updates',
      description: 'The volunteer marks the assignment as completed, adding status notes and photos. The reporter receives a notification, ensuring transparency.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="py-16 sm:py-24 space-y-20">
      
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          How It <span className="text-primary">Works</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          From a simple notification to a completed volunteer response, here is how Hands For Homeless coordinates care.
        </p>
      </section>

      {/* Steps List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="bg-card border border-border/40 p-8 rounded-3xl relative space-y-6">
                {/* Step Number Badge */}
                <div className="absolute top-4 right-6 text-5xl font-black text-primary/10 tracking-tight">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground pt-4">{step.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{step.description}</p>
                
                {/* Connection lines for desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 w-8 h-[2px] bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Transparency Focus */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">A Focus on Security and Dignity</h3>
          <p className="text-sm text-muted leading-relaxed max-w-3xl mx-auto">
            All user profiles and volunteer registrations are verified by administrators. Case reporters coordinates details anonymously if requested, respecting the privacy and dignity of every human being on the platform.
          </p>
        </div>
      </section>

    </div>
  );
}
