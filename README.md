## ausdata-swiper

A lightweight React component library featuring an image gallery with smooth transitions, auto-play functionality, and comprehensive accessibility support.

🌟 **New Feature**: Individual Image Rotation Control - Set unique rotation angles for each image in EffectFlow component for creative 3D visual effects!

### Install

```bash
npm install @ausdata/swiper
```

Peer deps:

- react >= 18
- react-dom >= 18

### Usage (Next.js / React)

#### Image Gallery

```tsx
"use client";
import { DefaultGallery, EffectFlow, BeforeAfter, Lightbox } from "@ausdata/swiper";

export default function GalleryExample() {
  const images = [
    "/img/1.png",
    "/img/2.png", 
    "/img/3.png",
    "/img/4.png",
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <DefaultGallery
        images={images}                     // Image array
        initialIndex={0}                    // Initial display index (default: 0)
        enableDots={true}                   // Show bottom dot navigation (default: true)
        enableArrows={true}                 // Show left/right navigation buttons (default: true)
        enableAutoPlay={false}              // Auto-play toggle (default: false)
        autoPlayInterval={3000}             // Auto-play interval in milliseconds (default: 3000)
        transitionDuration={300}            // Transition animation duration in ms (default: 300)
        pauseOnHover={true}                 // Pause on hover (default: true)
        loop={true}                         // Loop playback (default: true)
        height={400}                        // Component height (default: "16/9")
        aspectRatio={"16/9"}                // Aspect ratio (default: "16/9")
        showCounter={false}                 // Show counter (default: false)
        slidesPerView={1}                   // Number of cards per screen (default: 1)
        spaceBetween={0}                    // Card spacing (default: 0)
        onIndexChange={(index) => console.log('Gallery changed to index:', index)}  // Index change callback
        imageAlt={(index) => `Gallery image ${index + 1}`}  // Alt text generator function
        className="gallery-demo"            // Custom CSS class name
      />
    </div>
  );
}
```

#### EffectFlow Gallery (CoverFlow-style 3D)

```tsx
import { EffectFlow } from "@ausdata/swiper";

export default function EffectFlowExample() {
  const images = [
    "/img/1.jpg", 
    "/img/2.jpg", 
    "/img/3.jpg",
    "/img/4.jpg",
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <EffectFlow
        images={images}                      // Image array
        initialIndex={0}                     // Initial display index (default: 0)
        height={350}                        // Component height (default: 350)
        rotate={45}                         // Global default side card rotation angle (default: 50 degrees)
        individualRotate={[20, 45, 60, 25]} // 🔥 Individual rotation angles for each image's side position
        depth={100}                         // 3D depth distance, controls depth perception (default: 60)
        scale={0.8}                         // Side card scaling ratio (default: 0.85)
        slideShadows={true}                 // Show shadow effects (default: true)
        spaceBetween={20}                   // Card spacing (default: 20px)
        transitionDuration={500}            // Transition animation duration in ms (default: 600)
        centerCardSize={320}                // Center card size in pixels (default: 280)
        centerCardScale={1.1}               // Center card scaling ratio (default: 1)
        centerCardDepth={0}                 // Center card Z-axis position (default: 0)
        centerCardRotate={0}                // Global default center card rotation angle (default: 0 degrees)
        centerCardRotates={[10, -15, 5, -10]} // 🔥 Individual rotation angles for each image when centered
        visibleCardCount={5}                // Number of cards to display (default: 3)
        borderRadius={8}                    // Image border radius (default: 3)
        containerWidth="90%"                // Container width (default: "100%")
        showStarIndicator={true}           // Show star indicator (default: true)
        enableKeyboard={true}               // Enable keyboard control (default: true)
        enableArrows={true}                 // Show left/right navigation buttons (default: true)
        enableDots={true}                   // Show bottom dot navigation (default: true)
        enableAutoPlay={false}              // Auto-play toggle (default: false)
        autoPlayInterval={3000}             // Auto-play interval in ms (default: 3000)
        pauseOnHover={true}                 // Pause on hover (default: true)
        loop={true}                         // Loop playback (default: true)
        showCounter={false}                 // Show counter (default: false)
        onIndexChange={(index) => console.log('EffectFlow changed to:', index)}
      />
    </div>
  );
}
```

