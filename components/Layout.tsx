import React from 'react';
import { Activity, Upload, FileText, Settings, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: UserRole;
  toggleRole: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, userRole, toggleRole }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: string; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
        activeView === view
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm z-20 sticky top-0">
        <div className="flex items-center space-x-2 text-blue-700">
          <Activity size={24} />
          <span className="text-xl font-bold tracking-tight">PneumoScan AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-100 hidden md:flex items-center space-x-2 text-blue-700">
          <Activity size={28} />
          <span className="text-2xl font-bold tracking-tight">PneumoScan AI</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Clinical
          </div>
          <NavItem view="dashboard" icon={Activity} label="Dashboard" />
          <NavItem view="upload" icon={Upload} label="Upload Scan" />
          
          {userRole === UserRole.ADMIN && (
            <>
              <div className="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Management
              </div>
              <NavItem view="admin" icon={Settings} label="Admin Console" />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <UserIcon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Dr. Sarah Jenning</p>
              <p className="text-xs text-slate-500">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={toggleRole}
            className="w-full text-xs text-blue-600 hover:text-blue-800 hover:underline text-left mb-2 px-1"
          >
            Switch to {userRole === UserRole.ADMIN ? 'Radiologist' : 'Admin'} View (Demo)
          </button>
          <button className="w-full flex items-center space-x-2 text-slate-500 hover:text-red-600 transition-colors px-1">
            <LogOut size={16} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;