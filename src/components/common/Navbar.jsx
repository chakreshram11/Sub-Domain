import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Radar, History, GitCompare, FileText } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Radar },
    { path: '/history', label: 'Scan History', icon: History },
    { path: '/compare', label: 'Compare Scans', icon: GitCompare },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-colors">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <span className="font-mono font-bold text-lg tracking-wider text-slate-100 flex items-center gap-2">
                  SUBSCAN
                  <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    SOC v1.0
                  </span>
                </span>
                <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
                  Attack Surface Reconnaissance Platform
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 shadow-sm shadow-cyan-950'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
