import { ENDPOINTS } from '@/lib/endpoints';
import type { Endpoint } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  selected: Endpoint;
  onSelect: (e: Endpoint) => void;
}

export function EndpointPicker({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 p-3 border-b">
      {ENDPOINTS.map((ep) => (
        <button
          key={ep.id}
          onClick={() => onSelect(ep.id)}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            selected === ep.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent',
          )}
        >
          {ep.label}
          {ep.responseType === 'binary' && (
            <Badge variant="outline" className="ml-1.5 text-[10px] px-1 py-0">
              bin
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}
