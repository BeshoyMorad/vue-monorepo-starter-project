// Glob keys are relative to this file, e.g. `../assets/images/logo.png`.
const images = import.meta.glob<string>('../assets/images/**/*', {
  eager: true,
  import: 'default',
});
const gifs = import.meta.glob<string>('../assets/gifs/**/*', { eager: true, import: 'default' });
const sounds = import.meta.glob<string>('../assets/sounds/**/*', {
  eager: true,
  import: 'default',
});

export const getImagePath = (path: string): string => {
  const cleanPath = path.replace(/^(assets\/images\/|images\/)/, '');
  const key = `../assets/images/${cleanPath}`;
  return images[key] ?? '';
};

export const getGifPath = (name: string): string => {
  const cleanName = name.replace(/^(assets\/gifs\/|gifs\/)/, '').replace(/\.gif$/, '');
  const key = `../assets/gifs/${cleanName}.gif`;
  return gifs[key] ?? '';
};

export const getSoundPath = (name: string): HTMLAudioElement => {
  const cleanName = name.replace(/^(assets\/sounds\/|sounds\/)/, '').replace(/\.wav$/, '');
  const key = `../assets/sounds/${cleanName}.wav`;
  const src = sounds[key] ?? '';
  return new Audio(src);
};
