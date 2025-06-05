import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationsAPI, jobsAPI, type JobApplication } from '@/lib/api';

interface ApplicationsState {
  applications: JobApplication[];
  jobApplications: JobApplication[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  jobApplications: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async ({ jobId, message, resume }: { jobId: string; message: string; resume?: File }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      if (resume) {
        formData.append('resume', resume);
      }
      const response = await applicationsAPI.applyToJob(jobId, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors?.job?.[0] ||
        'Failed to apply to job'
      );
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.getMyApplications();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'applications/fetchJobApplications',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getJobApplications(jobId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job applications');
    }
  }
);

export const withdrawApplication = createAsyncThunk(
  'applications/withdrawApplication',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      await applicationsAPI.withdrawApplication(applicationId);
      return applicationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to withdraw application');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearJobApplications: (state) => {
      state.jobApplications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply to job
      .addCase(applyToJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload.data);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to apply to job';
      })
      // Fetch my applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.data;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch applications';
      })
      // Fetch job applications (for employers)
      .addCase(fetchJobApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobApplications = action.payload.data;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch job applications';
      })
      // Withdraw application
      .addCase(withdrawApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = state.applications.filter(
          app => app.id.toString() !== action.payload
        );
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to withdraw application';
      });
  },
});

export const { clearError, clearJobApplications } = applicationsSlice.actions;
export default applicationsSlice.reducer; 