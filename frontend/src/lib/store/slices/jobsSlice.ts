import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jobsAPI, Job, JobFilters, CreateJobData, UpdateJobData } from '../../api';

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  myJobs: Job[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  filters: JobFilters;
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  myJobs: [],
  isLoading: false,
  error: null,
  pagination: null,
  filters: {},
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters: JobFilters = {}, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getJobs(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJob = createAsyncThunk(
  'jobs/fetchJob',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getJob(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (data: CreateJobData, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.createJob(data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors || 
        'Failed to create job'
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, data }: { id: string; data: UpdateJobData }, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.updateJob(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors || 
        'Failed to update job'
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id: string, { rejectWithValue }) => {
    try {
      await jobsAPI.deleteJob(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  'jobs/fetchMyJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getMyJobs();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your jobs');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<JobFilters>) => {
      state.filters = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Job
      .addCase(fetchJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload;
        state.error = null;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myJobs.unshift(action.payload);
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.myJobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.myJobs[index] = action.payload;
        }
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.myJobs = state.myJobs.filter(job => job.id !== parseInt(action.payload));
        if (state.currentJob?.id === parseInt(action.payload)) {
          state.currentJob = null;
        }
      })
      // Fetch My Jobs
      .addCase(fetchMyJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myJobs = action.payload.data;
        state.error = null;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearCurrentJob } = jobsSlice.actions;
export default jobsSlice.reducer; 