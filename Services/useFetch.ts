import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  autoFetch = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const activeRequest = useRef(0);

  const fetchData = useCallback(async (): Promise<T> => {
    const requestId = ++activeRequest.current;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();

      // ✅ Ignore stale responses
      if (requestId === activeRequest.current) {
        setData(result);
      }

      return result;
    } catch (err) {
      if (requestId === activeRequest.current) {
        setError(err as Error);
      }
      throw err;
    } finally {
      if (requestId === activeRequest.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction]);

  const reset = useCallback(() => {
    activeRequest.current++;
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
