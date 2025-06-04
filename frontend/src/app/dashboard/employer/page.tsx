'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/store/slices/authSlice';
import { fetchMyJobs, deleteJob } from '@/lib/store/slices/jobsSlice';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { JobForm } from '@/components/JobForm';
import { JobApplicationsModal } from '@/components/JobApplicationsModal';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  LogOut,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Wifi,
  MoreVertical
} from 'lucide-react';
import { toast } from '@/lib/utils/toast';
import type { Job } from '@/lib/api';

export default function EmployerDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { myJobs, isLoading } = useAppSelector((state) => state.jobs);

  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState<Job | null>(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'employer') {
      router.push('/dashboard/applicant');
      return;
    }

    // Fetch employer's jobs
    dispatch(fetchMyJobs());
  }, [user, router, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.quickSuccess('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setIsJobFormOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsJobFormOpen(true);
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await dispatch(deleteJob(jobId.toString())).unwrap();
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleJobFormSuccess = () => {
    dispatch(fetchMyJobs());
  };

  const handleViewAllApplications = () => {
    // TODO: Implement all applications view - could navigate to a dedicated page
    toast.info('Please select a specific job to view its applications');
  };

  const handleViewJobApplications = (job: Job) => {
    setSelectedJobForApplications(job);
    setIsApplicationsModalOpen(true);
  };

  const handleCloseApplicationsModal = () => {
    setIsApplicationsModalOpen(false);
    setSelectedJobForApplications(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0 flex-1">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Mini Job Board
              </Link>
              <span className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-800 text-xs sm:text-sm rounded-full">
                Employer
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <span className="text-gray-700 text-sm sm:text-base hidden sm:block">Welcome, {user.name}</span>
              <span className="text-gray-700 text-sm sm:hidden">Hi, {user.name.split(' ')[0]}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your job postings and applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{myJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myJobs.filter(job => job.status === 'published').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Edit className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myJobs.filter(job => job.status === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Closed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myJobs.filter(job => job.status === 'closed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button className="flex items-center justify-center" onClick={handleCreateJob}>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
            <Button variant="outline" className="flex items-center justify-center" onClick={handleViewAllApplications}>
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View All Applications</span>
              <span className="sm:hidden">All Applications</span>
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
            <CardDescription>
              Manage and track your job listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading jobs...</p>
              </div>
            ) : myJobs.length > 0 ? (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 break-words">{job.title}</h3>
                          <span className={`mt-1 sm:mt-0 px-2 py-1 text-xs rounded-full self-start ${
                            job.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : job.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                            {job.is_remote && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center flex-shrink-0">
                                <Wifi className="h-3 w-3 mr-1" />
                                Remote
                              </span>
                            )}
                          </div>
                          {job.salary_range && (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{job.salary_range}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Posted {formatDate(job.created_at)}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3 sm:mb-0">
                          {job.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 sm:ml-4 mt-3 sm:mt-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditJob(job)}
                          className="flex items-center justify-center"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewJobApplications(job)}
                          className="flex items-center justify-center"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Applications</span>
                          <span className="sm:hidden">Apps</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300 flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                  Create your first job posting to start finding talented candidates.
                </p>
                <Button onClick={handleCreateJob}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Form Modal */}
      <JobForm
        job={editingJob}
        isOpen={isJobFormOpen}
        onClose={() => {
          setIsJobFormOpen(false);
          setEditingJob(null);
        }}
        onSuccess={handleJobFormSuccess}
      />

      {/* Job Applications Modal */}
      <JobApplicationsModal
        job={selectedJobForApplications}
        isOpen={isApplicationsModalOpen}
        onClose={handleCloseApplicationsModal}
      />
    </div>
  );
} 