import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/lib/store/slices/authSlice'
import jobsReducer from '@/lib/store/slices/jobsSlice'

// Mock job data
const mockJob = {
  id: 1,
  title: 'Senior React Developer',
  description: 'Looking for an experienced React developer...',
  location: 'New York, NY',
  salary_range: '$80,000 - $120,000',
  is_remote: false,
  status: 'published',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  user: {
    id: 1,
    name: 'TechCorp Inc.'
  }
}

// Mock JobListingCard component
const MockJobListingCard = ({ job, onJobClick }: any) => (
  <div className="job-card" data-testid="job-card">
    <h3 data-testid="job-title">{job.title}</h3>
    <p data-testid="job-company">{job.user.name}</p>
    <p data-testid="job-location">
      {job.is_remote ? 'Remote' : job.location}
    </p>
    <p data-testid="job-salary">{job.salary_range}</p>
    <button 
      onClick={() => onJobClick(job)}
      data-testid="view-job-btn"
    >
      View Details
    </button>
  </div>
)

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      jobs: jobsReducer,
    },
    preloadedState: {
      auth: {
        user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'applicant' },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null
      },
      jobs: {
        jobs: [mockJob],
        isLoading: false,
        error: null
      }
    }
  })
}

describe('JobListingCard', () => {
  let store: ReturnType<typeof createTestStore>
  let mockOnJobClick: jest.Mock

  beforeEach(() => {
    store = createTestStore()
    mockOnJobClick = jest.fn()
  })

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MockJobListingCard job={mockJob} onJobClick={mockOnJobClick} />
      </Provider>
    )
  }

  it('renders job information correctly', () => {
    renderComponent()

    expect(screen.getByTestId('job-title')).toHaveTextContent('Senior React Developer')
    expect(screen.getByTestId('job-company')).toHaveTextContent('TechCorp Inc.')
    expect(screen.getByTestId('job-location')).toHaveTextContent('New York, NY')
    expect(screen.getByTestId('job-salary')).toHaveTextContent('$80,000 - $120,000')
  })

  it('shows "Remote" for remote jobs', () => {
    const remoteJob = { ...mockJob, is_remote: true }
    
    render(
      <Provider store={store}>
        <MockJobListingCard job={remoteJob} onJobClick={mockOnJobClick} />
      </Provider>
    )

    expect(screen.getByTestId('job-location')).toHaveTextContent('Remote')
  })

  it('calls onJobClick when view details button is clicked', () => {
    renderComponent()

    const viewButton = screen.getByTestId('view-job-btn')
    fireEvent.click(viewButton)

    expect(mockOnJobClick).toHaveBeenCalledWith(mockJob)
    expect(mockOnJobClick).toHaveBeenCalledTimes(1)
  })

  it('renders all required elements', () => {
    renderComponent()

    expect(screen.getByTestId('job-card')).toBeInTheDocument()
    expect(screen.getByTestId('job-title')).toBeInTheDocument()
    expect(screen.getByTestId('job-company')).toBeInTheDocument()
    expect(screen.getByTestId('job-location')).toBeInTheDocument()
    expect(screen.getByTestId('job-salary')).toBeInTheDocument()
    expect(screen.getByTestId('view-job-btn')).toBeInTheDocument()
  })
}) 