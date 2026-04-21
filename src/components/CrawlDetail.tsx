import { useState, useEffect, useCallback, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import { crawlGet } from '@/lib/api';
import { isTerminal } from '@/lib/use-jobs';
import { cn } from '@/lib/utils';
import type { Credentials, CrawlJob, CrawlRecord, CrawlResultPage, CrawlJobStatus } from '@/lib/types';

interface Props {
  job: CrawlJob;
  credentials: Credentials;
  onBack: () => void;
}

const RECORD_STATUSES: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'queued', label: 'Queued' },
  { value: 'disallowed', label: 'Disallowed' },
  { value: 'skipped', label: 'Skipped' },
  { value: 'errored', label: 'Errored' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAGE_SIZE = 25;

export function CrawlDetail({ job, credentials, onBack }: Props) {
  const [records, setRecords] = useState<CrawlRecord[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [meta, setMeta] = useState<Partial<CrawlResultPage>>({});
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPollingRef = useRef(false);

  const fetchPage = useCallback(
    async (cursorVal?: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const params: Record<string, unknown> = { limit: PAGE_SIZE };
        if (cursorVal != null) params.cursor = cursorVal;
        if (statusFilter !== 'all') params.status = statusFilter;

        const res = await crawlGet(credentials, job.id, params as never);
        const data = res.data as Record<string, unknown>;

        if (!data.success) {
          setError(JSON.stringify(data, null, 2));
          return;
        }

        const result = data.result as CrawlResultPage;
        setMeta({
          status: result.status,
          total: result.total,
          finished: result.finished,
          browserSecondsUsed: result.browserSecondsUsed,
        });

        const newRecords = result.records || [];
        if (append) {
          setRecords((prev) => [...prev, ...newRecords]);
        } else {
          setRecords(newRecords);
        }

        if (result.cursor != null) {
          setCursor(result.cursor);
          setHasMore(true);
        } else {
          setCursor(undefined);
          setHasMore(false);
        }

        return result.status;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
        return undefined;
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [credentials, job.id, statusFilter],
  );

  // Fetch first page on mount or when filter changes, then auto-poll if running
  useEffect(() => {
    let cancelled = false;

    // Clear any existing poll
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    setRecords([]);
    setCursor(undefined);
    setExpandedIdx(null);

    (async () => {
      const status = await fetchPage();
      if (cancelled) return;

      // Start polling if the job is not yet in a terminal state
      if (!status || !isTerminal(status as CrawlJobStatus)) {
        isPollingRef.current = true;
        pollIntervalRef.current = setInterval(async () => {
          if (isPollingRef.current === false) return;
          const newStatus = await fetchPage();
          if (newStatus && isTerminal(newStatus as CrawlJobStatus)) {
            // Job finished — stop polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            isPollingRef.current = false;
          }
        }, 5000);
      }
    })();

    return () => {
      cancelled = true;
      isPollingRef.current = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [fetchPage]);

  const loadMore = () => {
    if (cursor != null) fetchPage(cursor, true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-sm font-medium">{job.id}</span>
          <Badge variant="outline" className="text-xs">
            {meta.status || job.status}
          </Badge>
          {!isTerminal((meta.status || job.status) as CrawlJobStatus) && (
            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
          )}
        </div>
        {job.url && (
          <p className="text-xs text-muted-foreground truncate pl-9">{job.url}</p>
        )}
        <div className="flex items-center gap-4 pl-9 text-xs text-muted-foreground">
          {meta.total != null && (
            <span>
              {meta.finished ?? 0}/{meta.total} pages
            </span>
          )}
          {meta.browserSecondsUsed != null && (
            <span>{meta.browserSecondsUsed.toFixed(1)}s browser time</span>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RECORD_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {records.length} record{records.length !== 1 ? 's' : ''} loaded
        </span>
      </div>

      {/* Records list */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="p-4">
          <Badge variant="destructive" className="mb-2">Error</Badge>
          <pre className="text-xs font-mono bg-muted p-2 rounded overflow-auto max-h-[200px]">
            {error}
          </pre>
        </div>
      ) : records.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          No records found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {records.map((record, i) => (
              <div key={i} className="border-b last:border-b-0">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                >
                  <ChevronRight
                    className={cn(
                      'h-3.5 w-3.5 transition-transform shrink-0 text-muted-foreground',
                      expandedIdx === i && 'rotate-90',
                    )}
                  />
                  <span className="text-xs font-mono truncate flex-1">
                    {record.url || `Record ${i + 1}`}
                  </span>
                  {record.status && (
                    <RecordStatusBadge status={record.status} />
                  )}
                  {record.metadata?.status && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      {record.metadata.status}
                    </Badge>
                  )}
                </button>
                {expandedIdx === i && (
                  <div className="px-4 pb-3">
                    <RecordContent record={record} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center py-4">
              <Button variant="outline" size="sm" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load more records'
                )}
              </Button>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}

function RecordStatusBadge({ status }: { status: string }) {
  const variant =
    status === 'completed'
      ? 'default'
      : status === 'errored'
        ? 'destructive'
        : 'secondary';
  return (
    <Badge variant={variant} className="text-[10px] px-1.5 py-0 shrink-0">
      {status}
    </Badge>
  );
}

function RecordContent({ record }: { record: CrawlRecord }) {
  const [tab, setTab] = useState<string>(() => {
    if (record.markdown) return 'markdown';
    if (record.html) return 'html';
    if (record.json) return 'json';
    if (record.links) return 'links';
    return 'raw';
  });

  const tabs = [];
  if (record.markdown) tabs.push('markdown');
  if (record.html) tabs.push('html');
  if (record.json) tabs.push('json');
  if (record.links) tabs.push('links');
  if (record.metadata) tabs.push('metadata');
  if (tabs.length === 0) tabs.push('raw');

  return (
    <div className="space-y-2">
      {tabs.length > 1 && (
        <div className="flex gap-1">
          {tabs.map((t) => (
            <Button
              key={t}
              variant={tab === t ? 'default' : 'outline'}
              size="sm"
              className="h-6 text-[11px] px-2"
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      )}
      <pre className="text-xs font-mono overflow-auto max-h-[400px] bg-muted p-3 rounded whitespace-pre-wrap">
        {tab === 'markdown' && record.markdown}
        {tab === 'html' && record.html}
        {tab === 'json' && JSON.stringify(record.json, null, 2)}
        {tab === 'links' && (record.links || []).join('\n')}
        {tab === 'metadata' && JSON.stringify(record.metadata, null, 2)}
        {tab === 'raw' && JSON.stringify(record, null, 2)}
      </pre>
    </div>
  );
}
