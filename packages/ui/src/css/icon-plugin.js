import { fileURLToPath } from 'node:url';
import iconifyPlugin from '@iconify/tailwind4';

const iconsDir = fileURLToPath(new URL('../assets/icons', import.meta.url));

export default iconifyPlugin({
  prefixes: ['hugeicons', 'custom'],
  scale: 1.5,
  'icon-sets': [`from-folder(custom, ${iconsDir})`],
});
