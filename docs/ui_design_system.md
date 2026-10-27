# UI / UX Design System Specification

**Design Philosophy**: Premium Minimalist White-Theme  
**Target Personality**: Sleek, High-precision, Professional, Tech-forward (AI / ML Engineer)

---

## 1. Color Palette Tokens

The color architecture enforces a pure, crisp white foundation accented with high-contrast slate text and a calculated royal-blue accent. Dark mode is explicitly disabled in favor of an immaculate, editorial-grade light canvas.

| Token | Hex Value | Tailwind Class | Semantic Application |
| :--- | :--- | :--- | :--- |
| **Canvas Primary** | `#FFFFFF` | `bg-white` | Main page background, primary card surfaces, active modal sheets |
| **Canvas Secondary**| `#F8FAFC` | `bg-slate-50` | Section alternation, dashboard sidebar, subtle card backgrounds |
| **Text Primary** | `#111827` | `text-gray-900` | Headings, hero display titles, primary high-priority data points |
| **Text Secondary** | `#64748B` | `text-slate-500` | Body copy, meta information, dates, form helper labels |
| **Accent Primary** | `#2563EB` | `text-blue-600` / `bg-blue-600` | Interactive CTAs, active tab indicators, link underlines, progress bars |
| **Accent Hover** | `#1D4ED8` | `hover:bg-blue-700` | Hover state for primary action buttons |
| **Border Subtle** | `#E5E7EB` | `border-gray-200` | Card borders, dividers, table borders, input outlines |
| **Hover Subtle** | `#F1F5F9` | `hover:bg-slate-100`| Table row hover, secondary button hover, navigation item active state |
| **Success State** | `#059669` | `text-emerald-600` | Published status, positive metrics, form success notifications |
| **Warning State** | `#D97706` | `text-amber-600` | Draft status, unsaved changes indicator |
| **Danger State** | `#DC2626` | `text-rose-600` | Delete actions, error banners, validation alerts |

---

## 2. Typography Hierarchy

**Primary Font Family**: `Inter`, `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`  
**Monospace Font**: `JetBrains Mono`, `ui-monospace, SFMono-Regular, monospace` (for code snippets, model parameters, API routes)

| Level | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `2.75rem - 3.75rem` (fluid) | 700 (Bold) | 1.15 | `-0.025em` | Hero personal name & main statement |
| **Heading 1 (H1)** | `2.25rem` (36px) | 700 (Bold) | 1.25 | `-0.02em` | Main section titles (About, Projects, Skills) |
| **Heading 2 (H2)** | `1.5rem` (24px) | 600 (Semibold) | 1.35 | `-0.015em` | Card titles, modal headers, subsection titles |
| **Heading 3 (H3)** | `1.125rem` (18px) | 600 (Semibold) | 1.4 | `-0.01em` | Experience roles, institution titles, stat labels |
| **Body Large** | `1.125rem` (18px) | 400 (Regular) | 1.6 | Normal | Hero introduction snippet, about summary |
| **Body Standard**| `0.9375rem` (15px) | 400 (Regular) | 1.6 | Normal | Standard paragraphs, project descriptions |
| **Caption / Small**| `0.8125rem` (13px) | 500 (Medium) | 1.4 | `+0.01em` | Tech stack badges, timestamps, table cells |

---

## 3. Surface, Spacing & Elevation Tokens

### 3.1 Shadows (Subtle, Restrained)
- **Shadow Flat / Border Only**: `box-shadow: none; border: 1px solid #E5E7EB;` (Default for content cards)
- **Shadow Soft (Elevation 1)**: `0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)` (Card resting state)
- **Shadow Float (Elevation 2)**: `0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)` (Card hover & dropdown menus)
- **Shadow Modal (Elevation 3)**: `0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)` (Admin modals & dialogs)

### 3.2 Spacing & Radii
- **Border Radius**:
  - `rounded-md`: `6px` (Standard buttons, inputs, tags, badges)
  - `rounded-lg`: `8px` (Cards, dropdown containers)
  - `rounded-xl`: `12px` (Modal windows, preview canvas)
  - *Strictly avoid:* Pill-shaped or overly rounded bubbly cards (`rounded-3xl` or excessive pills) to maintain an engineered, high-precision aesthetic.
- **Section Spacing**: `py-16 md:py-24` on desktop to allow generous negative space and visual breathing room.
- **Container Max-Width**: `max-w-6xl` (`1152px`) centered with `mx-auto px-4 sm:px-6 lg:px-8`.

---

## 4. UI Component Design Specifications

### 4.1 Buttons
- **Primary Action**: Solid `#2563EB`, text `#FFFFFF`, font-weight 500, `h-10 px-4 py-2 rounded-md`, transition ease 150ms.
- **Secondary / Outline**: `#FFFFFF` background, border `1px solid #E5E7EB`, text `#111827`, hover background `#F1F5F9`.
- **Ghost Action**: Transparent background, text `#64748B`, hover text `#111827`, hover background `#F1F5F9`.
- **Destructive**: Solid `#DC2626`, text `#FFFFFF`, hover background `#B91C1C`.

### 4.2 Interactive Project Cards
- Pure white background with 1px `#E5E7EB` border.
- 16:9 aspect ratio image thumbnail with subtle overflow zoom on hover (`scale-102 transition duration-300`).
- Technology stack pills: `#F8FAFC` background with `#E5E7EB` border and `#64748B` typography.
- Action icons (GitHub, External Demo) placed top-right or at footer with discreet tooltips.

### 4.3 Form Inputs & Selects
- 1px `#E5E7EB` border, pure `#FFFFFF` background.
- Focus state: `ring-2 ring-blue-600/20 border-blue-600 outline-none`.
- Labels in `#111827` font-weight 500 (`text-sm`), subtle help text in `#64748B` (`text-xs`).

### 4.4 Admin Dashboard Shell
- Left sidebar: Fixed width `260px`, background `#F8FAFC`, right border `1px solid #E5E7EB`.
- Active sidebar item: Background `#FFFFFF`, text `#2563EB`, shadow soft, font-weight 500.
- Top bar: Background `#FFFFFF`, bottom border `1px solid #E5E7EB`, height `64px`, sticky top.

---

## 5. Responsive Breakpoint Matrix & Layout Rules

The interface must adhere to strict mobile-first fluid design principles across all designated viewports:

| Breakpoint | Minimum Width | Target Devices | Layout Adaptations |
| :--- | :--- | :--- | :--- |
| **xs** | `320px - 375px` | Compact smartphones (iPhone SE) | Single column, stacked CTA buttons, drawer mobile menu, 14px body |
| **sm** | `640px` | Large smartphones | 2-column skills grid, horizontal CTA button group |
| **md** | `768px` | Tablets & iPads | 2-column project grid, collapsible admin sidebar, tablet navigation |
| **lg** | `1024px` | Laptops & standard displays | 3-column project grid, permanent admin sidebar, expanded topbar search |
| **xl** | `1280px` | Desktop monitors | Generous negative margins, max-w-6xl container |
| **2xl** | `1440px - 1920px`| Widescreen & 4K displays | Centered bounded container (no stretched horizontal layouts) |

### Non-Negotiable Responsive Rules:
1. **Zero Horizontal Overflow**: `overflow-x: hidden` enforced on page wrapper; test tables with fluid card wraps or contained scroll wrappers.
2. **Touch Targets**: Minimum tap target size of `44px x 44px` on interactive elements for mobile displays (`< 768px`).
3. **Responsive Media**: All Cloudinary images rendered using `next/image` with explicit `sizes` attributes for dynamic device resolution adaptation.
