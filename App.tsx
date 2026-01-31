import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UploadPortal from './components/UploadPortal';
import AnalysisView from './components/AnalysisView';
import AdminPanel from './components/AdminPanel';
import { MOCK_SCANS } from './constants';
import { ScanResult, UserRole } from './types';

const App: React.FC = () => {
  // Global State
  const [activeView, setActiveView] = useState('dashboard');
  const [scans, setScans] = useState<ScanResult[]>(MOCK_SCANS);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.RADIOLOGIST);

  // Handlers
  const handleScanComplete = (newScan: ScanResult) => {
    setScans([newScan, ...scans]);
    setSelectedScan(newScan);
    setActiveView('analysis');
  };

  const handleViewScan = (scan: ScanResult) => {
    setSelectedScan(scan);
    setActiveView('analysis');
  };

  const toggleRole = () => {
    const newRole = userRole === UserRole.RADIOLOGIST ? UserRole.ADMIN : UserRole.RADIOLOGIST;
    setUserRole(newRole);
    setActiveView(newRole === UserRole.ADMIN ? 'admin' : 'dashboard');
  };

  // View Routing
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard scans={scans} onViewScan={handleViewScan} />;
      case 'upload':
        return <UploadPortal onScanComplete={handleScanComplete} />;
      case 'analysis':
        return selectedScan ? (
          <AnalysisView 
            scan={selectedScan} 
            onBack={() => setActiveView('dashboard')} 
          />
        ) : (
          <Dashboard scans={scans} onViewScan={handleViewScan} />
        );
      case 'admin':
        return userRole === UserRole.ADMIN ? <AdminPanel /> : <div className="p-4 text-red-600">Access Denied</div>;
      default:
        return <Dashboard scans={scans} onViewScan={handleViewScan} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      userRole={userRole}
      toggleRole={toggleRole}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;