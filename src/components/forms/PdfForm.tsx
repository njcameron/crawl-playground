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
import type { PdfRequest } from '@/lib/types';

interface Props {
  values: PdfRequest;
  onChange: (v: PdfRequest) => void;
}

export function PdfForm({ values, onChange }: Props) {
  const opts = values.pdfOptions || {};

  const updateOpts = (patch: Partial<NonNullable<PdfRequest['pdfOptions']>>) =>
    onChange({ ...values, pdfOptions: { ...opts, ...patch } });

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">Paper Format</Label>
        <Select
          value={opts.format || 'A4'}
          onValueChange={(v) => updateOpts({ format: v ?? undefined })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A4">A4</SelectItem>
            <SelectItem value="Letter">Letter</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Tabloid">Tabloid</SelectItem>
            <SelectItem value="A3">A3</SelectItem>
            <SelectItem value="A5">A5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Landscape</Label>
        <Switch
          checked={opts.landscape || false}
          onCheckedChange={(checked) => updateOpts({ landscape: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Print Background</Label>
        <Switch
          checked={opts.printBackground ?? true}
          onCheckedChange={(checked) => updateOpts({ printBackground: checked })}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Scale</Label>
        <Input
          type="number"
          min={0.1}
          max={2}
          step={0.1}
          value={opts.scale ?? 1}
          onChange={(e) => updateOpts({ scale: parseFloat(e.target.value) || 1 })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Margin Top</Label>
          <Input
            placeholder="0.4in"
            value={opts.margin?.top || ''}
            onChange={(e) =>
              updateOpts({ margin: { ...opts.margin, top: e.target.value } })
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Margin Bottom</Label>
          <Input
            placeholder="0.4in"
            value={opts.margin?.bottom || ''}
            onChange={(e) =>
              updateOpts({ margin: { ...opts.margin, bottom: e.target.value } })
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Margin Left</Label>
          <Input
            placeholder="0.4in"
            value={opts.margin?.left || ''}
            onChange={(e) =>
              updateOpts({ margin: { ...opts.margin, left: e.target.value } })
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Margin Right</Label>
          <Input
            placeholder="0.4in"
            value={opts.margin?.right || ''}
            onChange={(e) =>
              updateOpts({ margin: { ...opts.margin, right: e.target.value } })
            }
          />
        </div>
      </div>
    </div>
  );
}
