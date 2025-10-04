## ausdata-swiper

A lightweight React component library featuring an image gallery with smooth transitions, auto-play functionality, and comprehensive accessibility support.

### Install

```bash
npm install ausdata-swiper
```

Peer deps:

- react >= 18
- react-dom >= 18

### Usage (Next.js / React)

#### Image Gallery

```tsx
"use client";
import { Gallery, CoverFlow, BeforeAfter, Lightbox } from "ausdata-swiper";

export default function GalleryExample() {
  const images = [
    "/img/1.png",
    "/img/2.png", 
    "/img/3.png",
    "/img/4.png",
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <Gallery
        images={images}
        initialIndex={0}
        enableDots={true}
        enableArrows={true}
        enableAutoPlay={false}
        onIndexChange={(index) => console.log('Gallery changed to index:', index)}
        imageAlt={(index) => `Gallery image ${index + 1}`}
        className="gallery-demo"
      />
    </div>
  );
}
```

#### CoverFlow Gallery

```tsx
import { CoverFlow } from "ausdata-swiper";

export default function CoverFlowExample() {
  const images = [
    "/img/1.jpg", 
    "/img/2.jpg", 
    "/img/3.jpg",
    "/img/4.jpg",
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <CoverFlow
        images={images}
        initialIndex={1}
        enableAutoPlay={true}
        autoPlayInterval={2000}
        transitionDuration={600}
        slidesPerView={3}
        visibleSlides={3}
        onIndexChange={(index) => console.log('CoverFlow changed to:', index)}
      />
    </div>
  );
}
```

#### Before/After Comparator

```tsx
import { BeforeAfter } from "ausdata-swiper";

export default function BeforeAfterExample() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <BeforeAfter 
        beforeSrc="/img/before.jpg" 
        afterSrc="/img/after.jpg" 
        initialPercent={50}
        label="Comparison"
      />
    </div>
  );
}
```

#### Lightbox (Modal)

```tsx
import { Lightbox } from "ausdata-swiper";

export default function LightboxExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ["/img/1.jpg", "/img/2.jpg", "/img/3.jpg"];

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Lightbox
      </button>
      
      <Lightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        images={images}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        title="Photo Gallery"
        subtitle="Beautiful images"
        description="Browse through our collection"
      />
    </>
  );
}
```

### Props

#### Gallery Component

- `images: string[]` – required list of image URLs
- `initialIndex?: number` – initial slide index (default: 0)
- `onIndexChange?: (index: number) => void` – callback when active slide changes
- `className?: string` – wrapper className
- `imageAlt?: (index: number) => string` – alt generator per image
- `enableDots?: boolean` – show dot navigation (default: true)
- `enableArrows?: boolean` – show arrow navigation (default: true)
- `enableAutoPlay?: boolean` – enable auto-play (default: false)
- `autoPlayInterval?: number` – auto-play interval in ms (default: 3000)
- `transitionDuration?: number` – transition duration in ms (default: 300)
- `pauseOnHover?: boolean` – pause auto-play on hover (default: true)
- `loop?: boolean` – enable infinite loop mode (default: true)
- `height?: string | number` – custom height (e.g., "500px" or 500)
- `aspectRatio?: string` – aspect ratio when height not set (default: "16 / 9")
- `showCounter?: boolean` – show image counter (default: false)
- `slidesPerView?: number` – number of slides per view (default: 1)
- `spaceBetween?: number` – space between slides in px (default: 0)

#### CoverFlow Component

- `images: string[]` – required list of image URLs
- `initialIndex?: number` – initial slide index (default: 0)
- `onIndexChange?: (index: number) => void` – callback when active slide changes
- `className?: string` – wrapper className
- `imageAlt?: (index: number) => string` – alt generator per image
- `enableAutoPlay?: boolean` – enable auto-play (default: false)
- `autoPlayInterval?: number` – auto-play interval in ms (default: 3000)
- `transitionDuration?: number` – transition duration in ms (default: 300)
- `slidesPerView?: number` – number of slides visible (default: 3)
- `spaceBetween?: number` – space between slides in px (default: 30)
- `height?: string | number` – container height (default: 400)

#### BeforeAfter Component

- `beforeSrc: string` – path to "before" image
- `afterSrc: string` – path to "after" image
- `label?: string` – comparator label
- `initialPercent?: number` – initial slider position (default: 50)
- `className?: string` – wrapper className
- `aspectRatio?: string` – CSS aspect ratio (e.g., "16/9")

#### Lightbox Component

- `isOpen: boolean` – controls modal visibility
- `onClose: () => void` – close handler
- `images: string[]` – array of image URLs
- `currentIndex: number` – current active image index
- `onIndexChange: (index: number) => void` – index change handler
- `title?: string` – optional title
- `subtitle?: string` – optional subtitle
- `description?: string` – optional description

### Features

✅ **Image Gallery**
- Smooth hardware-accelerated transitions
- Touch/swipe support with drag feedback
- Infinite loop mode (Swiper.js-like)
- Keyboard navigation (arrows, home, end)
- Auto-play with pause on hover/interaction
- Navigation dots and arrows
- Flexible height/aspect ratio configuration
- Multiple slides per view support
- Configurable spacing between slides
- Accessibility support (ARIA labels, screen reader friendly)
- Optional image counter display

✅ **Before/After Comparator**
- Drag slider comparison
- Configurable initial position
- Custom labels and styling

✅ **Lightbox Modal**
- Full-screen image viewing
- Keyboard navigation
- Optional content overlay
- Clean modal experience

### Build

```bash
npm run build
```

### Development

```bash
npm run dev
npm test
```

### Roadmap

🔄 **Planned Features**
- Thumbnail strip navigation
- Image zoom functionality
- Lazy loading support
- SSR enhancements
- Video gallery support
- Custom transition animations
- Vertical sliding mode
- Free mode (continuous dragging)
