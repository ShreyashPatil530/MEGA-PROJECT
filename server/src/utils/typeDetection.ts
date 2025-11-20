import { ColumnInfo } from '../types/index';

export function detectColumnType(values: any[]): ColumnInfo['type'] {
  if (values.length === 0) return 'unknown';

  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

  if (nonNullValues.length === 0) return 'unknown';

  // Check if boolean
  const boolValues = new Set(nonNullValues.map(v => String(v).toLowerCase()));
  if (boolValues.size <= 2 && (boolValues.has('true') || boolValues.has('false') || boolValues.has('yes') || boolValues.has('no'))) {
    return 'boolean';
  }

  // Check if date
  const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{1,2}\/\d{1,2}\/\d{2,4}/;
  if (nonNullValues.every(v => datePattern.test(String(v)))) {
    return 'date';
  }

  // Check if numeric
  const numericCount = nonNullValues.filter(v => !isNaN(parseFloat(v))).length;
  if (numericCount / nonNullValues.length > 0.8) {
    return 'numeric';
  }

  return 'categorical';
}

export function getColumnInfo(column: string, values: any[]): ColumnInfo {
  const type = detectColumnType(values);
  const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined && v !== '').map(v => String(v))).size;

  return {
    name: column,
    type,
    uniqueValues
  };
}