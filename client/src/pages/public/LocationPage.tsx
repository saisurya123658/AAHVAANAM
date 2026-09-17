import React from 'react';
import { MapPin, Phone, MessageSquare, ExternalLink, Navigation } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const LocationPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-primary text-cream py-14 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            FIND US IN KURNOOL
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cream">
            Location & Directions
          </h1>
          <div className="gold-divider mx-auto w-24" />
          <p className="text-cream/80 text-sm max-w-xl mx-auto pt-1">
            Centrally located right opposite Kurnool New Bus Stand for maximum accessibility and travel convenience.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Location Details Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-card-soft space-y-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-dark text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                <span>Primary Landmark</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                Aahvaanam – Luxury Rooms
              </h2>
              <p className="text-sm font-semibold text-gray-800">
                Opposite Kurnool New Bus Stand
              </p>
              <p className="text-xs text-gray-500">
                Kurnool City, Andhra Pradesh, India
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-gray-600">
              <div className="p-3.5 rounded-xl bg-cream border border-gold/30">
                <span className="font-bold text-primary block mb-0.5">Immediate Transit Access:</span>
                Right across from the state and inter-city bus terminal, eliminating lengthy commutes with luggage.
              </div>

              <div className="p-3.5 rounded-xl bg-cream border border-gold/30">
                <span className="font-bold text-primary block mb-0.5">Surrounding Facilities:</span>
                Round-the-clock auto-rickshaw availability, local restaurants, tea stalls, medical stores, and student test centers nearby.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-bright-gold via-gold to-yellow-600 text-brandDark font-extrabold text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>GET DIRECTIONS ON GOOGLE MAPS</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="w-full py-3 px-4 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>CALL HOTEL ({settings.phone})</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hello Aahvaanam, please share your exact location landmark on WhatsApp.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>MESSAGE ON WHATSAPP</span>
              </a>
            </div>

          </div>

          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl bg-white p-3">
            <div className="rounded-2xl overflow-hidden h-[450px] sm:h-[500px] relative bg-gray-100">
              <iframe
                title="Aahvaanam Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.757827878841!2d78.033!3d15.828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb5e7a9e0f6b7c5%3A0x6b!2sKurnool+New+Bus+Stand!5e0!3m2!1sen!2sin!4v1600000000000"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
