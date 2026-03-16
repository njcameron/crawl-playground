import type { Credentials, ApiResponse, Endpoint, EndpointRequest, CrawlJob } from './types';
import { getEndpointMeta } from './endpoints';

const BASE = 'https://api.cloudflare.com/client/v4/accounts';

function buildUrl(creds: Credentials, path: string): string {
  return `${BASE}/${creds.accountId}/browser-rendering${path}`;
}

function buildHeaders(creds: Credentials): Record<string, string> {
  return {
    Authorization: `Bearer ${creds.apiToken}`,
    'Content-Type': 'application/json',
  };
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== '' && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nested = stripUndefined(value as Record<string, unknown>);
        if (Object.keys(nested).length > 0) {
          result[key] = nested;
        }
      } else if (Array.isArray(value) && value.length > 0) {
        result[key] = value;
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export async function cfFetch(
  creds: Credentials,
  endpoint: Endpoint,
  body: EndpointRequest,
  methodOverride?: 'GET' | 'DELETE',
): Promise<ApiResponse> {
  const meta = getEndpointMeta(endpoint);
  const method = methodOverride ?? meta.method;
  const url = buildUrl(creds, meta.path);
  const headers = buildHeaders(creds);

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (method === 'POST') {
    fetchOptions.body = JSON.stringify(stripUndefined(body as Record<string, unknown>));
  }

  const res = await fetch(url, fetchOptions);
  const responseHeaders: Record<string, string> = {};
  res.headers.forEach((v, k) => {
    responseHeaders[k] = v;
  });

  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch {
      errorData = await res.text();
    }
    return { type: 'error', data: errorData, status: res.status, headers: responseHeaders };
  }

  if (contentType.includes('image/')) {
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    return { type: 'image', data: null, blobUrl, status: res.status, headers: responseHeaders };
  }

  if (contentType.includes('application/pdf')) {
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    return { type: 'pdf', data: null, blobUrl, status: res.status, headers: responseHeaders };
  }

  const data = await res.json();
  return { type: 'json', data, status: res.status, headers: responseHeaders };
}

export async function crawlGet(
  creds: Credentials,
  jobId: string,
): Promise<ApiResponse> {
  const url = `${BASE}/${creds.accountId}/browser-rendering/crawl/${jobId}`;
  const res = await fetch(url, { headers: buildHeaders(creds) });
  const responseHeaders: Record<string, string> = {};
  res.headers.forEach((v, k) => {
    responseHeaders[k] = v;
  });
  const data = await res.json();
  return {
    type: res.ok ? 'json' : 'error',
    data,
    status: res.status,
    headers: responseHeaders,
  };
}

export async function crawlDelete(
  creds: Credentials,
  jobId: string,
): Promise<ApiResponse> {
  const url = `${BASE}/${creds.accountId}/browser-rendering/crawl/${jobId}`;
  const res = await fetch(url, { method: 'DELETE', headers: buildHeaders(creds) });
  const responseHeaders: Record<string, string> = {};
  res.headers.forEach((v, k) => {
    responseHeaders[k] = v;
  });
  const data = await res.json();
  return {
    type: res.ok ? 'json' : 'error',
    data,
    status: res.status,
    headers: responseHeaders,
  };
}

export function buildCrawlJob(id: string): CrawlJob {
  return { id, status: 'running' };
}
