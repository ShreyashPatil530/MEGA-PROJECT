import axios, { AxiosInstance, AxiosError } from 'axios';
import { UploadResponse, AnalysisHistoryItem } from '../types/index';

const API_URL = process.env.REACT_APP_API_URL || 'https://mega-project-fau6.onrender.com/api';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// API Service Functions

export const apiService = {
  // Upload CSV file
  uploadCSV: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post<UploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Clean CSV file and download
  cleanCSV: async (file: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/clean', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate Groq AI Report
  generateReport: async (analysisData: any): Promise<string> => {
    try {
      const response = await axiosInstance.post<{ success: boolean; report: string }>('/generate-report', { analysisData });
      return response.data.report;
    } catch (error) {
      throw error;
    }
  },

  // Get analysis history
  getAnalysisHistory: async (limit: number = 10, skip: number = 0) => {
    try {
      const response = await axiosInstance.get(`/history?limit=${limit}&skip=${skip}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single analysis by ID
  getAnalysisById: async (id: string): Promise<{ success: boolean; data: AnalysisHistoryItem }> => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: AnalysisHistoryItem }>(`/history/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete analysis by ID
  deleteAnalysis: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.delete<{ success: boolean; message: string }>(`/history/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default axiosInstance;