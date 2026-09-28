// App project assets (resolved relative to the running application root)
const appImages = import.meta.glob('/src/assets/images/**/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
const appGifs = import.meta.glob('/src/assets/gifs/**/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
const appSounds = import.meta.glob('/src/assets/sounds/**/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// Shared global core assets (resolved relative to @workspace/core)
const coreImages = import.meta.glob('../assets/images/**/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
const coreGifs = import.meta.glob('../assets/gifs/**/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
const coreSounds = import.meta.glob('../assets/sounds/**/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export const getImagePath = (path: string): string => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const cleanPath = path.replace(/^(assets\/images\/|images\/)/, '').replace(/^\.?\//, '');
  const appKey = `/src/assets/images/${cleanPath}`;
  if (appImages[appKey]) {
    return appImages[appKey];
  }

  const coreKey = `../assets/images/${cleanPath}`;
  if (coreImages[coreKey]) {
    return coreImages[coreKey];
  }

  return '';
};

export const getGifPath = (name: string): string => {
  if (!name) return '';
  const cleanName = name
    .replace(/^(assets\/gifs\/|gifs\/)/, '')
    .replace(/^\.?\//, '')
    .replace(/\.gif$/, '');
  const appKey = `/src/assets/gifs/${cleanName}.gif`;
  if (appGifs[appKey]) {
    return appGifs[appKey];
  }

  const coreKey = `../assets/gifs/${cleanName}.gif`;
  if (coreGifs[coreKey]) {
    return coreGifs[coreKey];
  }

  return '';
};

export const getSoundPath = (name: string): HTMLAudioElement => {
  const cleanName = name
    .replace(/^(assets\/sounds\/|sounds\/)/, '')
    .replace(/^\.?\//, '')
    .replace(/\.wav$/, '');
  const appKey = `/src/assets/sounds/${cleanName}.wav`;
  const coreKey = `../assets/sounds/${cleanName}.wav`;
  const src = appSounds[appKey] || coreSounds[coreKey] || '';
  return new Audio(src);
};
