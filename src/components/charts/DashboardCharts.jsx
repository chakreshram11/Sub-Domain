import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];

export default function DashboardCharts({ subdomains = [] }) {

  // 1. Active vs Inactive ratio
  const activeCount = subdomains.filter((s) => s.status === 'active').length;
  const inactiveCount = subdomains.length - activeCount;
  const statusRatioData = [
    { name: 'Active Hosts', value: activeCount },
    { name: 'Inactive Hosts', value: inactiveCount },
  ];

  // 2. HTTP Status Code breakdown
  const statusMap = {};
  subdomains.forEach((s) => {
    const code = s.http_result?.status_code;
    if (code) {
      statusMap[code] = (statusMap[code] || 0) + 1;
    }
  });
  const httpStatusData = Object.entries(statusMap).map(([code, count]) => ({
    code: `HTTP ${code}`,
    count,
  }));

  // 3. Discovery Sources breakdown
  const sourceMap = {};
  subdomains.forEach((s) => {
    (s.sources || []).forEach((src) => {
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });
  });
  const sourceData = Object.entries(sourceMap).map(([source, count]) => ({
    name: source.replace('_', ' ').toUpperCase(),
    value: count,
  }));

  // 4. Technology distribution
  const techMap = {};
  subdomains.forEach((s) => {
    (s.technologies || []).forEach((t) => {
      techMap[t.name] = (techMap[t.name] || 0) + 1;
    });
  });
  const techData = Object.entries(techMap)
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* Active vs Inactive Pie Chart */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
        <h3 className="text-sm font-mono font-semibold text-slate-200 uppercase tracking-wider mb-4">
          Host Availability Ratio
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusRatioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="cell-active" fill="#10B981" />
                <Cell key="cell-inactive" fill="#374151" />
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F3F4F6' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HTTP Status Code Distribution Bar Chart */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
        <h3 className="text-sm font-mono font-semibold text-slate-200 uppercase tracking-wider mb-4">
          HTTP Status Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={httpStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="code" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#06B6D4' }}
              />
              <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Discovery Source Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
        <h3 className="text-sm font-mono font-semibold text-slate-200 uppercase tracking-wider mb-4">
          Discovery Source Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Detected Technologies */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
        <h3 className="text-sm font-mono font-semibold text-slate-200 uppercase tracking-wider mb-4">
          Top Identified Technologies
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={techData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis dataKey="tech" type="category" stroke="#9CA3AF" tick={{ fontSize: 12 }} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
