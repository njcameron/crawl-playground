import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

interface Props {
  data: unknown;
}

export function JsonViewer({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const formatted = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
      <pre className="p-4 bg-muted rounded-md overflow-auto text-xs font-mono leading-relaxed max-h-[600px]">
        <code>{formatted}</code>
      </pre>
    </div>
  );
}
