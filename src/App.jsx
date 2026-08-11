import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import DashboardPage from './pages/DashboardPage';
import LiveScanPage from './pages/LiveScanPage';
import ScanHistoryPage from './pages/ScanHistoryPage';
import ScanComparePage from './pages/ScanComparePage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/scan/:scanId" element={<LiveScanPage />} />
            <Route path="/history" element={<ScanHistoryPage />} />
            <Route path="/compare" element={<ScanComparePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
