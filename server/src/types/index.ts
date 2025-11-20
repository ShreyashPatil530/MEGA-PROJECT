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