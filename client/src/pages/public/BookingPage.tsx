import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Room } from '../../types';
import { LocalStorageService } from '../../services/localStorageService';
import {
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Clock,
  Ban,
  Building
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

const guestFormSchema = z.object({
  guestName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number').max(15),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  specialRequest: z.string().max(500).optional()
});

type GuestFormData = z.infer<typeof guestFormSchema>;

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  // Stepper state: 1 = Dates, 2 = Select Room, 3 = Guest Details, 4 = Review & Confirm
  const [step, setStep] = useState<number>(1);

  // Form parameters
  const [checkIn, setCheckIn] = useState<string>(searchParams.get('checkIn') || todayStr);
  const [checkOut, setCheckOut] = useState<string>(searchParams.get('checkOut') || tomorrowStr);
  const [guests, setGuests] = useState<number>(Number(searchParams.get('guests') || 2));
  const [roomType, setRoomType] = useState<string>(searchParams.get('roomType') || '');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Availability state computed directly from LocalStorage
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [unavailableRooms, setUnavailableRooms] = useState<Array<{ room: Room; conflictBooking: any }>>([]);

  // React Hook Form for guest details
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema)
  });

  // Calculate nights
  const calculateNights = () => {
    const a = new Date(checkIn);
    const b = new Date(checkOut);
    const diff = Math.ceil(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const nights = calculateNights();

  // Instant Availability Evaluation from localStorage
  const refreshAvailability = (inDate: string, outDate: string, numGuests: number, rType: string) => {
    const result = LocalStorageService.checkAvailability(inDate, outDate, numGuests, rType);
    setAvailableRooms(result.availablePhysicalRooms);
    setUnavailableRooms(result.unavailablePhysicalRooms);
    return result;
  };

  // Initial check on mount
  useEffect(() => {
    const targetRoomId = searchParams.get('roomId');
    const res = refreshAvailability(checkIn, checkOut, guests, roomType);

    if (targetRoomId) {
      const foundAvailable = res.availablePhysicalRooms.find((r) => r._id === targetRoomId);
      if (foundAvailable) {
        setSelectedRoom(foundAvailable);
        setStep(3); // jump directly to guest details if available
      } else {
        const foundUnavailable = res.unavailablePhysicalRooms.find((u) => u.room._id === targetRoomId);
        if (foundUnavailable) {
          setSubmissionError('The room you selected is no longer available for these dates. Please pick an alternative below.');
          setStep(2);
        }
      }
    } else if (searchParams.get('checkIn') && searchParams.get('checkOut')) {
      setStep(2);
    }
  }, [searchParams]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkOut <= checkIn) {
      setSubmissionError('Check-out date must be strictly after check-in date.');
      return;
    }
    setSubmissionError(null);
    refreshAvailability(checkIn, checkOut, guests, roomType);
    setStep(2);
  };

  const handleSelectRoom = (room: Room) => {
    // Check if room is available
    const isAvail = LocalStorageService.isRoomAvailable(room._id, checkIn, checkOut);
    if (!isAvail) {
      setSubmissionError('This room is no longer available for the selected dates.');
      return;
    }
    setSelectedRoom(room);
    setSubmissionError(null);
    setStep(3);
  };

  const onGuestSubmit = () => {
    setSubmissionError(null);
    setStep(4);
  };

  const handleConfirmReservation = async (guestData: GuestFormData) => {
    if (!selectedRoom) return;
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Double booking verification
      const isStillAvailable = LocalStorageService.isRoomAvailable(selectedRoom._id, checkIn, checkOut);
      if (!isStillAvailable) {
        throw new Error('This room is no longer available for the selected dates. Please choose another available room.');
      }

      // Calculate total amount
      const roomPrice = selectedRoom.price || 2500;
      const totalAmount = roomPrice * nights;

      // Save directly to localStorage
      const booking = LocalStorageService.createBooking({
        roomId: selectedRoom._id,
        guestName: guestData.guestName,
        phone: guestData.phone,
        email: guestData.email || undefined,
        checkIn,
        checkOut,
        guests,
        specialRequest: guestData.specialRequest || '',
        totalAmount
      });

      // Immediate transition to confirmation page
      navigate('/booking/confirmation', { state: { booking } });
    } catch (err: any) {
      setSubmissionError(err.message || 'Unable to confirm booking. Please review details.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen">
      {/* Header Banner */}
      <div className="bg-primary text-cream py-10 border-b border-gold/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            SECURE RESERVATION • CLIENT DEMO
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream">
            Book Your Stay at Aahvaanam
          </h1>
          <p className="text-xs sm:text-sm text-cream/80 max-w-lg mx-auto">
            Reserve your air-conditioned luxury room near Kurnool New Bus Stand. Instant offline confirmation.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Stepper Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gold transition-all duration-300 -z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, title: 'Dates' },
              { num: 2, title: 'Select Room' },
              { num: 3, title: 'Guest Details' },
              { num: 4, title: 'Review & Confirm' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center bg-ivory px-2 z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step >= s.num
                      ? 'bg-primary text-gold border-2 border-gold shadow-gold-glow'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 ${
                    step >= s.num ? 'text-primary font-bold' : 'text-gray-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {submissionError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold">{submissionError}</div>
          </div>
        )}

        {/* ================= STEP 1: DATES & GUESTS ================= */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold/30 shadow-card-soft space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-serif text-2xl font-bold text-primary">
                Step 1: Select Stay Dates & Guests
              </h2>
              <p className="text-xs text-gray-500">
                Standard check-in: {settings.checkInTime} • Check-out: {settings.checkOutTime}.
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (e.target.value >= checkOut) {
                        const next = new Date(e.target.value);
                        next.setDate(next.getDate() + 1);
                        setCheckOut(next.toISOString().slice(0, 10));
                      }
                    }}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5+ Guests (Family)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Preferred Room Type (Optional)
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                  >
                    <option value="">Any Room Type</option>
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Premium Room">Premium Room</option>
                    <option value="Family Suite">Family Suite</option>
                    <option value="Luxury Suite">Luxury Suite</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center space-x-2"
                >
                  <span>Check Available Rooms</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 2: SELECT AVAILABLE ROOM ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gold/30 shadow-card-soft flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">
                  Step 2: Choose Your Room
                </h2>
                <p className="text-xs text-gray-500">
                  Stay: <span className="font-bold text-brandDark">{checkIn}</span> to{' '}
                  <span className="font-bold text-brandDark">{checkOut}</span> ({nights} night{nights > 1 ? 's' : ''}), {guests} Guest{guests > 1 ? 's' : ''}
                </p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-primary hover:text-gold underline"
              >
                Change Dates
              </button>
            </div>

            {/* If no rooms at all are available */}
            {availableRooms.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center border border-rose-300 shadow-sm space-y-4">
                <Ban className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-primary">
                  No rooms are available for your selected dates.
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  All rooms have existing reservations for {checkIn} to {checkOut}. Please select different dates or contact reception directly.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 bg-primary text-cream rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  CHANGE DATES
                </button>
              </div>
            )}

            {/* Available Rooms Grid */}
            {availableRooms.length > 0 && (
              <div className="space-y-4">
                <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  <span>Available for Your Dates ({availableRooms.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableRooms.map((room) => {
                    const cover =
                      room.images && room.images.length > 0
                        ? room.images[0]
                        : '/images/rooms/room_deluxe_double_bed.jpg';

                    return (
                      <div
                        key={room._id}
                        className="bg-white rounded-2xl overflow-hidden border border-gold/30 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-48 bg-gray-100">
                          <img src={cover} alt={room.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 bg-primary/90 text-gold text-xs font-bold px-2.5 py-1 rounded-lg">
                            Room #{room.roomNumber}
                          </div>
                          <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            <span>Available</span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-[11px] uppercase font-bold text-gold">
                              {room.roomType}
                            </span>
                            <h3 className="font-serif text-xl font-bold text-primary">
                              {room.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {room.description || 'Clean luxury room with WiFi, AC, and 24/7 hot water.'}
                            </p>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {room.amenities.slice(0, 3).map((a, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-cream px-2 py-0.5 rounded text-primary-light font-medium border border-gold/20"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-gray-400 block font-semibold uppercase">
                                Tariff
                              </span>
                              <span className="text-sm font-bold text-primary">
                                {room.price ? `₹${room.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                                <span className="text-[10px] text-gray-500 font-normal"> / night</span>
                              </span>
                            </div>

                            <button
                              onClick={() => handleSelectRoom(room)}
                              className="px-5 py-2.5 bg-gradient-to-r from-bright-gold to-gold text-brandDark font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
                            >
                              BOOK THIS ROOM
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Unavailable Rooms Section (Section 11 requirement) */}
            {unavailableRooms.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                <div className="text-xs uppercase font-extrabold tracking-wider text-rose-700 flex items-center">
                  <Ban className="w-4 h-4 mr-1.5 text-rose-600" />
                  <span>Unavailable for Selected Dates ({unavailableRooms.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {unavailableRooms.map(({ room, conflictBooking }) => (
                    <div
                      key={room._id}
                      className="bg-gray-50 rounded-2xl overflow-hidden border border-rose-200 opacity-80 flex flex-col justify-between"
                    >
                      <div className="relative h-40 bg-gray-200 grayscale">
                        <img
                          src={room.images[0] || '/images/rooms/room_deluxe_double_bed.jpg'}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-gray-800 text-gray-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                          Room #{room.roomNumber}
                        </div>
                        <div className="absolute top-3 right-3 bg-rose-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                          Unavailable
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-500">{room.roomType}</span>
                          <h4 className="font-serif text-base font-bold text-gray-700">{room.title}</h4>
                        </div>

                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                          <p className="font-semibold">This room is no longer available for the selected dates.</p>
                          <p className="text-[11px] text-rose-700 mt-0.5">
                            Reserved from {new Date(conflictBooking.checkIn).toLocaleDateString('en-IN')} to{' '}
                            {new Date(conflictBooking.checkOut).toLocaleDateString('en-IN')}.
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500">
                            {room.price ? `₹${room.price.toLocaleString('en-IN')}/night` : ''}
                          </span>
                          <button
                            disabled
                            className="px-4 py-2 bg-gray-200 text-gray-400 font-bold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed"
                          >
                            UNAVAILABLE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: GUEST DETAILS ================= */}
        {step === 3 && selectedRoom && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold/30 shadow-card-soft space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">
                  Step 3: Guest Information
                </h2>
                <p className="text-xs text-gray-500">
                  Selected: <span className="font-bold text-primary">{selectedRoom.title}</span> (Room #{selectedRoom.roomNumber})
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-xs font-bold text-primary hover:text-gold underline"
              >
                Change Room
              </button>
            </div>

            <form onSubmit={handleSubmit(onGuestSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ravi Kumar"
                    {...register('guestName')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                  />
                  {errors.guestName && (
                    <p className="text-xs text-red-500 mt-1">{errors.guestName.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. ravi.kumar@example.com"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                  Special Request or Arrival Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Arriving late by 8 PM, require extra blanket..."
                  {...register('specialRequest')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold text-sm font-medium"
                />
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1 text-gold-dark" />
                  <span>Important Check-in Policy</span>
                </div>
                <p>{settings.bookingInstructions}</p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center space-x-2"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 4: REVIEW SUMMARY & CONFIRM ================= */}
        {step === 4 && selectedRoom && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold/30 shadow-card-soft space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs uppercase font-bold text-gold tracking-widest">
                STEP 4 OF 4
              </span>
              <h2 className="font-serif text-2xl font-bold text-primary mt-0.5">
                Review & Confirm Reservation
              </h2>
              <p className="text-xs text-gray-500">
                Please verify your stay details below before confirming your booking.
              </p>
            </div>

            {/* Breakdown card */}
            <div className="p-6 rounded-2xl bg-cream border border-gold/40 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gold/20 text-xs">
                <div>
                  <span className="text-gray-500 block font-medium">Room:</span>
                  <span className="font-bold text-primary text-sm">{selectedRoom.title}</span>
                  <span className="text-[11px] text-gray-500 block">
                    Room #{selectedRoom.roomNumber} ({selectedRoom.roomType})
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Guests:</span>
                  <span className="font-bold text-primary text-sm">{guests} Guest{guests > 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Check-In:</span>
                  <span className="font-bold text-brandDark text-sm">{checkIn}</span>
                  <span className="text-[11px] text-gray-500 block">{settings.checkInTime}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Check-Out:</span>
                  <span className="font-bold text-brandDark text-sm">{checkOut}</span>
                  <span className="text-[11px] text-gray-500 block">{settings.checkOutTime}</span>
                </div>
              </div>

              {/* Nights and price summary */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-600 font-medium">Total Duration:</span>
                <span className="font-bold text-brandDark">{nights} Night{nights > 1 ? 's' : ''}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Tariff Rate:</span>
                <span className="font-bold text-primary">
                  {selectedRoom.price ? `₹${selectedRoom.price.toLocaleString('en-IN')} / night` : '₹2,500 / night'}
                </span>
              </div>

              <div className="pt-3 border-t border-gold/30 flex items-center justify-between">
                <span className="font-serif text-base font-bold text-primary">Total Amount:</span>
                <span className="font-serif text-2xl font-extrabold text-primary">
                  ₹{((selectedRoom.price || 2500) * nights).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Instant Confirmation Notice */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Instant Confirmation Available</span>
                <span>Your reservation will be saved immediately and a unique booking reference will be generated.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit(handleConfirmReservation)}
                className="px-8 py-4 bg-gradient-to-r from-bright-gold via-gold to-yellow-600 text-brandDark font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-brandDark border-t-transparent rounded-full animate-spin" />
                    <span>Processing Reservation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>CONFIRM BOOKING</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
