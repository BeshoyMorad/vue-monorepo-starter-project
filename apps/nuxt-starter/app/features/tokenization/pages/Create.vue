<script setup lang="ts">
  import { MultiStepForm } from '@/components';
  import { paths } from '@/constants/route-names';
  import { getApiErrorMessage } from '@/utils/apiError';
  import { useCreateToken } from '@/features/tokenization/composables';
  import { createTokenSteps } from '@/features/tokenization/schemas/token.schema';
  import type { CreateTokenFormValues } from '@/features/tokenization/types';
  import { NFT_TOKEN_TYPE } from '@/features/tokenization/constants/config';
  import type { GenericObject } from 'vee-validate';
  import BasicSettings from '@/features/tokenization/components/create/BasicSettings.vue';
  import Configuration from '@/features/tokenization/components/create/Configuration.vue';
  import { buildTokenPayload } from '@/features/tokenization/utils/token-payload-builder';

  const router = useRouter();

  const { uploadFormMedia, isUploading } = useFormMedia();
  const { mutateAsync: createToken, isPending: isSubmitting } = useCreateToken();

  const formRef = useTemplateRef<InstanceType<typeof MultiStepForm>>('formRef');

  const isLoading = computed(() => isSubmitting.value || isUploading.value);
  const serverErrorMessage = ref<string | null>(null);

  // ── Form Submission Handler ────────────────────────────────────────────────
  const handleSubmit = async (values: GenericObject) => {
    try {
      await uploadFormMedia(values, 'TOKENIZATION', formRef.value?.form.setFieldValue);

      const mediaPayload = extractMediaPayload(values);
      const mediaIdsToAdd = (mediaPayload.mediaIdsToAdd as string[]).filter(Boolean);

      const isNFT = values.type === NFT_TOKEN_TYPE;
      const payload = buildTokenPayload(values as CreateTokenFormValues, mediaIdsToAdd, isNFT);

      await createToken(payload);

      const vaultId = values.vaultId;
      if (isNFT && vaultId) {
        router.push({
          name: paths.vaults.details,
          params: { id: vaultId },
        });
      } else {
        router.push({ name: paths.tokenization.root });
      }
    } catch (err: unknown) {
      serverErrorMessage.value = getApiErrorMessage(err);
      formRef.value?.handleApiError(err);
    }
  };
</script>

<template>
  <PageWrapper title="Create New Token" subtitle="Enter the token details & configuration settings">
    <template #header-actions>
      <p class="text-foreground-caption text-sm">
        Step {{ (formRef?.currentStep ?? 0) + 1 }} from {{ formRef?.totalSteps }}
      </p>
    </template>

    <div class="border-border border-t p-6">
      <ErrorAlert v-if="serverErrorMessage" class="mb-6">
        {{ serverErrorMessage }}
      </ErrorAlert>

      <MultiStepForm
        ref="formRef"
        test-id="create-token-multi-step-form"
        :steps="createTokenSteps"
        :loading="isLoading"
        submit-label="Save"
        :show-stepper="false"
        @submit="handleSubmit"
      >
        <template #step-0>
          <BasicSettings />
        </template>

        <template #step-1>
          <Configuration />
        </template>
      </MultiStepForm>
    </div>
  </PageWrapper>
</template>
