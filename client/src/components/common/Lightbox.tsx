import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  title?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
  title
}) => {
  const [zoomed, setZoomed] = React.useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-white/90 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-sm font-medium tracking-wide">
          <span className="text-gold font-bold">{currentIndex + 1}</span> / {images.length}
          {title && <span className="ml-3 text-cream/80 hidden sm:inline">• {title}</span>}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setZoomed(!zoomed)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title={zoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {zoomed ? <ZoomOut className="w-5 h-5 text-gold" /> : <ZoomIn className="w-5 h-5 text-gold" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-6 h-6 text-cream hover:text-gold" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 border border-gold/40 text-cream hover:text-gold transition-all z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 border border-gold/40 text-cream hover:text-gold transition-all z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="relative max-w-5xl max-h-[85vh] p-4 flex items-center justify-center overflow-auto">
        <img
          src={images[currentIndex]}
          alt={title || 'Aahvaanam Luxury Rooms'}
          className={`rounded-lg object-contain transition-transform duration-300 shadow-2xl ${
            zoomed ? 'scale-150 cursor-zoom-out' : 'max-h-[80vh] cursor-zoom-in'
          }`}
          onClick={() => setZoomed(!zoomed)}
          loading="lazy"
        />
      </div>

      {/* Bottom Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 px-4 overflow-x-auto py-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setZoomed(false);
                // Parent can change index
              }}
              className={`w-12 h-10 rounded border-2 overflow-hidden transition-all shrink-0 ${
                idx === currentIndex ? 'border-gold scale-110 shadow-gold-glow' : 'border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
