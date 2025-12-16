export interface PantoneColor {
  hex: string;
  pantoneName: string;
  pantoneCode: string;
  description?: string;
}

export interface AnalysisResult {
  colors: PantoneColor[];
}

export type UploadStatus = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
