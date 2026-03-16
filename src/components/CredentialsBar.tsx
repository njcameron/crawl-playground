import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Key } from 'lucide-react';

interface Props {
  apiToken: string;
  accountId: string;
  onTokenChange: (v: string) => void;
  onAccountIdChange: (v: string) => void;
}

export function CredentialsBar({ apiToken, accountId, onTokenChange, onAccountIdChange }: Props) {
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="flex items-end gap-4 p-4 border-b bg-card">
      <Key className="h-5 w-5 text-muted-foreground shrink-0 mb-2" />
      <div className="flex-1 space-y-1">
        <Label htmlFor="api-token" className="text-xs">API Token</Label>
        <div className="relative">
          <Input
            id="api-token"
            type={showToken ? 'text' : 'password'}
            placeholder="Your Cloudflare API token"
            value={apiToken}
            onChange={(e) => onTokenChange(e.target.value)}
            className="pr-10 font-mono text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowToken(!showToken)}
          >
            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <Label htmlFor="account-id" className="text-xs">Account ID</Label>
        <Input
          id="account-id"
          placeholder="Your Cloudflare Account ID"
          value={accountId}
          onChange={(e) => onAccountIdChange(e.target.value)}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}
