import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import { formatCurrency, formatDate, dateRangeToParams, exportToCSV } from '@/utils';

describe('formatCurrency', () => {
  it('formats whole numbers with two decimal places', () => {
    expect(formatCurrency(1000)).toBe('₹1,000.00');
  });

  it('formats with thousands separator (en-IN)', () => {
    expect(formatCurrency(100000)).toBe('₹1,00,000.00');
  });

  it('formats decimal amounts correctly', () => {
    expect(formatCurrency(1234.5)).toBe('₹1,234.50');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string to readable format', () => {
    const result = formatDate('2024-03-15T00:00:00.000Z');
    // dayjs formats: Mar 15, 2024
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('accepts a Date object', () => {
    const date = new Date('2024-06-01T00:00:00.000Z');
    const result = formatDate(date);
    expect(result).toContain('2024');
  });
});

describe('dateRangeToParams', () => {
  it('returns empty object for "all"', () => {
    const result = dateRangeToParams('all');
    expect(result).toEqual({});
  });

  it('returns start and end for "this_month"', () => {
    const result = dateRangeToParams('this_month');
    const thisMonth = dayjs().format('YYYY-MM');
    expect(result.startDate).toContain(thisMonth);
    expect(result.endDate).toContain(thisMonth);
  });

  it('returns previous month dates for "last_month"', () => {
    const result = dateRangeToParams('last_month');
    const lastMonth = dayjs().subtract(1, 'month');
    expect(result.startDate).toContain(lastMonth.format('YYYY-MM'));
    expect(result.endDate).toContain(lastMonth.format('YYYY-MM'));
  });

  it('last_7_days startDate is 7 days before today', () => {
    const result = dateRangeToParams('last_7_days');
    const expected = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    expect(result.startDate).toBe(expected);
  });

  it('last_30_days startDate is 30 days before today', () => {
    const result = dateRangeToParams('last_30_days');
    const expected = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    expect(result.startDate).toBe(expected);
  });

  it('returns empty object for "custom" (user provides dates manually)', () => {
    const result = dateRangeToParams('custom');
    expect(result).toEqual({});
  });
});

describe('exportToCSV', () => {
  beforeEach(() => {
    // Mock DOM APIs used by the export function
    const mockClick = vi.fn();
    const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
    const mockRevokeObjectURL = vi.fn();

    vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      set href(_: string) {},
      set download(_: string) {},
    } as unknown as HTMLAnchorElement);

    Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL, writable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL, writable: true });

    global.Blob = vi.fn().mockImplementation((content: string[]) => ({
      content,
      type: 'text/csv',
    })) as unknown as typeof Blob;
  });

  it('does not throw with an empty array', () => {
    expect(() => exportToCSV([])).not.toThrow();
  });

  it('calls Blob constructor with CSV content', () => {
    exportToCSV([
      {
        id: '1',
        amount: 500,
        category: 'Food',
        date: '2024-03-15T00:00:00.000Z',
        note: 'Lunch',
        createdAt: '2024-03-15T00:00:00.000Z',
      },
    ]);
    expect(global.Blob).toHaveBeenCalled();
    const callArg = (global.Blob as ReturnType<typeof vi.fn>).mock.calls[0][0][0] as string;
    expect(callArg).toContain('Food');
    expect(callArg).toContain('500.00');
    expect(callArg).toContain('Lunch');
  });
});
