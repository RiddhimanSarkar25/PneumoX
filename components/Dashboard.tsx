import React from 'react';
import { ScanResult, ClassificationResult } from '../types';
import { FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  scans: ScanResult[];
  onViewScan: (scan: ScanResult) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ scans, onViewScan }) => {
  const stats = {
    total: scans.length,
    abnormal: scans.filter(s => s.classification !== ClassificationResult.NORMAL).length,
    recent: scans.filter(s => {
      const date = new Date(s.uploadDate);
      const now = new Date();
      return (now.getTime() - date.getTime()) < 86400000; // 24 hours
    }).length
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Radiologist Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Dr. Jenning. Here is today's overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Scans</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Abnormal Findings</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.abnormal}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Last 24 Hours</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.recent}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Recent Scans</h2>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Patient ID</th>
                <th className="px-6 py-4 font-semibold">Date Uploaded</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Classification</th>
                <th className="px-6 py-4 font-semibold">Confidence</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{scan.patientId}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(scan.uploadDate).toLocaleDateString()} <span className="text-xs text-slate-400">{new Date(scan.uploadDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scan.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scan.classification === ClassificationResult.NORMAL 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {scan.classification}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {scan.confidenceScore}%
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onViewScan(scan)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;