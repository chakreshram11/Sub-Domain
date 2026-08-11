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

  exportData: (scanId, format, subdomainsList = null, targetDomainName = null) => {
    const scan = mockScanService.getScanById(scanId);
    const subdomains = (subdomainsList && subdomainsList.length > 0)
      ? subdomainsList
      : mockScanService.getSubdomains(scanId);

    const target = targetDomainName || (scan ? scan.target_domain : 'target_domain');

    if (!subdomains || subdomains.length === 0) {
      alert('No subdomain records available to export.');
      return;
    }

    const fmt = format.toLowerCase();

    if (fmt === 'txt') {
      const txt = subdomains.map((s) => s.subdomain).join('\n');
      downloadFile(txt, `subscan_${target}.txt`, 'text/plain;charset=utf-8');
    } else if (fmt === 'csv') {
      let csv = 'Subdomain,Status,HTTP Status,IP Addresses,CNAME,Title,Sources\n';
      subdomains.forEach((s) => {
        const httpStatus = s.http_result?.status_code || '';
        const title = (s.http_result?.title || '').replace(/"/g, '""');
        const ips = (s.dns_records?.A || []).join(';');
        const cnames = (s.dns_records?.CNAME || []).join(';');
        const sources = (s.sources || []).join(';');
        csv += `"${s.subdomain}","${s.status}","${httpStatus}","${ips}","${cnames}","${title}","${sources}"\n`;
      });
      downloadFile(csv, `subscan_${target}.csv`, 'text/csv;charset=utf-8');
    } else if (fmt === 'json') {
      const json = JSON.stringify({ scan: scan || { target_domain: target }, total: subdomains.length, subdomains }, null, 2);
      downloadFile(json, `subscan_${target}.json`, 'application/json;charset=utf-8');
    } else if (fmt === 'html') {
      let rows = subdomains.map((s) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1F2937;">${s.subdomain}</td>
          <td style="padding: 10px; border-bottom: 1px solid #1F2937; color: ${s.status === 'active' ? '#10B981' : '#6B7280'};">${(s.status || '').toUpperCase()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #1F2937;">${s.http_result?.status_code || '-'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #1F2937;">${(s.dns_records?.A || []).join(', ') || '-'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #1F2937;">${(s.dns_records?.CNAME || []).join(', ') || '-'}</td>
        </tr>
      `).join('');

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SUBSCAN Report - ${target}</title>
  <style>
    body { font-family: system-ui, sans-serif; background-color: #0B0F19; color: #E5E7EB; padding: 30px; margin: 0; }
    .card { background-color: #111827; border: 1px solid #1F2937; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    h1 { color: #06B6D4; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; background: #111827; border-radius: 8px; overflow: hidden; }
    th { background: #1F2937; color: #9CA3AF; text-align: left; padding: 12px 10px; font-size: 13px; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="card">
    <h1>SUBSCAN Reconnaissance Report</h1>
    <p><strong>Target Domain:</strong> ${target}</p>
    <p><strong>Total Subdomains:</strong> ${subdomains.length}</p>
    <p><strong>Generated Date:</strong> ${new Date().toLocaleString()}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Subdomain</th>
        <th>Status</th>
        <th>HTTP Code</th>
        <th>IP Addresses</th>
        <th>CNAME</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;
      downloadFile(html, `subscan_${target}.html`, 'text/html;charset=utf-8');
    }
  }
};

function downloadFile(content, fileName, mimeType) {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (e) {
    console.error('Download error:', e);
    alert('Failed to trigger file download.');
  }
}
