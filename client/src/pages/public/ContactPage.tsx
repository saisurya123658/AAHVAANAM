import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../api/client';
import { useSettings } from '../../hooks/useSettings';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().int().min(1).optional().default(1),
  message: z.string().min(5, 'Please provide a message or inquiry details')
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setServerError(null);
    try {
      await api.post('/enquiries', data);
      setSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Failed to submit enquiry. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-primary text-cream py-14 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            GET IN TOUCH
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cream">
            Contact Aahvaanam
          </h1>
          <div className="gold-divider mx-auto w-24" />
          <p className="text-cream/80 text-sm max-w-xl mx-auto pt-1">
            Have questions regarding group reservations, exam stays, or wedding party accommodation? Reach out to our front desk anytime.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-card-soft space-y-6">
              
              <div>
                <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
                  HOTEL RECEPTION
                </span>
                <h2 className="font-serif text-2xl font-bold text-primary">
                  {settings.hotelName}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {settings.location}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">Direct Phone</span>
                    <a href={`tel:${cleanPhone}`} className="font-bold text-primary hover:text-gold text-base">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">WhatsApp Desk</span>
                    <a
                      href={`https://wa.me/${settings.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:underline text-base"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-gold/15 text-gold-dark shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">Timings</span>
                    <div className="text-xs text-gray-700">Check-in: <strong>{settings.checkInTime}</strong></div>
                    <div className="text-xs text-gray-700">Check-out: <strong>{settings.checkOutTime}</strong></div>
                    <div className="text-xs text-emerald-600 font-semibold mt-0.5">Reception Open 24/7</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">Landmark</span>
                    <p className="text-xs text-gray-700">{settings.landmark}</p>
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-primary font-bold hover:underline mt-1"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Instant Call / WhatsApp Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${cleanPhone}`}
                  className="py-3 px-4 rounded-xl bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  <span>CALL NOW</span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WHATSAPP</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Guest Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-card-soft space-y-6">
              
              <div>
                <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
                  SEND MESSAGE
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                  Send an Enquiry
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Fill out the form below. Inquiries are stored in our lodge management system and attended to promptly.
                </p>
              </div>

              {success && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Thank you! Your enquiry has been received.</h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      Our front desk will review your details and call you shortly. For immediate room booking, feel free to call +91 96402 89999.
                    </p>
                  </div>
                </div>
              )}

              {serverError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Reddy"
                      {...register('name')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9640289999"
                      {...register('phone')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      {...register('email')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                      Tentative Guests Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      defaultValue={1}
                      {...register('guests', { valueAsNumber: true })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                      Tentative Check-In (Optional)
                    </label>
                    <input
                      type="date"
                      {...register('checkIn')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                      Tentative Check-Out (Optional)
                    </label>
                    <input
                      type="date"
                      {...register('checkOut')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you require (e.g. marriage group stay, college exam accommodation, multiple rooms)..."
                    {...register('message')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-gold" />
                    <span>{submitting ? 'Submitting Enquiry...' : 'SUBMIT ENQUIRY'}</span>
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
