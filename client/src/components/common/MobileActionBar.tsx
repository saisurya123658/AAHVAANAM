import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, CalendarCheck } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const MobileActionBar: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top >= 0 && rect.top <= windowHeight * 0.7;
    };

    if (location.pathname === '/') {
      const formEl = document.getElementById('booking-form');
      if (formEl) {
        if (!isElementInViewport(formEl)) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    } else if (location.pathname === '/booking') {
      const formEl = document.getElementById('booking-form');
      if (formEl) {
        if (!isElementInViewport(formEl)) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }

    navigate('/booking');
  };

  return (
    <aside
      aria-label="Quick Mobile Actions"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#171411]/95 backdrop-blur-md border-t border-[#E0B84D]/40 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] py-2 px-3 sm:hidden"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* CALL */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-white transition-all border border-white/10"
          title="Direct Reception Call"
        >
          <Phone className="w-4 h-4 text-[#E0B84D] mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">CALL</span>
        </a>

        {/* WHATSAPP */}
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Aahvaanam, I would like to enquire about luxury room booking.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 bg-emerald-800/90 hover:bg-emerald-700 active:scale-95 rounded-xl text-white transition-all shadow-sm border border-emerald-600/40"
          title="Enquire on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 text-emerald-300 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">WHATSAPP</span>
        </a>

        {/* BOOK NOW */}
        <button
          onClick={handleBookingClick}
          className="flex flex-col items-center justify-center py-2 bg-gradient-to-r from-[#F4C542] via-[#E0B84D] to-[#C49A32] hover:brightness-110 active:scale-95 rounded-xl text-[#171411] transition-all font-bold shadow-[0_4px_12px_rgba(224,184,77,0.4)] cursor-pointer"
          id="mobile-book-now-bottom-cta"
        >
          <CalendarCheck className="w-4 h-4 text-[#171411] mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-wider uppercase">BOOK NOW</span>
        </button>
      </div>
    </aside>
  );
};
