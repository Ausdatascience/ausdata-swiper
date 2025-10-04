"use client";
import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface CoverFlowProps {
  images: string[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
  imageAlt?: (index: number) => string;
  enableAutoPlay?: boolean;
  autoPlayInterval?: number;
  transitionDuration?: number;
  slidesPerView?: number;
  spaceBetween?: number;
  height?: string | number;
  // CoverFlow specific props
  rotate?: number;
  stretch?: number;
  depth?: number;
  modifier?: number;
  slideShadows?: boolean;
  grabCursor?: boolean;
}

const CoverFlow: React.FC<CoverFlowProps> = ({
  images,
  initialIndex = 0,
  onIndexChange,
  className = '',
  imageAlt,
  enableAutoPlay = false,
  autoPlayInterval = 3000,
  transitionDuration = 300,
  slidesPerView = 3,
  spaceBetween = 30,
  height = 400,
  // CoverFlow specific
  rotate = 50,
  stretch = 0,
  depth = 100,
  modifier = 1,
  slideShadows = true,
  grabCursor = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear auto-play
  const clearAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Navigate functions
  const goToIndex = useCallback((newIndex: number) => {
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    
    setIsTransitioning(true);
    setActiveIndex(newIndex);
    onIndexChange?.(newIndex);
    
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [images.length, onIndexChange, transitionDuration]);

  const goToNext = useCallback(() => {
    const nextIndex = activeIndex >= images.length - 1 ? 0 : activeIndex + 1;
    goToIndex(nextIndex);
  }, [activeIndex, images.length, goToIndex]);

  const goToPrev = useCallback(() => {
    const prevIndex = activeIndex <= 0 ? images.length - 1 : activeIndex - 1;
    goToIndex(prevIndex);
  }, [activeIndex, goToIndex]);

  // Auto-play
  const startAutoPlay = useCallback(() => {
    if (!enableAutoPlay || images.length <= 1 || isPaused) return;
    
    clearAutoPlay();
    autoPlayRef.current = window.setInterval(() => {
      if (!isPaused) goToNext();
    }, autoPlayInterval);
  }, [enableAutoPlay, images.length, isPaused, autoPlayInterval, goToNext, clearAutoPlay]);

  // Touch handling (drag support)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (enableAutoPlay) setIsPaused(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragCurrent({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;
    setDragCurrent({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (!isDragging || !dragStart || !dragCurrent) {
      setIsDragging(false);
      if (enableAutoPlay) setIsPaused(false);
      return;
    }

    const deltaX = dragStart.x - dragCurrent.x;
    const deltaY = Math.abs(dragStart.y - dragCurrent.y);
    
    // Only trigger horizontal swipes
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
    
    if (enableAutoPlay) {
      setTimeout(() => setIsPaused(false), transitionDuration);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (enableAutoPlay) setIsPaused(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setDragCurrent({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart) return;
    setDragCurrent({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStart || !dragCurrent) {
      if (enableAutoPlay) setIsPaused(false);
      return;
    }

    const deltaX = dragStart.x - dragCurrent.x;
    const deltaY = Math.abs(dragStart.y - dragCurrent.y);
    
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setDragStart(null);
    setDragCurrent(null);
    
    if (enableAutoPlay) {
      setTimeout(() => setIsPaused(false), transitionDuration);
    }
  };

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (enableAutoPlay) setIsPaused(true);
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToIndex(0);
        break;
      case 'End':
        e.preventDefault();
        goToIndex(images.length - 1);
        break;
    }
    
    if (enableAutoPlay) {
      setTimeout(() => setIsPaused(false), autoPlayInterval);
    }
  };

  // Effects
  useEffect(() => {
    if (enableAutoPlay && images.length > 1) {
      startAutoPlay();
    } else {
      clearAutoPlay();
    }
    return clearAutoPlay;
  }, [enableAutoPlay, images.length, startAutoPlay, clearAutoPlay]);

  useEffect(() => {
    if (enableAutoPlay && images.length > 1 && !isPaused && !isTransitioning) {
      startAutoPlay();
    } else {
      clearAutoPlay();
    }
  }, [isPaused, isTransitioning, enableAutoPlay, images.length, startAutoPlay, clearAutoPlay]);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  if (!images?.length) return null;

  const containerHeight = typeof height === 'number' ? `${height}px` : height;
  const centerSlide = Math.floor(slidesPerView / 2);
  
  // Correct CoverFlow positioning algorithm  
  const getCoverFlowTransform = (index: number) => {
    const offset = index - activeIndex;
    const visibleRange = Math.floor(slidesPerView / 2);
    
    // Hide slides outside visible range
    if (Math.abs(offset) > visibleRange) {
      return {
        opacity: 0,
        transform: `translateX(${offset > 0 ? 150 : -150}%) rotateY(${offset > 0 ? 30 : -30}deg)`,
        transformOrigin: 'center center',
      };
    }
    
    // Calculate positions - this is the key fix!
    // Center slide (offset = 0) stays at center
    // Side slides move away from center with rotation
    let translateX = 0;
    let rotateY = 0;
    let translateZ = 0;
    let scale = 1;
    let opacity = 1;
    
    if (offset === 0) {
      // Center slide - no transformation needed
      translateX = 0;
      rotateY = 0;
      translateZ =  depth;
      scale = 1;
      opacity = 1;
    } else {
      // Side slides - position them correctly
      const slideWidth = 320; // Width of each slide
      const spacing = 80; // Space between slides
      
      // Move slides outward from center
      translateX = offset * (slideWidth + spacing);
      
      // Rotate side slides inward toward center
      rotateY = -offset * (rotate / visibleRange) * modifier;
      
      // Push side slides back in depth
      translateZ = depth - Math.abs(offset) * (depth / visibleRange);
      
      // Scale down side slides
      scale = 1 - Math.abs(offset) * 0.15;
      
      // Reduce opacity for non-center slides
      opacity = Math.max(0.6, 1 - Math.abs(offset) * 0.2);
    }
    
    return {
      opacity,
      transform: `translateX(${translateX}px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
      transformOrigin: 'center center',
      transition: isTransitioning ? `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`coverflow-container relative w-full ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ 
        outline: 'none',
        height: containerHeight,
        perspective: '1200px',
        cursor: grabCursor ? 'grab' : 'default',
      }}
      role="region"
      aria-label="CoverFlow image gallery"
      onMouseEnter={() => enableAutoPlay && setIsPaused(true)}
      onMouseLeave={() => {
        enableAutoPlay && setIsPaused(false);
        setIsDragging(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* CoverFlow main container */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Slides container */}
        <div 
          className="coverflow-wrapper relative h-full"
          style={{
            transformStyle: 'preserve-3d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200%', // Wider container to accommodate side slides
            left: '-50%', // Center the wider container
            position: 'absolute',
          }}
        >
          {/* Individual slides */}
          {images.map((image, index) => {
            const slideTransform = getCoverFlowTransform(index);
            
            return (
              <div
                key={index}
                className="coverflow-slide absolute cursor-pointer"
                style={{
                  ...slideTransform,
                  position: 'absolute',
                  left: '50%',
                  transformOrigin: 'center center',
                  width: '320px',
                  height: '80%',
                  marginLeft: '-160px', // Half of slide width
                  zIndex: slideTransform.opacity > 0 ? (centerSlide - Math.abs(index - activeIndex) + 10) : 0,
                }}
                onClick={() => goToIndex(index)}
              >
                <div className="relative w-full h-full group">
                  <div 
                    className="relative w-full h-full border-2 border-white/30 rounded-xl overflow-hidden bg-gray-100"
                    style={{
                      boxShadow: slideShadows && slideTransform.opacity > 0 
                        ? '0 15px 35px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' 
                        : 'none',
                    }}
                  >
                    <img
                      src={image}
                      alt={imageAlt ? imageAlt(index) : `CoverFlow image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      draggable={false}
                      loading="lazy"
                    />
                    
                    {/* Active slide indicator */}
                    {index === activeIndex && (
                      <div className="absolute inset-0 ring-2 ring-blue-500 ring-inset pointer-events-none" />
                    )}
                  </div>
                  
                  {/* Slide number */}
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Navigation arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-300 rounded-full p-3 shadow-lg z-10 transition-all duration-200 opacity-0 group-hover:opacity-100"
          onClick={goToPrev}
          aria-label="Previous image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-300 rounded-full p-3 shadow-lg z-10 transition-all duration-200 opacity-0 group-hover:opacity-100"
          onClick={goToNext}
          aria-label="Next image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Drag indicator */}
        {isDragging && dragStart && dragCurrent && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="bg-white/20 border border-white/50 rounded-full px-4 py-2 text-white text-sm font-medium backdrop-blur-sm">
              {dragStart.x > dragCurrent.x ? '→ 下一张' : '← 上一张'}
            </div>
          </div>
        )}
      </div>
      
      {/* Progress dots */}
      {images.length > 1 && (
        <div className="progress-dots flex justify-center space-x-2 mt-6">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === activeIndex 
                  ? 'bg-blue-500 w-8' 
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              onClick={() => goToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Slide counter and info */}
      <div className="text-center text-sm text-gray-600 mt-2 font-medium">
        {activeIndex + 1} / {images.length} 
        {enableAutoPlay && ' • Auto: ON'} 
        {grabCursor && ' • Drag to navigate'}
      </div>
    </div>
  );
};

export default CoverFlow;