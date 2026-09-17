import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Room } from '../../types';
import { LocalStorageService } from '../../services/localStorageService';
import { SearchWidget } from '../../components/common/SearchWidget';
import { Users, Check, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const { data: rooms = [], isLoading, error } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => LocalStorageService.getRooms(),
    initialData: () => LocalStorageService.getRooms()
  });

  const filteredRooms = rooms.filter((room) => {
    if (selectedType === 'ALL') return true;
    return (
      room.roomType === selectedType ||
      room.roomType.toLowerCase().includes(selectedType.toLowerCase().replace(' room', '').replace(' suite', ''))
    );
  });

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen">
      
      {/* Page Header */}
      <div className="bg-primary text-cream py-14 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            ACCOMMODATION IN KURNOOL
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cream">
            Our Luxury Rooms
          </h1>
          <div className="gold-divider mx-auto w-24" />
          <p className="text-cream/80 text-sm max-w-xl mx-auto pt-1">
            Experience spotless hygiene, chilled air conditioning, 24/7 hot water, and tranquil comfort right by Kurnool New Bus Stand.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <SearchWidget compact={false} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {['ALL', 'Deluxe Room', 'Premium Room', 'Family Suite', 'Luxury Suite'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                selectedType === type
                  ? 'bg-primary text-cream shadow-md border-2 border-gold'
                  : 'bg-white text-brandDark border border-gray-200 hover:border-gold'
              }`}
            >
              {type === 'ALL' ? 'All Rooms' : type}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 text-sm font-medium">Loading luxury rooms...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto my-12 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="font-bold text-rose-900">Failed to load rooms</h3>
            <p className="text-xs text-rose-700">Please verify your connection and try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredRooms.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-gold mx-auto" />
            <h3 className="font-serif text-xl font-bold text-primary">No rooms found</h3>
            <p className="text-xs text-gray-500">Try selecting a different room type filter.</p>
          </div>
        )}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => {
            const coverImage = room.images && room.images.length > 0
              ? room.images[0]
              : '/images/rooms/room_deluxe_double_bed.jpg';

            return (
              <div
                key={room._id}
                className="bg-white rounded-2xl overflow-hidden border border-gold/30 shadow-card-soft hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Photo Preview */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={coverImage}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-gold font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-gold/40">
                    Room {room.roomNumber}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-cream text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-gold" />
                    <span>Max {room.maxGuests}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-gold mb-1">
                      {room.roomType}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-primary">
                      {room.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                      {room.description || 'Spacious, clean air-conditioned room with 24/7 hot water and lift facility.'}
                    </p>

                    {/* Amenities list */}
                    <div className="pt-3 flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 4).map((amenity, aIdx) => (
                        <span
                          key={aIdx}
                          className="inline-flex items-center text-[11px] bg-cream text-primary-light font-medium px-2.5 py-1 rounded-md border border-gold/20"
                        >
                          <Check className="w-3 h-3 text-gold mr-1" />
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-[11px] text-gray-400 py-1 px-1">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                        Rate
                      </span>
                      <span className="text-sm font-extrabold text-primary">
                        {room.price ? `₹${room.price.toLocaleString('en-IN')} / night` : 'Contact for Price'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/rooms/${room._id}`}
                        className="px-3 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 text-xs font-bold transition-colors"
                      >
                        Details
                      </Link>

                      <Link
                        to={`/booking?roomId=${room._id}`}
                        className="px-4 py-2 rounded-lg bg-primary text-cream hover:bg-primary-light text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center space-x-1"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
