import dayjs from 'dayjs';
import { DateRangeOption } from '@/constants';

/**
 * Format a number as Indian Rupee currency.
 * e.g. 1234.5 → "₹1,234.50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string for display.
 * e.g. "2024-03-15T00:00:00.000Z" → "Mar 15, 2024"
 */
export function formatDate(date: string | Date): string {
  return dayjs(date).format('MMM D, YYYY');
}

/**
 * Convert a DateRangeOption to a { startDate, endDate } pair for the API.
 */
export function dateRangeToParams(range: DateRangeOption): {
  startDate?: string;
  endDate?: string;
} {
  const today = dayjs();

  switch (range) {
    case 'this_month':
      return {
        startDate: today.startOf('month').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
      };
    case 'last_month': {
      const lastMonth = today.subtract(1, 'month');
      return {
        startDate: lastMonth.startOf('month').format('YYYY-MM-DD'),
        endDate: lastMonth.endOf('month').format('YYYY-MM-DD'),
      };
    }
    case 'last_7_days':
      return {
        startDate: today.subtract(7, 'day').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
      };
    case 'last_30_days':
      return {
        startDate: today.subtract(30, 'day').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
      };
    default:
      return {};
  }
}

/**
 * Export an array of expenses to a CSV file download.
 * Only the currently visible (filtered) rows are exported.
 */
export function exportToCSV(
  expenses: Array<{
    id: string;
    amount: number;
    category: string;
    date: string;
    note: string | null;
    createdAt: string;
  }>
): void {
  const headers = ['Date', 'Category', 'Amount (INR)', 'Note'];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.category,
    e.amount.toFixed(2),
    e.note ?? '',
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses-${dayjs().format('YYYY-MM-DD')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
