import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T, P extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for handling API calls with loading and error states
 */
export function useApi<T, P extends unknown[]>(
  apiFunction: (...params: P) => Promise<T>
): UseApiReturn<T, P> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await apiFunction(...params);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}