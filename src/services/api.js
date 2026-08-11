import { mockScanService } from './mockScanService';

export const scansApi = {
  createScan: async (targetDomain, config = {}) => {
    const scan = await mockScanService.createScan(targetDomain, config);
    return { data: scan };
  },

  listScans: async (params = {}) => {
    const scans = mockScanService.getScans();
    return { data: scans };
  },

  getScan: async (scanId) => {
    const scan = mockScanService.getScanById(scanId);
    return { data: scan };
  },

  deleteScan: async (scanId) => {
    mockScanService.deleteScan(scanId);
    return { data: { message: 'Deleted' } };
  },

  cancelScan: async (scanId) => {
    return { data: { message: 'Cancelled' } };
  },

  listSubdomains: async (scanId, params = {}) => {
    const subs = mockScanService.getSubdomains(scanId);
    return { data: subs };
  },

  getSubdomainDetail: async (scanId, subdomainId) => {
    const subs = mockScanService.getSubdomains(scanId);
    const sub = subs.find((s) => s._id === subdomainId || s.subdomain === subdomainId);
    return { data: sub };
  },

  getFindings: async (scanId) => {
    const subs = mockScanService.getSubdomains(scanId);
    const findings = subs.flatMap((s) => s.findings || []);
    return { data: { findings, total: findings.length } };
  },

  compareScans: async (scanId, targetScanId) => {
    const subsA = mockScanService.getSubdomains(scanId).map((s) => s.subdomain);
    const subsB = mockScanService.getSubdomains(targetScanId).map((s) => s.subdomain);
    const setA = new Set(subsA);
    const setB = new Set(subsB);
    return {
      data: {
        scan_a_id: scanId,
        scan_b_id: targetScanId,
        added_subdomains: Array.from(setB).filter((x) => !setA.has(x)),
        removed_subdomains: Array.from(setA).filter((x) => !setB.has(x)),
        status_changes: [],
        ip_changes: []
      }
    };
  },

  getExportUrl: (scanId, format) => {
    return `#export-${format}-${scanId}`;
  },

  exportData: (scanId, format) => {
    const scan = mockScanService.getScanById(scanId);
    const subdomains = mockScanService.getSubdomains(scanId);
    const target = scan ? scan.target_domain : 'export';

    if (format === 'txt') {
      const txt = subdomains.map((s) => s.subdomain).join('\n');
      downloadFile(txt, `subscan_${target}.txt`, 'text/plain');
    } else if (format === 'csv') {
      let csv = 'Subdomain,Status,IP Addresses,CNAME,Sources\n';
      subdomains.forEach((s) => {
        const ips = (s.dns_records?.A || []).join(';');
        const cnames = (s.dns_records?.CNAME || []).join(';');
        csv += `"${s.subdomain}","${s.status}","${ips}","${cnames}","${(s.sources || []).join(';')}"\n`;
      });
      downloadFile(csv, `subscan_${target}.csv`, 'text/csv');
    } else if (format === 'json') {
      const json = JSON.stringify({ scan, subdomains }, null, 2);
      downloadFile(json, `subscan_${target}.json`, 'application/json');
    } else if (format === 'html') {
      let rows = subdomains.map((s) => `<tr><td>${s.subdomain}</td><td>${s.status}</td><td>${(s.dns_records?.A || []).join(', ')}</td></tr>`).join('');
      const html = `<!DOCTYPE html><html><head><title>SUBSCAN Report - ${target}</title><style>body{font-family:sans-serif;padding:20px;background:#0b0f19;color:#e5e7eb;}table{width:100%;border-collapse:collapse;}th,td{padding:8px;border:1px solid #1f2937;}</style></head><body><h1>SUBSCAN Report - ${target}</h1><table><thead><tr><th>Subdomain</th><th>Status</th><th>IP Addresses</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
      downloadFile(html, `subscan_${target}.html`, 'text/html');
    }
  }
};

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
