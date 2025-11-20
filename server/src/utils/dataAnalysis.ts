import { NumericStats, AnalysisResult, ColumnInfo } from '../types/index';

export function calculateNumericStats(values: number[]): NumericStats {
  const sorted = values.filter(v => !isNaN(v)).sort((a, b) => a - b);

  if (sorted.length === 0) {
    return { mean: 0, median: 0, std: 0, min: 0, max: 0, q1: 0, q3: 0, iqr: 0 };
  }

  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const std = Math.sqrt(sorted.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / sorted.length);

  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  return {
    mean: parseFloat(mean.toFixed(2)),
    median: parseFloat(median.toFixed(2)),
    std: parseFloat(std.toFixed(2)),
    min: Math.min(...sorted),
    max: Math.max(...sorted),
    q1: parseFloat(q1.toFixed(2)),
    q3: parseFloat(q3.toFixed(2)),
    iqr: parseFloat(iqr.toFixed(2))
  };
}

export function countOutliers(values: number[]): number {
  const sorted = values.filter(v => !isNaN(v)).sort((a, b) => a - b);
  if (sorted.length < 4) return 0;

  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return sorted.filter(v => v < lowerBound || v > upperBound).length;
}

export function calculateMissingPercentage(data: Record<string, any>[]): { count: number; percentage: number } {
  let missingCount = 0;
  const totalCells = data.length * Object.keys(data[0] || {}).length;

  for (const row of data) {
    for (const value of Object.values(row)) {
      if (value === null || value === undefined || value === '') {
        missingCount++;
      }
    }
  }

  return {
    count: missingCount,
    percentage: totalCells > 0 ? (missingCount / totalCells) * 100 : 0
  };
}

export function calculateDuplicatePercentage(data: Record<string, any>[]): number {
  if (data.length < 2) return 0;

  const jsonStrings = data.map(row => JSON.stringify(row));
  const uniqueRows = new Set(jsonStrings);

  return ((data.length - uniqueRows.size) / data.length) * 100;
}

export function getColumnDistribution(data: Record<string, any>[], column: string): Record<string, number> {
  const distribution: Record<string, number> = {};

  for (const row of data) {
    const value = String(row[column] || 'null');
    distribution[value] = (distribution[value] || 0) + 1;
  }

  return distribution;
}