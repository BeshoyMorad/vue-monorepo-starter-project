<script setup lang="ts">
  import InputText from '@workspace/ui/form/input-text/InputText.vue';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import AuthSubmitButton from '~/modules/auth/components/AuthSubmitButton.vue';
  import { AVATAR_TYPES, useAvatarPick } from '~/modules/account/composables/useAvatarUpload';
  import { useProfileForm } from '~/modules/account/composables/useProfileForm';
  import type { CustomerProfile } from '~/modules/account/types';
  import AccountCard from './AccountCard.vue';
  import ProfileAvatar from './ProfileAvatar.vue';

  /** "User details": avatar, first and last name, national ID (Ibbil design) */
  const props = defineProps<{ profile?: CustomerProfile }>();
  const { t } = useI18n();
  const photo = useAvatarPick();
  const { onSubmit, canSubmit, hasChanges, formError, isPending } = useProfileForm(
    toRef(props, 'profile'),
    photo
  );
  const fileInput = ref<HTMLInputElement>();
  const onFile = (event: Event) => {
    const input = event.target as HTMLInputElement;
    photo.choose(input.files?.[0]);
    input.value = '';
  };
</script>

<template>
  <AccountCard id="account-details" :title="t('account.details.title')">
    <form class="details" method="post" novalidate @submit="onSubmit">
      <!-- Photo: the whole avatar picks an image; it is uploaded with "Save details" -->
      <div class="photo">
        <button
          type="button"
          class="photo__btn"
          data-test-id="details-photo"
          :aria-label="t('account.details.changePhoto')"
          :aria-disabled="isPending || undefined"
          @click="!isPending && fileInput?.click()"
        >
          <ProfileAvatar
            :name="profile?.fullName"
            :src="photo.preview.value ?? profile?.avatar"
            :size="120"
          />
          <span class="photo__overlay" aria-hidden="true">
            <Icon icon="hugeicons--camera-01" class="size-7" />
          </span>
          <span v-if="isPending && photo.file.value" class="photo__spinner" aria-hidden="true" />
          <span class="photo__pencil" aria-hidden="true">
            <Icon icon="hugeicons--pencil-edit-01" class="size-4" />
          </span>
        </button>
        <input
          ref="fileInput"
          type="file"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
          :accept="AVATAR_TYPES.join(',')"
          @change="onFile"
        />
        <p v-if="photo.error.value" class="photo__error" role="alert">{{ photo.error.value }}</p>
        <p v-else-if="photo.file.value" class="photo__hint" role="status">
          {{ t('account.details.photoPending') }}
        </p>
      </div>
      <div class="details__fields">
        <div class="grid items-start gap-4 sm:grid-cols-2">
          <InputText
            name="firstName"
            test-id="details-first-name"
            autocomplete="given-name"
            :label="t('account.details.firstName')"
            aria-required="true"
            container-class="auth-field field-required"
          />
          <InputText
            name="lastName"
            test-id="details-last-name"
            autocomplete="family-name"
            :label="t('account.details.lastName')"
            aria-required="true"
            container-class="auth-field field-required"
          />
          <InputText
            name="nationalId"
            test-id="details-national-id"
            inputmode="numeric"
            maxlength="14"
            dir="ltr"
            :label="t('account.details.nationalId')"
            :description="t('auth.fields.nationalId.hint')"
            aria-required="true"
            container-class="auth-field field-required sm:col-span-2"
          />
        </div>
        <div class="details__actions">
          <span v-if="!hasChanges" class="text-sm text-[oklch(0.45_0_0)]">
            {{ t('account.details.noChanges') }}
          </span>
          <div class="w-full sm:w-auto sm:min-w-40">
            <AuthSubmitButton test-id="details-save" :loading="isPending" :disabled="!canSubmit">
              {{ t('account.details.save') }}
            </AuthSubmitButton>
          </div>
        </div>
        <AuthFormError test-id="details-error" :message="formError" />
      </div>
    </form>
  </AccountCard>
</template>

<style scoped>
  .details {
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }
  .photo {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    max-width: 160px;
  }
  .photo__btn {
    position: relative;
    display: block;
    border-radius: 50%;
    cursor: pointer;
  }
  .photo__btn[aria-disabled='true'] {
    cursor: progress;
  }
  /* Hover / focus: a dark veil with a camera, so the whole photo reads as editable */
  .photo__overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgb(17 32 24 / 0.45);
    color: #fff;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .photo__btn:hover .photo__overlay,
  .photo__btn:focus-visible .photo__overlay {
    opacity: 1;
  }
  .photo__spinner {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 32px;
    height: 32px;
    border: 3px solid rgb(255 255 255 / 0.7);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  /* Gold pencil on the bottom start edge, as in the design (gold-700: 4.4:1 for the icon) */
  .photo__pencil {
    position: absolute;
    bottom: 2px;
    inset-inline-start: 2px;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 2px solid #fff;
    border-radius: 50%;
    background: var(--color-gold-700);
    color: #fff;
    box-shadow: 0 2px 6px rgb(0 0 0 / 0.15);
  }
  .photo__btn:hover .photo__pencil {
    background: var(--color-gold-800);
  }
  .photo__error,
  .photo__hint {
    font-size: 12px;
    line-height: 16px;
    text-align: center;
  }
  .photo__error {
    color: oklch(0.5 0.2 25);
  }
  .photo__hint {
    color: var(--color-gold-800);
    font-weight: 600;
  }
  .details__fields {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .details__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }
  @media (max-width: 640px) {
    .details {
      flex-direction: column;
      align-items: center;
    }
    .details__fields {
      width: 100%;
    }
  }
</style>
