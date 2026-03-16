import type { Endpoint, EndpointRequest, SharedOptions as SharedOptionsType } from '@/lib/types';
import { SharedOptions } from './forms/SharedOptions';
import { CrawlForm } from './forms/CrawlForm';
import { ScreenshotForm } from './forms/ScreenshotForm';
import { PdfForm } from './forms/PdfForm';
import { ScrapeForm } from './forms/ScrapeForm';
import { JsonForm } from './forms/JsonForm';
import { LinksForm } from './forms/LinksForm';
import { ContentForm } from './forms/ContentForm';
import { MarkdownForm } from './forms/MarkdownForm';
import { PresetSelector } from './PresetSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getEndpointMeta } from '@/lib/endpoints';
import { Play, Loader2 } from 'lucide-react';

interface Props {
  endpoint: Endpoint;
  body: EndpointRequest;
  onChange: (body: EndpointRequest) => void;
  onSubmit: () => void;
  loading: boolean;
  isValid: boolean;
}

export function RequestBuilder({ endpoint, body, onChange, onSubmit, loading, isValid }: Props) {
  const meta = getEndpointMeta(endpoint);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (isValid && !loading) onSubmit();
    }
  };

  const b = body as unknown as SharedOptionsType;
  const sharedValues: SharedOptionsType = {
    url: b.url,
    html: b.html,
    gotoOptions: b.gotoOptions,
    authenticate: b.authenticate,
    cookies: b.cookies,
    userAgent: b.userAgent,
    setExtraHTTPHeaders: b.setExtraHTTPHeaders,
  };

  return (
    <div className="flex flex-col h-full" onKeyDown={handleKeyDown}>
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{meta.label}</h3>
            <p className="text-xs text-muted-foreground">{meta.description}</p>
          </div>
          <PresetSelector
            endpoint={endpoint}
            onApply={(preset) => onChange({ ...body, ...preset })}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">URL</Label>
          <Input
            placeholder="https://example.com"
            value={sharedValues.url || ''}
            onChange={(e) => onChange({ ...body, url: e.target.value })}
            className="font-mono text-sm"
          />
        </div>

        <Separator />

        {endpoint === 'crawl' && (
          <CrawlForm values={body} onChange={onChange} />
        )}
        {endpoint === 'screenshot' && (
          <ScreenshotForm values={body} onChange={onChange} />
        )}
        {endpoint === 'pdf' && (
          <PdfForm values={body} onChange={onChange} />
        )}
        {endpoint === 'scrape' && (
          <ScrapeForm values={body} onChange={onChange} />
        )}
        {endpoint === 'json' && (
          <JsonForm values={body} onChange={onChange} />
        )}
        {endpoint === 'links' && (
          <LinksForm values={body} onChange={onChange} />
        )}
        {endpoint === 'content' && (
          <ContentForm values={body} onChange={onChange} />
        )}
        {endpoint === 'markdown' && (
          <MarkdownForm values={body} onChange={onChange} />
        )}

        <Separator />

        <SharedOptions
          values={sharedValues}
          onChange={(shared) => onChange({ ...body, ...shared })}
          hideUrl
        />
      </div>

      <div className="p-4 border-t">
        <Button
          onClick={onSubmit}
          disabled={loading || !isValid}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          Send Request
          <span className="ml-2 text-xs opacity-60">Ctrl+Enter</span>
        </Button>
      </div>
    </div>
  );
}
