import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { GalleryItem } from '../../types';
import { Lightbox } from '../../components/common/Lightbox';
import { Sparkles, Maximize2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: galleryItems = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['gallery', selectedCategory],
    queryFn: async () => {
      const q = selectedCategory !== 'ALL' ? `?category=${selectedCategory}` : '';
      const res = await api.get(`/gallery${q}`);
      return res.data?.items || [];
    }
  });

  const categories = [
    { label: 'All Photos', value: 'ALL' },
    { label: 'Rooms', value: 'ROOMS' },
    { label: 'Bathrooms', value: 'BATHROOM' },
    { label: 'Property & Hall', value: 'PROPERTY' },
    { label: 'Facilities & Comfort', value: 'FACILITIES' },
    { label: 'Exterior & Poster', value: 'EXTERIOR' }
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-primary text-cream py-14 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            AUTHENTIC HOTEL PHOTOGRAPHY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cream">
            Photo Gallery
          </h1>
          <div className="gold-divider mx-auto w-24" />
          <p className="text-cream/80 text-sm max-w-xl mx-auto pt-1">
            Explore our spotless AC rooms, designer cove-lit master suites, pristine modern bathrooms, and warm hospitality in Kurnool.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary text-cream shadow-md border-2 border-gold'
                  : 'bg-white text-brandDark border border-gray-200 hover:border-gold'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 font-medium text-xs">Loading authentic photographs...</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && galleryItems.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-gold mx-auto" />
            <h3 className="font-serif text-xl font-bold text-primary">No images in this category</h3>
            <p className="text-xs text-gray-500">Select another category tab to view photos.</p>
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={item._id}
              onClick={() => openLightbox(idx)}
              className="relative h-64 rounded-2xl overflow-hidden shadow-card-soft border border-gold/30 cursor-pointer group bg-gray-100"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-cream">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gold uppercase font-bold tracking-widest">
                    {item.category}
                  </span>
                  <div className="p-1.5 rounded-lg bg-black/40 text-gold">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-serif text-sm font-bold text-white mt-1 leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      <Lightbox
        images={galleryItems.map((g) => g.imageUrl)}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0))}
        title={galleryItems[lightboxIndex]?.title}
      />
    </div>
  );
};
