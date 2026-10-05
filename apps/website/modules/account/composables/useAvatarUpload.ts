export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 5;

/**
 * Local copies of uploaded photos, by their stored URL. Every avatar shows the copy the
 * browser already has instead of downloading the new photo again, so the sidebar and the
 * header change at the same moment as the form, with no extra request.
 */
export const useAvatarLocalCopies = () =>
  useState<Record<string, string>>('avatar-local-copies', () => ({}));

/**
 * A photo picked in "User details": checked and previewed locally only. Nothing is sent
 * until "Save details" (see useProfileForm), which uploads it with the other changes.
 */
export function useAvatarPick() {
  const { t } = useI18n();
  const file = shallowRef<File | null>(null);
  const preview = ref<string | null>(null);
  const error = ref('');

  const choose = (picked?: File | null) => {
    error.value = '';
    if (!picked) return;
    if (!AVATAR_TYPES.includes(picked.type)) {
      error.value = t('account.details.photoType');
      return;
    }
    const size = picked.size / 1024 / 1024;
    if (size > MAX_MB) {
      error.value = t('account.details.photoSize', { size: size.toFixed(1), max: MAX_MB });
      return;
    }
    if (preview.value && file.value) URL.revokeObjectURL(preview.value);
    file.value = picked;
    preview.value = URL.createObjectURL(picked);
  };

  /** After saving: the file is sent; its preview is kept as the local copy of `storedUrl` */
  const saved = (storedUrl: string) => {
    if (preview.value) useAvatarLocalCopies().value[storedUrl] = preview.value;
    file.value = null;
    preview.value = null;
  };

  /** Drops an unsaved pick (e.g. the profile changed underneath) */
  const reset = () => {
    if (preview.value && file.value) URL.revokeObjectURL(preview.value);
    file.value = null;
    preview.value = null;
    error.value = '';
  };

  return { file, preview, error, choose, saved, reset };
}

export type AvatarPick = ReturnType<typeof useAvatarPick>;
