import React, { useCallback, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../api/axiosConfig';
import { AnalysisResult } from '../types/index';

interface FileUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete, isLoading = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (selectedFile: File): boolean => {
    if (!selectedFile) return false;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('❌ Please upload a CSV file');
      return false;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      setError('❌ File size must be less than 50MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('❌ Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.uploadCSV(file);

      if (response.success && response.data) {
        setSuccess(true);
        onAnalysisComplete(response.data);
        setFile(null);

        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to analyze CSV');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error uploading file');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClean = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const blob = await apiService.cleanCSV(file);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cleaned_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error cleaning file');
      console.error('Clean error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="w-full">
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`card border-2 border-dashed transition-all duration-300 ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
          }`}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Upload className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drag & drop your CSV file
          </h3>
          <p className="text-gray-600 mb-4">or click to browse</p>

          <label className="btn-primary cursor-pointer">
            Browse Files
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              disabled={loading || isLoading}
            />
          </label>

          <p className="text-sm text-gray-500 mt-4">
            Maximum file size: 50MB • Supported format: CSV
          </p>
        </div>
      </div>

      {/* Selected File Display */}
      {file && (
        <div className="mt-6 card bg-gray-50 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">CSV</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              disabled={loading || isLoading}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={handleUpload}
              disabled={loading || isLoading}
              className={`flex-1 btn-primary flex items-center justify-center gap-2 ${loading || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading || isLoading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Analyzing CSV...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Analyze
                </>
              )}
            </button>
            <button
              onClick={handleClean}
              disabled={loading || isLoading}
              className={`flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 ${loading || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading || isLoading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Clean & Download Dataset
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 fade-in">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Success!</h4>
            <p className="text-sm text-green-700 mt-1">
              {file ? 'File selected successfully' : 'CSV analyzed and saved'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;