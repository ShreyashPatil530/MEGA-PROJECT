export interface ColumnInfo {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'boolean' | 'unknown';
  uniqueValues?: number;
}

export interface NumericStats {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
}

export interface AnalysisResult {
  fileName: string;
  fileSize: number;
  totalRows: number;
  totalColumns: number;
  columns: ColumnInfo[];
  missingCount: number;
  missingPercentage: number;
  duplicateRowsPercentage: number;
  completenessScore: number;
  numericColumns: number;
  categoricalColumns: number;
  outlierCount: number;
  stats: Record<string, NumericStats>;
  preview: Record<string, any>[];
  columnDistribution: Record<string, Record<string, number>>;
  numericData: Record<string, number[]>;
  categoricalData: Record<string, string[]>;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: AnalysisResult;
  error?: string;
}

export interface AnalysisHistoryItem {
  _id: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  totalColumns: number;
  uploadedAt: string;
  analysisData: AnalysisResult;
}

export interface KPIData {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  unit?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}
