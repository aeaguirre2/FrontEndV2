import { useState, useCallback } from 'react';
import { useGlobalStore } from '../contexts/GlobalContext';
import type { ApiError } from '../types';

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export const useApi = <T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const { addToast } = useGlobalStore();

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      
      if (options.showSuccessToast && options.successMessage) {
        addToast({
          type: 'success',
          message: options.successMessage,
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      
      if (options.showErrorToast) {
        addToast({
          type: 'error',
          message: apiError.message || 'An error occurred',
        });
      }
      
      if (options.onError) {
        options.onError(apiError);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options, addToast]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// Hook for paginated data
export const usePaginatedApi = <T = any>(
  apiFunction: (params: any) => Promise<{ data: T[]; total: number; page: number; pageSize: number }>,
  initialParams: any = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const { addToast } = useGlobalStore();

  const fetchData = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = {
        ...initialParams,
        ...params,
        page: params.page || page,
        pageSize: params.pageSize || pageSize,
      };
      
      const result = await apiFunction(mergedParams);
      
      setData(result.data);
      setTotal(result.total);
      setPage(result.page);
      setPageSize(result.pageSize);
      
      return result;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      
      addToast({
        type: 'error',
        message: apiError.message || 'Failed to fetch data',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, initialParams, page, pageSize, addToast]);

  const refresh = useCallback(() => {
    return fetchData({ page, pageSize });
  }, [fetchData, page, pageSize]);

  const goToPage = useCallback((newPage: number) => {
    return fetchData({ page: newPage, pageSize });
  }, [fetchData, pageSize]);

  const changePageSize = useCallback((newPageSize: number) => {
    return fetchData({ page: 1, pageSize: newPageSize });
  }, [fetchData]);

  return {
    data,
    total,
    page,
    pageSize,
    loading,
    error,
    fetchData,
    refresh,
    goToPage,
    changePageSize,
  };
};