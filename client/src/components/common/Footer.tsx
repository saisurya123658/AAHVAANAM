import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-primary text-cream border-t-2 border-gold/30 pt-16 pb-24 sm:pb-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full border border-gold flex items-center justify-center bg-primary-light">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-wider text-cream">AAHVAANAM</h3>
                <p className="text-[10px] text-gold tracking-widest uppercase font-semibold">LUXURY ROOMS • KURNOOL</p>
              </div>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed">
              Spacious, comfortable and clean rooms for students, families, professionals and travellers in Kurnool. Experience peaceful stay with premier hospitality.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Opp: Kurnool New Bus Stand</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold mb-4 tracking-wide border-b border-gold/20 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <Link to="/" className="hover:text-gold transition-colors flex items-center">
                  <span className="text-gold mr-2">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-gold transition-colors flex items-center">
                  <span className="text-gold mr-2">›</span> Luxury Rooms
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-gold transition-colors flex items-center">
                  <span className="text-gold mr-2">›</span> Book Your Stay
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold transition-colors flex items-center">
                  <span className="text-gold mr-2">›</span> Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-gold transition-colors flex items-center">
                  <span className="text-gold mr-2">›</span> Location & Directions
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors flex items-center">
                  <span className="text-gold mr-2">›</span> About Aahvaanam
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors flex items-center">
                  <span className="text-gold mr-2">›</span> Contact & Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Amenities & Highlights */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold mb-4 tracking-wide border-b border-gold/20 pb-2">
              Hotel Highlights
            </h4>
            <ul className="space-y-2 text-xs text-cream/75">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2" /> Air Conditioned Luxury Rooms
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2" /> High-Speed WiFi Internet
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2" /> 24 Hours Hot Water Facility
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2" /> Modern Lift Facility
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2" /> Clean RO Drinking Water
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2" /> Spotless Hygiene & Daily Housekeeping
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2" /> 24/7 Security & CCTV Surveillance
              </li>
            </ul>
          </div>

          {/* Contact & Timings */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold mb-4 tracking-wide border-b border-gold/20 pb-2">
              Stay & Contact Info
            </h4>
            <div className="space-y-3 text-sm text-cream/80">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-cream">Call Reception:</div>
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-gold hover:underline font-bold">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <div>Check-in: <span className="text-cream font-semibold">{settings.checkInTime}</span></div>
                  <div>Check-out: <span className="text-cream font-semibold">{settings.checkOutTime}</span></div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-bright-gold hover:text-white transition-colors underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/60 space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} AAHVAANAM – LUXURY ROOMS. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-gold/80">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Hospitality Brand
            </span>
            <Link to="/admin/login" className="hover:text-gold transition-colors text-[11px] underline">
              Staff / Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
