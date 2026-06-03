import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '@/services/expense.service';
import type { Expense, ExpenseFilters, PaginatedResponse } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/constants';

interface UseExpensesReturn {
  expenses: Expense[];
  total: number;
  totalPages: number;
  page: number;
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => void;
}

/**
 * Fetches paginated expense data from the API.
 * Re-fetches whenever filters or page changes.
 */
export function useExpenses(filters: ExpenseFilters): UseExpensesReturn {
  const [result, setResult] = useState<PaginatedResponse<Expense> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    setPage(1);
  }, [filtersKey]);

  useEffect(() => {
    let cancelled = false;

    const fetchExpenses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await expenseService.getAll({
          ...filters,
          page,
          pageSize: DEFAULT_PAGE_SIZE,
        });

        if (!cancelled) {
          setResult(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load expenses'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchExpenses();

    return () => {
      cancelled = true;
    };
  }, [filtersKey, page, refreshKey, filters]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return {
    expenses: result?.data ?? [],
    total: result?.total ?? 0,
    totalPages: result?.totalPages ?? 0,
    page,
    isLoading,
    error,
    setPage,
    refetch,
  };
}