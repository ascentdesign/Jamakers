# JamMakers Platform - Design Guidelines (Uber Base System)

## Design Approach: Professional B2B with Uber Base Principles

**Selected Approach**: Uber Base Design System adapted for B2B manufacturing marketplace

**Rationale**: JamMakers requires clarity, efficiency, and professional credibility. Uber Base's "Go Big" philosophy ensures accessibility, while "Less is More" reduces cognitive load for busy procurement professionals and manufacturers.

**Reference Inspiration**: Uber (clarity, scale), Alibaba.com (search/filtering), Linear (dashboard efficiency), Stripe (trust signals)

---

## Core Design Elements

### A. Color Palette

**Three Primary Colors** (Uber Base principle):

**Light Mode**:
- **Black**: 0 0% 7% (primary text, headers, borders)
- **White**: 0 0% 100% (backgrounds, surfaces)
- **Green Accent**: 145 70% 35% (CTAs, success, verification badges, active states)
- **Gray-50**: 0 0% 97% (card backgrounds, subtle surfaces)
- **Gray-200**: 0 0% 88% (borders, dividers)
- **Gray-600**: 0 0% 45% (secondary text, meta information)

**Dark Mode**:
- **White**: 0 0% 95% (primary text)
- **Black**: 0 0% 9% (backgrounds)
- **Green Accent**: 145 65% 45% (CTAs, brighter for contrast)
- **Gray-800**: 0 0% 15% (card surfaces)
- **Gray-700**: 0 0% 25% (borders)
- **Gray-400**: 0 0% 65% (secondary text)

**Semantic Colors** (minimal use):
- Error: 355 75% 48% (validation only)
- Warning: 35 85% 50% (alerts only)

### B. Typography ("Go Big" Principle)

**Font Families**:
- **Primary**: Inter (all UI, body text)
- **Display**: Poppins (headlines only)

**Type Scale** (increased from standard):
- **Hero Display**: 64px (4rem) / 48px mobile - Poppins Bold
- **Page Titles**: 40px (2.5rem) / 32px mobile - Poppins Semibold
- **Section Headers**: 32px (2rem) - Poppins Semibold
- **Card Titles**: 20px (1.25rem) - Inter Semibold
- **Body Large**: 18px (1.125rem) - Inter Regular (default for most content)
- **Body**: 16px (1rem) - Inter Regular (minimum size)
- **Small/Meta**: 14px (0.875rem) - Inter Medium

**Line Heights**: 1.6 for body (increased readability), 1.2 for headings

### C. Layout System (4-Pixel Grid)

**Spacing Scale**: 4, 8, 12, 16, 24, 32, 48, 64px only
- **Micro spacing**: 4-8px (element gaps, icon padding)
- **Component padding**: 12-16px (cards, buttons, inputs)
- **Section spacing**: 32-48px (between content blocks)
- **Page margins**: 48-64px (outer containers on desktop)

**Container Widths**:
- Max Content: 1280px (main wrapper)
- Dashboard: 1152px (data-heavy layouts)
- Reading: 896px (text content)

**Grid Patterns**:
- Manufacturer Cards: 1 / md:2 / lg:3 columns, gap-24px
- Dashboard Metrics: 2 / lg:4 columns, gap-16px
- Project Cards: 1 / lg:2 columns, gap-32px

### D. Component Library (Simplified)

**Buttons** (2 variants only):
- **Primary Filled**: Green background, white text, 48px height, 16px horizontal padding, rounded-8px
- **Secondary Outline**: Black border (2px), transparent background, 48px height, hover fills with black

**Cards**:
- White/Gray-800 background, 1px border, 12px rounded corners, 16px padding
- Hover: subtle shadow (no scale transforms)

**Navigation**:
- **Top Bar**: 72px height, white/black background, 24px vertical padding
- Logo left, search center (max-w-600px), user menu right
- **Breadcrumbs**: 16px text, chevron separators, 32px margin-bottom

**Manufacturer Cards**:
- 300px min-height, company logo (80px square), name (20px bold)
- Certification badges (green checkmark icon + text)
- 3 key metrics row (capacity, lead time, rating)
- Single "View Profile" button (green, full-width)

**Search & Filters**:
- Search bar: 56px height, 16px text, black outline on focus
- Filter sidebar: 280px wide, white background, 16px padding sections
- Active filter chips: green background, white text, 32px height, 8px rounded

**Forms**:
- Input height: 56px, 16px text, 12px padding, 8px rounded
- Labels: 16px, medium weight, 8px margin-bottom
- Error text: 14px, red color, 4px margin-top
- Field spacing: 24px between fields

**Data Display**:
- **Metric Cards**: 140px height, large number (40px), label (16px), green trend arrow
- **Tables**: 16px text, 56px row height, zebra striping (gray-50), sticky headers
- **Status Badges**: 32px height, 8px rounded, colored backgrounds (green/gray/red)

**AI Assistant (JamBot)**:
- Fixed button: 64px diameter, bottom-right (24px margins), green background
- Panel: 400px width, 80vh height, slide-up from bottom
- Messages: 16px text, 12px padding bubbles, 8px spacing

### E. Imagery Strategy

**Hero Section** (Landing Page):
- Full-width hero: 75vh height, authentic Jamaican manufacturing photography
- Dark overlay (40% opacity) for text contrast
- Headline: 64px white text, centered
- Search bar: 600px wide, 64px height, white background, prominent placement
- 3-column value props below: icons + 20px headlines + 16px descriptions

**Photography Style**: High-quality, well-lit factory environments, products, team photos. Professional but warm. Always use real imagery, never illustrations for heroes.

**Image Placements**:
- Manufacturer profiles: 6-photo gallery grid, 16px gaps
- Product showcases: Large hero image + 4 thumbnail grid
- About/Trust pages: Team photos (full-width sections), facility tours
- Empty states: Simple icon + text (no illustrations)

**Icons**: Heroicons (outline), 24px standard size, green accent for active states

### F. Interactive States (Minimal Animation)

**Hover States**:
- Buttons: 8% darker shade, no transforms
- Cards: border color changes to green, no elevation
- Links: green underline appears

**Focus States**:
- 3px green outline, 2px offset
- High contrast for keyboard navigation

**Loading**:
- Shimmer effect on skeleton screens
- Green spinner for actions (24px size)

**Transitions**: 200ms duration, ease-in-out only for state changes

---

## Page-Specific Layouts

**Dashboard**: No hero. KPI cards row (4 columns, 32px gap) → Activity feed + Quick actions (2:1 split, 48px spacing)

**Manufacturer Directory**: Prominent search (64px height) → Filter sidebar (left) + Results grid (3 columns, 24px gap) → Pagination

**Manufacturer Profile**: Cover photo (280px height) → Header bar (logo, name, ratings, CTA) → Tab navigation → Content grid (2:1, content:sidebar)

**RFQ Creation**: Multi-step progress bar (48px height) → Form sections (48px vertical spacing) → Action buttons (sticky bottom bar)

---

## Accessibility Standards

- WCAG AA minimum: 4.5:1 text contrast, 3:1 UI elements
- Large touch targets: 48px minimum (Uber Base standard)
- Keyboard navigation: visible focus indicators throughout
- Screen reader: ARIA labels on all interactive elements
- Color independence: never rely on color alone for meaning