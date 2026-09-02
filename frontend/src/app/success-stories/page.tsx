import React from 'react';
import { Quote } from 'lucide-react';

export default function SuccessStories() {
  const stories = [
    {
      name: 'Mohan Lal',
      location: 'Connaught Place, New Delhi',
      story: 'Mohan was spotted shivering in the cold winter rains near the railway station. A citizen reported his case on HFH. Within 20 minutes, a nearby volunteer arrived with hot food, blankets, and coordinated with a local shelter. Today, Mohan has a night shelter placement and is enrolled in a vocational rehabilitation course.',
      volunteer: 'Rahul Verma',
      date: 'July 2026',
    },
    {
      name: 'Geeta & Daughter',
      location: 'Gomti Nagar, Lucknow',
      story: 'Struggling after losing her job, Geeta was forced to live on the streets with her 5-year-old child. A local store owner used HFH to request urgent shelter and food assistance. Volunteers secured immediate temporary housing within 3 hours. Community donations subsequently funded a deposit for a small rental apartment.',
      volunteer: 'Pooja Sharma',
      date: 'June 2026',
    },
    {
      name: 'Prakash Rao',
      location: 'Sector 22, Chandigarh',
      story: 'Prakash was living in sub-human conditions with severe foot injuries. An HFH case report brought volunteers who immediately transported him to the local general hospital. After medical treatment and shelter admission, Prakash now works part-time at a community garden.',
      volunteer: 'Khushi Yadav',
      date: 'May 2026',
    },
  ];

  return (
    <div className="py-16 sm:py-24 space-y-16">
      
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Success <span className="text-primary">Stories</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          See the real-world impact of your reports, volunteer hours, and donations. Every story represents a life restored.
        </p>
      </section>

      {/* Stories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((item) => (
            <div key={item.name} className="bg-card border border-border/40 p-8 rounded-3xl flex flex-col justify-between hover:shadow-xl hover:shadow-foreground/[0.01] transition-all relative overflow-hidden">
              <Quote className="w-10 h-10 text-primary/10 absolute top-4 right-4" />
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                  <p className="text-xs text-primary font-medium">{item.location}</p>
                </div>
                <p className="text-sm text-muted leading-relaxed">{item.story}</p>
              </div>
              
              <div className="border-t border-border/40 pt-6 mt-6 flex justify-between items-center text-xs text-muted">
                <span>Volunteer: <strong className="text-foreground">{item.volunteer}</strong></span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary/5 rounded-3xl border border-primary/10 p-8 sm:p-12 text-center space-y-6">
          <h3 className="text-2xl font-bold text-foreground">Help Us Write More Success Stories</h3>
          <p className="text-sm text-muted leading-relaxed max-w-2xl mx-auto">
            Your small act of reporting a homeless person or making a donation could be the turning point in someone\'s life.
          </p>
          <div className="pt-2">
            <a href="/register" className="inline-block px-6 py-3 bg-primary text-white hover:bg-primary-hover font-medium rounded-xl transition-all shadow-md shadow-primary/20">
              Get Started Today
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
