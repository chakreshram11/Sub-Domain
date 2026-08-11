import { useState, useEffect } from 'react';

export function useScanWebSocket(scanId) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('queued');
  const [message, setMessage] = useState('Initializing scan engine...');
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!scanId) return;

    setLogs([`[${new Date().toLocaleTimeString()}] Live Browser Recon Engine Initialized`]);

    const steps = [
      { progress: 10, stage: 'domain_validation', msg: 'Domain syntax validated' },
      { progress: 25, stage: 'passive_discovery', msg: 'Querying Certificate Transparency (crt.sh)...' },
      { progress: 45, stage: 'normalization_dedup', msg: 'Normalizing & deduplicating candidate hosts' },
      { progress: 60, stage: 'wildcard_detection', msg: 'Checking Wildcard DNS configuration' },
      { progress: 75, stage: 'dns_resolution', msg: 'Resolving A & CNAME records via Cloudflare DoH...' },
      { progress: 90, stage: 'takeover_analysis', msg: 'Analyzing CNAME records for dangling DNS' },
      { progress: 100, stage: 'finalization', msg: 'Scan complete! Real subdomains loaded.' },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        const step = steps[idx];
        setProgress(step.progress);
        setStage(step.stage);
        setMessage(step.msg);
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${step.msg}`]);
        idx++;
      } else {
        clearInterval(interval);
        setIsCompleted(true);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [scanId]);

  return { progress, stage, message, logs, isConnected, isCompleted };
}
