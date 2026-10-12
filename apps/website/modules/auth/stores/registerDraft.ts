import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RegisterDraft } from '~/modules/auth/types';

/**
 * What the user entered on the register form, so "Change registration details" on the
 * verify screen brings them back to a filled-in form. Passwords are never kept, and it
 * lives in memory only (not a cookie), so personal details don't outlive the tab.
 */
export const useRegisterDraftStore = defineStore('auth-register-draft', () => {
  const draft = ref<RegisterDraft | null>(null);

  const save = (value: RegisterDraft) => {
    draft.value = { ...value };
  };

  const clear = () => {
    draft.value = null;
  };

  return { draft, save, clear };
});
