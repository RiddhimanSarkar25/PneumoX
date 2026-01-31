export enum UserRole {
  RADIOLOGIST = 'Radiologist',
  ADMIN = 'Administrator'
}

export enum ClassificationResult {
  NORMAL = 'Normal',
  BACTERIAL = 'Bacterial Pneumonia',
  VIRAL = 'Viral Pneumonia'
}

export interface ScanResult {
  id: string;
  patientId: string;
  uploadDate: string; // ISO String
  imageUrl: string;
  classification: ClassificationResult;
  confidenceScore: number;
  report: string;
  status: 'Processing' | 'Completed' | 'Failed';
}

export interface AnalyticsData {
  totalScans: number;
  accuracy: number;
  bacterialCases: number;
  viralCases: number;
  normalCases: number;
}