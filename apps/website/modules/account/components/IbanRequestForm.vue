<script setup lang="ts">
  import InputText from '@workspace/ui/form/input-text/InputText.vue';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import AuthSubmitButton from '~/modules/auth/components/AuthSubmitButton.vue';
  import { useChangeRequestForm } from '~/modules/account/composables/useChangeRequestForm';
  import { createIbanSchema, normalizeIban } from '~/modules/account/schemas';
  import { useAccountService } from '~/modules/account/services';
  import type { SentStep } from './ChangeFlowDialog.vue';

  /** New IBAN; the API sends a code to the registered phone */
  const props = defineProps<{ phone?: string | null; onSent: (step: SentStep) => void }>();

  const { t } = useI18n();
  const service = useAccountService();

  const { onSubmit, canSubmit, formError, isPending } = useChangeRequestForm({
    schema: createIbanSchema(t),
    initialValues: { iban: '' },
    request: ({ iban }) => service.requestIbanChange(normalizeIban(iban)),
    codeFields: { INVALID_IBAN: 'iban' },
    onSent: (token, _values, again) =>
      props.onSent({
        token,
        text: t('account.bank.codeSent', { phone: `⁦${props.phone ?? ''}⁩` }),
        again,
      }),
  });
</script>

<template>
  <form class="space-y-5" method="post" novalidate @submit="onSubmit">
    <InputText
      name="iban"
      test-id="iban-input"
      autocomplete="off"
      autocapitalize="characters"
      spellcheck="false"
      maxlength="34"
      dir="ltr"
      placeholder="SA00 0000 0000 0000 0000 0000"
      :label="t('account.bank.newIban')"
      :description="t('account.bank.ibanHint')"
      aria-required="true"
      container-class="auth-field field-required"
    />
    <AuthSubmitButton test-id="iban-send" :loading="isPending" :disabled="!canSubmit">
      {{ t('account.bank.sendCode') }}
    </AuthSubmitButton>
    <AuthFormError test-id="iban-error" :message="formError" />
  </form>
</template>
