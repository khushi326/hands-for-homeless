import React from 'react';
import { MapPin, Users, Heart, BarChart3, HelpCircle } from 'lucide-react';

export default function Services() {
  const serviceList = [
    {
      title: 'Reporting Cases',
      description: 'Allows citizens to pin down locations, upload images, and write details about homeless individuals in need of shelter or assistance.',
      icon: MapPin,
    },
    {
      title: 'Requesting Assistance',
      description: 'Homeless individuals or helpers can lodge requests for immediate food, warm blankets, medical attention, or shelter placement.',
      icon: HelpCircle,
    },
    {
      title: 'Volunteer Matchmaking',
      description: 'Automatically notifies local volunteers of new cases in their vicinity, allowing them to coordinate and deliver immediate relief.',
      icon: Users,
    },
    {
      title: 'Donation Management',
      description: 'Secure monetary donations targeting specific fundraising campaigns, or item donations (clothes, hygiene kits) with volunteer pickup scheduling.',
      icon: Heart,
    },
    {
      title: 'Impact & Progress Tracking',
      description: 'Transparency in action. Real-time updates showing progress on campaigns, reported cases status, and distribution trackers.',
      icon: BarChart3,
    },
  ];

  return (
    <div className="py-16 sm:py-24 space-y-16">
      
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Our <span className="text-primary">Services</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Providing specialized digital tools that enable quick, organized, and effective support.
        </p>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((svc) => {
            const Icon = svc.icon;
            return (
              <div key={svc.title} className="bg-card border border-border/40 hover:border-primary/20 rounded-3xl p-8 space-y-6 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-foreground/[0.005]">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{svc.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{svc.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-primary/5 rounded-3xl p-8 sm:p-12 border border-primary/10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Need Urgent Integration or Assistance?</h3>
            <p className="text-sm text-muted leading-relaxed">
              If you represent an established NGO, government shelter, or relief distribution center, please contact us for integrating our tracking database with your facilities.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <a href="/contact" className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-all text-sm shadow-md shadow-primary/20">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
