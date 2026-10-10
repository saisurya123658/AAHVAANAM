import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  BedDouble,
  ShieldAlert,
  Search
} from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { LocalStorageService } from '../../services/localStorageService';
import { Booking } from '../../types';

export const MyBookingsPage: React.FC = () => {
  const { user, isAuthenticated, loading } = useUserAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchBookings = () => {
    if (!user) return;
    const list = LocalStorageService.getUserBookings(user.id, user.email, user.phone);
    setBookings(list);
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelConfirm = () => {
    if (!cancelModalBooking) return;
    try {
      LocalStorageService.cancelBooking(cancelModalBooking._id, cancelReason);
      setCancelModalBooking(null);
      setCancelReason('');
      setActionSuccess(`Booking ${cancelModalBooking.bookingReference} has been cancelled successfully.`);
      fetchBookings();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setCancelError(err.message || 'Failed to cancel booking.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#FCFAF5]">
        <div className="w-10 h-10 border-4 border-[#E0B84D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FCFAF5] px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-2xl border border-[#E0B84D]/30 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#171411] border border-[#E0B84D] flex items-center justify-center mx-auto shadow-md">
            <BedDouble className="w-8 h-8 text-[#E0B84D]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C49A32] font-bold block mb-1">
              GUEST RESERVATIONS
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#171411]">
              View Your Bookings
            </h1>
            <p className="text-xs text-gray-600 mt-2">
              Please sign in to view your active stays, confirmation history, and manage your room reservations.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full py-3 bg-gradient-to-r from-[#D4A72C] via-[#E0B84D] to-[#C49A32] text-[#171411] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-105 transition-all text-center"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/signup"
              className="w-full py-2.5 border border-[#E0B84D]/60 text-[#171411] hover:bg-amber-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FCFAF5] px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-[#171411] text-white p-6 sm:p-8 rounded-2xl border border-[#E0B84D]/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0B84D]/20 border border-[#E0B84D]/40 text-[#F4C542] text-[10px] font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" />
              <span>GUEST ACCOUNT</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
              Hello, {user?.name}
            </h1>
            <p className="text-xs text-white/70">
              Registered email: {user?.email} • Mobile: {user?.phone}
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link
              to="/booking"
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4A72C] via-[#E0B84D] to-[#C49A32] text-[#171411] font-bold text-xs uppercase tracking-wider rounded-xl shadow-gold hover:brightness-105 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book New Stay</span>
            </Link>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Booking List Container */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-[#171411]">
              Your Booking Records ({bookings.length})
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-[#E0B84D]/50 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-[#E0B84D]/40 flex items-center justify-center mx-auto text-[#C49A32]">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#171411]">
                No Bookings Found Yet
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                You haven't made any reservations under this account yet. Choose from our luxury rooms and book your comfortable stay in Kurnool today.
              </p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#171411] text-[#E0B84D] hover:text-white border border-[#E0B84D] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#171411]/90 transition-all shadow-md"
              >
                <span>Reserve a Room Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const isCancelled = booking.status === 'CANCELLED';
                const isConfirmed = booking.status === 'CONFIRMED';
                const isPending = booking.status === 'PENDING';

                return (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl border border-gray-200 hover:border-[#E0B84D]/60 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#171411] bg-gray-100 px-2.5 py-1 rounded-md">
                            {booking.bookingReference}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              isCancelled
                                ? 'bg-red-100 text-red-700'
                                : isConfirmed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Booked on: {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Total Amount</span>
                        <span className="font-serif text-lg font-bold text-[#171411]">
                          ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                      {/* Room Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          Room Selected
                        </span>
                        <p className="font-bold text-[#171411] text-sm">
                          {booking.room?.title || booking.room?.roomType}
                        </p>
                        <p className="text-gray-500">
                          Room No: {booking.room?.roomNumber} • {booking.guests} Guests
                        </p>
                      </div>

                      {/* Dates */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          Stay Duration
                        </span>
                        <p className="text-gray-700 font-medium">
                          Check-in: <strong className="text-[#171411]">{booking.checkIn}</strong>
                        </p>
                        <p className="text-gray-700 font-medium">
                          Check-out: <strong className="text-[#171411]">{booking.checkOut}</strong>
                        </p>
                      </div>

                      {/* Actions & Guest Details */}
                      <div className="flex flex-col sm:items-end justify-between gap-3">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                            Guest Details
                          </span>
                          <span className="text-gray-700 font-medium">
                            {booking.customer?.name} ({booking.customer?.phone})
                          </span>
                        </div>

                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => {
                              setCancelModalBooking(booking);
                              setCancelError(null);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Booking</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {booking.specialRequest && (
                      <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-600 italic">
                        Note: {booking.specialRequest}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Cancel Reservation?
                </h3>
                <p className="text-xs text-gray-500">
                  Ref: {cancelModalBooking.bookingReference}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Are you sure you want to cancel your reservation for{' '}
              <strong>{cancelModalBooking.room?.title}</strong> from{' '}
              <strong>{cancelModalBooking.checkIn}</strong> to{' '}
              <strong>{cancelModalBooking.checkOut}</strong>?
            </p>

            {cancelError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {cancelError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Change of travel dates, personal reasons..."
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E0B84D]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
