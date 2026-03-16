import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { CrawlJob, ApiResponse } from '@/lib/types';

interface Props {
  jobs: CrawlJob[];
  onCancel: (jobId: string) => void;
  onLoadResult: (jobId: string) => Promise<ApiResponse>;
  onShowResult: (res: ApiResponse) => void;
}

export function JobTracker({ jobs, onCancel, onLoadResult, onShowResult }: Props) {
  if (jobs.length === 0) return null;

  const handleClick = async (job: CrawlJob) => {
    if (job.status === 'done' || job.result) {
      const res = await onLoadResult(job.id);
      onShowResult(res);
    }
  };

  return (
    <div className="border-t bg-muted/30 px-4 py-2">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Crawl Jobs:</span>
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center gap-1.5 border rounded-md px-2 py-1 bg-card shrink-0 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleClick(job)}
          >
            {job.status === 'running' && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
            {job.status === 'done' && <CheckCircle className="h-3 w-3 text-green-500" />}
            {job.status === 'cancelled' && <XCircle className="h-3 w-3 text-orange-500" />}
            {job.status === 'error' && <XCircle className="h-3 w-3 text-red-500" />}
            <span className="text-xs font-mono">{job.id.slice(0, 8)}</span>
            {job.total != null && (
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                {job.completed ?? 0}/{job.total}
              </Badge>
            )}
            {job.status === 'running' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(job.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
