import axios from 'axios';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://kbh-ljlw.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Increased to 30s (Render free tier can be slow on cold starts)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Add this for CORS
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Response Types (matching backend)
export interface SummaryData {
  sheet: string;
  total_students: number;
  paid_count: number;
  unpaid_count: number;
  total_paid_amount: number;
  pending_amount: number;
  expected_total: number;
}

export interface RoomStats {
  paid_count: number;
  unpaid_count: number;
  paid_amount: number;
  pending_amount: number;
  expected_amount: number;
}

export interface RoomWiseData {
  sheet: string;
  room_wise: {
    [room: string]: RoomStats;
  };
}

export interface YearStats {
  paid_count: number;
  unpaid_count: number;
  collected_amount: number;
  pending_amount: number;
  expected_amount: number;
}

export interface YearWiseData {
  sheet: string;
  year_wise: {
    [year: string]: YearStats;
  };
}

export interface SheetInfo {
  name: string;
  id: number;
}

export interface SheetsListData {
  spreadsheet_id: string;
  default_sheet: string;
  available_sheets: SheetInfo[];
  total_sheets: number;
}

// API Functions with error handling
export const api = {
  // Get list of available sheets
  getSheets: async (): Promise<SheetsListData> => {
    try {
      const response = await axiosInstance.get('/sheets');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sheets:', error);
      throw error;
    }
  },

  // Get summary (defaults to current month if no sheet specified)
  getSummary: async (sheetName?: string): Promise<SummaryData> => {
    try {
      const params = sheetName ? { sheet: sheetName } : {};
      const response = await axiosInstance.get('/summary', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      throw error;
    }
  },

  // Get room-wise data (defaults to current month if no sheet specified)
  getRoomwise: async (sheetName?: string): Promise<RoomWiseData> => {
    try {
      const params = sheetName ? { sheet: sheetName } : {};
      const response = await axiosInstance.get('/roomwise', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch roomwise data:', error);
      throw error;
    }
  },

  // Get year-wise data (defaults to current month if no sheet specified)
  getYearwise: async (sheetName?: string): Promise<YearWiseData> => {
    try {
      const params = sheetName ? { sheet: sheetName } : {};
      const response = await axiosInstance.get('/yearwise', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch yearwise data:', error);
      throw error;
    }
  },

  // Health check endpoint
  healthCheck: async () => {
    try {
      const response = await axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Debug endpoints
  debugColumns: async (sheetName?: string) => {
    try {
      const params = sheetName ? { sheet: sheetName } : {};
      const response = await axiosInstance.get('/debug/columns', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch debug columns:', error);
      throw error;
    }
  },

  debugSample: async (sheetName?: string) => {
    try {
      const params = sheetName ? { sheet: sheetName } : {};
      const response = await axiosInstance.get('/debug/sample', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch debug sample:', error);
      throw error;
    }
  }
};

export default api;