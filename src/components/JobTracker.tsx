import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import type { CrawlJob, CrawlJobStatus } from '@/lib/types';
import { isTerminal } from '@/lib/use-jobs';

interface Props {
  jobs: CrawlJob[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  onCancel: (jobId: string) => void;
  onRemove: (jobId: string) => void;
  onClearTerminal: () => void;
}

function statusIcon(status: CrawlJobStatus) {
  switch (status) {
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500 shrink-0" />;
    case 'complete':
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />;
    case 'cancelled_by_user':
    case 'cancelled_due_to_timeout':
    case 'cancelled_due_to_limits':
      return <XCircle className="h-4 w-4 text-orange-500 shrink-0" />;
    case 'errored':
      return <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground shrink-0" />;
  }
}

function statusLabel(status: CrawlJobStatus): string {
  switch (status) {
    case 'running':
      return 'Running';
    case 'complete':
    case 'completed':
      return 'Complete';
    case 'cancelled_by_user':
      return 'Cancelled';
    case 'cancelled_due_to_timeout':
      return 'Timed out';
    case 'cancelled_due_to_limits':
      return 'Hit limits';
    case 'errored':
      return 'Error';
    default:
      return status;
  }
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function JobTracker({
  jobs,
  selectedJobId,
  onSelectJob,
  onCancel,
  onRemove,
  onClearTerminal,
}: Props) {
  const hasTerminal = jobs.some((j) => isTerminal(j.status));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h3 className="text-sm font-semibold">Crawl History</h3>
        {hasTerminal && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-muted-foreground"
            onClick={onClearTerminal}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear finished
          </Button>
        )}
      </div>
      {jobs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground px-4 text-center">
          No crawl jobs yet. Start a crawl to see it here.
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedJobId === job.id ? 'bg-accent' : ''
                }`}
                onClick={() => onSelectJob(job.id)}
              >
                <div className="pt-0.5">{statusIcon(job.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono truncate">{job.id}</span>
                    <Badge
                      variant={job.status === 'running' ? 'default' : 'outline'}
                      className="text-[10px] px-1 py-0 shrink-0"
                    >
                      {statusLabel(job.status)}
                    </Badge>
                  </div>
                  {job.url && (
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{job.url}</p>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    {job.total != null && (
                      <span className="text-[11px] text-muted-foreground">
                        {job.finished ?? 0}/{job.total} pages
                      </span>
                    )}
                    {job.startedAt && (
                      <span className="text-[11px] text-muted-foreground">
                        {formatTime(job.startedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!isTerminal(job.status) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel(job.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {isTerminal(job.status) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(job.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
