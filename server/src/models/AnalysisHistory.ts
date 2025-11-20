import mongoose, { Schema, Document } from 'mongoose';
import { AnalysisResult } from '../types/index';

export interface IAnalysisHistory extends Document {
  fileName: string;
  fileSize: number;
  totalRows: number;
  totalColumns: number;
  analysisData: AnalysisResult;
  uploadedAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

const analysisHistorySchema = new Schema<IAnalysisHistory>(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    totalRows: {
      type: Number,
      required: true,
    },
    totalColumns: {
      type: Number,
      required: true,
    },
    analysisData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    userAgent: String,
    ipAddress: String,
  },
  { timestamps: true }
);

// Auto-delete old records after 30 days
analysisHistorySchema.index(
  { uploadedAt: 1 },
  { expireAfterSeconds: 2592000 } // 30 days
);

const AnalysisHistory = mongoose.model<IAnalysisHistory>(
  'AnalysisHistory',
  analysisHistorySchema
);

export default AnalysisHistory;