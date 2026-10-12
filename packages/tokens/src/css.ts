import { colors, lightColors, lightShadows, motionTokens, radius, shadows, space } from './tokens';

const kebab = (s: string) => s.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();

const colorVars = (c: Record<string, string>) => Object.entries(c).map(([k, v]) => `--color-${kebab(k)}:${v};`).join('');
const shadowVars = (s: Record<string, string>) => Object.entries(s).map(([k, v]) => `--shadow-${k}:${v};`).join('');

/**
 * Emits CSS variables for web and admin.
 * Dark is the default. Light applies when the OS prefers it, unless `data-theme="dark"` is set on <html>.
 * `data-theme="light"` forces light. Colour names match mobile.
 */
export function cssVariables(): string {
  const shared: string[] = [];
  for (const [k, v] of Object.entries(radius)) shared.push(`--radius-${k}:${v}px;`);
  for (const [k, v] of Object.entries(space)) shared.push(`--space-${k}:${v}px;`);
  for (const [k, v] of Object.entries(motionTokens.duration)) shared.push(`--dur-${k}:${v}s;`);
  shared.push(`--ease:cubic-bezier(${motionTokens.ease.join(',')});`);
  const light = `${colorVars(lightColors)}${shadowVars(lightShadows)}color-scheme:light;`;
  return (
    `:root{${shared.join('')}${colorVars(colors)}${shadowVars(shadows)}color-scheme:dark;}` +
    `:root[data-theme="light"]{${light}}` +
    `@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){${light}}}`
  );
}
