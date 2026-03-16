import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  data: unknown;
}

interface CrawlRecord {
  url?: string;
  status?: string;
  html?: string;
  markdown?: string;
  json?: unknown;
  links?: string[];
  [key: string]: unknown;
}

export function RecordsBrowser({ data }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const result = data as Record<string, unknown>;
  const records = (result?.data || result?.result || []) as CrawlRecord[];

  if (!Array.isArray(records) || records.length === 0) {
    return <p className="text-sm text-muted-foreground p-4">No records found in this response.</p>;
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-1 p-2">
        {records.map((record, i) => (
          <div key={i} className="border rounded-md">
            <button
              className="w-full flex items-center gap-2 p-3 text-left text-sm hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform shrink-0',
                  expandedIdx === i && 'rotate-90',
                )}
              />
              <span className="font-mono text-xs truncate flex-1">
                {record.url || `Record ${i + 1}`}
              </span>
              {record.status && (
                <span className="text-xs text-muted-foreground">{record.status}</span>
              )}
            </button>
            {expandedIdx === i && (
              <div className="border-t p-3">
                <pre className="text-xs font-mono overflow-auto max-h-[300px] bg-muted p-2 rounded">
                  {JSON.stringify(record, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
