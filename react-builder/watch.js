import * as esbuild from 'esbuild';

// Build config for each React UI island.
// Output bundles go to ../dist/ and are loaded by index.html.
async function watch() {
  // Sponsor CTA button (ExpandableSponsorButton)
  const ctx1 = await esbuild.context({
    entryPoints: ["src/mountSponsorButton.tsx"],
    bundle: true,
    outfile: "../dist/sponsorButtonBundle.js",
  });

  // Parallax journey timeline (ParallaxTimeline)
  const ctx2 = await esbuild.context({
    entryPoints: ["src/mountParallaxTimeline.tsx"],
    bundle: true,
    outfile: "../dist/parallaxTimelineBundle.js",
  });

  // Photo gallery carousel (GalleryCarousel)
  const ctx3 = await esbuild.context({
    entryPoints: ["src/mountGalleryCarousel.tsx"],
    bundle: true,
    outfile: "../dist/galleryCarouselBundle.js",
  });

  await ctx1.watch();
  await ctx2.watch();
  await ctx3.watch();
  console.log("Watching for changes...");
}

watch().catch(() => process.exit(1));
