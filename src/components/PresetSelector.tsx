import { useState, useRef, useEffect } from 'react';
import type { Endpoint, EndpointRequest } from '@/lib/types';
import { PRESETS } from '@/lib/presets';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface Props {
  endpoint: Endpoint;
  onApply: (values: Partial<EndpointRequest>) => void;
}

export function PresetSelector({ endpoint, onApply }: Props) {
  const presets = PRESETS[endpoint];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!presets || presets.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        Presets <ChevronDown className="h-3 w-3 ml-1" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border bg-popover p-1 shadow-md">
          {presets.map((p, i) => (
            <button
              key={i}
              className="w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
              onClick={() => {
                onApply(p.values);
                setOpen(false);
              }}
            >
              <div className="font-medium">{p.label}</div>
              <div className="text-xs text-muted-foreground">{p.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
