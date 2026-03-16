import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { generateCurl } from '@/lib/curl';
import type { Credentials, Endpoint, EndpointRequest } from '@/lib/types';

interface Props {
  credentials: Credentials;
  endpoint: Endpoint;
  body: EndpointRequest;
}

export function CurlGenerator({ credentials, endpoint, body }: Props) {
  const [copied, setCopied] = useState(false);
  const curl = generateCurl(credentials, endpoint, body);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(curl);
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
      <pre className="p-4 bg-muted rounded-md overflow-auto text-xs font-mono leading-relaxed">
        <code>{curl}</code>
      </pre>
    </div>
  );
}
