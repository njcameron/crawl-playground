import { useState, useCallback, useRef, useEffect } from 'react';
import type { Credentials, CrawlJob, ApiResponse } from './types';
import { crawlGet, crawlDelete } from './api';

export function useJobs(credentials: Credentials) {
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const addJob = useCallback((id: string) => {
    setJobs((prev) => [...prev, { id, status: 'running' }]);
  }, []);

  const pollJob = useCallback(
    (jobId: string, onResult?: (res: ApiResponse) => void) => {
      if (intervalsRef.current.has(jobId)) return;

      const interval = setInterval(async () => {
        try {
          const res = await crawlGet(credentials, jobId);
          const data = res.data as Record<string, unknown>;

          setJobs((prev) =>
            prev.map((j) => {
              if (j.id !== jobId) return j;
              if (data.success === true && data.result) {
                const result = data.result as Record<string, unknown>;
                return {
                  ...j,
                  status: (result.status as string) === 'complete' ? 'done' : 'running',
                  total: result.total as number | undefined,
                  completed: result.completed as number | undefined,
                  result: result,
                };
              }
              return j;
            }),
          );

          const result = data.result as Record<string, unknown> | undefined;
          if (result?.status === 'complete') {
            clearInterval(interval);
            intervalsRef.current.delete(jobId);
            if (onResult) onResult(res);
          }
        } catch {
          // keep polling on transient errors
        }
      }, 5000);

      intervalsRef.current.set(jobId, interval);
    },
    [credentials],
  );

  const cancelJob = useCallback(
    async (jobId: string) => {
      const interval = intervalsRef.current.get(jobId);
      if (interval) {
        clearInterval(interval);
        intervalsRef.current.delete(jobId);
      }
      await crawlDelete(credentials, jobId);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: 'cancelled' } : j)),
      );
    },
    [credentials],
  );

  const loadJobResult = useCallback(
    async (jobId: string): Promise<ApiResponse> => {
      return crawlGet(credentials, jobId);
    },
    [credentials],
  );

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  return { jobs, addJob, pollJob, cancelJob, loadJobResult };
}
