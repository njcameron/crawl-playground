import { useState, useEffect, useCallback } from 'react';
import type { Credentials } from './types';

const STORAGE_KEY = 'cf-playground-creds';

export function useCredentials() {
  const [credentials, setCredentials] = useState<Credentials>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { apiToken: '', accountId: '' };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  }, [credentials]);

  const updateToken = useCallback((apiToken: string) => {
    setCredentials((prev) => ({ ...prev, apiToken }));
  }, []);

  const updateAccountId = useCallback((accountId: string) => {
    setCredentials((prev) => ({ ...prev, accountId }));
  }, []);

  const isValid = credentials.apiToken.length > 0 && credentials.accountId.length > 0;

  return { credentials, updateToken, updateAccountId, isValid };
}
