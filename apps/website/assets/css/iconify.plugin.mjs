// Iconify Tailwind plugin with absolute icon folder paths.
// A relative path in CSS is resolved from the process cwd, which differs between
// `nuxt dev` (apps/website) and the VS Code Tailwind extension (repo root).
// Single-color SVGs in these folders are recolored to currentColor, so they follow the text color.
//   custom--<file>: shared icons in packages/ui/src/assets/icons
//   site--<file>:   website-only icons in apps/website/assets/icons (e.g. site--user-square)
import { fileURLToPath } from 'node:url';
import iconify from '@iconify/tailwind4';

const customIconsDir = fileURLToPath(
  new URL('../../../../packages/ui/src/assets/icons', import.meta.url)
);
const siteIconsDir = fileURLToPath(new URL('../icons', import.meta.url));

export default iconify({
  prefixes: ['hugeicons', 'custom', 'site'],
  scale: 1.5,
  'icon-sets': [
    `from-folder(custom, '${customIconsDir}')`,
    `from-folder(site, '${siteIconsDir}')`,
  ],
});
