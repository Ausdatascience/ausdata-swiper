"use client";
import { useState, useCallback, useEffect, useRef } from 'react';

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  title?: string;
  subtitle?: string;
  description?: string;
}

// Swiper-like core functionality implementation
interface EnhancedLightboxProps extends LightboxProps {
  enableZoom?: boolean;
  enableKeyboard?: boolean;
  enableSmoothTransition?: boolean;
}

const Lightbox = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  title = "Gallery",
  subtitle = "View Images",
  description = "Browse through the image gallery with navigation features."
}: LightboxProps) => {
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Client-side rendering check
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  }, [currentIndex, images.length, onIndexChange]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  }, [currentIndex, onIndexChange]);

  // Swiper-like zoom functionality implementation
  const handleZoom = useCallback((direction: 'in' | 'out' | 'reset' | 'wheel', delta?: number) => {
    let newZoom = zoomLevel;
    
    switch (direction) {
      case 'in':
        newZoom = Math.min(zoomLevel * 1.2, 3);
        break;
      case 'out':
        newZoom = Math.max(zoomLevel * 0.8, 0.5);
        break;
      case 'reset':
        newZoom = 1;
        setIsZoomed(false);
        break;
      case 'wheel':
        if (delta) {
          newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta));
        }
        break;
    }
    
    setZoomLevel(newZoom);
    setIsZoomed(newZoom !== 1);
  }, [zoomLevel]);

  // Double click zoom functionality
  const handleDoubleClick = useCallback(() => {
    if (zoomLevel === 1) {
      handleZoom('in');
    } else {
      handleZoom('reset');
    }
  }, [zoomLevel, handleZoom]);

  // Enhanced keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
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
          setShowThumbnails(prev => !prev);
          break;
        case 't':
        case 'T':
          e.preventDefault();
          setShowThumbnails(prev => !prev);
          break;
        case 'Home':
          e.preventDefault();
          onIndexChange(0);
          break;
        case 'End':
          e.preventDefault();
          onIndexChange(images.length - 1);
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoom('in');
          break;
        case '-':
          e.preventDefault();
          handleZoom('out');
          break;
        case '0':
          e.preventDefault();
          handleZoom('reset');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrev, goToNext, handleZoom, onIndexChange, images.length]);

  // Mouse wheel zoom functionality (imitates Swiper Zoom module)
  useEffect(() => {
    if (!isOpen || !imageRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        handleZoom('wheel', delta);
      }
    };

    const imageElement = imageRef.current;
    imageElement.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      imageElement.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, handleZoom]);

  // Touch gesture handling (enhanced version with dual-finger zoom support)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);

    // Dual-finger zoom detection
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setInitialDistance(distance);
      setInitialZoom(zoomLevel);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Dual-finger zoom
    if (e.touches.length === 2 && initialDistance && initialZoom) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scale = distance / initialDistance;
      const newZoom = Math.max(0.5, Math.min(3, initialZoom * scale));
      setZoomLevel(newZoom);
      setIsZoomed(newZoom !== 1);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX || !touchStartY || e.touches.length > 1) {
      setTouchStartX(null);
      setTouchStartY(null);
      setInitialDistance(null);
      setInitialZoom(null);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touchStartX - touch.clientX;
    const deltaY = touchStartY - touch.clientY;
    const minSwipeDistance = 50;

    // Prioritize vertical swipe (disable swipe when zoomed)
    if (isZoomed) {
      setTouchStartX(null);
      setTouchStartY(null);
      setInitialDistance(null);
      setInitialZoom(null);
      return;
    }

    // Prioritize horizontal swipe (when not zoomed)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        goToNext(); // Swipe left - next image
      } else {
        goToPrev(); // Swipe right - previous image
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setInitialDistance(null);
    setInitialZoom(null);
  };

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !images[currentIndex]) return null;

  return (
    <>
      {/* Global Styles */}
      {isOpen && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .lightbox-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 9999;
              background: rgba(0, 0, 0, 0.95);
              backdrop-filter: blur(10px);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 1;
              visibility: visible;
              animation: lightboxFadeIn 0.3s ease;
            }
            
            @keyframes lightboxFadeIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            .lightbox-header {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              z-index: 10;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 20px 24px;
              background: rgba(0, 0, 0, 0.3);
              backdrop-filter: blur(20px);
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .lightbox-title {
              font-size: 24px;
              font-weight: 700;
              color: white;
              margin: 0 0 4px 0;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            }
            
            .lightbox-subtitle {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.8);
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .lightbox-controls {
              display: flex;
              gap: 12px;
              align-items: center;
            }
            
            .lightbox-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 44px;
              height: 44px;
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              color: white;
              cursor: pointer;
              transition: all 0.2s ease;
              backdrop-filter: blur(10px);
            }
            
            .lightbox-btn:hover {
              background: rgba(255, 255, 255, 0.2);
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
            
            .lightbox-smart {
              position: relative;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 80px 120px;
            }
            
            .lightbox-nav {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 56px;
              height: 56px;
              background: rgba(255, 255, 255, 0.15);
              border: 1px solid rgba(255, 255, 255,  0.2);
              border-radius: 50%;
              color: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              backdrop-filter: blur(10px);
              z-index: 10;
            }
            
            .lightbox-nav:hover {
              background: rgba(255, 255, 255, 0.25);
              transform: translateY(-50%) scale(1.1);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
          
            .lightbox-nav-left {
              left: 64px;
            }
            
            .lightbox-nav-right {
              right: 64px;
            }
            
            .lightbox-image-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
              max-width: 1200px;
              max-height: 80vh;
              border-radius: 16px;
              overflow: hidden;
              background: #000;
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            }
            
            .lightbox-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: block;
              cursor: grab;
              transition: transform 0.3s ease;
            }
            
            .lightbox-counter {
              position: absolute;
              top: 16px;
              right: 16px;
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 8px 12px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 500;
              backdrop-filter: blur(10px);
              z-index: 5;
            }
            
          .lightbox-thumbnails {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.9);
              backdrop-filter:
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding: 20px 24px;
              transform: translateY(100%);
              animation: lightboxSlideUp 0.3s ease forwards;
              z-index: 15;
            }
            
            @keyframes lightboxSlideUp {
              to {
                transform: translateY(0);
              }
            }
            
            .lightbox-thumbnails-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 16px;
            }
            
            .lightbox-thumbnails-title {
              color: white;
              font-size: 18px;
              font-style: 600;
              margin: 0;
            }
            
            .lightbox-thumbnail-btn {
              width: 32px;
              height: 32px;
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 8px;
              color: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;
            }
            
            .lightbox-thumbnail-btn:hover {
              background: rgba(255, 255, 255, 0.2);
            }
            
            .lightbox-thumbnails-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              gap: 12px;
              max-height: 120px;
              overflow-y: auto;
              padding-right: 8px;
            }
            
            .lightbox-thumbnail {
              position: relative;
              aspect-ratio: 4/3;
              border: 2px solid transparent;
              border-radius: 8px;
              overflow: hidden;
              cursor: pointer;
              transition: all 0.2s ease;
              background: transparent;
              padding: 0;
            }
            
            .lightbox-thumbnail:hover {
              border-color: rgba(255, 255, 255, 0.5);
              transform: scale(1.05);
            }
            
            .lightbox-thumbnail-active {
              border-color: #3b82f6;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            }
            
            .lightbox-thumbnail-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            
            .lightbox-footer {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 10;
              padding: 16px 24px;
              background: rgba(0, 0, 0, 0.2);
              backdrop-filter: blur(20px);
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .lightbox-footer-content {
              max-width: 1200px;
              margin: 0 auto;
              text-align: center;
            }
            
            .lightbox-description {
              color: rgba(255, 255, 255, 0.9);
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 8px 0;
            }
            
            .lightbox-footer small {
              color: rgba(255, 255, 255, 0.6);
              font-size: 12px;
              font-style: italic;
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
              .lightbox-header {
                padding: 12px 16px;
              }
              
              .lightbox-title {
                font-size: 18px;
              }
              
              .lightbox-subtitle {
                font-size: 12px;
              }
              
              .lightbox-btn {
                width: 40px;
                height: 40px;
              }
              
              .lightbox-nav {
                width: 44px;
                height: 44px;
              }
              
              .lightbox-nav-left {
                left: 24px;
              }
              
              .lightbox-nav-right {
                right: 24px;
              }
              
              .lightbox-smart {
                padding: 60px 40px;
              }
              
              .lightbox-thumbnails {
                padding: 16px;
              }
              
              .lightbox-thumbnails-grid {
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: 6px;
                max-height: 100px;
              }
              
              .lightbox-description {
                font-size: 13px;
              }
            }
          `
        }} />
      )}

      <div 
        ref={lightboxRef}
        className="lightbox-overlay"
        role="dialog" 
        aria-modal="true"
        onClick={handleBackdropClick}
      >
        {/* Header */}
        <header className="lightbox-header">
          <div style={{ flex: 1 }}>
            <h2 className="lightbox-title">{title}</h2>
            <p className="lightbox-subtitle">{subtitle}</p>
          </div>
          <div className="lightbox-controls">
            <button 
              className={`lightbox-btn ${showThumbnails ? 'bg-blue-500/30 text-white border border-blue-400/50' : ''}`}
              onClick={() => setShowThumbnails(!showThumbnails)}
              aria-label="Toggle thumbnails"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
          </button>
            <button 
              className={`lightbox-btn ${isZoomed ? 'bg-blue-500/30 text-white border border-blue-400/50' : ''}`}
              onClick={() => isZoomed ? handleZoom('reset') : handleZoom('in')}
              aria-label={isZoomed ? "Reset zoom" : "Zoom in"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {isZoomed ? (
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7m6 0v6m0-6H7" stroke="currentColor" strokeWidth="2"/>
                ) : (
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" stroke="currentColor" strokeWidth="2"/>
                )}
              </svg>
            </button>
            <button 
              className="lightbox-btn"
              onClick={onClose}
              aria-label="Close lightbox"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="lightbox-smart">
          {/* Navigation arrows */}
          <button 
            className="lightbox-nav lightbox-nav-left"
            onClick={goToPrev}
            disabled={currentIndex === 0}
            aria-label="Previous image"
            style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          
          <button 
            className="lightbox-nav lightbox-nav-right"
            onClick={goToNext}
            disabled={currentIndex === images.length - 1}
            aria-label="Next image"
            style={{ opacity: currentIndex === images.length - 1 ? 0.3 : 1 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>

          {/* Image */}
          <div 
            className="lightbox-image-wrapper"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              ref={imageRef}
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="lightbox-image"
              style={{
                transform: `scale(${zoomLevel})`,
                cursor: isZoomed ? 'grab' : 'grab'
              }}
              onDoubleClick={handleDoubleClick}
              loading="lazy"
              draggable={false}
            />
            
            {/* Image counter */}
            <div className="lightbox-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnails panel */}
          {showThumbnails && (
            <div className="lightbox-thumbnails">
              <div className="lightbox-thumbnails-header">
                <h3 className="lightbox-thumbnails-title">All Images ({images.length})</h3>
                <button 
                  className="lightbox-thumbnail-btn"
                  onClick={() => setShowThumbnails(false)}
                  aria-label="Close thumbnails"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              <div className="lightbox-thumbnails-grid">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`lightbox-thumbnail ${
                      index === currentIndex ? 'lightbox-thumbnail-active' : ''
                    }`}
                    onClick={() => {
                      onIndexChange(index);
                      handleZoom('reset');
                    }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="lightbox-thumbnail-img"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="lightbox-footer">
          <div className="lightbox-footer-content">
            <p className="lightbox-description">{description}</p>
            <small>
              Use arrow keys or swipe to navigate • Press ESC to close 
              {isZoomed ? '' : ' • Double-click to zoom'} 
              {isZoomed ? ' • +/- to adjust zoom' : ''} 
              • Home/End to jump to first/last • Ctrl+wheel to zoom
            </small>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Lightbox;
