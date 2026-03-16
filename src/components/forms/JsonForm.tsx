import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { JsonRequest } from '@/lib/types';

interface Props {
  values: JsonRequest;
  onChange: (v: JsonRequest) => void;
}

export function JsonForm({ values, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs font-medium">Prompt</Label>
        <Textarea
          placeholder="Describe what data to extract from the page..."
          rows={3}
          value={values.prompt || ''}
          onChange={(e) => onChange({ ...values, prompt: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Response Format (JSON Schema)</Label>
        <Textarea
          placeholder={`{
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "price": { "type": "number" }
  }
}`}
          rows={6}
          value={
            values.response_format
              ? JSON.stringify(values.response_format, null, 2)
              : ''
          }
          onChange={(e) => {
            if (!e.target.value) {
              onChange({ ...values, response_format: undefined });
              return;
            }
            try {
              const parsed = JSON.parse(e.target.value);
              onChange({ ...values, response_format: parsed });
            } catch {
              // let user keep typing
            }
          }}
          className="font-mono text-xs"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Custom AI Model</Label>
        <Input
          placeholder="e.g. gpt-4"
          value={values.custom_ai?.model || ''}
          onChange={(e) =>
            onChange({
              ...values,
              custom_ai: { ...values.custom_ai, model: e.target.value },
            })
          }
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Custom AI API Key</Label>
        <Input
          type="password"
          placeholder="API key for custom model"
          value={values.custom_ai?.api_key || ''}
          onChange={(e) =>
            onChange({
              ...values,
              custom_ai: { ...values.custom_ai, api_key: e.target.value },
            })
          }
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Custom AI Base URL</Label>
        <Input
          placeholder="e.g. https://api.openai.com/v1"
          value={values.custom_ai?.base_url || ''}
          onChange={(e) =>
            onChange({
              ...values,
              custom_ai: { ...values.custom_ai, base_url: e.target.value },
            })
          }
          className="text-sm"
        />
      </div>
    </div>
  );
}
