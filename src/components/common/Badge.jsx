import React from 'react';

export default function Badge({ children, variant = 'slate' }) {
  const variantMap = {
    active: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    inactive: 'bg-slate-800/80 text-slate-400 border-slate-700',
    cyan: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60',
    amber: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
    rose: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
    purple: 'bg-purple-950/80 text-purple-400 border-purple-800/60',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${
        variantMap[variant] || variantMap.slate
      }`}
    >
      {children}
    </span>
  );
}
