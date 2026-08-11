import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Activity, ShieldAlert, Cpu, Server, Wifi, FileText, Download } from 'lucide-react';
import ScanForm from '../components/dashboard/ScanForm';
import StatCard from '../components/common/StatCard';
import DashboardCharts from '../components/charts/DashboardCharts';
import SubdomainTable from '../components/subdomains/SubdomainTable';
import SubdomainDetailModal from '../components/subdomains/SubdomainDetailModal';
import { scansApi } from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [activeScan, setActiveScan] = useState(null);
  const [subdomains, setSubdomains] = useState([]);
  const [selectedSubdomain, setSelectedSubdomain] = useState(null);

  useEffect(() => {
    fetchLatestScans();
  }, []);

  const fetchLatestScans = async () => {
    try {
      const res = await scansApi.listScans({ limit: 5 });
      setRecentScans(res.data);
      if (res.data.length > 0) {
        const latest = res.data[0];
        setActiveScan(latest);
        fetchSubdomains(latest._id);
      }
    } catch (err) {
      console.error('Failed to fetch scans:', err);
    }
  };

  const fetchSubdomains = async (scanId) => {
    try {
      const res = await scansApi.listSubdomains(scanId, { limit: 200 });
      setSubdomains(res.data);
    } catch (err) {
      console.error('Failed to fetch subdomains:', err);
    }
  };

  const handleStartScan = async (targetDomain, config) => {
    setIsScanLoading(true);
    try {
      const res = await scansApi.createScan(targetDomain, config);
      const newScan = res.data;
      navigate(`/scan/${newScan._id}`);
    } catch (err) {
      alert('Failed to start scan.');
    } finally {
      setIsScanLoading(false);
    }
  };

  const handleExport = (format) => {
    if (activeScan) {
      scansApi.exportData(activeScan._id, format, subdomains, activeScan.target_domain);
    } else {
      alert('No active scan available for export.');
    }
  };

  const stats = activeScan?.stats || {
    total_subdomains: 0,
    active_hosts: 0,
    inactive_hosts: 0,
    unique_ips: 0,
    http_count: 0,
    https_count: 0,
    cname_count: 0,
    findings_count: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Target Domain Input Banner */}
      <div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-3">
            ATTACK SURFACE DISCOVERY PLATFORM
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time client-side subdomain discovery, DoH resolution, and dangling CNAME risk analysis.
          </p>
        </div>

        <ScanForm onStartScan={handleStartScan} isLoading={isScanLoading} />
      </div>

      {/* KPI Stats Section */}
      {activeScan && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              Active Recon Summary — <span className="text-cyan-400">{activeScan.target_domain}</span>
            </h2>

            <div className="flex items-center gap-2">
              {['TXT', 'CSV', 'JSON', 'HTML'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleExport(fmt)}
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" /> {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <StatCard title="Subdomains" value={stats.total_subdomains} icon={Globe} color="cyan" />
            <StatCard title="Active Hosts" value={stats.active_hosts} icon={Activity} color="emerald" />
            <StatCard title="Inactive Hosts" value={stats.inactive_hosts} icon={Server} color="slate" />
            <StatCard title="Unique IPs" value={stats.unique_ips} icon={Wifi} color="purple" />
            <StatCard title="HTTP Services" value={stats.http_count} icon={Globe} color="cyan" />
            <StatCard title="HTTPS Services" value={stats.https_count} icon={Globe} color="emerald" />
            <StatCard title="CNAME Records" value={stats.cname_count} icon={Server} color="amber" />
            <StatCard title="Potential Issues" value={stats.findings_count} icon={ShieldAlert} color="rose" />
          </div>

          {/* Charts Visualizations */}
          <DashboardCharts subdomains={subdomains} />

          {/* Master Subdomain Data Table */}
          <div className="mt-8">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">
              Discovered Subdomain Assets ({subdomains.length})
            </h3>
            <SubdomainTable subdomains={subdomains} onSelectSubdomain={(sub) => setSelectedSubdomain(sub)} />
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedSubdomain && (
        <SubdomainDetailModal subdomain={selectedSubdomain} onClose={() => setSelectedSubdomain(null)} />
      )}
    </div>
  );
}
