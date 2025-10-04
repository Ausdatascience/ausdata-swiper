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
  rotate?: number;
  stretch?: number;
  depth?: number;
  scale?: number;
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
  height = 400,
  rotate = 50,
  stretch = 0,
  depth = 100,
  scale = 1,
  modifier = 1,
  slideShadows = true,
  grabCursor = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const goToIndex = useCallback((newIndex: number) => {
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    
    setActiveIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [images.length, onIndexChange]);

  const goToNext = useCallback(() => {
    const nextIndex = activeIndex >= images.length - 1 ? 0 : activeIndex + 1;
    goToIndex(nextIndex);
  }, [activeIndex, images.length, goToIndex]);

  const goToPrev = useCallback(() => {
    const prevIndex = activeIndex <= 0 ? images.length - 1 : activeIndex - 1;
    goToIndex(prevIndex);
  }, [activeIndex, goToIndex]);

  const startAutoPlay = useCallback(() => {
    if (!enableAutoPlay || images.length <= 1 || isPaused) return;
    
    clearAutoPlay();
    autoPlayRef.current = setInterval(() => {
      if (!isPaused) goToNext();
    }, autoPlayInterval);
  }, [enableAutoPlay, images.length, isPaused, autoPlayInterval, goToNext, clearAutoPlay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (enableAutoPlay) setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = e.changedTouches[0].clientX;
    const startY = e.changedTouches[0].clientY;
    
    if (Math.abs(startX) > 50) {
      if (startX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    if (enableAutoPlay) {
      setTimeout(() => setIsPaused(false), transitionDuration);
    }
  };

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

  const getRotateFix = (value: number) => {
    const roundValue = Math.round(value * 100000) / 100000;
    if (Math.abs(roundValue) < 0.001) return 0;
    return roundValue;
  };

  // Swiper.js CoverFlow algorithm
  const getCoverFlowTransform = (index: number) => {
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const containerHeight = containerRef.current?.offsetHeight || 400;
    const isHorizontal = true;
    
    const slideWidth = containerWidth / slidesPerView;
    const transform = -activeIndex * slideWidth;
    const center = -transform + containerWidth / 2;
    
    const offset = index - activeIndex;
    const slideOffset = offset * slideWidth;
    const slideSize = slideWidth;
    const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
    const offsetMultiplier = centerOffset * modifier;
    
    let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
    let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
    let translateZ = -depth * Math.abs(offsetMultiplier);
    let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
    let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
    let scaleValue = 1 - (1 - scale) * Math.abs(offsetMultiplier);

    // Fix for ultra small values
    if (Math.abs(translateX) < 0.001) translateX = 0;
    if (Math.abs(translateY) < 0.001) translateY = 0;
    if (Math.abs(translateZ) < 0.001) translateZ = 0;
    if (Math.abs(rotateY) < 0.001) rotateY = 0;
    if (Math.abs(rotateX) < 0.001) rotateX = 0;
    if (Math.abs(scaleValue) < 0.001) scaleValue = 0;

    const rotateXFixed = getRotateFix(rotateX);
    const rotateYFixed = getRotateFix(rotateY);
    
    return {
      transform: `translate3d(${translateX}px,${translateY}px,${translateZ}px) rotateX(${rotateXFixed}deg) rotateY(${rotateYFixed}deg) scale(${scaleValue})`,
      zIndex: -Math.abs(Math.round(offsetMultiplier)) + 1,
      opacity: Math.abs(offsetMultiplier) > 3 ? 0 : 1,
      transition: `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    };
  };

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

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  if (!images?.length) return null;

  const containerHeightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      ref={containerRef}
      className={`coverflow-container group relative w-full ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ 
        outline: 'none',
        height: containerHeightStyle,
        perspective: '1000px',
        cursor: grabCursor ? 'grab' : 'default',
      }}
      role="region"
      aria-label="CoverFlow image gallery"
      onMouseEnter={() => enableAutoPlay && setIsPaused(true)}
      onMouseLeave={() => enableAutoPlay && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full overflow-hidden">
        <div 
          className="coverflow-wrapper relative h-full"
          style={{
            transformStyle: 'preserve-3d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {images.map((image, index) => {
            const slideTransform = getCoverFlowTransform(index);
            
            return (
              <div
                key={index}
                className={`coverflow-slide absolute cursor-pointer ${slideTransform.opacity === 0 ? 'pointer-events-none' : ''}`}
                style={{
                  ...slideTransform,
                  left: '50%',
                  transformOrigin: 'center center',
                  width: '300px',
                  height: '80%',
                  marginLeft: '-150px',
                  minWidth: '300px',
                  minHeight: '240px',
                }}
                onClick={() => goToIndex(index)}
              >
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      aspectRatio: '3 / 2',
                      background: '#000',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: slideShadows && slideTransform.opacity > 0 
                        ? '0 15px 35px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' 
                        : 'none',
                    }}
                  >
                    <img
                      src={image}
                      alt={imageAlt ? imageAlt(index) : `CoverFlow image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        background: '#000'
                      }}
                      draggable={false}
                      loading="lazy"
                    />
                    
                    {index === activeIndex && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        border: '2px solid #3b82f6',
                        borderRadius: '12px',
                        pointerEvents: 'none'
                      }} />
                    )}
                  </div>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
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
      </div>
      
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
      
      <div className="text-center text-sm text-gray-600 mt-2 font-medium">
        {activeIndex + 1} / {images.length} 
        {enableAutoPlay && ' • Auto: ON'} 
        {grabCursor && ' • Drag to navigate'}
      </div>
    </div>
  );
};

export default CoverFlow;