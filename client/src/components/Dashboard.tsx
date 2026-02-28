import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { apiService } from '../api/axiosConfig';
import {
  BarChart3,
  Database,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Rows,
  Columns,
  Cpu,
  Download
} from 'lucide-react';
import FileUpload from './FileUpload';
import KPICard from './KPICard';
import DataPreview from './DataPreview';
import Charts from './Charts';
import { AnalysisResult, KPIData } from '../types/index';

const Dashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysis(result);
    setAiReport(null);
    setIsLoading(false);
  };

  const handleGenerateReport = async () => {
    if (!analysis) return;
    setIsGeneratingReport(true);
    try {
      const report = await apiService.generateReport(analysis);
      setAiReport(report);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate AI report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleDownloadReport = () => {
    if (!aiReport) return;
    const blob = new Blob([aiReport], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Report_${analysis?.fileName || 'dataset'}.md`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const kpiData: KPIData[] = analysis
    ? [
      {
        label: 'Total Rows',
        value: analysis.totalRows.toLocaleString(),
        icon: <Rows className="w-6 h-6 text-blue-600" />,
        color: 'text-blue-600',
      },
      {
        label: 'Total Columns',
        value: analysis.totalColumns,
        icon: <Columns className="w-6 h-6 text-green-600" />,
        color: 'text-green-600',
      },
      {
        label: 'Missing %',
        value: analysis.missingPercentage.toFixed(2),
        icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
        color: 'text-yellow-600',
        unit: '%',
      },
      {
        label: 'Duplicates %',
        value: analysis.duplicateRowsPercentage.toFixed(2),
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
        color: 'text-red-600',
        unit: '%',
      },
      {
        label: 'Numeric Columns',
        value: analysis.numericColumns,
        icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
        color: 'text-purple-600',
      },
      {
        label: 'Categorical Columns',
        value: analysis.categoricalColumns,
        icon: <Database className="w-6 h-6 text-indigo-600" />,
        color: 'text-indigo-600',
      },
      {
        label: 'Completeness',
        value: analysis.completenessScore.toFixed(2),
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        color: 'text-green-600',
        unit: '%',
      },
      {
        label: 'Outlier Count',
        value: analysis.outlierCount,
        icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
        color: 'text-orange-600',
      },
    ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="section-title text-4xl gradient-text">
            <BarChart3 className="w-8 h-8" />
            Data Explorer
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Upload your CSV files and get instant insights with advanced analytics
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8 fade-in">
          <FileUpload
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
          />
        </div>

        {/* File Information Section */}
        {analysis && (
          <div className="card mb-8 slide-in">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  {analysis.fileName}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                  <div>
                    <span className="font-semibold text-gray-900">File Size:</span>{' '}
                    {(analysis.fileSize / 1024).toFixed(2)} KB
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Rows:</span>{' '}
                    {analysis.totalRows.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Columns:</span>{' '}
                    {analysis.totalColumns}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Section */}
        {analysis && (
          <div className="mb-8">
            <h2 className="section-title mb-6">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, idx) => (
                <div key={idx} className="slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                  <KPICard kpi={kpi} isLoading={isLoading} />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className={`btn-primary px-8 py-3 text-lg font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all ${isGeneratingReport ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isGeneratingReport ? (
                  <div className="animate-spin text-white">⏳</div>
                ) : (
                  <Cpu className="w-6 h-6 text-yellow-300" />
                )}
                {isGeneratingReport ? 'Generating Groq AI Report...' : 'Generate Groq AI Report'}
              </button>
            </div>

            {aiReport && (
              <div className="mt-8 card slide-in bg-white border-2 border-blue-100">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-blue-600" />
                    AI Analysis Report
                  </h2>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <ReactMarkdown>{aiReport}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Preview Section */}
        {analysis && (
          <div className="mb-8 fade-in">
            <DataPreview data={analysis} isLoading={isLoading} />
          </div>
        )}

        {/* Charts Section */}
        {analysis && (
          <div className="fade-in">
            <Charts data={analysis} isLoading={isLoading} />
          </div>
        )}

        {/* Empty State */}
        {!analysis && (
          <div className="card text-center py-16">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No data analyzed yet
            </h3>
            <p className="text-gray-600">
              Upload a CSV file to get started with data analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;