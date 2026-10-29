---
paths:
  - "apps/*/src/**/schemas/**/*.ts"
  - "apps/*/src/**/*.vue"
  - "packages/ui/src/form/**"
---

# Forms and validation

- The apps use **vee-validate with yup**, not zod (zod is only for env validation in `@workspace/core/env`). Wire forms with `useForm({ validationSchema: toTypedSchema(schema) })`, where `useForm` comes from `vee-validate` and `toTypedSchema` from `@vee-validate/yup`.
- Schemas live in `modules/<feature>/schemas/<name>.schema.ts`. Export `schema` and a form type derived from it:

  ```ts
  export const schema = yup.object({ ... });
  export type LoginForm = Partial<yup.InferType<typeof schema>>;
  ```

  Reuse the inferred type. Do not hand-write a second copy of the shape.
- Reusable rules come from the app's `@/lib/yup`: `phoneSchema`, `passwordSchema`, `positiveNumberSchema`, `percentageSchema`, `requiredMediaSchema`, `optionalMediaSchema`. `setupYupLocale()` runs once in the app's `main.ts`, so messages come from the `yup` locale namespace. Add new messages to `apps/<app>/src/locales/{en,ar}/yup.json`.
- The yup helpers live in the app, not in `packages/core`, because they need the app's i18n instance. `apps/base-template` has them. An app that needs them adds its own `lib/yup/`.
- Do not hardcode error strings on `.required()`, `.email()`, or `.min()`. Omit them so Yup uses `yup.json`, and set `.label()` so `{path}` reads as a field name.
- Field components come from `@workspace/ui` (for example `Field.Text`, `Field.Password`, `Field.Select`). Match the wiring of the nearby form in the same module.
- Server errors go to fields with `applyApiErrorToForm(error, ctx.setErrors, '<field>')` from `@workspace/core/utils/apiError`.
- Uploads use `useFormMedia` and `useUploadImage` from `@workspace/core/composables`. Pass `MediaValue` through `extractMediaPayload`.
- Multi-step forms use `useMultiStepForm` with `MultiStepForm` and `StepIndicator` from `@workspace/ui`.
