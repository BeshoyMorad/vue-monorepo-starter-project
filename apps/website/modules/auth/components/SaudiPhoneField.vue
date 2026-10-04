<script setup lang="ts">
  import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@workspace/ui/ui/form';
  import { Input } from '@workspace/ui/ui/input';

  /**
   * Saudi mobile number: a fixed +966 box plus the local number, as on ibbil.com.
   * The form value is E.164 (+9665XXXXXXXX), which is what the API expects.
   */
  defineProps<{
    name: string;
    testId: string;
    label: string;
    description?: string;
    placeholder?: string;
    containerClass?: string;
    /** Announced as required to screen readers (the visual asterisk comes from containerClass) */
    required?: boolean;
  }>();

  const DIAL_CODE = '+966';

  const toLocal = (value: unknown) => String(value ?? '').replace(DIAL_CODE, '');

  /** Arabic-Indic (٠-٩) and Persian (۰-۹) digits, typed by Arabic keyboards, as 0-9. */
  const toLatinDigits = (text: string) =>
    text.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) % 16));

  /** Keeps digits only and drops a leading 0 (05XXXXXXXX → 5XXXXXXXX). */
  const toE164 = (local: string | number) => {
    const digits = toLatinDigits(String(local)).replace(/\D/g, '').replace(/^0+/, '');
    return digits ? `${DIAL_CODE}${digits}` : '';
  };
</script>

<template>
  <FormField v-slot="{ value, handleChange, handleBlur }" :name="name">
    <FormItem :class="['auth-field', containerClass]">
      <FormLabel>{{ label }}</FormLabel>

      <div class="flex gap-2" dir="ltr">
        <span
          class="text-primary-500 inline-flex h-[46px] w-[89px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-[oklch(0.9_0_0)] bg-[#fafbfa] text-sm font-semibold"
          aria-hidden="true"
        >
          <span class="text-lg leading-none">🇸🇦</span>
          {{ DIAL_CODE }}
        </span>
        <FormControl>
          <Input
            :model-value="toLocal(value)"
            type="tel"
            inputmode="numeric"
            autocomplete="tel-national"
            maxlength="10"
            :placeholder="placeholder"
            :aria-required="required || undefined"
            :data-test-id="testId"
            class="w-full min-w-0 flex-1"
            @update:model-value="(local) => handleChange(toE164(local))"
            @blur="handleBlur"
          />
        </FormControl>
      </div>

      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
