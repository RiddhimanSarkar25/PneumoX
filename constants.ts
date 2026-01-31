import { ScanResult, ClassificationResult } from './types';

export const MOCK_SCANS: ScanResult[] = [
  {
    id: 'SCN-1001',
    patientId: 'PT-8923',
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    imageUrl: 'https://picsum.photos/400/400?grayscale&random=1',
    classification: ClassificationResult.NORMAL,
    confidenceScore: 98.5,
    report: 'No significant abnormalities detected. Lung fields are clear.',
    status: 'Completed',
  },
  {
    id: 'SCN-1002',
    patientId: 'PT-4421',
    uploadDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    imageUrl: 'https://picsum.photos/400/400?grayscale&random=2',
    classification: ClassificationResult.BACTERIAL,
    confidenceScore: 89.2,
    report: 'Focal consolidation observed in the right lower lobe, consistent with bacterial pneumonia.',
    status: 'Completed',
  },
  {
    id: 'SCN-1003',
    patientId: 'PT-1102',
    uploadDate: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/400/400?grayscale&random=3',
    classification: ClassificationResult.VIRAL,
    confidenceScore: 92.1,
    report: 'Diffuse interstitial infiltrates noted bilaterally. Suggestive of viral etiology.',
    status: 'Completed',
  },
];

export const APP_COLORS = {
  primary: 'blue-600',
  secondary: 'slate-100',
  accent: 'sky-500',
  danger: 'red-500',
  success: 'emerald-500',
};