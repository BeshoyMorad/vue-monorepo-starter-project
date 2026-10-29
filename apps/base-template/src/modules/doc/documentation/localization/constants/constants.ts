export const LOCALIZATION_DOM = {
  buttonLanguage: {
    title: 'Change Language with Button',
    description:
      'You can change the application language directly from any button by setting locale.value from useI18n().',
    howToUse:
      'Get locale from useI18n(), then set locale.value to the target locale code when the button is clicked.',
  },
  title: 'Localization',
  description:
    'A centralized localization system for translations, locale switching, number and date formatting, pluralization, and dynamic RTL/LTR support.',

  currentLocale: {
    title: 'Current Locale',
    description:
      'Use the application locale composable to access the active language, direction, and locale metadata. Changing the locale also updates the application direction.',
  },

  interpolation: {
    title: 'Interpolation',
    description:
      'Pass dynamic values into translation messages using named interpolation parameters.',
    howToUse:
      'Use t() with a translation key and provide the dynamic values required by the message.',
    inputLabel: 'Input Name:',
    inputPlaceholder: 'Enter name...',
    renderedLabel: 'Rendered:',
  },

  pluralization: {
    title: 'Pluralization',
    description:
      'Use locale-aware plural rules to automatically render the correct message based on a quantity.',
    howToUse:
      'Pass the quantity to t() and provide named values when the translation message needs the count.',
    quantityLabel: 'Quantity:',
    applesLabel: 'Apples Plural Rule:',
    membersLabel: 'Members Plural Rule:',
  },

  formatting: {
    title: 'Number & Currency Formatting',
    description: 'Format numbers, currencies, and percentages according to the active locale.',
    howToUse: 'Use n() with a number and the registered number format name.',
    currencyLabel: 'Currency',
    percentLabel: 'Percent',
  },

  dateTime: {
    title: 'Date & Relative Time',
    description:
      'Format dates using the application locale and display localized relative timestamps with Dayjs.',
    howToUse:
      'Use d() for localized date formatting and Dayjs with the current locale for relative timestamps.',
    dateLabel: 'Localized Date',
    relativeTimeLabel: 'Relative Time',
  },

  implementation: {
    title: 'Implementation Guide',
    description:
      'Use the application locale composable as the main entry point for translations, formatting, and locale switching.',
  },

  structure: {
    title: 'Structure',
    description:
      'App messages live in apps/base-template/src/locales/{locale}/{namespace}.json, and the shared common, errors, and nav messages come from packages/locales. The filename is the key prefix. TypeScript in the app locales folder is wiring only (loader, types).',
    howToUse:
      'Add matching en and ar JSON files for every app namespace, with no extra wrapper object. Register the namespace on MessageSchema in messages.ts. Put messages that several apps share in packages/locales instead. Do not colocate locale files next to components.',
  },

  validation: {
    title: 'Yup Validation',
    description:
      'Yup error messages are translated through vue-i18n. setupYupLocale(i18n.global.t) maps built-in Yup keys to the shared yup namespace in packages/locales/src/common/{locale}.json. Custom helpers in packages/core/src/lib/yup/methods.ts call t() when validation runs, so a locale switch updates errors immediately.',
    howToUse:
      'Do not hardcode error strings on .required(), .email(), or .min(). Omit them so Yup uses the shared yup messages, and set .label() so {path} is a readable field name. Recreate the schema with computed() if labels should follow the active locale. Use passwordSchema() and similar helpers for rules that already go through t().',
  },

  queryCache: {
    title: 'Query cache per locale',
    description:
      'The shared QueryClient prefixes the active locale onto every query hash. Each language keeps its own cached API response. Switching away and back reuses that cache instead of sending another backend request, while the entry is still within staleTime (1 minute).',
    howToUse:
      'Keep using QUERY_KEYS as usual. Do not add locale to individual keys. Locale scoping is handled globally by queryKeyHashFn in packages/core/src/lib/query-client.ts (the app registers its locale with setQueryClientLocale), so repeated language switches do not refetch the same locale.',
  },
} as const;

export const LOCALIZATION_USAGE_CODE = {
  locale: `import { useI18n } from 'vue-i18n';
import { LanguageSwitcher } from '@workspace/ui';

const {
  t,                  // Translate a message using its localization key
  d,                  // Format dates using the active locale
  n,                  // Format numbers, currencies, and percentages
  locale,             // Reactive ref for active locale
} = useI18n();

const label = t('common.save');`,

  localeTemplate: `<template>
       <span
            class="border-primary-500/30 bg-primary-500/10 text-primary-600 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
          >
            <span>{{ currentLocaleMeta.flag }}</span>
            <span>
              {{ currentLocaleMeta.nativeLabel }}
              ({{ currentLocaleMeta.code.toUpperCase() }})
            </span>
            <span class="text-text-disabled">•</span>
            <span class="font-mono tracking-wider uppercase">
              {{ currentLocaleMeta.direction }}
            </span>
            <span class="text-text-disabled">•</span>
            <span class="text-[11px] font-normal"> isRTL: {{ isRTL ? 'true' : 'false' }} </span>
          </span>
    <LanguageSwitcher v-model="locale" />
</template>`,
  buttonLanguage: `import { Button } from '@workspace/ui';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const changeLanguage = (newLocale: 'en' | 'ar') => {
  locale.value = newLocale; // Load and activate the selected locale
};`,

  buttonLanguageTemplate: `<Button
  test-id="change-language-en"
  @click="changeLanguage('en')"
>
  English
</Button>

<Button
  test-id="change-language-ar"
  @click="changeLanguage('ar')"
>
  العربية
</Button>`,

  steps: [
    {
      code: `import { useI18n } from 'vue-i18n';

const { t, d, n } = useI18n();

const label = t('common.save');`,
      header: 'Step 1 - Composable',
    },
    {
      code: `<template>
  <h1>{{ t('common.save') }}</h1>
  <p>{{ n(150, 'currency') }}</p>
  <p>{{ d(new Date(), 'short') }}</p>
</template>`,
      header: 'Step 2 - Template',
    },
    {
      code: `const { locale } = useI18n();

locale.value = 'ar';

// Updates the active locale
// and document direction.`,
      header: 'Step 3 - Locale Switching',
    },
  ],
} as const;

