import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT_DIR = join(ROOT, 'images');
const OUTPUT_DIR = join(ROOT, 'images', 'optimized');

await mkdir(OUTPUT_DIR, { recursive: true });

const EXTS = new Set(['.png', '.jpg', '.jpeg']);

const files = (await readdir(INPUT_DIR)).filter(f => EXTS.has(extname(f).toLowerCase()));

console.log(`\nProcessing ${files.length} images...\n`);
console.log('File'.padEnd(30) + 'Before'.padStart(10) + 'After'.padStart(10) + 'Saved'.padStart(10) + 'Reduction'.padStart(12));
console.log('-'.repeat(72));

let totalBefore = 0, totalAfter = 0;

for (const file of files) {
  const inputPath = join(INPUT_DIR, file);
  const outName = basename(file, extname(file)) + '.webp';
  const outputPath = join(OUTPUT_DIR, outName);

  const beforeStat = await stat(inputPath);
  const beforeBytes = beforeStat.size;

  await sharp(inputPath)
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: 82, effort: 6 })
    .toFile(outputPath);

  const afterStat = await stat(outputPath);
  const afterBytes = afterStat.size;
  const savedBytes = beforeBytes - afterBytes;
  const pct = ((savedBytes / beforeBytes) * 100).toFixed(1);

  totalBefore += beforeBytes;
  totalAfter  += afterBytes;

  const fmt = b => (b / 1024).toFixed(0) + ' KB';
  console.log(
    file.padEnd(30) +
    fmt(beforeBytes).padStart(10) +
    fmt(afterBytes).padStart(10) +
    fmt(savedBytes).padStart(10) +
    `${pct}%`.padStart(12)
  );
}

console.log('-'.repeat(72));
const totalSaved = totalBefore - totalAfter;
const fmt = b => (b / 1024 / 1024).toFixed(2) + ' MB';
console.log(
  'TOTAL'.padEnd(30) +
  fmt(totalBefore).padStart(10) +
  fmt(totalAfter).padStart(10) +
  fmt(totalSaved).padStart(10) +
  `${((totalSaved/totalBefore)*100).toFixed(1)}%`.padStart(12)
);
console.log('\n✅ All WebP files written to images/optimized/\n');