#### Individual Image Rotation Control Example

```tsx
import { EffectFlow } from "@ausdata/swiper";

export default function IndividualRotationExample() {
  const images = ["/img/1.jpg", "/img/2.jpg", "/img/3.jpg", "/img/4.jpg"];

  return (
    <div>
      <EffectFlow
        images={images}
        // 🔥 Individual side rotation: each image has different rotation angles
        individualRotate={[20, 45, 60, 25]}        
        // 🔥 Individual center rotation: each image has different angles when centered
        centerCardRotates={[10, -15, 5, -10]}      
        // Global default values (used when individual images are not specified)
        rotate={35}                                
        centerCardRotate={0}                       
        height={400}
        depth={80}
        scale={0.8}
        slideShadows={true}
        visibleCardCount={5}
        borderRadius={12}
        containerWidth="90%"
        showStarIndicator={true}
        centerCardSize={320}
        centerCardScale={1.1}
        centerCardDepth={60}
        transitionDuration={600}
        spaceBetween={120}
        enableKeyboard={true}
        enableArrows={true}
        enableDots={true}
        showCounter={true}
      />
    </div>
  );
}
```

#### Before/After Comparator

```tsx
import { BeforeAfter } from "@ausdata/swiper";

export default function BeforeAfterExample() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <BeforeAfter 
        beforeSrc="/img/before.jpg"        // "Before" image path
        afterSrc="/img/after.jpg"           // "After" image path
        initialPercent={50}                 // Initial divider position percentage (default: 50)
        label="Comparison"                  // Comparison label text
        className="before-after-demo"       // Custom CSS class name
        aspectRatio="4/3"                   // Aspect ratio (optional)
      />
    </div>
  );
}
```

#### Lightbox (Modal)

```tsx
import { Lightbox } from "@ausdata/swiper";

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
        isOpen={isOpen}                      // Control modal show/hide
        onClose={() => setIsOpen(false)}      // Close callback function
        images={images}                       // Image array
        currentIndex={currentIndex}           // Current active image index
        onIndexChange={setCurrentIndex}       // Index change callback function
        title="Photo Gallery"                 // Title (optional)
        subtitle="Beautiful images"           // Subtitle (optional)
        description="Browse through our collection"  // Description text (optional)
      />
    </>
  );
}
```

### Props

#### DefaultGallery Component

**📋 Basic Parameters:**
- `images: string[]` – image URL array (required)
- `initialIndex?: number` – initial display index (default: 0)
- `onIndexChange?: (index: number) => void` – callback when active image changes
- `className?: string` – custom CSS class name
- `imageAlt?: (index: number) => string` – alt text generator per image

**🎮 Navigation Control:**
- `enableDots?: boolean` – show dot navigation (default: true)
- `enableArrows?: boolean` – show arrow navigation (default: true)
- `enableAutoPlay?: boolean` – auto-play toggle (default: false)
- `autoPlayInterval?: number` – auto-play interval in ms (default: 3000)
- `pauseOnHover?: boolean` – pause on hover (default: true)
- `loop?: boolean` – infinite loop mode (default: true)

**🎨 Layout & Styling:**
- `height?: string | number` – custom height (e.g.: "500px" or 500)
- `aspectRatio?: string` – aspect ratio (default: "16/9")
- `slidesPerView?: number` – number of images per screen (default: 1)
- `spaceBetween?: number` – image spacing in pixels (default: 0)
- `showCounter?: boolean` – show counter (default: false)

**⚙️ Animation Settings:**
- `transitionDuration?: number` – transition animation duration in ms (default: 300)

#### EffectFlow Component (CoverFlow-style 3D)

