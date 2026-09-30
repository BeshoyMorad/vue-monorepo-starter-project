export const DIALOG_VARIANTS = [
  {
    type: 'dialog',
    nameKey: 'dialog.variants.dialog.name',
    descriptionKey: 'dialog.variants.dialog.description',
    importCode: `// Auto-imported by Nuxt: <Dialog>. No import needed.`,
    code: `<Dialog title="Dialog" description="Description">
  <template #trigger>
    <Button>Open</Button>
  </template>

  <div>dialog content goes here</div>

  <template #footer>
    <div>footer</div>
  </template>
</Dialog>`,
  },
  {
    type: 'confirm',
    nameKey: 'dialog.variants.confirm.name',
    descriptionKey: 'dialog.variants.confirm.description',
    importCode: `// Auto-imported by Nuxt: <ConfirmDialog>. No import needed.`,
    code: `<ConfirmDialog
  title="title"
  description="description"
  icon="hugeicons--circle"
>
  <template #trigger>
    <Button>Open Confirm</Button>
  </template>
</ConfirmDialog>`,
  },
  {
    type: 'form',
    nameKey: 'dialog.variants.form.name',
    descriptionKey: 'dialog.variants.form.description',
    importCode: `// Auto-imported by Nuxt: <FormDialog>. No import needed.`,
    code: `<FormDialog
  title="title"
  description="description"
>
  <template #trigger>
    <Button>Open Form</Button>
  </template>

  <div>form goes here</div>
</FormDialog>`,
  },
] as const;
