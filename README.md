# Ajay Kumar Maharjan — Portfolio & Interactive 3D Rubik's Cube Architecture

A modern, high-performance developer portfolio built with Next.js 15 (App Router, static export), TypeScript, Tailwind CSS, and Framer Motion. The portfolio features an innovative exploration paradigm where visitors can explore portfolio sections either through an interactive full-viewport 3D Rubik's cube stage or through a traditional classic scrollable view.

---

## 🎲 Interactive 3D Portfolio Architecture

### 1. Exploration Model: The Rubik's Cube as Content Navigator
Rather than acting as a static side-widget, the 3D Rubik's cube serves as the primary exploratory interface:
- **Six Labeled Center Stickers**:
  - **About**: Front face (Green `#10B981`)
  - **Projects / Work**: Right face (Red `#EF4444`)
  - **Skills / Tools**: Left face (Orange `#FF9234`)
  - **Experience**: Up face (White `#F8FAFC`)
  - **Services**: Down face (Yellow `#EAB308`)
  - **Contact**: Back face (Blue `#3B82F6`)
- **Center Invariant Property**: In a Rubik's cube, the 6 center cubies never change their relative positions under face turns. Scrambling or twisting outer layers preserves the exact 1-to-1 mapping of sections to faces.
- **Tech Stack Decals**: Non-center stickers feature subtle SVG canvas decals representing Ajay's real engineering stack (HTML5, CSS3, JavaScript, React, Next.js, Node.js, NestJS, PostgreSQL). Can be toggled on/off in the toolbar.

---

### 2. Camera Focus Transition & Upright Alignment (`focus.ts`)
When a visitor taps a center sticker or selects a section from the navigation menu:
- **Camera Arc Slerp**: Instead of rotating the cube, the camera glides smoothly around the cube on a spherical arc using spherical linear interpolation (quaternion slerp) and Anime.js v4 easing.
- **Upright Normal & Roll Alignment**: Because Up/Down faces look along the Y axis and face turns rotate stickers, `focus.ts` dynamically calculates the target cubie's current world normal and its rotated local "up" vector. The camera's orientation aligns precisely with this local up vector so all face labels always end right-side up to the viewer.
- **Frame Rate Optimization**: During focus transitions, full 60 FPS rendering is maintained. While the overlay dialog is open and the cube is static behind it, the render loop throttles to 10 FPS to minimize GPU/battery consumption. When closing, full 60 FPS is restored *before* the return camera tween starts.

---

### 3. Accessible Section Overlay (`SectionOverlay.tsx`)
- **Portal Outside Main Content**: The modal dialog is rendered via React `createPortal(..., document.body)`.
- **Inert Background**: When open, `#main-content` is given the HTML `inert` attribute to prevent background focus trapping or clicks, while the portal dialog remains completely interactive.
- **Immediate Content Visibility**: Sections inside the overlay receive `idPrefix="overlay"`. Framer Motion reveal animations bypass `whileInView` (which can fail inside nested scroll containers) and initialize with `initial="visible" animate="visible"` so text, cards, and forms are 100% visible immediately.
- **Mobile Sheet Ergonomics**: On small screens (`< 768px`), the overlay displays as a full-screen sheet with safe-area bottom padding (`env(safe-area-inset-bottom)`), native momentum scrolling, and a sticky header with a Back button.

---

### 4. Dual View Modes: 3D Explore vs. Classic Portfolio (`ViewModeContext.tsx`)
- **Zero-Dependency State**: Managed using standard React Context (`ViewModeProvider` / `useViewMode`) with zero third-party state libraries.
- **Server Match & Persistence**: Initial render always defaults to `'cube'` mode to match server-rendered HTML. Saved user preferences are read inside `useEffect` from `localStorage['portfolio_view_mode']` to prevent hydration mismatches.
- **Classic Mode**:
  - The 3D cube canvas is replaced with a compact hero card.
  - Classic in-page sections (`About`, `Experience`, `Work`, `Service`, `Tools`, `Contact`) display sequentially in the main document flow.
  - Navbar links trigger smooth scrolling to section anchors rather than opening the 3D overlay.

