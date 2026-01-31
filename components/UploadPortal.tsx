import React, { useState, useRef } from 'react';
import { Upload, X, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { analyzeXrayImage } from '../services/geminiService';
import { ScanResult, ClassificationResult } from '../types';

interface UploadPortalProps {
  onScanComplete: (result: ScanResult) => void;
}

const UploadPortal: React.FC<UploadPortalProps> = ({ onScanComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [patientId, setPatientId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !patientId || !preview) return;

    setIsAnalyzing(true);
    
    // Convert base64 for API (remove header)
    const base64Data = preview.split(',')[1];
    
    try {
      const result = await analyzeXrayImage(base64Data);
      
      const newScan: ScanResult = {
        id: `SCN-${Math.floor(Math.random() * 10000)}`,
        patientId: patientId,
        uploadDate: new Date().toISOString(),
        imageUrl: preview,
        classification: result.classification,
        confidenceScore: result.confidence,
        report: result.report,
        status: 'Completed'
      };

      onScanComplete(newScan);
    } catch (error) {
      console.error("Analysis error", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">New Scan Upload</h1>
        <p className="text-slate-500 mt-1">Upload an X-ray image for AI-powered analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <label className="block text-sm font-medium text-slate-700 mb-2">Patient Identifier</label>
             <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter Patient ID (e.g. PT-12345)"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
          </div>

          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors min-h-[300px] ${
              preview ? 'border-blue-300 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={preview} alt="Preview" className="max-h-[400px] rounded-lg shadow-sm" />
                <button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900">Drag and drop your scan here</p>
                  <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG (Max 10MB)</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Browse Files
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg" 
                  className="hidden" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Analysis Configuration</h3>
            
            <div className="space-y-4 flex-1">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <ImageIcon className="text-blue-600 mt-0.5" size={18} />
                <p className="text-sm text-blue-800">
                  Model: <span className="font-semibold">PneumoNet v2.5 (Gemini)</span><br/>
                  <span className="text-xs opacity-75">Optimized for Chest Radiography</span>
                </p>
              </div>
              
              <div className="text-sm text-slate-600 space-y-2">
                <p>• High-resolution heatmap generation</p>
                <p>• Multi-class classification</p>
                <p>• Automated report drafting</p>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || !patientId || isAnalyzing}
              className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-lg transition-all ${
                !file || !patientId || isAnalyzing
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Run Analysis</span>
                  <ArrowRight size={24} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPortal;