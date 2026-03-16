import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import type { ScrapeRequest } from '@/lib/types';

interface Props {
  values: ScrapeRequest;
  onChange: (v: ScrapeRequest) => void;
}

export function ScrapeForm({ values, onChange }: Props) {
  const elements = values.elements || [{ selector: '' }];

  const updateElement = (index: number, selector: string) => {
    const updated = [...elements];
    updated[index] = { selector };
    onChange({ ...values, elements: updated });
  };

  const addElement = () => {
    onChange({ ...values, elements: [...elements, { selector: '' }] });
  };

  const removeElement = (index: number) => {
    onChange({ ...values, elements: elements.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs font-medium">CSS Selectors</Label>
        {elements.map((el, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="e.g. h1, .price, article p"
              value={el.selector}
              onChange={(e) => updateElement(i, e.target.value)}
              className="font-mono text-sm"
            />
            {elements.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeElement(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addElement}>
          <Plus className="h-3 w-3 mr-1" /> Add selector
        </Button>
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
    </div>
  );
}
