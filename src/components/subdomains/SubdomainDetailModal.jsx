import React, { useState } from 'react';
import { X, ShieldAlert, Globe, Server, Lock, Cpu, AlertTriangle, ExternalLink } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export default function SubdomainDetailModal({ subdomain, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!subdomain) return null;

  const dns = subdomain.dns_records || {};
  const http = subdomain.http_result || {};
  const tls = subdomain.tls_info || {};
  const techs = subdomain.technologies || [];
  const findings = subdomain.findings || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold font-mono text-slate-100">{subdomain.subdomain}</h2>
              <Badge variant={subdomain.status === 'active' ? 'active' : 'inactive'}>
                {subdomain.status?.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Discovered via: {(subdomain.sources || []).join(', ')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 pt-3 border-b border-slate-800 flex space-x-6 text-xs font-mono">
          {[
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'dns', label: 'DNS Records', icon: Server },
            { id: 'http', label: 'HTTP Response', icon: Globe },
            { id: 'tls', label: 'TLS / Certificate', icon: Lock },
            { id: 'tech', label: 'Technologies', icon: Cpu },
            { id: 'findings', label: `Findings (${findings.length})`, icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 flex items-center gap-2 border-b-2 font-medium transition-all ${
                  isActive
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-[11px]">Subdomain Hostname</span>
                  <p className="text-slate-100 font-bold text-sm mt-1">{subdomain.subdomain}</p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-[11px]">Root Domain</span>
                  <p className="text-slate-100 font-bold text-sm mt-1">{subdomain.target_domain}</p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-[11px]">Active HTTP URL</span>
                  <p className="text-cyan-400 font-bold text-sm mt-1 flex items-center gap-1">
                    {http.url || 'N/A'}
                    {http.url && (
                      <a href={http.url} target="_blank" rel="noreferrer" className="hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-[11px]">Discovered Date</span>
                  <p className="text-slate-100 font-bold text-sm mt-1">{formatDate(subdomain.created_at)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dns' && (
            <div className="space-y-4">
              {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map((recType) => (
                <div key={recType} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-cyan-400 font-bold text-xs uppercase">{recType} Records</span>
                  <div className="mt-2 space-y-1 text-slate-200">
                    {(dns[recType] || []).length === 0 ? (
                      <p className="text-slate-400 italic">No {recType} records found.</p>
                    ) : (
                      dns[recType].map((val, idx) => (
                        <p key={idx} className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800/60 font-mono">
                          {val}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'http' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Status Code</span>
                  <p className="text-lg font-bold text-cyan-400 mt-1">{http.status_code || '-'}</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Response Time</span>
                  <p className="text-lg font-bold text-slate-100 mt-1">{http.response_time ? `${http.response_time}s` : '-'}</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Server Header</span>
                  <p className="text-sm font-bold text-slate-100 mt-1 truncate">{http.server || '-'}</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Content Length</span>
                  <p className="text-sm font-bold text-slate-100 mt-1">{http.content_length || 0} bytes</p>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Page Title</span>
                <p className="text-slate-100 text-sm mt-1">{http.title || 'No Title Found'}</p>
              </div>

              {http.redirect_url && (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Redirect Location</span>
                  <p className="text-cyan-400 text-sm mt-1">{http.redirect_url}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tls' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">TLS / HTTPS Status</span>
                <p className="text-emerald-400 font-bold text-sm mt-1">
                  {tls.enabled ? 'TLS / HTTPS Enabled' : 'No TLS Certificate Detected'}
                </p>
              </div>

              {tls.enabled && (
                <>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Issuer</span>
                    <p className="text-slate-100 text-xs mt-1">{tls.issuer || '-'}</p>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Expiration Date</span>
                    <p className="text-slate-100 text-xs mt-1">
                      {tls.expiry_date} ({tls.days_to_expiry} days remaining)
                    </p>
                    {tls.expiring_soon && (
                      <p className="text-amber-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Certificate expiring in less than 30 days!
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-3">
              {techs.length === 0 ? (
                <p className="text-slate-400 italic">No technology fingerprints detected for this host.</p>
              ) : (
                techs.map((t, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-400">{t.name}</span>
                      <p className="text-[10px] text-slate-400">{t.category}</p>
                    </div>
                    <Badge variant="purple">Confidence: {t.confidence}</Badge>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'findings' && (
            <div className="space-y-4">
              {findings.length === 0 ? (
                <p className="text-slate-400 italic">No security risks or issues detected for this subdomain.</p>
              ) : (
                findings.map((f, idx) => (
                  <div key={idx} className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4" /> {f.title}
                      </span>
                      <Badge variant="amber">{f.severity?.toUpperCase()}</Badge>
                    </div>
                    <p className="text-slate-300 text-xs">{f.description}</p>
                    {f.evidence && (
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400 font-mono">
                        Evidence: {f.evidence}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
