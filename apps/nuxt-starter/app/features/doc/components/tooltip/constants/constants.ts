export const TOOLTIP_IMPORT_CODE = `// <AppTooltip> is auto-imported by Nuxt. No import needed.`;

export const TOOLTIP_BASIC_CODE = `<AppTooltip>
  <template #trigger>
    <p>tooltip</p>
  </template>

  <div>
    data here
  </div>
</AppTooltip>`;

export const TOOLTIP_EXAMPLES = [
  {
    nameKey: 'tooltip.examples.basic.name',
    descriptionKey: 'tooltip.examples.basic.description',
    code: `<AppTooltip>
  <template #trigger>
    <p>tooltip</p>
  </template>

  <div>
    data here
  </div>
</AppTooltip>`,
  },
] as const;
