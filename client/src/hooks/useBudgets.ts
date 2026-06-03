import { useState, useEffect, useCallback } from 'react';
import { summaryService } from '@/services/expense.service';
import type { BudgetWithSpend } from '@/types';

interface UseBudgetsReturn {
  budgets: BudgetWithSpend[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBudgets(): UseBudgetsReturn {
  const [budgets, setBudgets] = useState<BudgetWithSpend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await summaryService.getBudgetsWithSpend();
        if (!cancelled) setBudgets(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load budgets');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { budgets, isLoading, error, refetch };
}
