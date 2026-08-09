import React from 'react';
import Link from 'next/link';
import { Heart, Mail, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const initiatives = [
    { name: 'Report Homeless', href: '/register' },
    { name: 'Volunteer Sign Up', href: '/register' },
    { name: 'Monetary Donations', href: '/login' },
    { name: 'Item Donations', href: '/login' },
  ];

  return (
    <footer className="bg-card text-foreground border-t border-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand/About Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-md font-bold tracking-tight">
                Hands For <span className="text-primary">Homeless</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              A humanitarian digital platform designed to bridge the gap between people who require assistance and those willing to provide support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Initiatives */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase mb-4">
              Get Involved
            </h3>
            <ul className="space-y-2">
              {initiatives.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Sipheron Metadata) */}
          <div className="space-y-3 text-sm">
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase mb-4">
              Contact
            </h3>
            <div className="flex items-start space-x-2 text-muted">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Valayapathi St, Peerkankaranai,<br />
                Tambaram, Tamil Nadu – 600063, India
              </span>
            </div>
            <div className="flex items-center space-x-2 text-muted">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a href="mailto:info@sipheron.in" className="hover:text-primary transition-all">
                info@sipheron.in
              </a>
            </div>
            <div className="flex items-center space-x-2 text-muted">
              <Globe className="w-4 h-4 text-primary shrink-0" />
              <a href="http://www.siphron.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all">
                www.siphron.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Hands For Homeless (HFH). All rights reserved.
          </p>
          <p className="text-xs text-muted flex items-center">
            Developed by Sipheron Technologies Intern Khushi Yadav
          </p>
        </div>
      </div>
    </footer>
  );
}
