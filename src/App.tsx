import { useState, useCallback } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CredentialsBar } from '@/components/CredentialsBar';
import { EndpointPicker } from '@/components/EndpointPicker';
import { RequestBuilder } from '@/components/RequestBuilder';
import { ResponsePanel } from '@/components/ResponsePanel';
import { JobTracker } from '@/components/JobTracker';
import { useCredentials } from '@/lib/use-credentials';
import { useJobs } from '@/lib/use-jobs';
import { cfFetch } from '@/lib/api';
import type { Endpoint, EndpointRequest, ApiResponse } from '@/lib/types';
function App() {
  const { credentials, updateToken, updateAccountId, isValid } = useCredentials();
  const { jobs, addJob, pollJob, cancelJob, loadJobResult } = useJobs(credentials);

  const [endpoint, setEndpoint] = useState<Endpoint>('content');
  const [bodies, setBodies] = useState<Record<Endpoint, EndpointRequest>>({
    crawl: { url: '' },
    screenshot: { url: '' },
    pdf: { url: '' },
    content: { url: '' },
    markdown: { url: '' },
    json: { url: '' },
    scrape: { url: '', elements: [{ selector: '' }] },
    links: { url: '' },
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const body = bodies[endpoint];

  const updateBody = useCallback(
    (newBody: EndpointRequest) => {
      setBodies((prev) => ({ ...prev, [endpoint]: newBody }));
    },
    [endpoint],
  );

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await cfFetch(credentials, endpoint, body);
      setResponse(res);

      // If crawl endpoint and we got a job ID, start tracking
      if (endpoint === 'crawl' && res.type === 'json') {
        const data = res.data as Record<string, unknown>;
        const result = data?.result as Record<string, unknown> | undefined;
        const jobId = (result?.id || data?.id) as string | undefined;
        if (jobId) {
          addJob(jobId);
          pollJob(jobId, (pollRes) => setResponse(pollRes));
        }
      }
    } catch (err) {
      setResponse({
        type: 'error',
        data: { error: err instanceof Error ? err.message : 'Unknown error' },
        status: 0,
        headers: {},
      });
    } finally {
      setLoading(false);
    }
  }, [credentials, endpoint, body, isValid, addJob, pollJob]);

  const handleEndpointChange = useCallback((ep: Endpoint) => {
    setEndpoint(ep);
    setResponse(null);
  }, []);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <CredentialsBar
          apiToken={credentials.apiToken}
          accountId={credentials.accountId}
          onTokenChange={updateToken}
          onAccountIdChange={updateAccountId}
        />

        <EndpointPicker selected={endpoint} onSelect={handleEndpointChange} />

        <div className="flex-1 flex min-h-0">
          {/* Left: Request Builder */}
          <div className="w-[420px] border-r flex flex-col min-h-0 overflow-hidden">
            <RequestBuilder
              endpoint={endpoint}
              body={body}
              onChange={updateBody}
              onSubmit={handleSubmit}
              loading={loading}
              isValid={isValid}
            />
          </div>

          {/* Right: Response Panel */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ResponsePanel
              response={response}
              credentials={credentials}
              endpoint={endpoint}
              body={body}
              loading={loading}
            />
          </div>
        </div>

        <JobTracker
          jobs={jobs}
          onCancel={cancelJob}
          onLoadResult={loadJobResult}
          onShowResult={setResponse}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
