// 4px grid check. Fails when a spacing, size, radius or line-height is not a multiple of 4.
// Run from apps/mobile:  pnpm grid   (optionally pass folders: pnpm grid app src)
// Exempt: values of 2 or less (hairlines), shadow offsets, and font sizes.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const KEYS = 'padding|paddingHorizontal|paddingVertical|paddingTop|paddingBottom|paddingLeft|paddingRight|margin|marginHorizontal|marginVertical|marginTop|marginBottom|marginLeft|marginRight|gap|rowGap|columnGap|top|left|right|bottom|width|height|minHeight|minWidth|maxWidth|maxHeight|borderRadius|borderTopLeftRadius|borderTopRightRadius|lineHeight|line';
const style = new RegExp(`\\b(${KEYS})\\s*:\\s*(-?\\d+(?:\\.\\d+)?)\\b`, 'g');
const jsx = /\b(size|height)=\{(\d+(?:\.\d+)?)\}/g;

const files = (dir) => readdirSync(dir).flatMap((n) => {
  if (n === 'node_modules') return [];
  const p = join(dir, n);
  return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(n) ? [p] : [];
});

const bad = [];
for (const dir of process.argv.slice(2).length ? process.argv.slice(2) : ['app', 'src']) {
  for (const f of files(dir)) {
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (line.includes('shadowOffset')) return;
      for (const re of [style, jsx]) {
        re.lastIndex = 0;
        for (const m of line.matchAll(re)) {
          const v = Number(m[2]);
          if (Math.abs(v) > 2 && v % 4 !== 0) bad.push(`${f}:${i + 1}  ${m[1]}: ${m[2]}`);
        }
      }
    });
  }
}
if (bad.length) { console.error(`Off the 4px grid (${bad.length}):\n` + bad.join('\n')); process.exit(1); }
console.log('4px grid: all spacing, sizes, radii and line-heights are multiples of 4.');
