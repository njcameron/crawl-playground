import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { SharedOptions as SharedOptionsType } from '@/lib/types';

interface Props {
  values: SharedOptionsType;
  onChange: (v: SharedOptionsType) => void;
  hideUrl?: boolean;
}

export function SharedOptions({ values, onChange, hideUrl }: Props) {
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<SharedOptionsType>) =>
    onChange({ ...values, ...patch });

  return (
    <div className="space-y-3">
      {!hideUrl && (
        <div className="space-y-1">
          <Label className="text-xs font-medium">URL</Label>
          <Input
            placeholder="https://example.com"
            value={values.url || ''}
            onChange={(e) => update({ url: e.target.value })}
            className="font-mono text-sm"
          />
        </div>
      )}

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} />
          Advanced Options
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs">Goto Wait Until</Label>
            <Select
              value={values.gotoOptions?.waitUntil || ''}
              onValueChange={(v) => {
                if (!v) return;
                update({
                  gotoOptions: {
                    ...values.gotoOptions,
                    waitUntil: v as 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2',
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="load">load</SelectItem>
                <SelectItem value="domcontentloaded">domcontentloaded</SelectItem>
                <SelectItem value="networkidle0">networkidle0</SelectItem>
                <SelectItem value="networkidle2">networkidle2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Goto Timeout (ms)</Label>
            <Input
              type="number"
              placeholder="30000"
              value={values.gotoOptions?.timeout ?? ''}
              onChange={(e) =>
                update({
                  gotoOptions: {
                    ...values.gotoOptions,
                    timeout: e.target.value ? parseInt(e.target.value) : undefined,
                  },
                })
              }
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">User Agent</Label>
            <Input
              placeholder="Custom user agent string"
              value={values.userAgent || ''}
              onChange={(e) => update({ userAgent: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Auth Username</Label>
              <Input
                value={values.authenticate?.username || ''}
                onChange={(e) =>
                  update({
                    authenticate: { ...values.authenticate, username: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Auth Password</Label>
              <Input
                type="password"
                value={values.authenticate?.password || ''}
                onChange={(e) =>
                  update({
                    authenticate: { ...values.authenticate, password: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Extra HTTP Headers (JSON)</Label>
            <Textarea
              placeholder='{"X-Custom": "value"}'
              rows={2}
              value={
                values.setExtraHTTPHeaders
                  ? JSON.stringify(values.setExtraHTTPHeaders)
                  : ''
              }
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  update({ setExtraHTTPHeaders: parsed });
                } catch {
                  // let user keep typing
                }
              }}
              className="font-mono text-xs"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
