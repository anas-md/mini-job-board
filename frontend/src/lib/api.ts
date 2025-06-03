import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/auth/user'),
};

// Jobs API endpoints
export const jobsAPI = {
  getJobs: (params?: JobFilters) => api.get('/jobs', { params }),
  getJob: (id: string) => api.get(`/jobs/${id}`),
  createJob: (data: CreateJobData) => api.post('/jobs', data),
  updateJob: (id: string, data: UpdateJobData) => api.put(`/jobs/${id}`, data),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/my-jobs'),
  getJobApplications: (jobId: string) => api.get(`/jobs/${jobId}/applications`),
};

// Job Applications API endpoints
export const applicationsAPI = {
  applyToJob: (jobId: string, data: { message: string }) => 
    api.post(`/jobs/${jobId}/apply`, data),
  getMyApplications: () => api.get('/my-applications'),
  getApplication: (id: string) => api.get(`/applications/${id}`),
  withdrawApplication: (id: string) => api.delete(`/applications/${id}`),
};

// Type definitions
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'employer' | 'applicant';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'employer' | 'applicant';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary_range?: string;
  is_remote: boolean;
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  applications?: JobApplication[];
}

export interface JobApplication {
  id: number;
  job_id: number;
  user_id: number;
  message: string;
  applied_at: string;
  job?: Job;
  user?: User;
}

export interface JobFilters {
  location?: string;
  is_remote?: boolean;
  search?: string;
  page?: number;
}

export interface CreateJobData {
  title: string;
  description: string;
  location: string;
  salary_range?: string;
  is_remote: boolean;
  status: 'draft' | 'published' | 'closed';
}

export interface UpdateJobData extends Partial<CreateJobData> {}

export interface ApiResponse<T> {
  message?: string;
  data: T;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
} 