import { useState, useCallback } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CredentialsBar } from '@/components/CredentialsBar';
import { EndpointPicker } from '@/components/EndpointPicker';
import { RequestBuilder } from '@/components/RequestBuilder';
import { ResponsePanel } from '@/components/ResponsePanel';
import { JobTracker } from '@/components/JobTracker';
import { CrawlDetail } from '@/components/CrawlDetail';
import { useCredentials } from '@/lib/use-credentials';
import { useJobs } from '@/lib/use-jobs';
import { cfFetch } from '@/lib/api';
import type { Endpoint, EndpointRequest, ApiResponse, CrawlRequest } from '@/lib/types';

function App() {
  const { credentials, updateToken, updateAccountId, isValid } = useCredentials();
  const { jobs, addJob, pollJob, cancelJob, removeJob, clearTerminalJobs } =
    useJobs(credentials);

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
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

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
        const result = data?.result as string | undefined;
        const jobId = result || (data?.id as string | undefined);
        if (jobId) {
          const crawlBody = body as CrawlRequest;
          addJob(jobId, crawlBody.url);
          pollJob(jobId);
          setSelectedJobId(jobId);
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
    setSelectedJobId(null);
  }, []);

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

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

          {/* Middle: Response Panel */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {selectedJob ? (
              <CrawlDetail
                job={selectedJob}
                credentials={credentials}
                onBack={() => setSelectedJobId(null)}
              />
            ) : (
              <ResponsePanel
                response={response}
                credentials={credentials}
                endpoint={endpoint}
                body={body}
                loading={loading}
              />
            )}
          </div>

          {/* Right: Crawl History */}
          {endpoint === 'crawl' && (
            <div className="w-[280px] border-l flex flex-col min-h-0 overflow-hidden">
              <JobTracker
                jobs={jobs}
                selectedJobId={selectedJobId}
                onSelectJob={setSelectedJobId}
                onCancel={cancelJob}
                onRemove={removeJob}
                onClearTerminal={clearTerminalJobs}
              />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
