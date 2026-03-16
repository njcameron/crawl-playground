import type { Endpoint, EndpointRequest } from './types';

export interface Preset {
  label: string;
  description: string;
  values: Partial<EndpointRequest>;
}

export const PRESETS: Record<Endpoint, Preset[]> = {
  crawl: [
    {
      label: 'Quick scrape',
      description: 'Crawl up to 5 pages, markdown format',
      values: { formats: ['markdown'], limit: 5, depth: 1, render: true },
    },
    {
      label: 'Full site',
      description: 'Deep crawl with HTML + markdown',
      values: { formats: ['html', 'markdown'], limit: 50, depth: 3, render: true },
    },
    {
      label: 'AI extraction',
      description: 'Crawl and extract structured JSON',
      values: {
        formats: ['json'],
        limit: 10,
        depth: 1,
        render: true,
        jsonOptions: { prompt: 'Extract the main content and metadata' },
      },
    },
    {
      label: 'Sitemap only',
      description: 'Use sitemap as crawl source',
      values: { formats: ['markdown'], limit: 20, source: 'sitemap' },
    },
  ],
  screenshot: [
    {
      label: 'Full page',
      description: 'Full page screenshot, PNG',
      values: { screenshotOptions: { fullPage: true, type: 'png' } },
    },
    {
      label: 'Mobile viewport',
      description: '375x812 mobile viewport',
      values: {
        viewport: { width: 375, height: 812, deviceScaleFactor: 2 },
        screenshotOptions: { fullPage: false, type: 'png' },
      },
    },
    {
      label: 'Element capture',
      description: 'Screenshot a specific CSS selector',
      values: {
        selector: 'main',
        screenshotOptions: { type: 'png' },
      },
    },
  ],
  pdf: [
    {
      label: 'A4 Portrait',
      description: 'Standard A4 PDF',
      values: { pdfOptions: { format: 'A4', landscape: false, printBackground: true } },
    },
    {
      label: 'Letter Landscape',
      description: 'US Letter, landscape orientation',
      values: { pdfOptions: { format: 'Letter', landscape: true, printBackground: true } },
    },
  ],
  scrape: [
    {
      label: 'Headings',
      description: 'Extract all h1-h3 headings',
      values: { elements: [{ selector: 'h1' }, { selector: 'h2' }, { selector: 'h3' }] },
    },
    {
      label: 'Links & images',
      description: 'Extract links and image sources',
      values: { elements: [{ selector: 'a[href]' }, { selector: 'img[src]' }] },
    },
  ],
  json: [
    {
      label: 'Product info',
      description: 'Extract product name, price, description',
      values: { prompt: 'Extract the product name, price, and description from this page' },
    },
    {
      label: 'Article metadata',
      description: 'Extract article title, author, date',
      values: { prompt: 'Extract the article title, author, publish date, and summary' },
    },
  ],
  links: [
    {
      label: 'Visible only',
      description: 'Only visible links',
      values: { visibleLinksOnly: true },
    },
    {
      label: 'Internal only',
      description: 'Exclude external links',
      values: { excludeExternalLinks: true },
    },
  ],
  content: [
    {
      label: 'No images/fonts',
      description: 'Block images and fonts for faster load',
      values: { rejectResourceTypes: ['image', 'font'] },
    },
  ],
  markdown: [
    {
      label: 'No images/fonts',
      description: 'Block images and fonts for faster load',
      values: { rejectResourceTypes: ['image', 'font'] },
    },
  ],
};
