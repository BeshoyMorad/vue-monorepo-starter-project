<script setup lang="ts">
  import InputText from '@workspace/ui/form/input-text/InputText.vue';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import AuthSubmitButton from '~/modules/auth/components/AuthSubmitButton.vue';
  import { useProfileForm } from '~/modules/account/composables/useProfileForm';
  import type { CustomerProfile } from '~/modules/account/types';
  import AccountCard from './AccountCard.vue';

  const props = defineProps<{ profile?: CustomerProfile }>();
  const { t } = useI18n();
  const { onSubmit, canSubmit, hasChanges, formError, isPending } = useProfileForm(
    toRef(props, 'profile')
  );
</script>

<template>
  <AccountCard
    id="account-profile"
    :title="t('account.profile.title')"
    :text="t('account.profile.text')"
  >
    <form class="space-y-5" method="post" novalidate @submit="onSubmit">
      <div class="grid items-start gap-4 sm:grid-cols-2">
        <InputText
          name="fullName"
          test-id="profile-full-name"
          autocomplete="name"
          :label="t('account.profile.fullName')"
          aria-required="true"
          container-class="auth-field field-required"
        />
        <InputText
          name="nationalId"
          test-id="profile-national-id"
          inputmode="numeric"
          maxlength="14"
          dir="ltr"
          :label="t('account.profile.nationalId')"
          :description="t('auth.fields.nationalId.hint')"
          aria-required="true"
          container-class="auth-field field-required"
        />
        <InputText
          name="addressLink"
          test-id="profile-address-link"
          type="url"
          inputmode="url"
          dir="ltr"
          :label="t('account.profile.addressLink')"
          :description="t('account.profile.addressLinkHint')"
          :placeholder="t('account.profile.addressLinkPlaceholder')"
          container-class="auth-field sm:col-span-2"
        />
      </div>
      <div class="flex flex-wrap items-center justify-end gap-3">
        <span v-if="!hasChanges" class="text-sm text-[oklch(0.45_0_0)]">
          {{ t('account.profile.noChanges') }}
        </span>
        <div class="w-full sm:w-auto">
          <AuthSubmitButton test-id="profile-save" :loading="isPending" :disabled="!canSubmit">
            {{ t('account.profile.save') }}
          </AuthSubmitButton>
        </div>
      </div>
      <AuthFormError test-id="profile-error" :message="formError" />
    </form>
  </AccountCard>
</template>
