import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface EffectFlowProps {
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
  grabCursor?: boolean;
  enableKeyboard?: boolean;
  enableTouch?: boolean;
  
  // CoverFlow specific props (matching Swiper Coverflow)
  rotate?: number; // Rotation angle for side slides
  depth?: number; // Distance between slides
  modifier?: number; // Multiplier for transform effects
  scale?: number; // Scale for non-active slides
  slideShadows?: boolean; // Enable shadows between slides
  stretch?: number; // Stretch effect
}

const EffectFlow: React.FC<EffectFlowProps> = ({
  images,
  initialIndex = 0,
  onIndexChange,
  className = '',
  imageAlt,
  enableDots = true,
  enableArrows = true,
  enableAutoPlay = false,
  autoPlayInterval = 3000,
  transitionDuration = 600,
  pauseOnHover = true,
  loop = true,
  height = 350,
  aspectRatio = '1/1',
  showCounter = true,
  slidesPerView = 3,
  spaceBetween = 20,
  grabCursor = true,
  enableKeyboard = true,
  enableTouch = true,
  // CoverFlow specific
  rotate = 50,
  depth = 60,
  modifier = 1,
  scale = 0.8,
  slideShadows = true,
  stretch = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);
  const isPaused = useRef(false);
  const lastTouchEnd = useRef(0);

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
    if (!enableAutoPlay || images.length <= 1 || isPaused.current) return;
    clearAutoPlay();
    autoPlayRef.current = window.setInterval(() => {
      if (!isPaused.current) {
        goToNext();
      }
    }, autoPlayInterval);
  }, [enableAutoPlay, images.length, autoPlayInterval]);

  const clearAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      window.clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (!images.length || isTransitioning) return;
    setIsTransitioning(true);
    
    const nextIndex = loop ? 
      (currentIndex + 1) % images.length : 
      Math.min(currentIndex + 1, images.length - 1);
    
    setCurrentIndex(nextIndex);
    onIndexChange?.(nextIndex);
    
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [currentIndex, images.length, loop, onIndexChange, transitionDuration, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (!images.length || isTransitioning) return;
    setIsTransitioning(true);
    
    const prevIndex = loop ? 
      (currentIndex - 1 + images.length) % images.length : 
      Math.max(currentIndex - 1, 0);
    
    setCurrentIndex(prevIndex);
    onIndexChange?.(prevIndex);
    
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [currentIndex, images.length, loop, onIndexChange, transitionDuration, isTransitioning]);

  const goToIndex = useCallback((index: number) => {
    if (index === currentIndex || !images.length || isTransitioning) return;
    setIsTransitioning(true);
    
    setCurrentIndex(index);
    onIndexChange?.(index);
    
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [currentIndex, images.length, onIndexChange, transitionDuration, isTransitioning]);

  // Touch handling for drag/swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableTouch) return;
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  }, [enableTouch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableTouch) return;
    e.preventDefault();
  }, [enableTouch]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enableTouch || isTransitioning) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const deltaTime = Date.now() - lastTouchEnd.current;
    
    // Prevent rapid swipes
    if (deltaTime < 300) return;
    
    lastTouchEnd.current = Date.now();
    
    // Minimum swipe distance
    if (Math.abs(deltaX) > 20 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  }, [enableTouch, touchStartX, touchStartY, goToNext, goToPrev, isTransitioning]);

  // Mouse drag handling with continuous dragging like Swiper
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [isAllowDrag, setIsAllowDrag] = useState(false);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!grabCursor || isTransitioning) return;
    setIsDragging(true);
    setIsAllowDrag(false);
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
    e.preventDefault();
  }, [grabCursor, isTransitioning]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || isTransitioning) return;
    
    const deltaX = Math.abs(e.clientX - dragStartX);
    
    // Enable drag if moved enough to prevent accidental drags
    if (deltaX > 5 && !isAllowDrag) {
      setIsAllowDrag(true);
    }
    
    if (isAllowDrag) {
      setDragCurrentX(e.clientX);
      e.preventDefault();
    }
  }, [isDragging, isTransitioning, dragStartX, isAllowDrag]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!grabCursor || !isDragging || isTransitioning) return;
    
    const deltaX = e.clientX - dragStartX;
    const deltaDistance = Math.abs(deltaX);
    
    setIsDragging(false);
    setIsAllowDrag(false);
    
    // Determine slide change based on drag distance and speed
    const threshold = 50; // Minimum pixels to trigger slide change
    
    if (deltaDistance >= threshold) {
      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  }, [grabCursor, isDragging, dragStartX, goToNext, goToPrev, isTransitioning]);

  // Keyboard handling
  useEffect(() => {
    if (!enableKeyboard || !isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          // Toggle autoplay
          if (enableAutoPlay) {
            isPaused.current = !isPaused.current;
            if (isPaused.current) {
              clearAutoPlay();
            } else {
              startAutoPlay();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, isClient, goToNext, goToPrev, enableAutoPlay, clearAutoPlay, startAutoPlay, isTransitioning]);

  // Global mouse events for continuous drag like Swiper
  useEffect(() => {
    if (!isClient || !isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || isTransitioning) return;
      
      const deltaX = Math.abs(e.clientX - dragStartX);
      
      // Enable drag if moved enough
      if (deltaX > 5 && !isAllowDrag) {
        setIsAllowDrag(true);
      }
      
      if (isAllowDrag) {
        setDragCurrentX(e.clientX);
        e.preventDefault();
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!isDragging || isTransitioning) return;
      
      const deltaX = e.clientX - dragStartX;
      const deltaDistance = Math.abs(deltaX);
      
      setIsDragging(false);
      setIsAllowDrag(false);
      
      // More realistic threshold
      const threshold = 50;
      
      if (deltaDistance >= threshold) {
        if (deltaX > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isClient, isDragging, isAllowDrag, dragStartX, goToNext, goToPrev, isTransitioning]);

  // Start/stop autoplay
  useEffect(() => {
    if (isHovering && pauseOnHover) {
      isPaused.current = true;
      clearAutoPlay();
    } else {
      isPaused.current = false;
      if (enableAutoPlay) {
        startAutoPlay();
      }
    }
    return () => clearAutoPlay();
  }, [isHovering, pauseOnHover, enableAutoPlay, startAutoPlay, clearAutoPlay]);

  // Calculate container height
  const containerHeightStyle = typeof height === 'number' ? `${height}px` : height;

  if (!images?.length) {
    return (
      <div className={`effect-flow-container ${className}`} style={{ height: containerHeightStyle }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
          color: '#888', fontSize: '16px', border: '1px dashed #ccc', borderRadius: '8px'
        }}>
          No images available
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`effect-flow-container group relative w-full ${className}`}
      style={{
        height: containerHeightStyle,
        overflow: 'hidden',
          borderRadius: '0', // 移除容器圆角
        cursor: grabCursor ? (isDragging ? 'grabbing' : 'grab') : 'default',
          backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          transition: 'background-color 0.2s ease',
        userSelect: 'none',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      role="region"
      aria-label="3D Effect Flow image gallery"
    >
      {/* Slides container with CSS covers same as Swiper */}
      <div 
        className="swiper-wrapper effect-flow-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          perspective: '1200px',
        }}
      >
        {images.map((src, index) => {
          // Calculate position relative to current slide
          const centerOffset = index - currentIndex;
          const distanceFromCenter = Math.abs(centerOffset);
          
          // Only render visible slides - only show 1 slide on each side (3 total)
          if (distanceFromCenter > 1) return null;
          
          const isActive = centerOffset === 0;
          
          // Calculate drag offset for dragging effect
          let dragOffset = 0;
          if (isDragging && isAllowDrag && isActive) {
            dragOffset = dragCurrentX - dragStartX;
            // Limit drag offset to prevent excessive movement
            dragOffset = Math.max(-100, Math.min(100, dragOffset));
          }
          
          // Calculate transform values following Swiper Coverflow formula
          let translateX = 0;
          let translateZ = 0;
          let rotateY = 0;
          let scaleVal = scale;
          
          if (isActive) {
            // Center slide with drag offset
            translateX = dragOffset; // Keep drag offset for center slide
            translateZ = 0;
            rotateY = 0;
            scaleVal = 1;
          } else {
            // Side slides - optimized for 3-card layout
            const slideWidth = 280; // Smaller base slide width for better spacing
            const baseTranslate = centerOffset * (slideWidth + spaceBetween);
            
            // Apply Coverflow transformations - fix rotation direction
            rotateY = -centerOffset * rotate * modifier;
            translateZ = -depth + Math.abs(centerOffset) * 10;
            
            // Calculate horizontal position with Coverflow adjustments
            const rotateRad = Math.abs(rotateY) * Math.PI / 180;
            const rotatedOffset = slideWidth / 3 * Math.sin(rotateRad); // 减少偏移量
            
            // Add drag influence to side slides
            const sideDragInfluence = isDragging && isAllowDrag ? dragOffset * 0.3 : 0;
            
            if (centerOffset > 0) {
              translateX = baseTranslate - rotatedOffset + sideDragInfluence;
            } else {
              translateX = baseTranslate + rotatedOffset + sideDragInfluence;
            }
            
            // Adjust scale based on distance - simplified for 3-card layout
            scaleVal = scale;
          }
          
          return (
            <div
              key={index}
              className={`swiper-slide coverflow-slide-wrapper ${isActive ? 'swiper-slide-active' : ''}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '280px',
                height: '280px',
                marginLeft: '-140px',
                marginTop: '-140px',
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scaleVal})`,
                transformStyle: 'preserve-3d',
                transition: isDragging && isAllowDrag 
                  ? 'transform 0.1s linear' // Smooth dragging
                  : `transform ${transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`, // Normal transitions
                zIndex: isActive ? 10 : 5 - distanceFromCenter,
                opacity: distanceFromCenter <= 2 ? 1 : 0.3,
              }}
              onClick={() => !isActive && goToIndex(index)}
            >
              <div
                className="coverflow-slide"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '0', // 移除圆角
                  overflow: 'hidden',
                  background: '#000',
                  boxShadow: 'none',
                  // 移除 border
                  cursor: isActive ? 'default' : 'pointer',
                }}
              >
                <img
                  src={src}
                  alt={imageAlt ? imageAlt(index) : `Effect Flow image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  draggable={false}
                  loading="lazy"
                />
                
                {/* Active indicator */}
                {isActive && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      borderRadius: '0', // 移除圆角
                      boxShadow: 'none',
                    }}>
                    ★
                  </div>
                )}
                
                {/* Image number */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '0', // 移除圆角
                  fontWeight: '500',
                }}>
                  {index + 1}
                </div>
              </div>
              
              {/* Shadow effects for 3D depth */}
              {slideShadows && !isActive && (
                <>
                  <div 
                    className="swiper-slide-shadow-left"
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 50%)',
                      borderRadius: '0', // 移除阴影圆角
                      pointerEvents: 'none',
                      zIndex: -1,
                      opacity: centerOffset < 0 ? 0.8 : 0,
                    }}
                  />
                  <div 
                    className="swiper-slide-shadow-right"
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(-90deg, rgba(0,0,0,0.3) 0%, transparent 50%)',
                      borderRadius: '0', // 移除阴影圆角
                      pointerEvents: 'none',
                      zIndex: -1,
                      opacity: centerOffset > 0 ? 0.8 : 0,
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      {enableArrows && (
        <>
          <button
            className={`swiper-button-prev effect-nav-prev ${isHovering ? 'nav-visible' : ''}`}
            onClick={goToPrev}
            aria-label="Previous image"
            disabled={isTransitioning || (!loop && currentIndex === 0)}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '0',
              cursor: 'pointer',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              boxShadow: 'none',
              opacity: isHovering ? 1 : 0.7,
              visibility: 'visible',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            className={`swiper-button-next effect-nav-next ${isHovering ? 'nav-visible' : ''}`}
            onClick={goToNext}
            aria-label="Next image"
            disabled={isTransitioning || (!loop && currentIndex === images.length - 1)}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '0',
              cursor: 'pointer',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              boxShadow: 'none',
              opacity: isHovering ? 1 : 0.7,
              visibility: 'visible',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {/* Pagination dots */}
      {enableDots && (
        <div 
          className="swiper-pagination effect-pagination"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 15,
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              className={`swiper-pagination-bullet ${index === currentIndex ? 'swiper-pagination-bullet-active' : ''}`}
              onClick={() => goToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '0',
                border: 'none',
                backgroundColor: index === currentIndex ? '#3b82f6' : 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Counter display */}
      {showCounter && (
        <div 
          className="effect-counter"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '0',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 15,
            backdropFilter: 'blur(10px)',
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Dev mode indicator */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '0',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 15,
          backdropFilter: 'blur(10px)',
        }}
      >
        🎨 Effect Flow (纯CSS 3D)
      </div>

      {/* Drag hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '0',
          fontSize: '12px',
          fontWeight: '500',
          zIndex: 15,
          opacity: isHovering ? 1 : 0.6,
          transition: 'opacity 0.3s ease',
        }}
      >
        🖱️ 拖拽滑动或 ↑↓ 键导航
      </div>
      
      {/* CSS mimicking Swiper Coverflow */}
      <style>{`
        .effect-flow-container {
          perspective: 1200px;
        }
        
        .effect-flow-wrapper {
          transform-style: preserve-3d;
        }
        
        .swiper-slide {
          cursor: pointer;
        }
        
        .swiper-slide-active {
          cursor: default;
        }
        
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        
        .swiper-button-prev:disabled,
        .swiper-button-next:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .swiper-pagination-bullet-active {
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px) rotateY(30deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
          }
        }
        
        .swiper-slide {
          animation: slideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
};

export default EffectFlow;