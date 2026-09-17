import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Enquiry, EnquiryStatus } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Phone, Mail, CheckCircle2, MessageSquare, Trash2, Clock, Calendar } from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-enquiries', statusFilter],
    queryFn: async () => {
      const q = statusFilter !== 'ALL' ? `?status=${statusFilter}` : '';
      const res = await api.get(`/admin/enquiries${q}`);
      return res.data?.enquiries || [];
    }
  });

  const enquiries: Enquiry[] = data || [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: EnquiryStatus }) => {
      await api.patch(`/admin/enquiries/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/enquiries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] });
      setDeleteConfirm({ open: false, id: null });
    }
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'CONTACTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">CONTACTED</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">CLOSED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">NEW</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
            INQUIRIES & LEADS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
            Enquiry Management
          </h1>
          <p className="text-xs text-gray-500">
            Messages and stay requests submitted via the public contact form.
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm space-y-2">
          <MessageSquare className="w-8 h-8 text-gold mx-auto" />
          <h3 className="font-serif text-lg font-bold text-primary">No Enquiries Found</h3>
          <p className="text-xs text-gray-500">New customer inquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div
              key={e._id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4 hover:border-gold/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-base text-brandDark">{e.name}</h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-0.5">
                    <a href={`tel:${e.phone}`} className="flex items-center text-primary font-bold hover:underline">
                      <Phone className="w-3.5 h-3.5 mr-1 text-gold" />
                      <span>{e.phone}</span>
                    </a>
                    {e.email && (
                      <span className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        <span>{e.email}</span>
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400">
                      Received: {new Date(e.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>{getStatusBadge(e.status)}</div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl bg-gray-50 text-xs text-gray-700 leading-relaxed border border-gray-100">
                <span className="font-bold text-primary block mb-1">Inquiry Message:</span>
                <p>{e.message}</p>
                {(e.checkIn || e.checkOut) && (
                  <div className="mt-2 pt-2 border-t border-gray-200 flex items-center space-x-4 text-[11px] text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-gold" />
                      Dates: {e.checkIn || 'N/A'} to {e.checkOut || 'N/A'}
                    </span>
                    <span>Guests: {e.guests || 1}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  {e.status !== 'CONTACTED' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: e._id, status: 'CONTACTED' })}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {e.status !== 'CLOSED' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: e._id, status: 'CLOSED' })}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs"
                    >
                      Mark Closed
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setDeleteConfirm({ open: true, id: e._id })}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Enquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.open}
        title="Delete Enquiry"
        message="Permanently remove this enquiry from the database?"
        isDestructive={true}
        onConfirm={() => deleteConfirm.id && deleteMutation.mutate(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />

    </div>
  );
};
