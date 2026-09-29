<script setup lang="ts">
  import { paths } from '@/constants/route-names';
  import { Field } from '@/components/form';

  import {
    DATE_PICKER_IMPORT_CODE,
    DATE_PICKER_BASIC_CODE,
    DATE_PICKER_DATE_FORMAT_CODE,
    DATE_PICKER_MIN_MAX_CODE,
    DATE_PICKER_DISABLED_CODE,
    DATE_PICKER_V_MODEL_CODE,
    DATE_PICKER_DOC,
  } from '@/features/doc/forms/datepicker-field/constants/constants';

  definePageMeta({
    name: paths.formsPaths.datePicker,
    title: 'Date Picker',
    sidebar: true,
    order: 12,
  });

  const birthDate = ref<Date | null>(null);

  const disabledDate = ref<Date | null>(new Date());
</script>

<template>
  <div class="mx-auto w-full space-y-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <section class="space-y-2">
      <h1 class="text-text-primary heading-font text-3xl font-bold tracking-tight">
        {{ DATE_PICKER_DOC.title }}
      </h1>

      <p class="text-text-secondary text-sm leading-6">
        {{ DATE_PICKER_DOC.description }}
      </p>
    </section>

    <!-- Import -->
    <ExampleCard
      :title="DATE_PICKER_DOC.import.title"
      :description="DATE_PICKER_DOC.import.description"
      :code="DATE_PICKER_IMPORT_CODE"
      :show-preview="false"
    />

    <!-- Examples -->
    <section class="space-y-4">
      <div>
        <h2 class="text-text-primary text-xl font-semibold">
          {{ DATE_PICKER_DOC.examples.title }}
        </h2>

        <p class="text-text-secondary mt-1 text-sm">
          {{ DATE_PICKER_DOC.examples.description }}
        </p>
      </div>

      <div class="space-y-5">
        <!-- Basic -->
        <ExampleCard
          :title="DATE_PICKER_DOC.basic.title"
          :description="DATE_PICKER_DOC.basic.description"
          :how-to-use="DATE_PICKER_DOC.basic.howToUse"
          :code="DATE_PICKER_BASIC_CODE"
        >
          <template #preview>
            <Field.DatePicker
              :placeholder="DATE_PICKER_DOC.basic.placeholder"
              :test-id="DATE_PICKER_DOC.basic.testId"
            />
          </template>
        </ExampleCard>

        <!-- Date Format -->
        <ExampleCard
          :title="DATE_PICKER_DOC.dateFormat.title"
          :description="DATE_PICKER_DOC.dateFormat.description"
          :how-to-use="DATE_PICKER_DOC.dateFormat.howToUse"
          :code="DATE_PICKER_DATE_FORMAT_CODE"
        >
          <template #preview>
            <div class="w-full space-y-6">
              <div class="space-y-3">
                <span class="text-text-secondary text-sm font-medium">
                  {{ DATE_PICKER_DOC.dateFormat.defaultLabel }}
                </span>

                <Field.DatePicker
                  :placeholder="DATE_PICKER_DOC.dateFormat.defaultPlaceholder"
                  :test-id="DATE_PICKER_DOC.dateFormat.defaultTestId"
                />
              </div>

              <div class="space-y-3">
                <span class="text-text-secondary text-sm font-medium">
                  {{ DATE_PICKER_DOC.dateFormat.customLabel }}
                </span>

                <Field.DatePicker
                  date-format="DD/MM/YYYY"
                  :placeholder="DATE_PICKER_DOC.dateFormat.customPlaceholder"
                  :test-id="DATE_PICKER_DOC.dateFormat.customTestId"
                />
              </div>
            </div>
          </template>
        </ExampleCard>

        <!-- Min / Max Date -->
        <ExampleCard
          :title="DATE_PICKER_DOC.minMaxDate.title"
          :description="DATE_PICKER_DOC.minMaxDate.description"
          :how-to-use="DATE_PICKER_DOC.minMaxDate.howToUse"
          :code="DATE_PICKER_MIN_MAX_CODE"
        >
          <template #preview>
            <div class="w-full space-y-6">
              <div class="space-y-3">
                <span class="text-text-secondary text-sm font-medium">
                  {{ DATE_PICKER_DOC.minMaxDate.minLabel }}
                </span>

                <Field.DatePicker
                  :min-date="new Date()"
                  :placeholder="DATE_PICKER_DOC.minMaxDate.minPlaceholder"
                  :test-id="DATE_PICKER_DOC.minMaxDate.minTestId"
                />
              </div>

              <div class="space-y-3">
                <span class="text-text-secondary text-sm font-medium">
                  {{ DATE_PICKER_DOC.minMaxDate.maxLabel }}
                </span>

                <Field.DatePicker
                  :max-date="new Date()"
                  :placeholder="DATE_PICKER_DOC.minMaxDate.maxPlaceholder"
                  :test-id="DATE_PICKER_DOC.minMaxDate.maxTestId"
                />
              </div>
            </div>
          </template>
        </ExampleCard>

        <!-- Disabled -->
        <ExampleCard
          :title="DATE_PICKER_DOC.disabled.title"
          :description="DATE_PICKER_DOC.disabled.description"
          :how-to-use="DATE_PICKER_DOC.disabled.howToUse"
          :code="DATE_PICKER_DISABLED_CODE"
        >
          <template #preview>
            <Field.DatePicker
              v-model="disabledDate"
              disabled
              :placeholder="DATE_PICKER_DOC.disabled.placeholder"
              :test-id="DATE_PICKER_DOC.disabled.testId"
            />
          </template>
        </ExampleCard>

        <!-- v-model -->
        <ExampleCard
          :title="DATE_PICKER_DOC.vModel.title"
          :description="DATE_PICKER_DOC.vModel.description"
          :how-to-use="DATE_PICKER_DOC.vModel.howToUse"
          :code="DATE_PICKER_V_MODEL_CODE"
        >
          <template #preview>
            <div class="w-full space-y-4">
              <Field.DatePicker
                v-model="birthDate"
                :placeholder="DATE_PICKER_DOC.vModel.placeholder"
                :test-id="DATE_PICKER_DOC.vModel.testId"
              />

              <div class="rounded-md border p-3 text-sm">
                <span class="text-text-secondary">
                  {{ DATE_PICKER_DOC.vModel.currentValueLabel }}
                </span>

                <span class="text-text-primary ml-2 font-medium">
                  {{
                    birthDate ? birthDate.toLocaleDateString() : DATE_PICKER_DOC.vModel.emptyValue
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
