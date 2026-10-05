<script setup lang="ts">
  import InputText from '@workspace/ui/form/input-text/InputText.vue';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import AuthSubmitButton from '~/modules/auth/components/AuthSubmitButton.vue';
  import SaudiPhoneField from '~/modules/auth/components/SaudiPhoneField.vue';
  import { AUTH_PORTAL } from '~/modules/auth/types';
  import { useChangeRequestForm } from '~/modules/account/composables/useChangeRequestForm';
  import { createContactSchema } from '~/modules/account/schemas';
  import { useAccountService } from '~/modules/account/services';
  import type { ContactChannel } from '~/modules/account/types';
  import type { SentStep } from './ChangeFlowDialog.vue';

  /** New phone or email; the API sends a code to it */
  const props = defineProps<{
    channel: ContactChannel;
    current?: string | null;
    onSent: (step: SentStep) => void;
  }>();

  const { t } = useI18n();
  const service = useAccountService();
  const testId = `contact-${props.channel}`;

  const { onSubmit, canSubmit, formError, isPending } = useChangeRequestForm({
    schema: createContactSchema(t, props.channel, props.current ?? ''),
    initialValues: { identifier: '' },
    request: ({ identifier }) =>
      service.requestContactChange({
        channel: props.channel,
        identifier: identifier.trim(),
        portal: AUTH_PORTAL,
      }),
    // A number / address already used by another account belongs under the field
    codeFields: { CONTACT_IN_USE: 'identifier', CONFLICT: 'identifier' },
    onSent: (token, { identifier }, again) =>
      props.onSent({
        token,
        // Isolated so "+9665…" or an address stays in order inside Arabic text
        text: t('account.contact.codeSentTo', { target: `⁦${identifier.trim()}⁩` }),
        again,
      }),
  });
</script>

<template>
  <form class="space-y-5" method="post" novalidate @submit="onSubmit">
    <SaudiPhoneField
      v-if="channel === 'phone'"
      name="identifier"
      :test-id="`${testId}-input`"
      :label="t('account.contact.newPhone')"
      :description="t('auth.fields.phone.hint')"
      :placeholder="t('auth.fields.phone.placeholder')"
      required
      container-class="field-required"
    />
    <InputText
      v-else
      name="identifier"
      :test-id="`${testId}-input`"
      type="email"
      autocomplete="email"
      dir="ltr"
      :label="t('account.contact.newEmail')"
      placeholder="name@example.com"
      aria-required="true"
      container-class="auth-field field-required"
    />
    <AuthSubmitButton :test-id="`${testId}-send`" :loading="isPending" :disabled="!canSubmit">
      {{ t('account.contact.sendCode') }}
    </AuthSubmitButton>
    <AuthFormError :test-id="`${testId}-error`" :message="formError" />
  </form>
</template>
