import React, { useState, useEffect } from 'react';
import { GitCompare, ArrowRight, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';
import Badge from '../components/common/Badge';
import { scansApi } from '../services/api';

export default function ScanComparePage() {
  const [scans, setScans] = useState([]);
  const [scanAId, setScanAId] = useState('');
  const [scanBId, setScanBId] = useState('');
  const [diffData, setDiffData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const res = await scansApi.listScans({ limit: 50 });
      setScans(res.data);
      if (res.data.length >= 2) {
        setScanAId(res.data[1]._id);
        setScanBId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load scans:', err);
    }
  };

  const handleCompare = async () => {
    if (!scanAId || !scanBId) return;
    setLoading(true);
    try {
      const res = await scansApi.compareScans(scanAId, scanBId);
      setDiffData(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to compare scans.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <GitCompare className="h-6 w-6 text-cyan-400" /> SCAN COMPARISON DIFF TOOL
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Compare two reconnaissance scans to analyze attack-surface changes over time.
        </p>
      </div>

      {/* Selector Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
        <div className="sm:col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Base Scan A (Older)</label>
          <select
            value={scanAId}
            onChange={(e) => setScanAId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select Scan A</option>
            {scans.map((s) => (
              <option key={s._id} value={s._id}>
                {s.target_domain} ({s._id}) - {new Date(s.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="h-5 w-5 text-cyan-400 hidden sm:block" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Target Scan B (Newer)</label>
          <select
            value={scanBId}
            onChange={(e) => setScanBId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select Scan B</option>
            {scans.map((s) => (
              <option key={s._id} value={s._id}>
                {s.target_domain} ({s._id}) - {new Date(s.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-5 flex justify-end">
          <button
            onClick={handleCompare}
            disabled={!scanAId || !scanBId || loading}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'COMPARING...' : 'RUN DIFFERENCE ANALYSIS'}
          </button>
        </div>
      </div>

      {/* Diff Results Output */}
      {diffData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Added Subdomains */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Newly Discovered Subdomains ({diffData.added_subdomains.length})
              </h3>
              <div className="space-y-1.5 text-xs text-slate-200">
                {diffData.added_subdomains.length === 0 ? (
                  <p className="text-slate-400 italic">No new subdomains added in Scan B.</p>
                ) : (
                  diffData.added_subdomains.map((sub) => (
                    <div key={sub} className="bg-slate-950 p-2 rounded border border-slate-800/60 text-emerald-400">
                      + {sub}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Removed Subdomains */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <MinusCircle className="h-4 w-4" /> Removed / Inactive Subdomains ({diffData.removed_subdomains.length})
              </h3>
              <div className="space-y-1.5 text-xs text-slate-200">
                {diffData.removed_subdomains.length === 0 ? (
                  <p className="text-slate-400 italic">No subdomains were removed in Scan B.</p>
                ) : (
                  diffData.removed_subdomains.map((sub) => (
                    <div key={sub} className="bg-slate-950 p-2 rounded border border-slate-800/60 text-rose-400">
                      - {sub}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
