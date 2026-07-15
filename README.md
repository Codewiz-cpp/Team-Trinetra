# Team Trinetra — Official Website

Website for **Team Trinetra**, an autonomous UAV team competing in drone racing and autonomous flight competitions.

🌐 **Live site:** [team-trinetra.vercel.app](https://github.com/Codewiz-cpp/Team-Trinetra)

---

## Project Structure

```
Team-Trinetra/
├── index.html              # Main SPA entry point — all tabs live here
├── journey.html            # Standalone journey page
├── style.css               # All styles (see section map inside the file)
├── script.js               # All JS logic (see section map inside the file)
│
├── tabs/                   # HTML partials injected per-tab at runtime
│   ├── sponsors.html       # Sponsors tab content
│   ├── config.html         # Mission config tab
│   ├── team.html           # Team tab placeholder
│   ├── vehicles.html       # Vehicles tab placeholder
│   ├── data.html           # Data tab
│   └── simulation.html     # Simulation tab placeholder
│
├── react-builder/          # React + TypeScript UI islands (bundled with esbuild)
│   ├── src/
│   │   ├── ExpandableSponsorButton.tsx   # Animated sponsor CTA button
│   │   ├── GalleryCarousel.tsx           # Photo gallery swiper (was skiper30)
│   │   ├── ParallaxTimeline.tsx          # Journey parallax timeline (was skiper19)
│   │   ├── ThemeToggle.tsx               # Theme toggle button + hook (was skiper26)
│   │   ├── VehicleSwiper.tsx             # Vehicle carousel (was skiper49)
│   │   ├── GradientText.tsx              # Animated gradient text
│   │   ├── SideRays.jsx                  # Side-ray visual effect
│   │   ├── TextRoll.tsx                  # Rolling text animation
│   │   ├── BentoSubtitleWrapper.tsx      # Bento grid subtitle reveal
│   │   ├── mountSponsorButton.tsx        # Entry: mounts ExpandableSponsorButton
│   │   ├── mountParallaxTimeline.tsx     # Entry: mounts ParallaxTimeline
│   │   ├── mountGalleryCarousel.tsx      # Entry: mounts GalleryCarousel
│   │   ├── mountGradientJourney.tsx      # Entry: mounts GradientText for journey
│   │   └── skiper40.tsx                  # Prototype animated links (unused, reference only)
│   ├── watch.js            # esbuild watch script for development
│   └── package.json        # React builder dependencies
│
├── dist/                   # Compiled JS/CSS bundles (git-ignored — run build locally)
├── images/                 # Site images and optimised WebP assets
├── fonts/                  # Custom font files (Gallery, Elios, Sigurd, Helvetica Neue)
├── videos/                 # Background video files
├── vendor/                 # Third-party libraries (Swiper)
└── tools/                  # Dev scripts (image optimisation)
```

---

## Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+

### 1. Serve the site
```bash
npx http-server -c-1 -o
```
Opens at `http://localhost:8080`.

### 2. Build React components (required after any `.tsx` change)
```bash
cd react-builder
npm install        # first time only
npm run build
```

Bundles are output to `dist/` and loaded by `index.html` as `<script>` tags.

### 3. Watch mode (auto-rebuild on save)
```bash
cd react-builder
npm run watch
```

---

## Adding a New Tab

1. Create `tabs/your-tab.html` with your content
2. Add a fetch call in the `loadTabs()` function in `script.js` (Section 9)
3. Add a toolbar button in `index.html`
4. Add CSS under the appropriate section in `style.css`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | Vanilla HTML |
| Styling | Vanilla CSS |
| Logic | Vanilla JavaScript |
| UI Islands | React 19 + TypeScript |
| Bundler | esbuild |
| Animation | GSAP, Framer Motion, Lenis |
| Gallery | Swiper.js |

---

## Contributing

1. Fork the repo
2. Make your changes
3. Run `npm run build` in `react-builder/` if you changed any `.tsx` files
4. Open a pull request

---

*Team Trinetra © 2026*
