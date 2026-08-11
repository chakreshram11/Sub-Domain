import React, { useState } from 'react';
import { Search, Copy, Check, Filter, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../common/Badge';
import { getStatusBadgeColor } from '../../utils/formatters';

export default function SubdomainTable({ subdomains = [], onSelectSubdomain }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedHost, setCopiedHost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const handleCopy = (host, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(host);
    setCopiedHost(host);
    setTimeout(() => setCopiedHost(null), 2000);
  };

  // Filtering
  const filteredSubdomains = subdomains.filter((item) => {
    // Status filter
    if (statusFilter === 'active' && item.status !== 'active') return false;
    if (statusFilter === 'inactive' && item.status !== 'inactive') return false;
    if (statusFilter === 'findings' && (!item.findings || item.findings.length === 0)) return false;
    if (statusFilter === 'cname' && (!item.dns_records?.CNAME || item.dns_records.CNAME.length === 0)) return false;

    // Search input
    if (search.trim()) {
      const q = search.toLowerCase();
      const hostMatch = item.subdomain.toLowerCase().includes(q);
      const ipMatch = (item.dns_records?.A || []).some((ip) => ip.includes(q));
      const cnameMatch = (item.dns_records?.CNAME || []).some((c) => c.toLowerCase().includes(q));
      const titleMatch = (item.http_result?.title || '').toLowerCase().includes(q);
      return hostMatch || ipMatch || cnameMatch || titleMatch;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubdomains.length / pageSize) || 1;
  const paginatedData = filteredSubdomains.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search subdomain, IP, CNAME, title..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 pl-10 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500/80"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-xs font-mono text-slate-400 shrink-0">Filter:</span>
          {['all', 'active', 'inactive', 'cname', 'findings'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setStatusFilter(filter);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Subdomain</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">HTTP</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4">CNAME</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Technologies</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-slate-400 font-mono">
                  No subdomains match the active criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const httpStatus = item.http_result?.status_code;
                const ips = item.dns_records?.A || [];
                const cnames = item.dns_records?.CNAME || [];
                const title = item.http_result?.title || '-';

                return (
                  <tr
                    key={item.subdomain}
                    onClick={() => onSelectSubdomain && onSelectSubdomain(item)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-2">
                      <span className="truncate max-w-[200px] sm:max-w-[240px]">{item.subdomain}</span>
                      <button
                        onClick={(e) => handleCopy(item.subdomain, e)}
                        title="Copy hostname"
                        className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
                      >
                        {copiedHost === item.subdomain ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={item.status === 'active' ? 'active' : 'inactive'}>
                        {item.status.upper ? item.status.toUpperCase() : item.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      {httpStatus ? (
                        <span className={`px-2 py-0.5 rounded text-[11px] border font-bold ${getStatusBadgeColor(httpStatus)}`}>
                          {httpStatus}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {ips.length > 0 ? (
                        <div className="flex flex-col">
                          <span>{ips[0]}</span>
                          {ips.length > 1 && (
                            <span className="text-[10px] text-slate-400">+{ips.length - 1} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-300 truncate max-w-[150px]">
                      {cnames.length > 0 ? cnames[0] : <span className="text-slate-400">-</span>}
                    </td>

                    <td className="py-3 px-4 text-slate-300 truncate max-w-[200px]" title={title}>
                      {title}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(item.technologies || []).slice(0, 2).map((t, idx) => (
                          <span key={idx} className="bg-purple-950/60 text-purple-300 border border-purple-800/40 text-[10px] px-1.5 py-0.5 rounded">
                            {t.name}
                          </span>
                        ))}
                        {(item.technologies || []).length > 2 && (
                          <span className="text-[10px] text-slate-400">+{item.technologies.length - 2}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSubdomain && onSelectSubdomain(item);
                        }}
                        className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <div>
          Showing {filteredSubdomains.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, filteredSubdomains.length)} of {filteredSubdomains.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-800 bg-slate-950 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-800 bg-slate-950 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
