import type { Credentials, Endpoint, EndpointRequest } from './types';
import { getEndpointMeta } from './endpoints';

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

export function generateCurl(
  creds: Credentials,
  endpoint: Endpoint,
  body: EndpointRequest,
): string {
  const meta = getEndpointMeta(endpoint);
  const base = 'https://api.cloudflare.com/client/v4/accounts';
  const url = `${base}/${creds.accountId || '<ACCOUNT_ID>'}/browser-rendering${meta.path}`;
  const token = creds.apiToken || '<API_TOKEN>';

  const parts = [
    `curl -X ${meta.method}`,
    `  "${url}"`,
    `  -H "Authorization: Bearer ${token}"`,
    `  -H "Content-Type: application/json"`,
  ];

  if (meta.method === 'POST') {
    const cleaned = stripUndefined(body as Record<string, unknown>);
    parts.push(`  -d '${JSON.stringify(cleaned, null, 2)}'`);
  }

  return parts.join(' \\\n');
}
