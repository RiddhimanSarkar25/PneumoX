import React, { useState } from 'react';
import { ScanResult, ClassificationResult } from '../types';
import { ArrowLeft, Download, Share2, Eye, EyeOff, FileText, Check, AlertTriangle } from 'lucide-react';

interface AnalysisViewProps {
  scan: ScanResult;
  onBack: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ scan, onBack }) => {
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Helper to determine status color
  const getStatusColor = (result: ClassificationResult) => {
    switch(result) {
      case ClassificationResult.NORMAL: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case ClassificationResult.BACTERIAL: return 'text-orange-600 bg-orange-50 border-orange-200';
      case ClassificationResult.VIRAL: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Scan Analysis: {scan.patientId}</h1>
            <p className="text-slate-500 text-sm">Processed on {new Date(scan.uploadDate).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            <Share2 size={18} />
            <span>Share</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg relative aspect-[4/3] group">
            {/* The X-Ray Image */}
            <img 
              src={scan.imageUrl} 
              alt="X-ray Scan" 
              className="w-full h-full object-contain" 
            />
            
            {/* Simulated Heatmap Overlay */}
            {/* 
               In a real app, this would be a heatmap image returned by the backend. 
               Here we simulate it with a radial gradient positioned roughly centrally or based on diagnosis.
            */}
            {showHeatmap && scan.classification !== ClassificationResult.NORMAL && (
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60"
                style={{
                  background: `radial-gradient(circle at 60% 60%, ${scan.classification === ClassificationResult.BACTERIAL ? 'orange' : 'red'}, transparent 40%)`
                }}
              />
            )}
             {showHeatmap && scan.classification !== ClassificationResult.NORMAL && (
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40"
                 style={{
                  background: `radial-gradient(circle at 60% 60%, ${scan.classification === ClassificationResult.BACTERIAL ? 'yellow' : 'magenta'}, transparent 50%)`
                }}
              />
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-slate-800/80 backdrop-blur-sm px-6 py-2 rounded-full text-white">
               <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
              >
                {showHeatmap ? <EyeOff size={18} /> : <Eye size={18} />}
                <span className="text-sm font-medium">{showHeatmap ? 'Hide AI Overlay' : 'Show AI Overlay'}</span>
              </button>
            </div>
          </div>
          
          <p className="text-center text-sm text-slate-500 italic">
            * Heatmap visualization highlights regions of interest used by the model for classification.
          </p>
        </div>

        {/* Diagnostic Panel */}
        <div className="space-y-6">
          {/* Classification Result Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Primary Diagnosis</h3>
            
            <div className={`p-4 rounded-lg border flex items-start space-x-3 mb-4 ${getStatusColor(scan.classification)}`}>
              {scan.classification === ClassificationResult.NORMAL ? (
                 <Check className="mt-1 flex-shrink-0" size={24} />
              ) : (
                 <AlertTriangle className="mt-1 flex-shrink-0" size={24} />
              )}
              <div>
                <p className="text-lg font-bold">{scan.classification}</p>
                <p className="text-sm opacity-90 mt-1">Confidence Score: {scan.confidenceScore}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Bacterial Probability</span>
                  <span className="font-medium text-slate-900">{scan.classification === ClassificationResult.BACTERIAL ? scan.confidenceScore : (100 - scan.confidenceScore) / 2}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${scan.classification === ClassificationResult.BACTERIAL ? scan.confidenceScore : (100 - scan.confidenceScore) / 2}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Viral Probability</span>
                  <span className="font-medium text-slate-900">{scan.classification === ClassificationResult.VIRAL ? scan.confidenceScore : (100 - scan.confidenceScore) / 2}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${scan.classification === ClassificationResult.VIRAL ? scan.confidenceScore : (100 - scan.confidenceScore) / 2}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Report Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
            <div className="flex items-center space-x-2 mb-4 text-blue-800">
              <FileText size={20} />
              <h3 className="font-bold">Automated Clinical Report</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {scan.report}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Generated by PneumoScan AI v2.1</span>
              <span>ID: {scan.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;