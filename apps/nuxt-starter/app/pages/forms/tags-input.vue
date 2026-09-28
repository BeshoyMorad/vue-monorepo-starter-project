<script setup lang="ts">
  import { paths } from '@/constants/route-names';
  import { Field } from '@/components';
  import {
    TAGS_INPUT_IMPORT_CODE,
    TAGS_INPUT_BASIC_CODE,
    TAGS_INPUT_DISABLED_CODE,
    TAGS_INPUT_CUSTOM_TAG_CODE,
    TAGS_INPUT_CUSTOM_SLOT_CODE,
    TAGS_INPUT_DOC,
    TAGS_CODE_HEARDER,
    TAGS_INPUT_V_MODEL_SCRIPT,
    TAGS_INPUT_V_MODEL_TEMPLATE,
  } from '@/features/doc/forms/tags-field/constants/constants';

  definePageMeta({
    name: paths.formsPaths.tags,
    title: 'Tags',
    sidebar: true,
    order: 14,
  });

  const directEmails = ref<string[]>([]);

  const customTags = ref<string[]>(['vue', 'react', 'typescript']);
  const slotTags = ref<string[]>([]);
</script>

<template>
  <div class="mx-auto w-full space-y-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <section class="space-y-2">
      <h1 class="text-text-primary heading-font text-3xl font-bold tracking-tight">
        {{ TAGS_INPUT_DOC.title }}
      </h1>

      <p class="text-text-secondary text-sm leading-6">
        {{ TAGS_INPUT_DOC.description }}
      </p>
    </section>

    <!-- Import -->
    <ExampleCard
      :title="TAGS_INPUT_DOC.import.title"
      :description="TAGS_INPUT_DOC.import.description"
      :code="TAGS_INPUT_IMPORT_CODE"
      :header="TAGS_CODE_HEARDER.import"
      :show-preview="false"
    />

    <!-- Examples -->
    <section class="space-y-4">
      <div>
        <h2 class="text-text-primary text-xl font-semibold">
          {{ TAGS_INPUT_DOC.examples.title }}
        </h2>

        <p class="text-text-secondary mt-1 text-sm">
          {{ TAGS_INPUT_DOC.examples.description }}
        </p>
      </div>

      <div class="space-y-5">
        <!-- Basic -->
        <ExampleCard
          :title="TAGS_INPUT_DOC.basic.title"
          :description="TAGS_INPUT_DOC.basic.description"
          :how-to-use="TAGS_INPUT_DOC.basic.howToUse"
          :code="TAGS_INPUT_BASIC_CODE"
          :header="TAGS_CODE_HEARDER.template"
          :usage-label="TAGS_INPUT_DOC.howToUseTitle"
        >
          <template #preview>
            <Field.TagsInput
              v-model="directEmails"
              placeholder="Add email tag..."
              test-id="direct-emails-input"
            />
          </template>
        </ExampleCard>

        <!-- Disabled -->
        <ExampleCard
          :title="TAGS_INPUT_DOC.disabled.title"
          :description="TAGS_INPUT_DOC.disabled.description"
          :how-to-use="TAGS_INPUT_DOC.disabled.howToUse"
          :code="TAGS_INPUT_DISABLED_CODE"
          :header="TAGS_CODE_HEARDER.template"
          :usage-label="TAGS_INPUT_DOC.howToUseTitle"
        >
          <template #preview>
            <Field.TagsInput
              :default-value="['Vue', 'TypeScript']"
              disabled
              test-id="tags-disabled"
            />
          </template>
        </ExampleCard>

        <!-- Custom Tag Class -->
        <ExampleCard
          :title="TAGS_INPUT_DOC.customTag.title"
          :description="TAGS_INPUT_DOC.customTag.description"
          :how-to-use="TAGS_INPUT_DOC.customTag.howToUse"
          :code="TAGS_INPUT_CUSTOM_TAG_CODE"
          :header="TAGS_CODE_HEARDER.template"
          :usage-label="TAGS_INPUT_DOC.howToUseTitle"
        >
          <template #preview>
            <Field.TagsInput
              v-model="customTags"
              placeholder="Add a tag..."
              tag-class="font-medium text-primary-600 rounded-full px-2 py-1"
              test-id="tags-custom-class"
            />
          </template>
        </ExampleCard>

        <!-- Custom Tag Slot -->
        <ExampleCard
          :title="TAGS_INPUT_DOC.customSlot.title"
          :description="TAGS_INPUT_DOC.customSlot.description"
          :how-to-use="TAGS_INPUT_DOC.customSlot.howToUse"
          :code="TAGS_INPUT_CUSTOM_SLOT_CODE"
          :header="TAGS_CODE_HEARDER.template"
          :usage-label="TAGS_INPUT_DOC.howToUseTitle"
        >
          <template #preview>
            <Field.TagsInput
              v-model="slotTags"
              placeholder="Add a tag..."
              test-id="tags-custom-slot"
            >
              <template #tag="{ value }">
                <span class="flex items-center gap-1">
                  <span>#</span>
                  <span>{{ value }}</span>
                </span>
              </template>
            </Field.TagsInput>
          </template>
        </ExampleCard>

        <!-- v-model -->
        <ExampleCard
          :title="TAGS_INPUT_DOC.vModel.title"
          :description="TAGS_INPUT_DOC.vModel.description"
          :how-to-use="TAGS_INPUT_DOC.vModel.howToUse"
          :code-arr="[
            { code: TAGS_INPUT_V_MODEL_SCRIPT, header: TAGS_CODE_HEARDER.script },
            { code: TAGS_INPUT_V_MODEL_TEMPLATE, header: TAGS_CODE_HEARDER.template },
          ]"
          :usage-label="TAGS_INPUT_DOC.howToUseTitle"
        >
          <template #preview>
            <div class="w-full space-y-4">
              <Field.TagsInput
                v-model="directEmails"
                placeholder="Add email tag..."
                test-id="tags-v-model"
              />

              <div class="rounded-md border p-3 text-sm">
                <span class="text-text-secondary">
                  {{ TAGS_INPUT_DOC.vModel.currentValueLabel }}
                </span>

                <span class="text-text-primary ml-2 font-medium">
                  {{
                    directEmails.length ? directEmails.join(', ') : TAGS_INPUT_DOC.vModel.emptyValue
                  }}
                </span>
              </div>
            </div>
          </template>
        </ExampleCard>
      </div>
    </section>
  </div>
</template>
