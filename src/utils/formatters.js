export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getStatusBadgeColor(statusCode) {
  if (!statusCode) return 'bg-slate-800 text-slate-400 border-slate-700';
  if (statusCode >= 200 && statusCode < 300) return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
  if (statusCode >= 300 && statusCode < 400) return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60';
  if (statusCode >= 400 && statusCode < 500) return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
  if (statusCode >= 500) return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
  return 'bg-slate-800 text-slate-300 border-slate-700';
}
