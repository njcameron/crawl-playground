import type { Endpoint } from './types';

export interface EndpointMeta {
  id: Endpoint;
  label: string;
  method: 'POST' | 'GET' | 'DELETE';
  path: string;
  responseType: 'json' | 'binary';
  description: string;
}

export const ENDPOINTS: EndpointMeta[] = [
  {
    id: 'content',
    label: 'Content',
    method: 'POST',
    path: '/content',
    responseType: 'json',
    description: 'Get rendered HTML content',
  },
  {
    id: 'markdown',
    label: 'Markdown',
    method: 'POST',
    path: '/markdown',
    responseType: 'json',
    description: 'Get page as markdown',
  },
  {
    id: 'links',
    label: 'Links',
    method: 'POST',
    path: '/links',
    responseType: 'json',
    description: 'Extract all links from a page',
  },
  {
    id: 'screenshot',
    label: 'Screenshot',
    method: 'POST',
    path: '/screenshot',
    responseType: 'binary',
    description: 'Capture a screenshot (PNG/JPEG)',
  },
  {
    id: 'pdf',
    label: 'PDF',
    method: 'POST',
    path: '/pdf',
    responseType: 'binary',
    description: 'Generate a PDF of the page',
  },
  {
    id: 'scrape',
    label: 'Scrape',
    method: 'POST',
    path: '/scrape',
    responseType: 'json',
    description: 'Extract elements by CSS selectors',
  },
  {
    id: 'json',
    label: 'JSON',
    method: 'POST',
    path: '/json',
    responseType: 'json',
    description: 'AI-powered structured data extraction',
  },
  {
    id: 'crawl',
    label: 'Crawl',
    method: 'POST',
    path: '/crawl',
    responseType: 'json',
    description: 'Crawl multiple pages (async)',
  },
];

export function getEndpointMeta(id: Endpoint): EndpointMeta {
  return ENDPOINTS.find((e) => e.id === id)!;
}
