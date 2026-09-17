import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
  MapPin,
  Phone,
  ArrowRight
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-primary text-cream py-14 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            ABOUT OUR LODGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cream">
            Welcome to Aahvaanam
          </h1>
          <div className="gold-divider mx-auto w-24" />
          <p className="text-cream/80 text-sm max-w-xl mx-auto pt-1 font-serif italic">
            &ldquo;Stay • Comfort • Feel at Home&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold text-gold tracking-widest">
              OUR COMMITMENT
            </span>
            <h2 className="font-serif text-3xl font-bold text-primary">
              A Haven of Cleanliness & Comfort in Kurnool
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>AAHVAANAM – LUXURY ROOMS</strong> was established with a singular vision: to bring modern hospitality, pristine hygiene, and home-like peace of mind to visitors in Kurnool City.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Situated right opposite the bustling Kurnool New Bus Stand, our property caters thoughtfully to travelers, students attending important competitive examinations, working professionals on business trips, and families attending functions or temple visits.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/40">
            <img
              src="/images/rooms/room_premium_master_bedroom.jpg"
              alt="Aahvaanam Luxury Bedroom"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Way to FreshUp Concept */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold/30 shadow-card-soft space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-primary">
              OUR MOTTO
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Way to FreshUp — Clean & Hygienic Stay
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We understand that after hours on the road or train, nothing revitalizes the body and mind like a spotless room, a refreshing hot shower, and clean, crisp bedding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-xl bg-cream border border-gold/30 space-y-2">
              <ShieldCheck className="w-6 h-6 text-gold" />
              <h4 className="font-serif font-bold text-primary text-base">Sanitized Bathrooms</h4>
              <p className="text-xs text-gray-600">Modern wall-hung commodes, concealed cisterns, clean tiles, and reliable health faucets.</p>
            </div>

            <div className="p-5 rounded-xl bg-cream border border-gold/30 space-y-2">
              <Sparkles className="w-6 h-6 text-gold" />
              <h4 className="font-serif font-bold text-primary text-base">Crisp Clean Bedding</h4>
              <p className="text-xs text-gray-600">Pure white cotton bedsheets, sanitized pillows, and cozy blankets for a sound night sleep.</p>
            </div>

            <div className="p-5 rounded-xl bg-cream border border-gold/30 space-y-2">
              <Heart className="w-6 h-6 text-gold" />
              <h4 className="font-serif font-bold text-primary text-base">Attentive Care</h4>
              <p className="text-xs text-gray-600">Courteous staff ready to assist with luggage, directions, and round-the-clock reception support.</p>
            </div>
          </div>
        </div>

        {/* Confirmed Amenities List */}
        <div className="bg-primary text-cream rounded-3xl p-8 sm:p-12 border-2 border-gold/40 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-bright-gold font-bold">
              CONVENIENCE & INFRASTRUCTURE
            </span>
            <h3 className="font-serif text-3xl font-bold text-white">
              Essential Hotel Amenities
            </h3>
            <div className="gold-divider mx-auto w-24" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            {[
              'Air Conditioned Luxury Rooms',
              'High-Speed WiFi Internet',
              '24 Hours Hot Water Supply',
              'RO Purified Mineral Drinking Water',
              'Modern Lift Facility to All Floors',
              'Attached Modern Bathrooms',
              'Wall-Mounted LED TVs',
              'Spacious Wardrobes & Dressing Areas',
              'Prime Location Near New Bus Stand'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-bright-gold shrink-0" />
                <span className="font-medium text-cream">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 text-center">
            <Link
              to="/booking"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-bright-gold to-gold text-brandDark font-bold text-xs uppercase tracking-wider rounded-full shadow-gold-glow hover:brightness-110 transition-all"
            >
              <span>RESERVE YOUR ROOM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
