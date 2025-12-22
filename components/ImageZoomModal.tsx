import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  productName?: string;
}

const ImageZoomModal = ({ isOpen, onClose, images, initialIndex = 0, productName }: ImageZoomModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [touchDistance, setTouchDistance] = useState(0);

  // إعادة ضبط الحالة عند الفتح أو تغيير الصورة
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [initialIndex, isOpen]);

  const handlePrev = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // التحكم بلوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 5));
  const handleZoomOut = () => setScale((prev) => {
    const newScale = Math.max(prev - 0.5, 1);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
    return newScale;
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      const maxPan = (scale - 1) * 300;
      setPosition({ x: Math.max(-maxPan, Math.min(maxPan, newX)), y: Math.max(-maxPan, Math.min(maxPan, newY)) });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setTouchDistance(Math.sqrt(dx * dx + dy * dy));
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      if (touchDistance > 0) {
        const delta = newDist / touchDistance;
        setScale(prev => Math.min(Math.max(prev * delta, 1), 5));
      }
      setTouchDistance(newDist);
    } else if (isDragging && scale > 1) {
      const newX = e.touches[0].clientX - startPos.x;
      const newY = e.touches[0].clientY - startPos.y;
      const maxPan = (scale - 1) * 300;
      setPosition({ x: Math.max(-maxPan, Math.min(maxPan, newX)), y: Math.max(-maxPan, Math.min(maxPan, newY)) });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col select-none touch-none"
        >
          <div className="flex items-center justify-between p-4 z-50">
            <button onClick={onClose} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl">
              <button onClick={handleZoomOut} className="p-2 text-white/70 hover:text-white"><ZoomOut size={20} /></button>
              <span className="text-white font-mono min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
              <button onClick={handleZoomIn} className="p-2 text-white/70 hover:text-white"><ZoomIn size={20} /></button>
            </div>
            <div className="text-white/70 text-sm font-medium">{currentIndex + 1} / {images.length}</div>
          </div>

          <div 
            ref={imageContainerRef}
            className="flex-1 relative overflow-hidden flex items-center justify-center cursor-move"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setIsDragging(false)}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => {setIsDragging(false); setTouchDistance(0);}}
          >
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={productName || ''}
              className="max-w-[95%] max-h-[90%] object-contain pointer-events-none"
              animate={{ scale, x: position.x, y: position.y }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />

            {images.length > 1 && scale === 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-4 p-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"><ChevronLeft size={32} /></button>
                <button onClick={handleNext} className="absolute right-4 p-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"><ChevronRight size={32} /></button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="p-6 overflow-x-auto flex justify-center gap-3 bg-gradient-to-t from-black/50 to-transparent">
              {images.map((img, idx) => (
                <button 
                  key={idx} onClick={() => { setCurrentIndex(idx); setScale(1); setPosition({ x: 0, y: 0 }); }}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${currentIndex === idx ? 'border-primary scale-110 shadow-lg shadow-primary/40' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageZoomModal;