import { cva } from 'class-variance-authority';

/** Layout and spacing classes shared by the checkbox group and the radio group. */
export const optionGroupVariants = cva('flex flex-wrap', {
  variants: {
    layout: {
      vertical: 'flex-col',
      horizontal: 'flex-row gap-x-6 gap-y-2',
    },
    size: {
      small: 'gap-x-4 gap-y-0.5',
      default: 'gap-x-5 gap-y-1',
      large: 'gap-x-6 gap-y-2',
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
});
