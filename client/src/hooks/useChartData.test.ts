import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChartData } from '@/hooks/useChartData';
import type { Expense } from '@/types';

const makeExpense = (id: string, amount: number, category: string): Expense => ({
  id,
  amount,
  category,
  date: '2024-03-15T00:00:00.000Z',
  note: null,
  createdAt: '2024-03-15T00:00:00.000Z',
  updatedAt: '2024-03-15T00:00:00.000Z',
});

describe('useChartData', () => {
  const expenses: Expense[] = [
    makeExpense('1', 500, 'Food'),
    makeExpense('2', 1200, 'Food'),
    makeExpense('3', 800, 'Transport'),
    makeExpense('4', 300, 'Entertainment'),
  ];

  it('aggregates multiple expenses in the same category', () => {
    const { result } = renderHook(() => useChartData(expenses));
    const food = result.current.pieData.find((d) => d.name === 'Food');
    expect(food?.value).toBe(1700); // 500 + 1200
  });

  it('returns one entry per category', () => {
    const { result } = renderHook(() => useChartData(expenses));
    expect(result.current.pieData).toHaveLength(3);
  });

  it('sorts pie data by value descending', () => {
    const { result } = renderHook(() => useChartData(expenses));
    const values = result.current.pieData.map((d) => d.value);
    expect(values[0]).toBeGreaterThanOrEqual(values[1]);
    expect(values[1]).toBeGreaterThanOrEqual(values[2]);
  });

  it('assigns a fill color to each entry', () => {
    const { result } = renderHook(() => useChartData(expenses));
    for (const entry of result.current.pieData) {
      expect(entry.fill).toBeTruthy();
      expect(entry.fill).toMatch(/^#/);
    }
  });

  it('barData mirrors pieData structure', () => {
    const { result } = renderHook(() => useChartData(expenses));
    expect(result.current.barData).toHaveLength(result.current.pieData.length);
    expect(result.current.barData[0].amount).toBe(result.current.pieData[0].value);
  });

  it('returns empty arrays for no expenses', () => {
    const { result } = renderHook(() => useChartData([]));
    expect(result.current.pieData).toHaveLength(0);
    expect(result.current.barData).toHaveLength(0);
  });
});
