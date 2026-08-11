import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, XCircle, Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useScanWebSocket } from '../hooks/useScanWebSocket';
import { scansApi } from '../services/api';

export default function LiveScanPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();

  const { progress, stage, message, logs, isCompleted } = useScanWebSocket(scanId);

  const stagesList = [
    { id: 'domain_validation', label: 'Domain Validation' },
    { id: 'passive_discovery', label: 'Passive Subdomain Discovery' },
    { id: 'normalization_dedup', label: 'Candidate Normalization & Deduplication' },
    { id: 'wildcard_detection', label: 'Wildcard DNS Detection' },
    { id: 'dns_resolution', label: 'Async DNS Resolution' },
    { id: 'http_probing', label: 'HTTP / HTTPS Probing' },
    { id: 'tls_analysis', label: 'TLS Certificate Analysis' },
    { id: 'technology_detection', label: 'Technology Stack Fingerprinting' },
    { id: 'takeover_analysis', label: 'CNAME & Dangling DNS Analysis' },
    { id: 'finalization', label: 'Report Finalization' },
  ];

  const getCurrentStageIndex = () => {
    return stagesList.findIndex((s) => s.id === stage);
  };

  const currentIdx = getCurrentStageIndex();

  const handleCancelScan = async () => {
    if (window.confirm('Are you sure you want to cancel this live scan?')) {
      try {
        await scansApi.cancelScan(scanId);
      } catch (err) {
        console.error('Failed to cancel scan:', err);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-mono">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            LIVE RECONNAISSANCE SCAN IN PROGRESS
          </span>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Scan ID: {scanId}</h1>
          <p className="text-xs text-slate-400 mt-1">{message}</p>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" /> VIEW DASHBOARD RESULTS
            </button>
          ) : (
            <button
              onClick={handleCancelScan}
              className="px-5 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-medium text-xs transition-all flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" /> CANCEL SCAN
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
          <span>PROGRESS ENGINE</span>
          <span className="text-cyan-400">{progress}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
          <div
            className="bg-cyan-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Grid: Stages Checklist & Terminal Console */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Stage Checklist */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Recon Stages Lifecycle
          </h2>

          <div className="space-y-3">
            {stagesList.map((st, idx) => {
              let isDone = idx < currentIdx || isCompleted;
              let isCurrent = idx === currentIdx && !isCompleted;

              return (
                <div
                  key={st.id}
                  className={`flex items-center space-x-3 text-xs p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-800/80 text-cyan-300'
                      : isDone
                      ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                      : 'bg-slate-950/20 border-slate-900 text-slate-400 opacity-60'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                  <span className="font-medium">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal Log Output */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[480px]">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/80 text-xs text-slate-400 font-bold">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span>LIVE RECON STREAM LOGS</span>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-1.5 font-mono text-[11px] text-slate-300 pr-2">
            {logs.length === 0 ? (
              <p className="text-slate-400 italic">Listening for live WebSocket events...</p>
            ) : (
              logs.map((logMsg, i) => (
                <div key={i} className="text-slate-300 leading-relaxed font-mono">
                  {logMsg}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
