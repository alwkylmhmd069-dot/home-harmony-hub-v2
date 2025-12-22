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
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [touchDistance, setTouchDistance] = useState(0);

  // Reset state when opening or changing image
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((prev) => {
      const newScale = Math.min(Math.max(prev + delta, 1), 4);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container || !isOpen) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isOpen, handleWheel]);

  const handlePrev = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      // Limit panning based on scale
      const maxPan = (scale - 1) * 200;
      setPosition({ 
        x: Math.max(-maxPan, Math.min(maxPan, newX)), 
        y: Math.max(-maxPan, Math.min(maxPan, newY)) 
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for pinch-to-zoom
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setTouchDistance(getTouchDistance(e.touches));
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      const delta = newDistance - touchDistance;
      setScale((prev) => Math.min(Math.max(prev + delta * 0.01, 1), 4));
      setTouchDistance(newDistance);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      const newX = e.touches[0].clientX - startPos.x;
      const newY = e.touches[0].clientY - startPos.y;
      const maxPan = (scale - 1) * 200;
      setPosition({ 
        x: Math.max(-maxPan, Math.min(maxPan, newX)), 
        y: Math.max(-maxPan, Math.min(maxPan, newY)) 
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(0);
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  // Dynamic cursor based on zoom state
  const getCursor = () => {
    if (scale > 1) {
      return isDragging ? 'grabbing' : 'grab';
    }
    return 'zoom-in';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl flex flex-col"
          ref={containerRef}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full glass hover:bg-destructive/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
              {productName && (
                <span className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-none">
                  {productName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {images.length}
              </span>
              <motion.button
                onClick={handleZoomOut}
                disabled={scale <= 1}
                className="p-2 rounded-full glass hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: scale > 1 ? 1.1 : 1 }}
                whileTap={{ scale: scale > 1 ? 0.9 : 1 }}
              >
                <ZoomOut size={20} />
              </motion.button>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg glass">
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={scale * 100}
                  onChange={(e) => {
                    const newScale = parseInt(e.target.value) / 100;
                    setScale(newScale);
                    if (newScale === 1) setPosition({ x: 0, y: 0 });
                  }}
                  className="w-20 h-1 appearance-none bg-border rounded-full cursor-pointer accent-primary"
                />
                <span className="text-sm w-12 text-center font-medium">{Math.round(scale * 100)}%</span>
              </div>
              <motion.button
                onClick={handleZoomIn}
                disabled={scale >= 4}
                className="p-2 rounded-full glass hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: scale < 4 ? 1.1 : 1 }}
                whileTap={{ scale: scale < 4 ? 0.9 : 1 }}
              >
                <ZoomIn size={20} />
              </motion.button>
            </div>
          </div>

          {/* Main Image Area */}
          <div
            ref={imageContainerRef}
            className="flex-1 relative overflow-hidden flex items-center justify-center"
            style={{ cursor: getCursor() }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={productName || 'Product image'}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  transformOrigin: 'center center',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                draggable={false}
              />
            </AnimatePresence>

            {/* Zoom hint */}
            {scale === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass text-sm text-muted-foreground"
              >
                Scroll or double-click to zoom
              </motion.div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-primary/20 transition-colors z-10"
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={28} />
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-primary/20 transition-colors z-10"
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={28} />
                </motion.button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setScale(1);
                      setPosition({ x: 0, y: 0 });
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentIndex === idx 
                        ? 'border-primary' 
                        : 'border-border/50 opacity-60 hover:opacity-100'
                    }`}
                    style={currentIndex === idx ? { boxShadow: '0 0 15px hsl(var(--primary) / 0.4)' } : {}}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageZoomModal;