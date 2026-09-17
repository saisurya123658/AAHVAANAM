import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { AdminUser, AdminRole } from '../../types';
import { Plus, Edit2, ShieldCheck, Power, X, KeyRound, AlertCircle } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminRole>('ADMIN');
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/admins');
      return res.data?.admins || [];
    }
  });

  const admins: AdminUser[] = data || [];

  const openCreateModal = () => {
    setSelectedAdmin(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('ADMIN');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPassword('');
    setRole(admin.role);
    setError(null);
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (selectedAdmin) {
        const id = selectedAdmin._id || selectedAdmin.id;
        const res = await api.patch(`/admin/admins/${id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/admin/admins', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setModalOpen(false);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to save admin user.');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.patch(`/admin/admins/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name,
      email,
      role
    };
    if (password.trim()) {
      payload.password = password.trim();
    }
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
            SECURITY & ACCESS CONTROL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
            Admin User Management
          </h1>
          <p className="text-xs text-gray-500">
            Create staff credentials, assign roles (SUPER_ADMIN, ADMIN, STAFF), and manage access.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider shadow-md flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>CREATE ADMIN</span>
        </button>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading admin users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((u) => {
                  const id = u._id || u.id || '';
                  return (
                    <tr key={id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-brandDark">
                        {u.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'ADMIN'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.isActive !== false ? (
                          <span className="text-emerald-600 font-bold">Active</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Deactivated</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => toggleStatusMutation.mutate({ id, isActive: u.isActive === false })}
                            className={`p-1.5 rounded-lg ${
                              u.isActive !== false ? 'text-gray-400 hover:text-gray-600' : 'text-emerald-600'
                            }`}
                            title={u.isActive !== false ? 'Deactivate Account' : 'Activate Account'}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary/5"
                            title="Edit Admin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gold/30">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-xl font-bold text-primary">
                {selectedAdmin ? 'Edit Admin User' : 'Create Admin User'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {selectedAdmin ? 'Reset Password (optional)' : 'Password (min 6 characters) *'}
                </label>
                <input
                  type="password"
                  required={!selectedAdmin}
                  placeholder={selectedAdmin ? 'Leave blank to keep unchanged' : '••••••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Role Permission *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full system access & admin management)</option>
                  <option value="ADMIN">ADMIN (Manage bookings, rooms, gallery & enquiries)</option>
                  <option value="STAFF">STAFF (Manage daily bookings and check-ins)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2 bg-primary text-cream hover:bg-primary-light rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
