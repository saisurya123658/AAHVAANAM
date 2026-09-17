import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Room } from '../../types';
import { LocalStorageService } from '../../services/localStorageService';
import { Lightbox } from '../../components/common/Lightbox';
import {
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { settings } = useSettings();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: room, isLoading, error } = useQuery<Room | null>({
    queryKey: ['room', id],
    queryFn: async () => (id ? LocalStorageService.getRoomById(id) : null),
    initialData: () => (id ? LocalStorageService.getRoomById(id) || undefined : undefined),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium text-sm">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-ivory">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl border border-gold/30 shadow-lg text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-primary">Room Not Found</h2>
          <p className="text-sm text-gray-600">The room you requested does not exist or has been removed.</p>
          <Link
            to="/rooms"
            className="inline-block px-6 py-2.5 bg-primary text-cream rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Browse All Rooms
          </Link>
        </div>
      </div>
    );
  }

  const roomImages = room.images && room.images.length > 0
    ? room.images
    : ['/images/rooms/room_deluxe_double_bed.jpg'];

  return (
    <div className="pt-28 pb-20 bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="text-xs font-medium text-gray-500 mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-gold transition-colors">Rooms</Link>
          <span>/</span>
          <span className="text-primary font-bold">{room.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Active Image with Lightbox trigger */}
            <div className="relative rounded-2xl overflow-hidden shadow-card-soft border border-gold/30 bg-black aspect-[4/3] group">
              <img
                src={roomImages[activeImageIndex]}
                alt={room.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Fullscreen Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-cream hover:text-gold backdrop-blur-sm transition-colors"
                title="View Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {/* Previous / Next Arrows */}
              {roomImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : roomImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-cream transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < roomImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-cream transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Room Number Badge */}
              <div className="absolute bottom-4 left-4 bg-primary/90 text-gold text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-gold/40">
                Room #{room.roomNumber}
              </div>
            </div>

            {/* Thumbnails Row */}
            {roomImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {roomImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === activeImageIndex ? 'border-gold scale-105 shadow-gold-glow' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Hygiene & Verification Guarantee */}
            <div className="bg-white rounded-2xl p-5 border border-gold/20 flex items-center space-x-4 shadow-sm">
              <div className="p-3 rounded-xl bg-gold/15 text-gold-dark">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-primary">Sanitized & FreshUp Guaranteed</h4>
                <p className="text-xs text-gray-500">Every room undergoes fresh linen replacement and thorough bathroom sanitation before each guest check-in.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Room Info & Booking CTA */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold/30 shadow-card-soft space-y-6">
              
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-gold block mb-1">
                  {room.roomType}
                </span>
                <h1 className="font-serif text-3xl font-bold text-primary">
                  {room.title}
                </h1>
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                  <div className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                    <Users className="w-3.5 h-3.5 mr-1 text-gold" />
                    <span>Up to {room.maxGuests} Guests</span>
                  </div>
                  <div className="flex items-center bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>Ready for Occupancy</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="p-4 rounded-xl bg-cream border border-gold/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
                  Reservation Tariff
                </span>
                <div className="font-serif text-2xl font-bold text-primary">
                  {room.price ? `₹${room.price.toLocaleString('en-IN')} / night` : 'Contact for Price'}
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Taxes included. Standard check-in {settings.checkInTime}, check-out {settings.checkOutTime}.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-serif text-base font-bold text-primary">
                  Room Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {room.description ||
                    'Thoughtfully designed with spotless flooring, energy-efficient split AC, clean linens, attached modern bathroom with 24-hour hot water, and high-speed WiFi connectivity.'}
                </p>
              </div>

              {/* Amenities List */}
              <div className="space-y-3">
                <h3 className="font-serif text-base font-bold text-primary">
                  Included Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {room.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-gold mr-2 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  to={`/booking?roomId=${room._id}&roomType=${encodeURIComponent(room.roomType)}`}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-bright-gold via-gold to-yellow-600 text-brandDark font-extrabold text-sm uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>BOOK THIS ROOM NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="w-full py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-3.5 h-3.5 text-gold" />
                  <span>CALL RECEPTION FOR INQUIRY</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Fullscreen Lightbox */}
      <Lightbox
        images={roomImages}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : roomImages.length - 1))}
        onNext={() => setActiveImageIndex((prev) => (prev < roomImages.length - 1 ? prev + 1 : 0))}
        title={room.title}
      />
    </div>
  );
};
