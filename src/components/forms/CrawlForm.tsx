import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CrawlRequest } from '@/lib/types';

interface Props {
  values: CrawlRequest;
  onChange: (v: CrawlRequest) => void;
}

const FORMAT_OPTIONS = ['markdown', 'html', 'json', 'links', 'screenshot'];

export function CrawlForm({ values, onChange }: Props) {
  const formats = values.formats || [];

  const toggleFormat = (fmt: string) => {
    const next = formats.includes(fmt)
      ? formats.filter((f) => f !== fmt)
      : [...formats, fmt];
    onChange({ ...values, formats: next });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs font-medium">Formats</Label>
        <div className="flex flex-wrap gap-3">
          {FORMAT_OPTIONS.map((fmt) => (
            <label key={fmt} className="flex items-center gap-1.5 text-sm">
              <Checkbox
                checked={formats.includes(fmt)}
                onCheckedChange={() => toggleFormat(fmt)}
              />
              {fmt}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Limit</Label>
          <Input
            type="number"
            min={1}
            placeholder="10"
            value={values.limit ?? ''}
            onChange={(e) =>
              onChange({ ...values, limit: e.target.value ? parseInt(e.target.value) : undefined })
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Depth</Label>
          <Input
            type="number"
            min={0}
            placeholder="1"
            value={values.depth ?? ''}
            onChange={(e) =>
              onChange({ ...values, depth: e.target.value ? parseInt(e.target.value) : undefined })
            }
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Source</Label>
        <Select
          value={values.source || 'links'}
          onValueChange={(v) => { if (v) onChange({ ...values, source: v as 'sitemap' | 'links' }); }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="links">links</SelectItem>
            <SelectItem value="sitemap">sitemap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Render (JavaScript)</Label>
        <Switch
          checked={values.render ?? true}
          onCheckedChange={(checked) => onChange({ ...values, render: checked })}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Max Age (seconds)</Label>
        <Input
          type="number"
          placeholder="3600"
          value={values.maxAge ?? ''}
          onChange={(e) =>
            onChange({ ...values, maxAge: e.target.value ? parseInt(e.target.value) : undefined })
          }
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Wait For Selector</Label>
        <Input
          placeholder="e.g. #content"
          value={values.waitForSelector || ''}
          onChange={(e) => onChange({ ...values, waitForSelector: e.target.value })}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Include Patterns (one per line)</Label>
        <Textarea
          placeholder={"/blog/*\n/docs/*"}
          rows={2}
          value={values.includePatterns?.join('\n') || ''}
          onChange={(e) =>
            onChange({
              ...values,
              includePatterns: e.target.value.split('\n').filter(Boolean),
            })
          }
          className="font-mono text-xs"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Exclude Patterns (one per line)</Label>
        <Textarea
          placeholder={"/admin/*\n/private/*"}
          rows={2}
          value={values.excludePatterns?.join('\n') || ''}
          onChange={(e) =>
            onChange({
              ...values,
              excludePatterns: e.target.value.split('\n').filter(Boolean),
            })
          }
          className="font-mono text-xs"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Reject Resource Types (comma-separated)</Label>
        <Input
          placeholder="image, font"
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

      {formats.includes('json') && (
        <div className="space-y-1">
          <Label className="text-xs">JSON Extraction Prompt</Label>
          <Textarea
            placeholder="Describe what data to extract..."
            rows={2}
            value={values.jsonOptions?.prompt || ''}
            onChange={(e) =>
              onChange({
                ...values,
                jsonOptions: { ...values.jsonOptions, prompt: e.target.value },
              })
            }
          />
        </div>
      )}
    </div>
  );
}
