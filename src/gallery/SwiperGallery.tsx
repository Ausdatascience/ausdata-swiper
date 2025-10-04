import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Keyboard, Navigation } from 'swiper/modules';
import 'swiper/css';

export interface SwiperGalleryProps {
  images: string[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
  imageAlt?: (index: number) => string;
}

const SwiperGallery: React.FC<SwiperGalleryProps> = ({
  images,
  initialIndex = 0,
  onIndexChange,
  className,
  imageAlt,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (swiperRef && isClient) {
      swiperRef.slideTo(initialIndex);
    }
  }, [initialIndex, swiperRef, isClient]);

  if (!images?.length) return null;

  return (
    <div className={className} style={{ border: '2px solid #ff6b6b', borderRadius: '8px', padding: '10px' }}>
      <p style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '10px' }}>
        🔥 开发模式: Gallery组件已更新!
      </p>
      {isClient && (
        <Swiper
          onSwiper={setSwiperRef}
          initialSlide={initialIndex}
          onSlideChange={(s) => onIndexChange?.(s.activeIndex)}
          modules={[Keyboard, Navigation]}
          navigation={false}
          keyboard={{ enabled: true, onlyInViewport: false }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={imageAlt ? imageAlt(i) : `Image ${i + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default SwiperGallery;
