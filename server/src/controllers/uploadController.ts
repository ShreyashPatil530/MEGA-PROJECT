import { Request, Response } from 'express';
import fs from 'fs';
import { parseAndAnalyzeCSV } from '../utils/csvParser';
import { UploadResponse } from '../types/index';
import AnalysisHistory from '../models/AnalysisHistory';

export async function uploadCSV(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        error: 'File is required'
      } as UploadResponse);
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    const analysisResult = await parseAndAnalyzeCSV(filePath, fileName);

    // Save analysis to MongoDB
    try {
      const analysis = new AnalysisHistory({
        fileName: analysisResult.fileName,
        fileSize: analysisResult.fileSize,
        totalRows: analysisResult.totalRows,
        totalColumns: analysisResult.totalColumns,
        analysisData: analysisResult,
        userAgent: req.get('user-agent'),
        ipAddress: req.ip,
      });

      await analysis.save();
      console.log('✅ Analysis saved to MongoDB');
    } catch (dbError: any) {
      console.error('⚠️  Failed to save to MongoDB:', dbError.message);
      // Continue even if DB save fails
    }

    // Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'CSV analyzed successfully',
      data: analysisResult
    } as UploadResponse);
  } catch (error: any) {
    // Clean up on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error processing CSV',
      error: error.message
    } as UploadResponse);
  }
}