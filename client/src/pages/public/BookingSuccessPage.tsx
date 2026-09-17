import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Booking } from '../../types';
import { LocalStorageService } from '../../services/localStorageService';
import {
  CheckCircle2,
  Phone,
  MessageSquare,
  Download,
  Home,
  MapPin,
  Calendar,
  Sparkles,
  BedDouble,
  UserCheck
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const BookingSuccessPage: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();

  // Retrieve booking from navigation state, or fallback to most recent booking in localStorage
  const booking: Booking | null = location.state?.booking || LocalStorageService.getMostRecentBooking();

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="pt-28 pb-20 bg-ivory min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-gold/40 shadow-xl text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-gold mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-primary">No Active Booking Found</h2>
          <p className="text-xs text-gray-600">Please make a reservation from our booking page.</p>
          <Link
            to="/booking"
            className="inline-block px-6 py-2.5 bg-primary text-cream rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Start Booking
          </Link>
        </div>
      </div>
    );
  }

  const customerName = booking.customer?.name || 'Valued Guest';
  const customerPhone = booking.customer?.phone || '';
  const roomTitle = booking.room?.title || 'Luxury Room';
  const roomType = booking.room?.roomType || '';

  const formatStayDate = (dStr: string) => {
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dStr;
    }
  };

  const checkInFormatted = formatStayDate(booking.checkIn);
  const checkOutFormatted = formatStayDate(booking.checkOut);

  const whatsappMessage = encodeURIComponent(
    `Hello Aahvaanam, I have booked room reservation ${booking.bookingReference} for ${customerName}. Stay: ${checkInFormatted} to ${checkOutFormatted}. Please confirm my details.`
  );

  return (
    <div className="pt-28 pb-20 bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Printable Confirmation Voucher */}
        <div
          id="booking-receipt"
          className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-gold/40 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300"
        >
          {/* Header Status */}
          <div className="text-center space-y-3 pb-6 border-b border-gold/20">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-emerald-700 block">
              BOOKING CONFIRMED
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">
              Thank you, {customerName}!
            </h1>

            <p className="text-xs text-gray-500">
              Your room reservation has been confirmed and saved to your device session.
            </p>

            {/* Prominent Booking ID Box */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                BOOKING ID
              </span>
              <div className="inline-block font-mono text-2xl sm:text-3xl font-black px-6 py-2.5 bg-cream text-primary rounded-2xl border-2 border-gold tracking-widest shadow-inner">
                {booking.bookingReference}
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium flex items-center">
                <UserCheck className="w-4 h-4 mr-1.5 text-gold" />
                Guest Name:
              </span>
              <span className="font-bold text-brandDark">{customerName}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium flex items-center">
                <Phone className="w-4 h-4 mr-1.5 text-gold" />
                Contact Phone:
              </span>
              <span className="font-bold text-brandDark">{customerPhone}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium flex items-center">
                <BedDouble className="w-4 h-4 mr-1.5 text-gold" />
                Reserved Room:
              </span>
              <span className="font-bold text-primary">
                {roomTitle} ({roomType})
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-gold" />
                Check-in:
              </span>
              <span className="font-bold text-brandDark">
                {checkInFormatted} ({settings.checkInTime})
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-gold" />
                Check-out:
              </span>
              <span className="font-bold text-brandDark">
                {checkOutFormatted} ({settings.checkOutTime})
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Number of Guests:</span>
              <span className="font-bold text-brandDark">{booking.guests}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Status:</span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                {booking.status}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Total Tariff:</span>
              <span className="font-serif font-extrabold text-primary text-base sm:text-lg">
                {booking.totalAmount ? `₹${booking.totalAmount.toLocaleString('en-IN')}` : '₹5,000'}
              </span>
            </div>
          </div>

          {/* Hotel Location & Instructions */}
          <div className="p-4 rounded-xl bg-cream/70 border border-gold/30 text-xs text-gray-700 space-y-2">
            <div className="flex items-center space-x-2 text-primary font-bold">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              <span>Aahvaanam – Luxury Rooms (Opp: Kurnool New Bus Stand)</span>
            </div>
            <p className="text-[11px] text-gray-600">
              {settings.bookingInstructions}
            </p>
          </div>

          {/* Buttons Group (Hidden during print) */}
          <div className="space-y-3 pt-2 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handlePrint}
                className="py-3.5 px-4 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD / PRINT CONFIRMATION</span>
              </button>

              <Link
                to="/"
                className="py-3.5 px-4 rounded-xl bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Home className="w-4 h-4 text-gold" />
                <span>BACK TO HOME</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WHATSAPP HOTEL</span>
              </a>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-brandDark font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>CALL HOTEL ({settings.phone})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
