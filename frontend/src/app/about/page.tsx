import React from 'react';
import { Heart, Eye, Award, CheckCircle } from 'lucide-react';

export default function About() {
  const values = [
    { title: 'Compassion', description: 'At our core, we believe in treating every individual with dignity and empathy.' },
    { title: 'Transparency', description: 'We ensure that every report is tracked and all donations are clearly accounted for.' },
    { title: 'Collaboration', description: 'Bridging citizens, volunteers, and organizations for maximum local impact.' },
    { title: 'Accessibility', description: 'Providing simple, mobile-first design so anyone can report or request help.' },
  ];

  return (
    <div className="py-16 sm:py-24 space-y-20">
      
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          About <span className="text-primary">Hands For Homeless</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Bringing communities together to create coordinated, transparent, and immediate support networks.
        </p>
      </section>

      {/* Background Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card border border-border/40 p-8 sm:p-12 rounded-3xl shadow-xl shadow-foreground/[0.01]">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Organization Background
            </h2>
            <p className="text-muted leading-relaxed">
              Hands For Homeless (HFH) is a startup humanitarian organization established with the mission of supporting homeless individuals through coordinated community efforts.
            </p>
            <p className="text-muted leading-relaxed">
              The organization believes that homelessness is not merely the absence of shelter but often the result of multiple interconnected challenges, including poverty, unemployment, health issues, and social isolation.
            </p>
            <p className="text-muted leading-relaxed">
              Rather than functioning solely as a charity website, HFH is envisioned as a digital ecosystem that promotes transparency, accountability, and community participation in addressing homelessness.
            </p>
          </div>
          <div className="bg-gradient-to-tr from-primary/10 to-amber-500/10 rounded-2xl p-8 flex flex-col justify-center h-full space-y-6 border border-primary/10">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Centralized Platform</h4>
                <p className="text-sm text-muted">A single hub to coordinate reporters, volunteers, and admin staff.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Immediate Cases Allocation</h4>
                <p className="text-sm text-muted">Ensures that every reported case gets assigned to an active nearby volunteer.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Accountability</h4>
                <p className="text-sm text-muted">Track the progress of your donations and reports live.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission */}
          <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">Our Mission</h3>
            <p className="text-muted leading-relaxed">
              The mission of Hands For Homeless is to simplify humanitarian assistance by providing an accessible digital platform that empowers citizens, volunteers, donors, and organizations to work together efficiently in helping homeless individuals rebuild their lives.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">Our Vision</h3>
            <p className="text-muted leading-relaxed">
              To build a compassionate digital ecosystem where every homeless individual has easier access to care, support, and opportunities through community collaboration and technology.
            </p>
          </div>

        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Our Core Values</h2>
          <p className="text-muted">
            The principles that guide our work, development, and interactions with the community daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {values.map((val) => (
            <div key={val.title} className="bg-card border border-border/40 p-6 rounded-2xl space-y-4">
              <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-foreground">{val.title}</h4>
              <p className="text-xs text-muted leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
