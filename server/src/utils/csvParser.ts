import fs from 'fs';
import csvParser from 'csv-parser';
import { getColumnInfo } from './typeDetection';
import { calculateNumericStats, countOutliers, calculateMissingPercentage, calculateDuplicatePercentage, getColumnDistribution } from './dataAnalysis';
import { AnalysisResult, ColumnInfo } from '../types/index';

export async function parseAndAnalyzeCSV(filePath: string, fileName: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const data: Record<string, any>[] = [];
    const columnValues: Record<string, any[]> = {};

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('headers', (headers: string[]) => {
        headers.forEach(header => {
          columnValues[header] = [];
        });
      })
      .on('data', (row: Record<string, any>) => {
        data.push(row);
        Object.keys(row).forEach(key => {
          columnValues[key].push(row[key]);
        });
      })
      .on('end', () => {
        try {
          const fileStats = fs.statSync(filePath);
          const columns = Object.keys(columnValues).map(col => getColumnInfo(col, columnValues[col]));

          const numericColumns = columns.filter(col => col.type === 'numeric').length;
          const categoricalColumns = columns.filter(col => col.type === 'categorical').length;

          const { count: missingCount, percentage: missingPercentage } = calculateMissingPercentage(data);
          const duplicatePercentage = calculateDuplicatePercentage(data);
          const completenessScore = 100 - missingPercentage;

          const stats: Record<string, any> = {};
          const numericData: Record<string, number[]> = {};
          let totalOutliers = 0;

          columns.forEach(col => {
            if (col.type === 'numeric') {
              const numValues = columnValues[col.name]
                .map((v: any) => parseFloat(v))
                .filter((v: number) => !isNaN(v));

              stats[col.name] = calculateNumericStats(numValues);
              numericData[col.name] = numValues;
              totalOutliers += countOutliers(numValues);
            }
          });

          const categoricalData: Record<string, string[]> = {};
          columns.forEach(col => {
            if (col.type === 'categorical') {
              categoricalData[col.name] = columnValues[col.name].map((v: any) => String(v));
            }
          });

          const columnDistribution: Record<string, Record<string, number>> = {};
          columns.forEach(col => {
            if (col.type === 'categorical') {
              columnDistribution[col.name] = getColumnDistribution(data, col.name);
            }
          });

          const preview = data.slice(0, 10);

          const result: AnalysisResult = {
            fileName,
            fileSize: fileStats.size,
            totalRows: data.length,
            totalColumns: columns.length,
            columns,
            missingCount,
            missingPercentage: parseFloat(missingPercentage.toFixed(2)),
            duplicateRowsPercentage: parseFloat(duplicatePercentage.toFixed(2)),
            completenessScore: parseFloat(completenessScore.toFixed(2)),
            numericColumns,
            categoricalColumns,
            outlierCount: totalOutliers,
            stats,
            preview,
            columnDistribution,
            numericData,
            categoricalData
          };

          resolve(result);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error: any) => {
        reject(error);
      });
  });
}