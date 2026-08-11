import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, ExternalLink, Calendar, Globe, Activity } from 'lucide-react';
import Badge from '../components/common/Badge';
import { scansApi } from '../services/api';
import { formatDate } from '../utils/formatters';

export default function ScanHistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    setLoading(true);
    try {
      const res = await scansApi.listScans({ limit: 50 });
      setScans(res.data);
    } catch (err) {
      console.error('Failed to load scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scanId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this scan and all discovered subdomains?')) {
      try {
        await scansApi.deleteScan(scanId);
        setScans(scans.filter((s) => s._id !== scanId));
      } catch (err) {
        alert('Failed to delete scan.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <History className="h-6 w-6 text-cyan-400" /> SCAN HISTORY LOGS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical repository of all past subdomain reconnaissance scans.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Target Domain</th>
                <th className="py-3 px-4">Scan ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Subdomains</th>
                <th className="py-3 px-4">Active Hosts</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 font-mono">
                    Loading scan history...
                  </td>
                </tr>
              ) : scans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 font-mono">
                    No scan history records found. Start a new scan from the dashboard.
                  </td>
                </tr>
              ) : (
                scans.map((scan) => {
                  const stats = scan.stats || {};
                  return (
                    <tr
                      key={scan._id}
                      onClick={() => navigate(`/`)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-100 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-cyan-400" />
                        {scan.target_domain}
                      </td>

                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {scan._id}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            scan.status === 'completed'
                              ? 'active'
                              : scan.status === 'running'
                              ? 'cyan'
                              : 'slate'
                          }
                        >
                          {scan.status.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {formatDate(scan.created_at)}
                      </td>

                      <td className="py-3 px-4 text-slate-200 font-bold">
                        {stats.total_subdomains || 0}
                      </td>

                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        {stats.active_hosts || 0}
                      </td>

                      <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleDelete(scan._id, e)}
                          title="Delete scan"
                          className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
