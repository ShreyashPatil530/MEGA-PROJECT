import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
 
  ResponsiveContainer,
 
} from 'recharts';
import { AnalysisResult } from '../types/index';
import { ChevronRight } from 'lucide-react';

interface ChartsProps {
  data: AnalysisResult | null;
  isLoading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Charts: React.FC<ChartsProps> = ({ data, isLoading = false }) => {
  const [selectedNumericColumn, setSelectedNumericColumn] = useState<string>('');
  const [selectedCategoricalColumn, setSelectedCategoricalColumn] = useState<string>('');

  if (!data) {
    return null;
  }

  const numericColumns = data.columns.filter(col => col.type === 'numeric').map(col => col.name);
  const categoricalColumns = data.columns
    .filter(col => col.type === 'categorical')
    .map(col => col.name);

  // Set default selected columns
  const activeNumericColumn = selectedNumericColumn || numericColumns[0];
  const activeCategoricalColumn = selectedCategoricalColumn || categoricalColumns[0];

  // Prepare histogram data for numeric column
  const getHistogramData = () => {
    if (!activeNumericColumn || !data.numericData[activeNumericColumn]) return [];

    const values = data.numericData[activeNumericColumn];
    const bins = 10;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins;

    const binCounts = Array(bins).fill(0);
    values.forEach(val => {
      const binIndex = Math.min(Math.floor((val - min) / binSize), bins - 1);
      binCounts[binIndex]++;
    });

    return binCounts.map((count, idx) => ({
      range: `${(min + idx * binSize).toFixed(2)}-${(min + (idx + 1) * binSize).toFixed(2)}`,
      count,
    }));
  };

  // Prepare pie chart data for categorical column
  const getPieChartData = () => {
    if (!activeCategoricalColumn || !data.columnDistribution[activeCategoricalColumn]) return [];

    const distribution = data.columnDistribution[activeCategoricalColumn];
    return Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  };

  const histogramData = getHistogramData();
  const pieData = getPieChartData();

  return (
    <div className="space-y-8">
      {/* Numeric Columns Charts */}
      {numericColumns.length > 0 && (
        <div>
          <h2 className="section-title">
            <ChevronRight className="w-6 h-6" />
            Numeric Data Visualization
          </h2>

          <div className="mb-4 flex flex-wrap gap-2">
            {numericColumns.map(col => (
              <button
                key={col}
                onClick={() => setSelectedNumericColumn(col)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeNumericColumn === col
                    ? 'badge-blue'
                    : 'badge bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Histogram */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Histogram</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={histogramData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Statistics Card */}
            <div className="card space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Statistics</h3>
              {data.stats[activeNumericColumn] && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Mean</span>
                    <span className="font-semibold text-lg">
                      {data.stats[activeNumericColumn].mean.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Median</span>
                    <span className="font-semibold text-lg">
                      {data.stats[activeNumericColumn].median.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Std Dev</span>
                    <span className="font-semibold text-lg">
                      {data.stats[activeNumericColumn].std.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Min</span>
                    <span className="font-semibold text-lg">
                      {data.stats[activeNumericColumn].min.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Max</span>
                    <span className="font-semibold text-lg">
                      {data.stats[activeNumericColumn].max.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Categorical Columns Charts */}
      {categoricalColumns.length > 0 && (
        <div>
          <h2 className="section-title">
            <ChevronRight className="w-6 h-6" />
            Categorical Data Visualization
          </h2>

          <div className="mb-4 flex flex-wrap gap-2">
            {categoricalColumns.map(col => (
              <button
                key={col}
                onClick={() => setSelectedCategoricalColumn(col)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeCategoricalColumn === col
                    ? 'badge-blue'
                    : 'badge bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="card flex items-center justify-center">
              <div className="w-full">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Categories Count</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;