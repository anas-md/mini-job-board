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
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  LogOut,
  MapPin,
  Clock,
  DollarSign,
  Wifi
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
    } catch {
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
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const handleJobFormSuccess = () => {
    dispatch(fetchMyJobs());
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-accent/10">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0 flex-1">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-foreground truncate font-serif">
                Mini Job Board
              </Link>
              <span className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-accent text-accent-foreground text-xs sm:text-sm rounded-full">
                Employer
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <ThemeToggle />
              <span className="text-muted-foreground text-sm sm:text-base hidden sm:block">Welcome, {user.name}</span>
              <span className="text-muted-foreground text-sm sm:hidden">Hi, {user.name.split(' ')[0]}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center text-xs sm:text-sm hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Employer Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Manage your job postings and applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{myJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold text-foreground">
                    {myJobs.filter(job => job.status === 'published').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Edit className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold text-foreground">
                    {myJobs.filter(job => job.status === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-secondary/50 rounded-lg">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold text-foreground">
                    {myJobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button className="flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105" onClick={handleCreateJob}>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Your Job Postings</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage and track your job listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading jobs...</p>
              </div>
            ) : myJobs.length > 0 ? (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-border rounded-lg p-4 sm:p-6 hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-foreground break-words">{job.title}</h3>
                          <span className={`mt-1 sm:mt-0 px-2 py-1 text-xs rounded-full self-start ${
                            job.status === 'published' 
                              ? 'bg-green-500 text-green-800' 
                              : job.status === 'draft'
                              ? 'bg-yellow-500 text-yellow-800'
                              : 'bg-red-500 text-red-800'
                          }`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                            {job.is_remote && (
                              <span className="ml-2 px-2 py-1 bg-green-500 text-green-800 text-xs rounded-full flex items-center flex-shrink-0">
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
                        
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 sm:mb-0">
                          {job.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 sm:ml-4 mt-3 sm:mt-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditJob(job)}
                          className="flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewJobApplications(job)}
                          className="flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Applications</span>
                          <span className="sm:hidden">Apps</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-lg hover:shadow-red-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105 flex items-center justify-center"
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
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No job postings yet</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Create your first job posting to start finding talented candidates.
                </p>
                <Button onClick={handleCreateJob} className="hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
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