# Home Page Responsive Design Guide

## Overview
The home page is fully responsive and optimized for all device sizes. Below are the key breakpoints and how the layout adapts.

## Device Breakpoints

### 🖥️ Desktop (1200px+)
- **Layout**: Two-column (content left, image right)
- **Hero Image**: Max-width 700px
- **Typography**: Large headings (clamp(2.5rem, 5vw, 4rem))
- **Features**: 3-column grid
- **Spacing**: Generous padding (120px top/bottom)

### 💻 Desktop Standard (992px - 1199px)
- **Layout**: Two-column (content left, image right)
- **Hero Image**: Max-width 550px
- **Typography**: Medium-large headings
- **Features**: 3-column grid
- **Spacing**: Standard padding

### 📱 Tablet Landscape (768px - 991px)
- **Layout**: Single column, stacked vertically
- **Hero Image**: Max-width 500px, centered
- **Typography**: Reduced heading sizes
- **Features**: Single column
- **Content**: Center-aligned
- **Steps**: Vertical flow with rotated arrows

### 📱 Tablet Portrait (600px - 767px)
- **Layout**: Single column, stacked
- **Hero Image**: Max-width 450px, centered
- **Typography**: Smaller headings (2rem)
- **Features**: Single column
- **Buttons**: Full-width, stacked
- **Feature Tags**: Full-width, centered

### 📱 Mobile Large (480px - 599px)
- **Layout**: Single column
- **Hero Image**: Full-width (100%), smaller border-radius
- **Typography**: Compact headings (1.75rem)
- **Features**: Single column
- **Spacing**: Reduced padding (50px top/bottom)
- **Feature Tags**: Smaller icons and text

### 📱 Mobile Small (below 480px)
- **Layout**: Single column, compact
- **Hero Image**: Full-width, minimal border-radius (12px)
- **Typography**: Small headings (1.5rem)
- **Features**: Single column, reduced padding
- **Spacing**: Minimal padding (40px top/bottom)
- **Feature Tags**: Very compact, full-width

## Hero Image Behavior

### Desktop
- Positioned on the right side
- Max-width: 600-700px
- Large border-radius: 24px
- Prominent shadow

### Tablet
- Centered below content
- Max-width: 450-500px
- Medium border-radius: 20px
- Moderate shadow

### Mobile
- Full-width (100%)
- Smaller border-radius: 12-16px
- Reduced shadow
- Optimized for touch

## Key Responsive Features

1. **Fluid Typography**: Uses `clamp()` for scalable text
2. **Flexible Grids**: Auto-fit columns that adapt to screen size
3. **Touch-Friendly**: Larger tap targets on mobile
4. **Optimized Images**: Responsive sizing and loading
5. **Stacked Layout**: Content stacks vertically on smaller screens
6. **Centered Content**: Text and elements center on mobile/tablet

## Testing Recommendations

To see how the page looks on different devices:

1. **Chrome DevTools**: 
   - Press F12 → Toggle device toolbar (Ctrl+Shift+M)
   - Select device presets or custom sizes

2. **Responsive Breakpoints to Test**:
   - 1920px (Large Desktop)
   - 1440px (Desktop)
   - 1024px (Tablet Landscape)
   - 768px (Tablet Portrait)
   - 480px (Mobile Large)
   - 375px (Mobile Small - iPhone)
   - 320px (Mobile Extra Small)

3. **Key Elements to Verify**:
   - Hero image scales correctly
   - Feature tags remain readable
   - Buttons are touch-friendly
   - Text doesn't overflow
   - Images load properly
   - Animations work smoothly

## Visual Layout Summary

```
DESKTOP (1200px+):
┌─────────────────────────────────────────┐
│  [Content]        [Hero Image]          │
│  Title + Text     (Large Image)         │
│  Features                                │
│  Buttons                                 │
└─────────────────────────────────────────┘

TABLET (768px-991px):
┌─────────────────────┐
│    [Content]        │
│    Title + Text     │
│    Features         │
│    Buttons          │
│                     │
│   [Hero Image]      │
│   (Centered)        │
└─────────────────────┘

MOBILE (< 768px):
┌──────────────┐
│  [Content]   │
│  Title       │
│  Text        │
│  Features     │
│  (Stacked)   │
│  Buttons     │
│  (Full-width)│
│              │
│ [Hero Image] │
│ (Full-width) │
└──────────────┘
```

