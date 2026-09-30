// Iconify Tailwind plugin with an absolute icon folder path.
// A relative path in CSS is resolved from the process cwd, which differs between
// `nuxt dev` (apps/website) and the VS Code Tailwind extension (repo root).
import { fileURLToPath } from 'node:url';
import iconify from '@iconify/tailwind4';

const customIconsDir = fileURLToPath(
  new URL('../../../../packages/ui/src/assets/icons', import.meta.url)
);

export default iconify({
  prefixes: ['hugeicons', 'custom'],
  scale: 1.5,
  'icon-sets': `from-folder(custom, '${customIconsDir}')`,
});