- `images: string[]` – required list of image URLs
- `initialIndex?: number` – initial slide index (default: 0)
- `onIndexChange?: (index: number) => void` – callback when active slide changes
- `className?: string` – wrapper className
- `imageAlt?: (index: number) => string` – alt generator per image

**🎨 3D Visual Parameters:**
- `height?: string | number` – container height (default: 350)
- `rotate?: number` – global default side card rotation angle in degrees (default: 50)
- `individualRotate?: number[]` – 🔥 individual rotation angles for each image when positioned as side cards
- `depth?: number` – 3D depth distance, controls depth perception (default: 60)
- `scale?: number` – side card scale ratio (default: 0.85)
- `slideShadows?: boolean` – show shadow effects (default: true)
- `spaceBetween?: number` – card spacing in px (default: 20)

**🎯 Center Card Controls:**
- `centerCardSize?: number` – center card size in pixels (default: 280)
- `centerCardScale?: number` – center card scale ratio (default: 1)
- `centerCardDepth?: number` – center card Z-axis position (default: 0)
- `centerCardRotate?: number` – global default center card rotation angle in degrees (default: 0)
- `centerCardRotates?: number[]` – 🔥 individual rotation angles for each image when positioned as center card

**🎮 Interaction Parameters:**
- `enableKeyboard?: boolean` – enable keyboard control (default: true)
- `enableArrows?: boolean` – show arrow navigation (default: true)
- `enableDots?: boolean` – show dot navigation (default: true)
- `enableAutoPlay?: boolean` – enable auto-play (default: false)
- `autoPlayInterval?: number` – auto-play interval in ms (default: 3000)
- `pauseOnHover?: boolean` – pause auto-play on hover (default: true)
- `loop?: boolean` – enable infinite loop (default: true)
- `showCounter?: boolean` – show image counter (default: false)

**📱 Display Controls:**
- `containerWidth?: string` – container width (default: "100%")
- `visibleCardCount?: number` – number of cards to display (default: 3)
- `borderRadius?: number` – card border radius in pixels (default: 3)
- `showStarIndicator?: boolean` – show star indicator on center card (default: true)

**⚙️ Animation Parameters:**
- `transitionDuration?: number` – transition duration in ms (default: 600)

#### BeforeAfter Component

**📋 Basic Parameters:**
- `beforeSrc: string` – "Before" image path (required)
- `afterSrc: string` – "After" image path (required)
- `label?: string` – Comparator label text
- `className?: string` – Custom CSS class name

**🎨 Style Layout:**
- `initialPercent?: number` – Initial divider position percentage (default: 50)
- `aspectRatio?: string` – CSS aspect ratio (e.g.: "16/9")

#### Lightbox Component

**📋 Core Parameters:**
- `isOpen: boolean` – Controls modal display/hide state
- `onClose: () => void` – Close callback function
- `images: string[]` – Image URL array
- `currentIndex: number` – Current active image index
- `onIndexChange: (index: number) => void` – Index change callback function

**📝 Content Options:**
- `title?: string` – Title (optional)
- `subtitle?: string` – Subtitle (optional)
- `description?: string` – Description text (optional)

### Features

✅ **EffectFlow Gallery (CoverFlow-style 3D)**
- Pure CSS 3D transformations with 3-card layout
- Hardware-accelerated 3D effects (center + left + right cards)
- Configurable rotation angles and depth perception
- 🔥 **Individual Image Rotation Control** - unique rotation angles for each image
- 🔥 **Individual Center Card Rotation** - distinct center rotation for each image
- **Independent center card controls** - Customize size, scale, depth, and rotation
- Customizable side card scaling and spacing
- Enhanced display controls (container width, visible card count, border radius)
- Star indicator on center cards
- Smooth drag interactions with visual feedback
- Keyboard navigation (arrow keys, space for autoplay pause)
- Auto-play with pause on hover
- Navigation arrows and pagination dots
- Shadow effects for enhanced 3D depth
- Loop mode and counter display options
- Accessibility support (ARIA labels, screen reader friendly)

✅ **Default Gallery**
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
