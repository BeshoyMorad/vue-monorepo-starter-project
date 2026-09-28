import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export * from './getDynamicAssets';
export * from './apiError';
export * from './device';
export * from './clipboard';
export * from './countries';
export * from './extractUrlDetails';
export * from './formatStatus';
export * from './formatText';
export * from './formatter';
export * from './openExternalLink';
export * from './toast';
export * from './yupSchemas';
