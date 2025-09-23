## ausdata-swiper

Lightweight Swiper-based gallery for Next.js/React. First feature: image gallery sliding left/right.

### Install

```bash
npm install ausdata-swiper swiper
```

Peer deps:

- react >= 18
- react-dom >= 18

### Usage (Next.js / React)

```tsx
"use client";
import { SwiperGallery } from "ausdata-swiper";
import "swiper/css";

export default function GalleryExample() {
  const images = [
    "/public/1.jpg",
    "/public/2.jpg",
    "/public/3.jpg",
  ];
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <SwiperGallery
        images={images}
        initialIndex={0}
        onIndexChange={(i) => console.log("index", i)}
      />
    </div>
  );
}
```

### Props

- `images: string[]` – required list of image URLs
- `initialIndex?: number` – initial slide index
- `onIndexChange?: (index: number) => void` – callback when active slide changes
- `className?: string` – wrapper className
- `imageAlt?: (index: number) => string` – alt generator per image

### Build

```bash
npm run build
```

### Roadmap

- Thumbnail strip and zoom
- Optional navigation arrows and pagination
- SSR-safe enhancements


