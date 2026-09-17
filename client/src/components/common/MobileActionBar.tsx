import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, CalendarCheck } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const MobileActionBar: React.FC = () => {
  const { settings } = useSettings();

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary/45 backdrop-blur-md border-t border-gold/40 shadow-2xl py-2 px-3 sm:hidden">
      <div className="grid grid-cols-3 gap-2">
        {/* CALL */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg text-cream transition-all"
        >
          <Phone className="w-4 h-4 text-gold mb-0.5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">CALL</span>
        </a>

        {/* WHATSAPP */}
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Aahvaanam, I would like to enquire about room booking.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 bg-emerald-700/80 hover:bg-emerald-600 active:scale-95 rounded-lg text-white transition-all shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-emerald-200 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">WHATSAPP</span>
        </a>

        {/* BOOK NOW */}
        <Link
          to="/booking"
          className="flex flex-col items-center justify-center py-2 bg-gradient-to-r from-bright-gold to-gold hover:brightness-110 active:scale-95 rounded-lg text-brandDark transition-all font-bold shadow-gold-glow"
        >
          <CalendarCheck className="w-4 h-4 text-brandDark mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-wider uppercase">BOOK NOW</span>
        </Link>
      </div>
    </div>
  );
};
