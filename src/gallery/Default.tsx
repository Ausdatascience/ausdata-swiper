import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface DefaultGalleryProps {
  images: string[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
  imageAlt?: (index: number) => string;
  enableDots?: boolean;
  enableArrows?: boolean;
  enableAutoPlay?: boolean;
  autoPlayInterval?: number;
  transitionDuration?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  height?: string | number;
  aspectRatio?: string;
  showCounter?: boolean;
  slidesPerView?: number;
  spaceBetween?: number;
}

const Default: React.FC<DefaultGalleryProps> = ({
  images,
  initialIndex = 0,
  onIndexChange,
  className = '',
  imageAlt,
  enableDots = true,
  enableArrows = true,
  enableAutoPlay = false,
  autoPlayInterval = 3000,
  transitionDuration = 300,
  pauseOnHover = true,
  loop = true,
  height,
  aspectRatio = '16 / 9',
  showCounter = false,
  slidesPerView = 1,
  spaceBetween = 0,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  
  const autoPlayRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (!enableAutoPlay || images.length <= 1 || isPaused) return;
    
    clearAutoPlay();
    autoPlayRef.current = window.setInterval(() => {
      if (!isPaused) {
        goToNext();
      }
    }, autoPlayInterval);
  }, [enableAutoPlay, images.length, isPaused, autoPlayInterval]);

  const clearAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      window.clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enableAutoPlay && images.length > 1) {
      startAutoPlay();
    } else {
      clearAutoPlay();
    }
    return clearAutoPlay;
  }, [enableAutoPlay, images.length, startAutoPlay, clearAutoPlay]);

  useEffect(() => {
    if (enableAutoPlay && images.length > 1 && !isPaused) {
      startAutoPlay();
    } else {
      clearAutoPlay();
    }
  }, [isPaused, enableAutoPlay, images.length, startAutoPlay, clearAutoPlay]);

  // Navigation functions
  const updateTranslateX = useCallback(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const itemWidth = slidesPerView === 1 ? containerWidth : containerWidth / slidesPerView;
    const offset = slidesPerView === 1 ? 0 : spaceBetween / 2;
    
    const newTranslateX = loop 
      ? -(currentIndex * (itemWidth + spaceBetween) + offset)
      : Math.max(
          -(currentIndex * (itemWidth + spaceBetween) + offset),
          Math.min(0, -(images.length - slidesPerView) * (itemWidth + spaceBetween) + offset)
        );
    
    setTranslateX(newTranslateX);
  }, [currentIndex, slidesPerView, spaceBetween, containerRef, loop]);

  useEffect(() => {
    updateTranslateX();
  }, [updateTranslateX]);

  const goToIndex = useCallback((index: number) => {
    if (index < 0) {
      index = loop ? images.length - 1 : 0;
    }
    if (index >= images.length) {
      index = loop ? 0 : images.length - 1;
    }
    
    setCurrentIndex(index);
    onIndexChange?.(index);
    updateTranslateX();
  }, [images.length, loop, onIndexChange, updateTranslateX]);

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex >= images.length - 1 ? (loop ? 0 : images.length - 1) : currentIndex + 1;
    goToIndex(nextIndex);
  }, [currentIndex, images.length, goToIndex, loop]);

  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex <= 0 ? (loop ? images.length - 1 : 0) : currentIndex - 1;
    goToIndex(prevIndex);
  }, [currentIndex, goToIndex, loop]);

  // Touch/mouse handling
  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsPaused(true);
    clearAutoPlay();
  }, [clearAutoPlay]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  }, [isDragging]);

  const handleEnd = useCallback((clientX?: number) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setIsPaused(false);
    
    const delta = clientX ? clientX - startX : currentX - startX;
    const threshold = 50;
    
    if (Math.abs(delta) > threshold) {
      if (delta > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    
    setCurrentX(0);
    setStartX(0);
  }, [isDragging, startX, currentX, goToPrev, goToNext]);

  // Event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX);
  };

  // Keyboard handling
  useEffect(() => {
    if (!isClient) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, goToPrev, goToNext, goToIndex, images.length]);

  // Calculate container height
  const containerHeightStyle = height 
    ? (typeof height === 'number' ? `${height}px` : height)
    : aspectRatio;

  if (!images?.length) return null;

  return (
    <div 
      className={`default-gallery ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: typeof height === 'undefined' ? aspectRatio : undefined,
        height: typeof height !== 'undefined' ? containerHeightStyle : undefined,
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'none',
      }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
      tabIndex={0}
      role="region"
      aria-label="Image gallery"
      aria-roledescription="carousel"
    >
      {/* Image slider */}
      <div 
        ref={sliderRef}
        style={{
          display: 'flex',
          height: '100%',
          transform: isDragging 
            ? `translateX(${translateX + (currentX - startX)}px)`
            : `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : `transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              flex: `0 0 ${slidesPerView === 1 ? '100%' : `${100 / slidesPerView}%`}`,
              paddingRight: index < images.length - 1 ? `${spaceBetween / 2}px` : '0px',
              paddingLeft: index > 0 ? `${spaceBetween / 2}px` : '0px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={src}
              alt={imageAlt ? imageAlt(index) : `Image ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                background: '#f3f4f6',
                borderRadius: '8px',
              }}
              loading="lazy"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {enableArrows && images.length > 1 && (
        <>
          <button
            className="gallery-nav gallery-nav-prev"
            onClick={goToPrev}
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '44px',
              height: '44px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            className="gallery-nav gallery-nav-next"
            onClick={goToNext}
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '44px',
              height: '44px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {/* Pagination dots */}
      {enableDots && images.length > 1 && (
        <div 
          className="gallery-pagination"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 2,
          }}
          role="group"
          aria-label="Navigate through images"
        >
          {images.map((_, index) => (
            <button
              key={index}
              className={`gallery-dot ${index === currentIndex ? 'gallery-dot-active' : ''}`}
              onClick={() => goToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: index === currentIndex ? '#3b82f6' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {showCounter && (
        <div
          className="gallery-counter"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 2,
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Dev mode indicator */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 2,
        }}
      >
        Custom Default
      </div>
    </div>
  );
};

export default Default;
