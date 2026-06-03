import { useMemo } from 'react';
import { CATEGORY_COLORS } from '@/constants';
import type { Expense } from '@/types';

interface PieEntry {
  name: string;
  value: number;
  fill: string;
}

interface BarEntry {
  category: string;
  amount: number;
  fill: string;
}

interface UseChartDataReturn {
  pieData: PieEntry[];
  barData: BarEntry[];
}

/**
 * Derives chart-ready data from a flat expenses array.
 *
 * Memoized because:
 * - Aggregating O(n) data on every render would be wasteful when re-renders
 *   are triggered by UI state (hover, dialog open) unrelated to the data.
 * - Recharts accepts stable references for smooth transitions.
 */
export function useChartData(expenses: Expense[]): UseChartDataReturn {
  const pieData = useMemo<PieEntry[]>(() => {
    const totals = new Map<string, number>();
    for (const e of expenses) {
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    }
    return Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100,
        fill: CATEGORY_COLORS[name] ?? '#888888',
      }));
  }, [expenses]);

  const barData = useMemo<BarEntry[]>(() => {
    return pieData.map((entry) => ({
      category: entry.name,
      amount: entry.value,
      fill: entry.fill,
    }));
  }, [pieData]);

  return { pieData, barData };
}
