export interface Credentials {
  apiToken: string;
  accountId: string;
}

export type Endpoint =
  | 'crawl'
  | 'screenshot'
  | 'pdf'
  | 'content'
  | 'markdown'
  | 'json'
  | 'scrape'
  | 'links';

export interface GotoOptions {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  timeout?: number;
  referer?: string;
}

export interface AuthenticateOptions {
  username?: string;
  password?: string;
}

export interface CookieParam {
  name: string;
  value: string;
  domain?: string;
  path?: string;
}

export interface SharedOptions {
  url?: string;
  html?: string;
  gotoOptions?: GotoOptions;
  authenticate?: AuthenticateOptions;
  cookies?: CookieParam[];
  userAgent?: string;
  setExtraHTTPHeaders?: Record<string, string>;
}

export interface CrawlRequest extends SharedOptions {
  formats?: string[];
  limit?: number;
  depth?: number;
  source?: 'sitemap' | 'links';
  render?: boolean;
  maxAge?: number;
  includePatterns?: string[];
  excludePatterns?: string[];
  jsonOptions?: { prompt?: string; response_format?: unknown };
  waitForSelector?: string;
  rejectResourceTypes?: string[];
}

export interface ScreenshotRequest extends SharedOptions {
  screenshotOptions?: {
    fullPage?: boolean;
    type?: 'png' | 'jpeg' | 'webp';
    quality?: number;
    omitBackground?: boolean;
    clip?: { x: number; y: number; width: number; height: number };
  };
  viewport?: { width: number; height: number; deviceScaleFactor?: number };
  selector?: string;
  addScriptTag?: Array<{ content?: string; url?: string }>;
  addStyleTag?: Array<{ content?: string; url?: string }>;
}

export interface PdfRequest extends SharedOptions {
  pdfOptions?: {
    format?: string;
    landscape?: boolean;
    margin?: { top?: string; bottom?: string; left?: string; right?: string };
    scale?: number;
    printBackground?: boolean;
  };
  viewport?: { width: number; height: number };
  headerTemplate?: string;
  footerTemplate?: string;
  addStyleTag?: Array<{ content?: string; url?: string }>;
}

export interface ScrapeRequest extends SharedOptions {
  elements?: Array<{ selector: string }>;
  waitForSelector?: string;
}

export interface JsonRequest extends SharedOptions {
  prompt?: string;
  response_format?: unknown;
  custom_ai?: { model?: string; api_key?: string; base_url?: string };
}

export interface LinksRequest extends SharedOptions {
  visibleLinksOnly?: boolean;
  excludeExternalLinks?: boolean;
}

export interface ContentRequest extends SharedOptions {
  rejectResourceTypes?: string[];
  rejectRequestPattern?: string[];
  waitForSelector?: string;
}

export interface MarkdownRequest extends SharedOptions {
  rejectResourceTypes?: string[];
  rejectRequestPattern?: string[];
  waitForSelector?: string;
}

export type EndpointRequest =
  | CrawlRequest
  | ScreenshotRequest
  | PdfRequest
  | ScrapeRequest
  | JsonRequest
  | LinksRequest
  | ContentRequest
  | MarkdownRequest;

export interface CrawlJob {
  id: string;
  status: 'running' | 'done' | 'cancelled' | 'error';
  total?: number;
  completed?: number;
  result?: unknown;
  error?: string;
}

export interface ApiResponse {
  type: 'json' | 'image' | 'pdf' | 'error';
  data: unknown;
  blobUrl?: string;
  status: number;
  headers: Record<string, string>;
}
