import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Props {
  type: 'image' | 'pdf';
  blobUrl: string;
}

export function BinaryViewer({ type, blobUrl }: Props) {
  if (type === 'image') {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const a = document.createElement('a');
              a.href = blobUrl;
              a.download = 'screenshot.png';
              a.click();
            }}
          >
            <Download className="h-3 w-3 mr-1" /> Download
          </Button>
        </div>
        <div className="border rounded-md overflow-auto max-h-[600px] bg-[repeating-conic-gradient(#f0f0f0_0%_25%,transparent_0%_50%)_50%/20px_20px]">
          <img src={blobUrl} alt="Screenshot" className="max-w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'page.pdf';
            a.click();
          }}
        >
          <Download className="h-3 w-3 mr-1" /> Download PDF
        </Button>
      </div>
      <iframe
        src={blobUrl}
        className="w-full h-[600px] border rounded-md"
        title="PDF Preview"
      />
    </div>
  );
}
