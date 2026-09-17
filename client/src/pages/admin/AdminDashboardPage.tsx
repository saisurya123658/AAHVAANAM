import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LocalStorageService } from '../../services/localStorageService';
import { Booking, BookingStatus, DashboardStats, Room } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Eye,
  Calendar,
  Phone,
  BedDouble,
  DollarSign,
  RotateCcw,
  PlusCircle,
  Sparkles,
  AlertTriangle,
  User,
  X
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(LocalStorageService.getDashboardStats());
  const [bookings, setBookings] = useState<Booking[]>(LocalStorageService.getBookings());
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    action: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    action: () => {}
  });

  // Reload data from localStorage
  const refreshData = () => {
    setStats(LocalStorageService.getDashboardStats());
    setBookings(LocalStorageService.getBookings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Status transition handlers
  const handleStatusChange = (booking: Booking, newStatus: BookingStatus) => {
    LocalStorageService.updateBooking(booking._id, { status: newStatus });
    refreshData();
    if (activeBooking && activeBooking._id === booking._id) {
      setActiveBooking({ ...activeBooking, status: newStatus });
    }
    showNotification(`Booking ${booking.bookingReference} marked as ${newStatus}.`);
  };

  const promptDeleteBooking = (booking: Booking) => {
    setConfirmModal({
      open: true,
      title: `Delete Booking ${booking.bookingReference}`,
      message: `Permanently delete reservation ${booking.bookingReference} for ${booking.customer?.name}? This cannot be undone.`,
      confirmLabel: 'Delete Permanently',
      isDestructive: true,
      action: () => {
        LocalStorageService.deleteBooking(booking._id);
        refreshData();
        if (activeBooking && activeBooking._id === booking._id) {
          setActiveBooking(null);
        }
        setConfirmModal((prev) => ({ ...prev, open: false }));
        showNotification(`Booking ${booking.bookingReference} removed.`);
      }
    });
  };

  // Demo controls
  const handleResetDemoData = () => {
    setConfirmModal({
      open: true,
      title: 'Reset Demo Data',
      message:
        'Are you sure you want to reset all rooms, bookings, and settings to the original default demo state?',
      confirmLabel: 'Yes, Reset Data',
      isDestructive: true,
      action: () => {
        LocalStorageService.resetDemoData();
        refreshData();
        setActiveBooking(null);
        setConfirmModal((prev) => ({ ...prev, open: false }));
        showNotification('Demo data successfully reset to initial clean state.');
      }
    });
  };

  const handleCreateDemoBooking = () => {
    try {
      const demo = LocalStorageService.createDemoBooking();
      refreshData();
      showNotification(`Created demo booking: ${demo.bookingReference} for ${demo.customer?.name}.`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to create demo booking.');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            CONFIRMED
          </span>
        );
      case 'CHECKED_IN':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            CHECKED IN
          </span>
        );
      case 'CHECKED_OUT':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
            CHECKED OUT
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            PENDING
          </span>
        );
    }
  };

  // KPI Calculations
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const cancelledCount = bookings.filter((b) => b.status === 'CANCELLED').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-primary text-gold border-2 border-gold rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-gold shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner with Demo Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary to-primary-light rounded-3xl p-6 sm:p-8 text-cream border-2 border-gold/40 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-bright-gold">
              OPERATIONS OVERVIEW
            </span>
            <span className="text-[10px] uppercase font-bold bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">
              CLIENT DEMO • NO BACKEND
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Aahvaanam Lodge Administration
          </h1>
          <p className="text-xs text-cream/80">
            Kurnool New Bus Stand Property • Pure localStorage persistence
          </p>
        </div>

        {/* Demo Controls Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCreateDemoBooking}
            className="px-4 py-2.5 rounded-xl bg-gold text-brandDark font-extrabold text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Demo Booking</span>
          </button>

          <button
            onClick={handleResetDemoData}
            className="px-4 py-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-900 border border-rose-500/50 text-rose-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4 text-rose-300" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* 1. DASHBOARD STATISTICS (Section 9 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1.5 hover:border-gold/50 transition-colors">
          <span className="text-xs uppercase font-bold text-gray-500 tracking-wider block">
            Total Bookings
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brandDark">
            {bookings.length}
          </div>
          <span className="text-[11px] text-gray-400">All registered stays</span>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-1.5 bg-amber-50/30">
          <span className="text-xs uppercase font-bold text-amber-700 tracking-wider block">
            Pending Bookings
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-800">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-600">Awaiting confirmation</span>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-1.5 bg-emerald-50/30">
          <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider block">
            Confirmed Bookings
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800">
            {confirmedCount}
          </div>
          <span className="text-[11px] text-emerald-600">Active reservations</span>
        </div>

        {/* Cancelled Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm space-y-1.5 bg-rose-50/30">
          <span className="text-xs uppercase font-bold text-rose-700 tracking-wider block">
            Cancelled Bookings
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-800">
            {cancelledCount}
          </div>
          <span className="text-[11px] text-rose-600">Released slots</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-primary/20 shadow-sm space-y-1.5 bg-cream col-span-2 sm:col-span-1">
          <span className="text-xs uppercase font-bold text-primary tracking-wider block">
            Total Revenue
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-extrabold text-primary">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-gold-dark font-semibold">From confirmed bookings</span>
        </div>
      </div>

      {/* 2. BOOKING MANAGEMENT TABLE (Section 9 Requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-card-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
              ACTIVE RESERVATIONS
            </span>
            <h2 className="font-serif text-2xl font-bold text-primary mt-0.5">
              Live Bookings Directory
            </h2>
            <p className="text-xs text-gray-500">
              Real-time bookings from localStorage. Changes immediately update inventory & stats without reload.
            </p>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            Showing <strong className="text-brandDark">{bookings.length}</strong> bookings
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-gold mx-auto" />
            <h3 className="font-serif text-lg font-bold text-primary">No Bookings in System</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You can click &ldquo;Create Demo Booking&rdquo; above or make a booking from the public website.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Guest Name</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Room</th>
                    <th className="py-3.5 px-4">Check-in</th>
                    <th className="py-3.5 px-4">Check-out</th>
                    <th className="py-3.5 px-4 text-center">Guests</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {b.bookingReference}
                      </td>
                      <td className="py-3 px-4 font-bold text-brandDark">
                        {b.customer?.name}
                      </td>
                      <td className="py-3 px-4">
                        <a href={`tel:${b.customer?.phone}`} className="hover:text-primary font-medium">
                          {b.customer?.phone}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-800">#{b.room?.roomNumber}</span>
                        <span className="text-[10px] text-gray-400 block">{b.room?.roomType}</span>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {new Date(b.checkIn).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {new Date(b.checkOut).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">{b.guests}</td>
                      <td className="py-3 px-4 font-serif font-bold text-primary">
                        {b.totalAmount ? `₹${b.totalAmount.toLocaleString('en-IN')}` : '₹2,500'}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(b.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* View */}
                          <button
                            onClick={() => setActiveBooking(b)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Confirm */}
                          {b.status !== 'CONFIRMED' && b.status !== 'CHECKED_IN' && (
                            <button
                              onClick={() => handleStatusChange(b, 'CONFIRMED')}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Confirm Booking"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Cancel */}
                          {b.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleStatusChange(b, 'CANCELLED')}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => promptDeleteBooking(b)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-primary text-sm">
                        {b.bookingReference}
                      </span>
                      <h3 className="font-bold text-brandDark text-base">{b.customer?.name}</h3>
                    </div>
                    <div>{getStatusBadge(b.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold">ROOM</span>
                      <span className="font-bold text-brandDark">#{b.room?.roomNumber}</span> ({b.room?.roomType})
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold">GUESTS</span>
                      <span className="font-bold text-brandDark">{b.guests} Guests</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold">CHECK-IN</span>
                      <span>{new Date(b.checkIn).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold">CHECK-OUT</span>
                      <span>{new Date(b.checkOut).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                    <span className="font-serif font-bold text-primary text-sm">
                      {b.totalAmount ? `₹${b.totalAmount.toLocaleString('en-IN')}` : '₹2,500'}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setActiveBooking(b)}
                        className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold"
                      >
                        Details
                      </button>

                      {b.status !== 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusChange(b, 'CONFIRMED')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                        >
                          Confirm
                        </button>
                      )}

                      {b.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleStatusChange(b, 'CANCELLED')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 3. PHYSICAL ROOM OCCUPANCY MATRIX */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-card-soft space-y-6">
        <div className="pb-4 border-b border-gray-100">
          <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
            ROOM MATRIX
          </span>
          <h2 className="font-serif text-2xl font-bold text-primary mt-0.5">
            Today&apos;s Room Occupancy Status
          </h2>
          <p className="text-xs text-gray-500">
            Real-time status based on confirmed and checked-in reservations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.todayInventory.rooms.map((r) => (
            <div
              key={r._id}
              className={`rounded-2xl p-5 border transition-all ${
                r.liveStatus === 'AVAILABLE'
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : r.liveStatus === 'OCCUPIED'
                  ? 'bg-rose-50/40 border-rose-300'
                  : 'bg-amber-50/40 border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-2xl font-serif font-extrabold text-brandDark">
                    #{r.roomNumber}
                  </span>
                  <div className="text-xs font-bold text-gold uppercase mt-0.5">{r.roomType}</div>
                </div>
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      r.liveStatus === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.liveStatus === 'OCCUPIED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.liveStatus}
                  </span>
                </div>
              </div>

              {r.activeBooking ? (
                <div className="mt-3 pt-2.5 border-t border-rose-200 text-xs space-y-0.5 text-rose-900">
                  <div className="font-bold truncate">Guest: {r.activeBooking.guestName}</div>
                  <div className="text-[11px] text-gray-500">Ref: {r.activeBooking.bookingReference}</div>
                </div>
              ) : (
                <div className="mt-3 pt-2.5 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                  <span>Max {r.maxGuests} Guests</span>
                  <span className="font-bold text-primary">₹{r.price}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. DETAIL SLIDE-OVER DRAWER */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
                    RESERVATION DETAILS
                  </span>
                  <h2 className="font-mono text-2xl font-bold text-primary">
                    {activeBooking.bookingReference}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveBooking(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-bold text-gray-600">Current Status:</span>
                <div>{getStatusBadge(activeBooking.status)}</div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-primary flex items-center">
                  <User className="w-4 h-4 mr-2 text-gold" />
                  <span>Guest Information</span>
                </h4>
                <div className="p-4 rounded-xl bg-gray-50 text-xs space-y-2 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-bold text-brandDark">{activeBooking.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <a
                      href={`tel:${activeBooking.customer?.phone}`}
                      className="font-bold text-primary hover:underline"
                    >
                      {activeBooking.customer?.phone}
                    </a>
                  </div>
                  {activeBooking.customer?.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-bold text-brandDark">{activeBooking.customer?.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Details */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-primary flex items-center">
                  <BedDouble className="w-4 h-4 mr-2 text-gold" />
                  <span>Room Assignment</span>
                </h4>
                <div className="p-4 rounded-xl bg-gray-50 text-xs space-y-2 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Room:</span>
                    <span className="font-bold text-primary text-sm">
                      {activeBooking.room?.title} (#{activeBooking.room?.roomNumber})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-bold text-brandDark">{activeBooking.room?.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests:</span>
                    <span className="font-bold text-brandDark">{activeBooking.guests}</span>
                  </div>
                </div>
              </div>

              {/* Stay Dates */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-primary flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gold" />
                  <span>Dates of Stay</span>
                </h4>
                <div className="p-4 rounded-xl bg-gray-50 text-xs space-y-2 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-in:</span>
                    <span className="font-bold text-brandDark">
                      {new Date(activeBooking.checkIn).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-out:</span>
                    <span className="font-bold text-brandDark">
                      {new Date(activeBooking.checkOut).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Request */}
              {activeBooking.specialRequest && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                  <span className="font-bold text-amber-900 block">Special Request:</span>
                  <p className="text-amber-800">{activeBooking.specialRequest}</p>
                </div>
              )}

              {/* Tariff */}
              <div className="p-4 rounded-xl bg-cream border border-gold/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block">Total Tariff</span>
                  <span className="font-serif text-lg font-bold text-primary">
                    ₹{activeBooking.totalAmount ? activeBooking.totalAmount.toLocaleString('en-IN') : '2,500'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">Status</span>
                  <span className="font-bold text-brandDark">{activeBooking.status}</span>
                </div>
              </div>
            </div>

            {/* Quick Transition Action Buttons */}
            <div className="pt-6 border-t border-gray-200 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Workflow Status Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeBooking.status !== 'CONFIRMED' && (
                  <button
                    onClick={() => handleStatusChange(activeBooking, 'CONFIRMED')}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Confirm Booking
                  </button>
                )}

                {activeBooking.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleStatusChange(activeBooking, 'CANCELLED')}
                    className="py-2.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}

                <button
                  onClick={() => promptDeleteBooking(activeBooking)}
                  className="py-2.5 px-3 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-gray-50 font-bold text-xs rounded-xl transition-colors col-span-2"
                >
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
};