export const LOCALIZATION_INTERPOLATION_CODE = `const { t } = useI18n();

const message = t('demo.interpolation.greeting', {
  name: 'Alex',
});

const stats = t('demo.interpolation.userStats', {
  count: 5,
  points: 240,
});`;

export const LOCALIZATION_PLURALIZATION_CODE = `const { t } = useI18n();

const count = 3;

const apples = t(
  'demo.pluralization.apples',
  count,
  {
    named: {
      count,
    },
  },
);

const members = t(
  'demo.pluralization.members',
  count,
  {
    named: {
      count,
    },
  },
);`;

export const LOCALIZATION_FORMATTING_CODE = `const { n } = useI18n();

const amount = n(1250.75, 'currency');

const percentage = n(0.85, 'percent');`;

export const LOCALIZATION_DATE_CODE = `import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const {
  d,
  locale,
} = useI18n();

const formattedDate = d(
  new Date(),
  'short',
);

const relativeTime = dayjs()
  .subtract(3, 'hour')
  .locale(locale.value)
  .fromNow();`;

export const LOCALIZATION_PROJECT_STRUCTURE = `📁 apps/base-template/src/locales/
├── 📁 en/
│     ├── 📄 auth.json
│     ├── 📄 demo.json
│     └── 📄 …
├── 📁 ar/
│     ├── 📄 auth.json
│     └── 📄 …
├── 📄 messages.ts
├── 📄 index.ts
└── 📄 schema.d.ts

📁 packages/locales/src/
├── 📁 common/
│     ├── 📄 en.json   (common, errors, nav)
│     └── 📄 ar.json
├── 📄 config.ts
├── 📄 formats.ts
├── 📄 utils.ts
└── 📄 index.ts
`;

export const LOCALIZATION_YUP_CODE = {
  steps: [
    {
      header: 'Step 1 - Bootstrap',
      code: `import { setupYupLocale } from '@workspace/core/lib/yup';

setupYupLocale(i18n.global.t);

// Maps Yup's built-in messages to vue-i18n.
// Each message is resolved when validation
// runs, so a locale switch applies immediately.`,
    },
    {
      header: 'Step 2 - Messages',
      code: `// packages/locales/src/common/en.json  (and ar.json) -> "yup"
{
  "mixed": {
    "required": "{path} is required"
  },
  "string": {
    "email": "{path} must be a valid email",
    "min": "{path} must be at least {min} characters"
  },
  "methods": {
    "required": "{field} is required",
    "password": "Password must be at least 8 characters..."
  }
}`,
    },
    {
      header: 'Step 3 - Schema',
      code: `import * as yup from 'yup';
import { toTypedSchema } from '@vee-validate/yup';
import { passwordSchema } from '@workspace/core/lib/yup';

const validationSchema = computed(() =>
  toTypedSchema(
    yup.object({
      email: yup
        .string()
        .label(t('demo.validation.email'))
        .required()
        .email(),
      username: yup
        .string()
        .label(t('demo.validation.username'))
        .required()
        .min(3),
      password: passwordSchema(
        t('demo.validation.password'),
      ),
    }),
  ),
);`,
    },
    {
      header: 'Step 4 - Form',
      code: `<Form :validation-schema="validationSchema">
  <Field.Text
    :label="t('demo.validation.email')"
    name="email"
  />
  <Field.Text
    :label="t('demo.validation.username')"
    name="username"
  />
  <Field.Password
    :label="t('demo.validation.password')"
    name="password"
  />
  <Button type="submit">
    {{ t('common.submit') }}
  </Button>
</Form>`,
    },
  ],
} as const;

export const LOCALIZATION_QUERY_CACHE_CODE = {
  steps: [
    {
      header: 'apps/base-template/src/main.ts',
      code: `import { setQueryClientLocale } from '@workspace/core/lib/query-client';
import i18n from './locales';

// createBaseQueryClient hashes the locale into every query key.
setQueryClientLocale(() => i18n.global.locale.value);`,
    },
    {
      header: 'Usage',
      code: `import { useQuery } from '@tanstack/vue-query';
import { QUERY_KEYS } from '@workspace/core/lib/query-keys';

// Locale is not part of QUERY_KEYS.
// queryKeyHashFn caches this response per locale.
return useQuery({
  queryKey: QUERY_KEYS.users.list(),
  queryFn: fetchUsers,
});

// EN → fetch once
// AR → fetch once
// EN again → cached, no backend request`,
    },
  ],
} as const;

export const LOCALIZATION_ADD_NAMESPACE_CODE = `// apps/base-template/src/locales/en/errors.json  (and ar/errors.json)
{
  "title": "Access Denied"
}

// apps/base-template/src/locales/messages.ts — add the namespace to MessageSchema
import type errors from './en/errors.json';

export interface MessageSchema extends CommonLocaleSchema {
  // ...existing namespaces
  errors: typeof errors;
}

// In a component
const { t } = useI18n();
t('errors.title');`;
