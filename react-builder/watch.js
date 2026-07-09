import * as esbuild from 'esbuild';

async function watch() {
  const ctx1 = await esbuild.context({
    entryPoints: ["src/mountSponsorButton.tsx"],
    bundle: true,
    outfile: "../dist/sponsorButtonBundle.js",
  });

  const ctx2 = await esbuild.context({
    entryPoints: ["src/mountSkiper19.tsx"],
    bundle: true,
    outfile: "../dist/skiper19Bundle.js",
  });

  const ctx3 = await esbuild.context({
    entryPoints: ["src/mountSkiper30.tsx"],
    bundle: true,
    outfile: "../dist/skiper30Bundle.js",
  });

  await ctx1.watch();
  await ctx2.watch();
  await ctx3.watch();
  console.log("Watching for changes...");
}

watch().catch(() => process.exit(1));
