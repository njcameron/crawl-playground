import { useState, useCallback, useRef, useEffect } from 'react';
import type { Credentials, CrawlJob, CrawlJobStatus } from './types';
import { crawlGet, crawlDelete } from './api';

const STORAGE_KEY = 'cf-playground-jobs';

function loadJobs(): CrawlJob[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveJobs(jobs: CrawlJob[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

const TERMINAL_STATUSES: CrawlJobStatus[] = [
  'complete',
  'completed',
  'cancelled_due_to_timeout',
  'cancelled_due_to_limits',
  'cancelled_by_user',
  'errored',
];

function isTerminal(status: CrawlJobStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export { isTerminal };

export function useJobs(credentials: Credentials) {
  const [jobs, setJobs] = useState<CrawlJob[]>(loadJobs);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // Persist whenever jobs change
  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  // On mount, resume polling any still-running jobs
  useEffect(() => {
    const running = loadJobs().filter((j) => !isTerminal(j.status));
    for (const job of running) {
      pollJob(job.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addJob = useCallback((id: string, url?: string) => {
    setJobs((prev) => {
      if (prev.some((j) => j.id === id)) return prev;
      return [{ id, status: 'running', url, startedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<CrawlJob>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  }, []);

  const pollJob = useCallback(
    (jobId: string) => {
      if (intervalsRef.current.has(jobId)) return;

      const poll = async () => {
        try {
          const res = await crawlGet(credentials, jobId);
          const data = res.data as Record<string, unknown>;

          if (data.success === true && data.result) {
            const result = data.result as Record<string, unknown>;
            const status = result.status as CrawlJobStatus;
            updateJob(jobId, {
              status,
              total: result.total as number | undefined,
              finished: result.finished as number | undefined,
              browserSecondsUsed: result.browserSecondsUsed as number | undefined,
            });
            if (isTerminal(status)) {
              clearInterval(interval);
              intervalsRef.current.delete(jobId);
            }
          }
        } catch {
          // keep polling on transient errors
        }
      };

      // Poll immediately, then every 5s
      poll();
      const interval = setInterval(poll, 5000);
      intervalsRef.current.set(jobId, interval);
    },
    [credentials, updateJob],
  );

  const cancelJob = useCallback(
    async (jobId: string) => {
      const interval = intervalsRef.current.get(jobId);
      if (interval) {
        clearInterval(interval);
        intervalsRef.current.delete(jobId);
      }
      await crawlDelete(credentials, jobId);
      updateJob(jobId, { status: 'cancelled_by_user' });
    },
    [credentials, updateJob],
  );

  const removeJob = useCallback((jobId: string) => {
    const interval = intervalsRef.current.get(jobId);
    if (interval) {
      clearInterval(interval);
      intervalsRef.current.delete(jobId);
    }
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  const clearTerminalJobs = useCallback(() => {
    setJobs((prev) => {
      const running = prev.filter((j) => !isTerminal(j.status));
      return running;
    });
  }, []);

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  return { jobs, addJob, pollJob, cancelJob, removeJob, clearTerminalJobs };
}
