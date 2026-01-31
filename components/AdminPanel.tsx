import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Settings, Database, Activity } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminPanel: React.FC = () => {
  const data = [
    { name: 'Mon', scans: 24 },
    { name: 'Tue', scans: 35 },
    { name: 'Wed', scans: 42 },
    { name: 'Thu', scans: 28 },
    { name: 'Fri', scans: 55 },
    { name: 'Sat', scans: 18 },
    { name: 'Sun', scans: 12 },
  ];

  const pieData = [
    { name: 'Normal', value: 400 },
    { name: 'Bacterial', value: 300 },
    { name: 'Viral', value: 300 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">System Administration</h1>
        <p className="text-slate-500 mt-1">Manage users and view system-wide analytics.</p>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Scan Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="scans" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Diagnosis Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 text-sm text-slate-600 mt-4">
             <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#0088FE]"></div>
                <span>Normal</span>
             </div>
             <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#00C49F]"></div>
                <span>Bacterial</span>
             </div>
             <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FFBB28]"></div>
                <span>Viral</span>
             </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="text-slate-400" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Authorized Personnel</h2>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Add New User
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Last Active</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: "Dr. Sarah Jenning", role: "Radiologist", active: "Now", status: "Active" },
              { name: "Dr. James Wilson", role: "Radiologist", active: "2h ago", status: "Active" },
              { name: "Admin System", role: "Administrator", active: "1d ago", status: "Active" },
            ].map((user, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4 text-slate-600">{user.role}</td>
                <td className="px-6 py-4 text-slate-500">{user.active}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600">
                    <Settings size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;