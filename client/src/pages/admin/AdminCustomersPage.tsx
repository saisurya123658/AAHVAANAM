import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Customer, Booking } from '../../types';
import { Search, Phone, Mail, User, History, X, Calendar } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [q, setQ] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', q],
    queryFn: async () => {
      const res = await api.get(`/admin/customers${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      return res.data;
    }
  });

  const { data: customerHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['customer-history', selectedCustomerId],
    queryFn: async () => {
      const res = await api.get(`/admin/customers/${selectedCustomerId}`);
      return res.data;
    },
    enabled: !!selectedCustomerId
  });

  const customers = data?.data || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
            GUEST PROFILES
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
            Customer Directory
          </h1>
          <p className="text-xs text-gray-500">
            Registered guest accounts and stay histories stored in system.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
          />
        </div>
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading customer profiles...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm space-y-2">
          <h3 className="font-serif text-lg font-bold text-primary">No Customers Found</h3>
          <p className="text-xs text-gray-500">Guest records are automatically created upon room booking.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Total Stays</th>
                  <th className="py-3.5 px-4">Last Reservation</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c: any) => (
                  <tr key={c._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brandDark">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      <a href={`tel:${c.phone}`} className="text-primary hover:underline">
                        {c.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {c.email || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md">
                        {c.totalBookings} stay{c.totalBookings > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.lastBookingDate ? (
                        <span>{new Date(c.lastBookingDate).toLocaleDateString('en-IN')}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomerId(c._id)}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold text-[11px] uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>View History</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Booking History Drawer / Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg h-full p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
                    GUEST RESERVATION HISTORY
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-primary">
                    {customerHistory?.customer?.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Phone: {customerHistory?.customer?.phone}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-500">Loading stay history...</p>
                </div>
              ) : customerHistory?.bookings?.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-10">No bookings on file.</p>
              ) : (
                <div className="space-y-3">
                  {customerHistory?.bookings?.map((b: Booking) => (
                    <div
                      key={b._id}
                      className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold text-primary text-sm">
                          {b.bookingReference}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-800">
                          {b.status}
                        </span>
                      </div>

                      <div className="text-gray-600">
                        Room: <strong>#{b.room?.roomNumber}</strong> ({b.room?.roomType})
                      </div>

                      <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-200">
                        <span>Check-In: {new Date(b.checkIn).toLocaleDateString('en-IN')}</span>
                        <span>Check-Out: {new Date(b.checkOut).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="w-full py-2.5 bg-gray-100 text-brandDark font-bold text-xs rounded-xl"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
