import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LocalStorageService } from '../../services/localStorageService';
import { Booking } from '../../types';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Phone,
  Home,
  MapPin,
  Clock,
  BedDouble
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const BookingStatusPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { settings } = useSettings();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      const found =
        LocalStorageService.getBookingByReference(bookingId) ||
        LocalStorageService.getBookingById(bookingId);
      setBooking(found);
      setLoading(false);
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium text-xs">Locating reservation...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-ivory">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl border border-gold/30 shadow-lg text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-gold mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-primary">Booking Not Found</h2>
          <p className="text-xs text-gray-600">
            No booking found matching &ldquo;{bookingId}&rdquo;. Please verify your booking reference or contact our reception.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <Link
              to="/"
              className="px-5 py-2.5 bg-primary text-cream rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Go to Home
            </Link>
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="px-5 py-2.5 border border-primary text-primary rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Call Hotel
            </a>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs border border-emerald-300">CONFIRMED</span>;
      case 'CHECKED_IN':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-xs border border-blue-300">CHECKED IN</span>;
      case 'CHECKED_OUT':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-bold text-xs border border-gray-300">CHECKED OUT</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-xs border border-rose-300">CANCELLED</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs border border-amber-300">PENDING</span>;
    }
  };

  return (
    <div className="pt-28 pb-20 bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-gold/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2 pb-6 border-b border-gold/20">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-gold block">
              RESERVATION TRACKER
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Reservation #{booking.bookingReference}
            </h1>
            <div className="pt-1">{getStatusBadge(booking.status)}</div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Guest:</span>
              <span className="font-bold text-brandDark">{booking.customer?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Phone:</span>
              <span className="font-bold text-brandDark">{booking.customer?.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Room Assigned:</span>
              <span className="font-bold text-primary">
                {booking.room?.title} (Room #{booking.room?.roomNumber})
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Check-In:</span>
              <span className="font-bold text-brandDark">
                {new Date(booking.checkIn).toLocaleDateString('en-IN')} ({settings.checkInTime})
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Check-Out:</span>
              <span className="font-bold text-brandDark">
                {new Date(booking.checkOut).toLocaleDateString('en-IN')} ({settings.checkOutTime})
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Tariff Total:</span>
              <span className="font-serif font-bold text-primary">
                {booking.totalAmount ? `₹${booking.totalAmount.toLocaleString('en-IN')}` : '₹5,000'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-2 shadow-sm"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span>Call Hotel</span>
            </a>

            <Link
              to="/"
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-brandDark font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
