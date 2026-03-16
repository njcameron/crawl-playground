import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { JsonViewer } from './JsonViewer';
import { BinaryViewer } from './BinaryViewer';
import { CurlGenerator } from './CurlGenerator';
import { RecordsBrowser } from './RecordsBrowser';
import type { ApiResponse, Credentials, Endpoint, EndpointRequest } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface Props {
  response: ApiResponse | null;
  credentials: Credentials;
  endpoint: Endpoint;
  body: EndpointRequest;
  loading: boolean;
}

export function ResponsePanel({ response, credentials, endpoint, body, loading }: Props) {
  const showRecords = endpoint === 'crawl' && response?.type === 'json';

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="response" className="flex flex-col h-full">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="response">
            Response
            {response && (
              <Badge
                variant={response.type === 'error' ? 'destructive' : 'secondary'}
                className="ml-2 text-[10px]"
              >
                {response.status}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="curl">cURL</TabsTrigger>
          {showRecords && <TabsTrigger value="records">Records</TabsTrigger>}
        </TabsList>

        <TabsContent value="response" className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && !response && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Send a request to see the response
            </div>
          )}
          {!loading && response?.type === 'json' && (
            <JsonViewer data={response.data} />
          )}
          {!loading && response?.type === 'error' && (
            <div className="space-y-2">
              <Badge variant="destructive">Error {response.status}</Badge>
              <JsonViewer data={response.data} />
            </div>
          )}
          {!loading && response?.type === 'image' && response.blobUrl && (
            <BinaryViewer type="image" blobUrl={response.blobUrl} />
          )}
          {!loading && response?.type === 'pdf' && response.blobUrl && (
            <BinaryViewer type="pdf" blobUrl={response.blobUrl} />
          )}
        </TabsContent>

        <TabsContent value="curl" className="flex-1 overflow-auto p-4">
          <CurlGenerator credentials={credentials} endpoint={endpoint} body={body} />
        </TabsContent>

        {showRecords && (
          <TabsContent value="records" className="flex-1 overflow-auto p-4">
            <RecordsBrowser data={response!.data} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
