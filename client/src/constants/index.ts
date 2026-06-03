import { Category } from '@/types';

export const CATEGORIES_LIST: Category[] = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6B6B',
  Transport: '#4ECDC4',
  Bills: '#45B7D1',
  Entertainment: '#96CEB4',
  Health: '#FFEAA7',
  Shopping: '#DDA0DD',
  Other: '#B0B0B0',
};

export const DATE_RANGE_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'Custom', value: 'custom' },
] as const;

export type DateRangeOption = (typeof DATE_RANGE_OPTIONS)[number]['value'];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 20;
