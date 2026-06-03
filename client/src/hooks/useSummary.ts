import { useState, useEffect, useCallback } from 'react';
import { summaryService } from '@/services/expense.service';
import type { Summary } from '@/types';

interface UseSummaryReturn {
  summary: Summary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches the monthly summary panel data.
 * Exposed refetch so parent can trigger after mutations.
 */
export function useSummary(): UseSummaryReturn {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await summaryService.getSummary();
        if (!cancelled) setSummary(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load summary');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { summary, isLoading, error, refetch };
}
