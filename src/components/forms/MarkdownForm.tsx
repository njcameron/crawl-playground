import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MarkdownRequest } from '@/lib/types';

interface Props {
  values: MarkdownRequest;
  onChange: (v: MarkdownRequest) => void;
}

export function MarkdownForm({ values, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">Wait For Selector</Label>
        <Input
          placeholder="e.g. #content, .main-article"
          value={values.waitForSelector || ''}
          onChange={(e) => onChange({ ...values, waitForSelector: e.target.value })}
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Reject Resource Types (comma-separated)</Label>
        <Input
          placeholder="image, font, stylesheet"
          value={values.rejectResourceTypes?.join(', ') || ''}
          onChange={(e) =>
            onChange({
              ...values,
              rejectResourceTypes: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="text-sm"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Reject Request Patterns (comma-separated)</Label>
        <Input
          placeholder="*.png, *.gif"
          value={values.rejectRequestPattern?.join(', ') || ''}
          onChange={(e) =>
            onChange({
              ...values,
              rejectRequestPattern: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="text-sm"
        />
      </div>
    </div>
  );
}
