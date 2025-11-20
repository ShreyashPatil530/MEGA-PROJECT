import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AnalysisResult } from '../types/index';

interface DataPreviewProps {
  data: AnalysisResult | null;
  isLoading?: boolean;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="card">
        <h2 className="section-title">
          <ChevronRight className="w-6 h-6" />
          Data Preview
        </h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.preview || data.preview.length === 0) {
    return (
      <div className="card">
        <h2 className="section-title">
          <ChevronRight className="w-6 h-6" />
          Data Preview
        </h2>
        <p className="text-gray-600 text-center py-8">
          No data available. Please upload a CSV file.
        </p>
      </div>
    );
  }

  const columns = Object.keys(data.preview[0] || {});

  return (
    <div className="card overflow-hidden">
      <h2 className="section-title">
        <ChevronRight className="w-6 h-6" />
        Data Preview (First 10 Rows)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold text-gray-900 bg-gray-50"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.preview.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-200 hover:bg-blue-50 transition ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={`${idx}-${col}`}
                    className="px-4 py-3 text-gray-700"
                  >
                    {String(row[col] || '-').substring(0, 50)}
                    {String(row[col] || '').length > 50 ? '...' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        ℹ️ Showing first 10 rows of {data.totalRows} total rows
      </div>
    </div>
  );
};

export default DataPreview;