import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { LinksRequest } from '@/lib/types';

interface Props {
  values: LinksRequest;
  onChange: (v: LinksRequest) => void;
}

export function LinksForm({ values, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Visible Links Only</Label>
        <Switch
          checked={values.visibleLinksOnly || false}
          onCheckedChange={(checked) =>
            onChange({ ...values, visibleLinksOnly: checked })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs">Exclude External Links</Label>
        <Switch
          checked={values.excludeExternalLinks || false}
          onCheckedChange={(checked) =>
            onChange({ ...values, excludeExternalLinks: checked })
          }
        />
      </div>
    </div>
  );
}