---

### 5. SEO & Progressive Enhancement
- **Full Static HTML Prerendering**: In `/out/index.html`, all 6 sections are fully server-rendered in the static HTML markup.
- **No-JS Fallback**: If JavaScript is disabled or unavailable, `html:not(.js) .classic-sections-container { display: block !important; }` ensures all text, images, and project details are immediately readable.
- **Search Engine Crawlability**: Googlebot and other web crawlers index the complete textual content of all sections directly from the static HTML.

---

### 6. Mobile Touch Ergonomics & Bounding Box Calibration
- **Default Touch Action (`touch-action: pan-y`)**: Prevents touch-trapping so mobile visitors can scroll down the page naturally.
- **"Interact 3D" Mode**: An accessible button enables `touch-action: none` for full thumb twisting and 3D orbiting, displaying an "Exit to Scroll" pill button to return to normal scrolling. Center sticker taps work in both modes.
- **Intelligent Coarse Pointer Detection**: Uses `window.matchMedia("(pointer: coarse)")` combined with hardware touch detection. Laptops with touchscreens and small desktop browser windows with mouse input do not display mobile controls unnecessarily.
- **Calibrated Camera Distance**:
  - **360x640** ($r = 11.2$): Cube projected bounds $340\text{px} \times 351\text{px}$ ($94.4\%$ width), toolbar clearance $64\text{px}$.
  - **390x844** ($r = 12.0$): Cube projected bounds $416\text{px} \times 432\text{px}$, toolbar clearance $126\text{px}$.
  - **768x1024** ($r = 10.5$): Cube projected bounds $584\text{px} \times 600\text{px}$, toolbar clearance $118\text{px}$.

---

### 7. Clean History & Popstate Management
- When opening an overlay, `history.pushState({ section: id }, '', '#' + id)` updates the URL.
- When closing via the UI close button, the engine checks if the open pushed an entry and calls `window.history.back()`.
- An internal flag (`isProgrammaticBackRef`) guards `popstate` to prevent double-firing close handlers.
- Fast open/close/open/close cycles cleanly pop entries without growing the browser history stack.

---

### 8. Orientation-Agnostic Solve Detection & Easter Egg
- Evaluates 54 sticker normals in local space, grouping into 6 groups of 9.
- Unlocks the secret developer terminal **only** if:
  1. The cube was scrambled via `scramble()`.
  2. The solve was reached via forward user moves.
  3. Auto-solve was not used or cancelled during the scramble cycle.
- Dev test helpers and debug flags (`cubeDebug`, `cubeTest`, `__triggerEasterEgg`) are completely stripped from production builds via dead-code elimination.

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Static Export Build
```bash
npm run build
```
Static files are generated in `/out`.

To serve the production export locally:
```bash
node scratch/serve_out.js
```
Open [http://localhost:5000](http://localhost:5000).

---

## 📋 Pre-Deploy Checklist for Production

Before deploying to your production domain:
- [ ] **Easter Egg Secret Content**: In [`src/components/cube/EasterEggModal.tsx`](src/components/cube/EasterEggModal.tsx), locate the `TODO: Ajay` comments and replace:
  - Secret Project Title (currently *"Autonomous Neural Code Engine"*).
  - Secret Project Description.
  - Secret GitHub repository link (`https://github.com/Aj23Mah/...`).
  - Private contact link / inquiry email.
- [ ] **Metadata Domain**: Confirm `metadataBase` in [`src/app/layout.tsx`](src/app/layout.tsx) points to your live URL (`https://ajayakumarmaharjan.com.np/`).
- [ ] **OpenGraph Image**: Ensure `/public/image/logo.png` or an OG banner image exists at the specified dimensions ($1200 \times 630$).
- [ ] **Run Lint & Build**: Confirm `npm run lint` and `npm run build` execute cleanly with zero errors.
- [ ] **Verify Zero Dev Tokens**: Run `node scratch/scan_dev_tokens.js` against `/out` to verify 0 dev tokens in production artifacts.
