import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Booking, BookingStatus } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  LogIn,
  LogOut,
  XCircle,
  Trash2,
  Calendar,
  Phone,
  Mail,
  User,
  BedDouble,
  Clock,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal / Drawer state
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    action: () => void;
    isDestructive?: boolean;
  }>({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    action: () => {}
  });

  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch paginated bookings
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-bookings', q, statusFilter, roomTypeFilter, sortOption, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '15',
        sort: sortOption,
        ...(q ? { q } : {}),
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
        ...(roomTypeFilter !== 'ALL' ? { roomType: roomTypeFilter } : {})
      });
      const res = await api.get(`/admin/bookings?${params.toString()}`);
      return res.data;
    }
  });

  const bookings: Booking[] = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  // Status transition mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const res = await api.patch(`/admin/bookings/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (res) => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      if (activeBooking && res.booking) {
        setActiveBooking(res.booking);
      }
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Status transition failed.');
    }
  });

  // Delete booking mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setActiveBooking(null);
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to delete booking.');
    }
  });

  const promptStatusChange = (booking: Booking, newStatus: BookingStatus) => {
    setActionError(null);
    setConfirmAction({
      open: true,
      title: `Update Status to ${newStatus}`,
      message: `Are you sure you want to change reservation ${booking.bookingReference} status to "${newStatus}"?`,
      action: () => {
        statusMutation.mutate({ id: booking._id, status: newStatus });
        setConfirmAction((prev) => ({ ...prev, open: false }));
      },
      isDestructive: newStatus === 'CANCELLED'
    });
  };

  const promptDeleteBooking = (booking: Booking) => {
    setActionError(null);
    setConfirmAction({
      open: true,
      title: `Delete Booking ${booking.bookingReference}`,
      message: `Permanently delete reservation ${booking.bookingReference} for ${booking.customer?.name}? This action cannot be undone.`,
      confirmLabel: 'Delete Permanently',
      isDestructive: true,
      action: () => {
        deleteMutation.mutate(booking._id);
        setConfirmAction((prev) => ({ ...prev, open: false }));
      }
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">CONFIRMED</span>;
      case 'CHECKED_IN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">CHECKED IN</span>;
      case 'CHECKED_OUT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">CHECKED OUT</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">PENDING</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
            HOTEL RESERVATIONS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
            Booking Management
          </h1>
          <p className="text-xs text-gray-500">
            Total of {totalCount} reservations registered in system.
          </p>
        </div>
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-rose-600 hover:text-rose-900 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* 1. SEARCH & FILTERS CONTROLS */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ref, Guest, Phone, Room..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold focus:ring-1 focus:ring-gold"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Room Type Filter */}
          <div>
            <select
              value={roomTypeFilter}
              onChange={(e) => {
                setRoomTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold focus:ring-1 focus:ring-gold"
            >
              <option value="ALL">All Room Types</option>
              <option value="Deluxe AC Room">Deluxe AC Room</option>
              <option value="Premium AC Room">Premium AC Room</option>
              <option value="Family Room">Family Room</option>
            </select>
          </div>

          {/* Sort Option */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold focus:ring-1 focus:ring-gold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="checkin_soonest">Check-In Soonest</option>
              <option value="checkout_soonest">Check-Out Soonest</option>
            </select>
          </div>

        </div>
      </div>

      {/* 2. BOOKINGS TABLE (Desktop) & CARDS (Mobile) */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading reservations...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm space-y-2">
          <h3 className="font-serif text-lg font-bold text-primary">No Bookings Match Your Criteria</h3>
          <p className="text-xs text-gray-500">Try clearing filters or search keywords.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Guest</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Room</th>
                    <th className="py-3.5 px-4">Check-In</th>
                    <th className="py-3.5 px-4">Check-Out</th>
                    <th className="py-3.5 px-4">Guests</th>
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
                      <td className="py-3 px-4 font-semibold text-brandDark">
                        {b.customer?.name}
                      </td>
                      <td className="py-3 px-4">
                        <a href={`tel:${b.customer?.phone}`} className="hover:text-primary">
                          {b.customer?.phone}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-800">#{b.room?.roomNumber}</span>
                        <span className="text-[10px] text-gray-400 block">{b.room?.roomType}</span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(b.checkIn).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(b.checkOut).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-bold">{b.guests}</td>
                      <td className="py-3 px-4">{getStatusBadge(b.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* View Drawer Button */}
                          <button
                            onClick={() => setActiveBooking(b)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Workflow buttons */}
                          {b.status === 'PENDING' && (
                            <button
                              onClick={() => promptStatusChange(b, 'CONFIRMED')}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Confirm Booking"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={() => promptStatusChange(b, 'CHECKED_IN')}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Check In Guest"
                            >
                              <LogIn className="w-4 h-4" />
                            </button>
                          )}

                          {b.status === 'CHECKED_IN' && (
                            <button
                              onClick={() => promptStatusChange(b, 'CHECKED_OUT')}
                              className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                              title="Check Out Guest"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          )}

                          {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                            <button
                              onClick={() => promptStatusChange(b, 'CANCELLED')}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => promptDeleteBooking(b)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Record"
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
          </div>

          {/* Mobile Cards View (Requirement 34) */}
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

                {/* Mobile Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                  <a
                    href={`tel:${b.customer?.phone}`}
                    className="flex items-center text-xs text-primary font-bold"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1 text-gold" />
                    <span>Call Guest</span>
                  </a>

                  <button
                    onClick={() => setActiveBooking(b)}
                    className="px-4 py-1.5 rounded-xl bg-primary text-cream text-xs font-bold uppercase tracking-wider"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 shadow-sm text-xs text-gray-600">
              <div>
                Page <span className="font-bold">{currentPage}</span> of{' '}
                <span className="font-bold">{totalPages}</span> ({totalCount} total)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. BOOKING DETAIL SLIDE-OVER DRAWER (Requirement 18) */}
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
                    <a href={`tel:${activeBooking.customer?.phone}`} className="font-bold text-primary hover:underline">
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
                    <span className="text-gray-500">Room Number:</span>
                    <span className="font-bold text-primary text-sm">#{activeBooking.room?.roomNumber}</span>
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
                  <span>Stay Dates</span>
                </h4>
                <div className="p-4 rounded-xl bg-gray-50 text-xs space-y-2 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-In:</span>
                    <span className="font-bold text-brandDark">
                      {new Date(activeBooking.checkIn).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-Out:</span>
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

              {/* Tariff & Payment */}
              <div className="p-4 rounded-xl bg-cream border border-gold/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block">Total Tariff</span>
                  <span className="font-serif text-lg font-bold text-primary">
                    {activeBooking.totalAmount ? `₹${activeBooking.totalAmount.toLocaleString('en-IN')}` : 'Contact for Price'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">Payment Status</span>
                  <span className="font-bold text-brandDark">{activeBooking.paymentStatus}</span>
                </div>
              </div>

            </div>

            {/* Transition Actions in Drawer (Requirement 18 & 19) */}
            <div className="pt-6 border-t border-gray-200 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Workflow Actions
              </span>

              <div className="grid grid-cols-2 gap-2">
                {activeBooking.status === 'PENDING' && (
                  <button
                    onClick={() => promptStatusChange(activeBooking, 'CONFIRMED')}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Confirm Booking
                  </button>
                )}

                {activeBooking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => promptStatusChange(activeBooking, 'CHECKED_IN')}
                    className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Check In Guest
                  </button>
                )}

                {activeBooking.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => promptStatusChange(activeBooking, 'CHECKED_OUT')}
                    className="py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors col-span-2"
                  >
                    Check Out Guest
                  </button>
                )}

                {(activeBooking.status === 'PENDING' || activeBooking.status === 'CONFIRMED') && (
                  <button
                    onClick={() => promptStatusChange(activeBooking, 'CANCELLED')}
                    className="py-2.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}

                <button
                  onClick={() => promptDeleteBooking(activeBooking)}
                  className="py-2.5 px-3 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-gray-50 font-bold text-xs rounded-xl transition-colors"
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
        isOpen={confirmAction.open}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmLabel={confirmAction.confirmLabel}
        isDestructive={confirmAction.isDestructive}
        onConfirm={confirmAction.action}
        onCancel={() => setConfirmAction((prev) => ({ ...prev, open: false }))}
      />

    </div>
  );
};
