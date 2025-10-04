## ausdata-swiper

A lightweight React component library featuring an image gallery with smooth transitions, auto-play functionality, and comprehensive accessibility support.

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
        images={images}                     // 图片数组
        initialIndex={0}                    // 初始显示索引（默认：0）
        enableDots={true}                   // 显示底部圆点导航（默认：true）
        enableArrows={true}                 // 显示左右导航按钮（默认：true）
        enableAutoPlay={false}              // 自动播放开关（默认：false）
        autoPlayInterval={3000}             // 自动播放间隔，毫秒（默认：3000）
        transitionDuration={300}            // 切换动画时长，毫秒（默认：300）
        pauseOnHover={true}                 // 悬停时暂停（默认：true）
        loop={true}                         // 循环播放（默认：true）
        height={400}                        // 组件高度（默认："16/9"）
        aspectRatio={"16/9"}                // 宽高比（默认："16/9"）
        showCounter={false}                 // 显示计数器（默认：false）
        slidesPerView={1}                   // 每屏显示卡片数（默认：1）
        spaceBetween={0}                    // 卡片间距（默认：0）
        onIndexChange={(index) => console.log('Gallery changed to index:', index)}  // 索引变化回调
        imageAlt={(index) => `Gallery image ${index + 1}`}  // alt文本生成函数
        className="gallery-demo"            // 自定义样式类名
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
        images={images}                      // 图片数组
        initialIndex={0}                     // 初始显示索引（默认：0）
        height={350}                        // 组件高度（默认：350）
        rotate={45}                         // 侧边卡片旋转角度（默认：50度）
        depth={100}                         // 3D深度距离，控制远近感（默认：60）
        scale={0.8}                         // 侧边卡片缩放比例（默认：0.85）
        slideShadows={true}                 // 是否显示阴影效果（默认：true）
        spaceBetween={20}                   // 卡片间距（默认：20px）
        transitionDuration={500}            // 切换动画时长，毫秒（默认：600）
        enableKeyboard={true}               // 启用键盘控制（默认：true）
        enableArrows={true}                 // 显示左右导航按钮（默认：true）
        enableDots={true}                   // 显示底部圆点导航（默认：true）
        enableAutoPlay={false}              // 自动播放开关（默认：false）
        autoPlayInterval={3000}             // 自动播放间隔，毫秒（默认：3000）
        pauseOnHover={true}                 // 悬停时暂停（默认：true）
        loop={true}                         // 循环播放（默认：true）
        showCounter={false}                 // 显示计数器（默认：false）
        onIndexChange={(index) => console.log('EffectFlow changed to:', index)}
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
        beforeSrc="/img/before.jpg"        // "前面"图片路径
        afterSrc="/img/after.jpg"           // "后面"图片路径
        initialPercent={50}                 // 初始分割线位置百分比（默认：50）
        label="Comparison"                  // 对比标签文本
        className="before-after-demo"       // 自定义样式类名
        aspectRatio="4/3"                   // 宽高比（可选）
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
        isOpen={isOpen}                      // 控制模态框显示/隐藏
        onClose={() => setIsOpen(false)}      // 关闭回调函数
        images={images}                       // 图片数组
        currentIndex={currentIndex}           // 当前活跃图片索引
        onIndexChange={setCurrentIndex}       // 索引变化回调函数
        title="Photo Gallery"                 // 标题（可选）
        subtitle="Beautiful images"           // 副标题（可选）
        description="Browse through our collection"  // 描述文本（可选）
      />
    </>
  );
}
```

### Props

#### DefaultGallery Component

**📋 基础参数:**
- `images: string[]` – 图片URL数组（必需）
- `initialIndex?: number` – 初始显示索引（默认：0）
- `onIndexChange?: (index: number) => void` – 活跃图片变化回调
- `className?: string` – 自定义CSS类名
- `imageAlt?: (index: number) => string` – 每张图片的alt文本生成器

**🎮 导航控制:**
- `enableDots?: boolean` – 显示圆点导航（默认：true）
- `enableArrows?: boolean` – 显示箭头导航（默认：true）
- `enableAutoPlay?: boolean` – 自动播放开关（默认：false）
- `autoPlayInterval?: number` – 自动播放间隔，毫秒（默认：3000）
- `pauseOnHover?: boolean` – 悬停时暂停（默认：true）
- `loop?: boolean` – 无限循环模式（默认：true）

**🎨 布局样式:**
- `height?: string | number` – 自定义高度（如："500px" 或 500）
- `aspectRatio?: string` – 宽高比（默认："16/9"）
- `slidesPerView?: number` – 每屏显示图片数（默认：1）
- `spaceBetween?: number` – 图片间距，像素（默认：0）
- `showCounter?: boolean` – 显示计数器（默认：false）

**⚙️ 动画设置:**
- `transitionDuration?: number` – 过渡动画时长，毫秒（默认：300）

#### EffectFlow Component (CoverFlow-style 3D)

- `images: string[]` – required list of image URLs
- `initialIndex?: number` – initial slide index (default: 0)
- `onIndexChange?: (index: number) => void` – callback when active slide changes
- `className?: string` – wrapper className
- `imageAlt?: (index: number) => string` – alt generator per image

**🎨 3D Visual Parameters:**
- `height?: string | number` – container height (default: 350)
- `rotate?: number` – side card rotation angle in degrees (default: 50)
- `depth?: number` – 3D depth distance, controls depth perception (default: 60)
- `scale?: number` – side card scale ratio (default: 0.85)
- `slideShadows?: boolean` – show shadow effects (default: true)
- `spaceBetween?: number` – card spacing in px (default: 20)

**🎮 Interaction Parameters:**
- `enableKeyboard?: boolean` – enable keyboard control (default: true)
- `enableArrows?: boolean` – show arrow navigation (default: true)
- `enableDots?: boolean` – show dot navigation (default: true)
- `enableAutoPlay?: boolean` – enable auto-play (default: false)
- `autoPlayInterval?: number` – auto-play interval in ms (default: 3000)
- `pauseOnHover?: boolean` – pause auto-play on hover (default: true)
- `loop?: boolean` – enable infinite loop (default: true)
- `showCounter?: boolean` – show image counter (default: false)

**⚙️ Animation Parameters:**
- `transitionDuration?: number` – transition duration in ms (default: 600)

#### BeforeAfter Component

**📋 基础参数:**
- `beforeSrc: string` – "之前"图片路径（必需）
- `afterSrc: string` – "之后"图片路径（必需）
- `label?: string` – 比较器标签文本
- `className?: string` – 自定义CSS类名

**🎨 样式布局:**
- `initialPercent?: number` – 初始分割线位置百分比（默认：50）
- `aspectRatio?: string` – CSS宽高比（如："16/9"）

#### Lightbox Component

**📋 核心参数:**
- `isOpen: boolean` – 控制模态框显示/隐藏状态
- `onClose: () => void` – 关闭回调函数
- `images: string[]` – 图片URL数组
- `currentIndex: number` – 当前活跃图片索引
- `onIndexChange: (index: number) => void` – 索引变化回调函数

**📝 内容选项:**
- `title?: string` – 标题（可选）
- `subtitle?: string` – 副标题（可选）
- `description?: string` – 描述文本（可选）

### Features

✅ **EffectFlow Gallery (CoverFlow-style 3D)**
- Pure CSS 3D transformations with 3-card layout
- Hardware-accelerated 3D effects (center + left + right cards)
- Configurable rotation angles and depth perception
- Customizable card scaling and spacing
- Touch/swipe drag support with visual feedback
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
