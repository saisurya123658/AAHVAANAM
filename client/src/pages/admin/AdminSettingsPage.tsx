import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Settings } from '../../types';
import { Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data?.settings;
    }
  });

  const [formData, setFormData] = useState<Settings>({
    hotelName: '',
    phone: '',
    whatsappNumber: '',
    location: '',
    landmark: '',
    address: '',
    googleMapsUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    checkInTime: '',
    checkOutTime: '',
    bookingInstructions: '',
    contactMessage: ''
  });

  useEffect(() => {
    if (settingsData) {
      setFormData(settingsData);
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<Settings>) => {
      const res = await api.put('/admin/settings', payload);
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setTimeout(() => setSuccess(false), 4000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to update hotel settings.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-medium">Loading hotel settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
          SYSTEM CONFIGURATION
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
          Hotel Settings
        </h1>
        <p className="text-xs text-gray-500">
          Update verified property details, contact numbers, and policies without editing code.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Hotel settings updated successfully and published to website!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        
        {/* Core Identity */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-primary border-b border-gray-100 pb-2">
            Property Brand & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                Hotel Name *
              </label>
              <input
                type="text"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                Primary Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                WhatsApp Desk Number (with country code, no +) *
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                placeholder="919640289999"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                Prominent Landmark *
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Location & Map */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-serif text-lg font-bold text-primary border-b border-gray-100 pb-2">
            Location & Map URL
          </h3>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
              Location Summary *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
              Full Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
              Google Maps URL
            </label>
            <input
              type="url"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
            />
          </div>
        </div>

        {/* Timings & Policies */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-serif text-lg font-bold text-primary border-b border-gray-100 pb-2">
            Stay Timings & Guest Policy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                Standard Check-In Time
              </label>
              <input
                type="text"
                name="checkInTime"
                value={formData.checkInTime}
                onChange={handleChange}
                placeholder="12:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                Standard Check-Out Time
              </label>
              <input
                type="text"
                name="checkOutTime"
                value={formData.checkOutTime}
                onChange={handleChange}
                placeholder="11:00 AM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
              Booking & Check-In Instructions
            </label>
            <textarea
              rows={2}
              name="bookingInstructions"
              value={formData.bookingInstructions}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
              Contact / Welcome Message
            </label>
            <textarea
              rows={2}
              name="contactMessage"
              value={formData.contactMessage}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-8 py-3 bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center space-x-2"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>{updateMutation.isPending ? 'Saving...' : 'SAVE SETTINGS'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
