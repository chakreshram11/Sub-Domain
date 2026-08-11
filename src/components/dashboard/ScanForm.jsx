import React, { useState } from 'react';
import { Settings, ShieldAlert, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function ScanForm({ onStartScan, isLoading }) {
  const [targetDomain, setTargetDomain] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    passive_ct: true,
    wordlist_enum: true,
    http_probe: true,
    tls_analysis: true,
    tech_detection: true,
    takeover_check: true,
    max_dns_concurrency: 20,
    max_http_concurrency: 10,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetDomain.strip && !targetDomain.trim()) return;
    onStartScan(targetDomain.trim(), config);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              placeholder="Enter target domain (e.g. example.com)"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 pl-11 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 transition-all placeholder:text-slate-400"
              required
              disabled={isLoading}
            />
            <Sparkles className="absolute left-4 top-4 h-4 w-4 text-cyan-400/70" />
          </div>

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-300 text-sm font-medium flex items-center justify-center gap-2 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Options</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || !targetDomain.trim()}
            className="px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Launching...
              </span>
            ) : (
              <span>START SCAN</span>
            )}
          </button>
        </div>

        {/* Authorization Notice */}
        <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          Authorized scans only. Ensure you own or have explicit permission to assess target domain.
        </p>

        {/* Optional Scan Configuration Drawer */}
        {showConfig && (
          <div className="mt-5 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.passive_ct}
                onChange={(e) => setConfig({ ...config, passive_ct: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span>Certificate Transparency</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.wordlist_enum}
                onChange={(e) => setConfig({ ...config, wordlist_enum: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span>DNS Wordlist Enumeration</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.http_probe}
                onChange={(e) => setConfig({ ...config, http_probe: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span>HTTP/HTTPS Service Probing</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.tls_analysis}
                onChange={(e) => setConfig({ ...config, tls_analysis: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span>TLS Certificate Analysis</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.tech_detection}
                onChange={(e) => setConfig({ ...config, tech_detection: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span>Passive Technology Fingerprinting</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.takeover_check}
                onChange={(e) => setConfig({ ...config, takeover_check: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span>CNAME Dangling DNS Analysis</span>
            </label>
          </div>
        )}
      </form>
    </div>
  );
}
