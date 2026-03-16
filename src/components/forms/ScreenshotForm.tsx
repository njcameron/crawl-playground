import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ScreenshotRequest } from '@/lib/types';

interface Props {
  values: ScreenshotRequest;
  onChange: (v: ScreenshotRequest) => void;
}

export function ScreenshotForm({ values, onChange }: Props) {
  const opts = values.screenshotOptions || {};
  const vp = values.viewport || { width: 1280, height: 720 };

  const updateOpts = (patch: Partial<NonNullable<ScreenshotRequest['screenshotOptions']>>) =>
    onChange({ ...values, screenshotOptions: { ...opts, ...patch } });

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">Image Type</Label>
        <Select
          value={opts.type || 'png'}
          onValueChange={(v) => { if (v) updateOpts({ type: v as 'png' | 'jpeg' | 'webp' }); }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Full Page</Label>
        <Switch
          checked={opts.fullPage || false}
          onCheckedChange={(checked) => updateOpts({ fullPage: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Omit Background</Label>
        <Switch
          checked={opts.omitBackground || false}
          onCheckedChange={(checked) => updateOpts({ omitBackground: checked })}
        />
      </div>

      {(opts.type === 'jpeg' || opts.type === 'webp') && (
        <div className="space-y-1">
          <Label className="text-xs">Quality (0-100)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={opts.quality ?? 80}
            onChange={(e) => updateOpts({ quality: parseInt(e.target.value) || undefined })}
          />
        </div>
      )}

      <div className="space-y-1">
        <Label className="text-xs">CSS Selector (capture element)</Label>
        <Input
          placeholder="e.g. #hero, main"
          value={values.selector || ''}
          onChange={(e) => onChange({ ...values, selector: e.target.value })}
          className="font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Viewport Width</Label>
          <Input
            type="number"
            value={vp.width}
            onChange={(e) =>
              onChange({ ...values, viewport: { ...vp, width: parseInt(e.target.value) || 1280 } })
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Viewport Height</Label>
          <Input
            type="number"
            value={vp.height}
            onChange={(e) =>
              onChange({ ...values, viewport: { ...vp, height: parseInt(e.target.value) || 720 } })
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Scale</Label>
          <Input
            type="number"
            min={1}
            max={3}
            step={0.5}
            value={vp.deviceScaleFactor ?? 1}
            onChange={(e) =>
              onChange({
                ...values,
                viewport: { ...vp, deviceScaleFactor: parseFloat(e.target.value) || 1 },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
