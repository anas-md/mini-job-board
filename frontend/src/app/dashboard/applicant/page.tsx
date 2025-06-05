'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/store/slices/authSlice';
import { fetchJobs } from '@/lib/store/slices/jobsSlice';
import { fetchMyApplications } from '@/lib/store/slices/applicationsSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { JobDetailModal } from '@/components/JobDetailModal';
import { ResumeDownload } from '@/components/ResumeDownload';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Building,
  LogOut,
  FileText,
  Send,
  DollarSign,
  Wifi
} from 'lucide-react';
import { toast } from '@/lib/utils/toast';
import type { JobFilters, Job } from '@/lib/api';

export default function ApplicantDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, isLoading } = useAppSelector((state) => state.jobs);
  const { applications, isLoading: applicationsLoading } = useAppSelector((state) => state.applications);
  
  const [filters, setFilters] = useState<JobFilters>({});
  const [activeTab, setActiveTab] = useState<'browse' | 'applications'>('browse');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'applicant') {
      router.push('/dashboard/employer');
      return;
    }

    dispatch(fetchJobs(filters));
    dispatch(fetchMyApplications());
  }, [user, router, dispatch, filters]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.quickSuccess('Logged out successfully');
      router.push('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const location = formData.get('location') as string;
    
    setFilters({
      ...filters,
      search: search || undefined,
      location: location || undefined,
    });
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user || user.role !== 'applicant') {
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
              <span className="ml-1 sm:ml-4 px-1 sm:px-3 py-0.5 sm:py-1 bg-accent text-accent-foreground text-xs rounded-full">
                <span className="hidden sm:inline">Job Seeker</span>
                <span className="sm:hidden">Seeker</span>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Job Seeker Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Discover and apply for amazing opportunities</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Available Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent/50 rounded-lg">
                  <Send className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-secondary/50 rounded-lg">
                  <Wifi className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Remote Jobs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.filter(job => job.is_remote).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Companies</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(jobs.map(job => job.user.id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'browse'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Browse Jobs
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'applications'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <span className="hidden sm:inline">My Applications ({applications.length})</span>
                <span className="sm:hidden">Applications ({applications.length})</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' ? (
          <div>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6 sm:mb-8 bg-card rounded-lg shadow-lg p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="search"
                    placeholder="Job title or keyword"
                    className="pl-10"
                    defaultValue={filters.search || ''}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="location"
                    placeholder="Location"
                    className="pl-10"
                    defaultValue={filters.location || ''}
                  />
                </div>
                <Button type="submit" className="w-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
                  Search Jobs
                </Button>
              </div>
            </form>

            {/* Job Listings */}
                          {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-muted-foreground">Loading jobs...</p>
                </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job: Job) => (
                  <Card 
                    key={job.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleJobClick(job)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg break-words">{job.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{job.user.name}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                          {job.is_remote && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center flex-shrink-0">
                              <Wifi className="h-3 w-3 mr-1" />
                              Remote
                            </span>
                          )}
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.salary_range}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">Posted {formatDate(job.created_at)}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>
                      <div className="mt-4">
                        <Button size="sm" className="w-full text-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
                          <span className="hidden sm:inline">View Details & Apply</span>
                          <span className="sm:hidden">View & Apply</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Applications Tab */
          <div>
            {applicationsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-muted-foreground">Loading applications...</p>
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-card-foreground break-words">
                            {application.job?.title}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{application.job?.user?.name}</span>
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{application.job?.location}</span>
                              {application.job?.is_remote && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex-shrink-0">
                                  Remote
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">Applied {formatDate(application.applied_at)}</span>
                            </p>
                          </div>
                          <div className="mt-3 space-y-3">
                            <div>
                              <p className="text-sm font-medium text-card-foreground">Your Message:</p>
                              <p className="text-sm text-card-foreground mt-1 bg-muted p-3 rounded break-words">
                                {application.message}
                              </p>
                            </div>
                            
                            {/* Resume Section */}
                            <div>
                              <p className="text-sm font-medium text-card-foreground mb-2">Resume:</p>
                              <ResumeDownload
                                applicationId={application.id.toString()}
                                hasResume={!!application.resume_path}
                                applicantName={application.user?.name}
                                jobTitle={application.job?.title}
                                variant="link"
                                className="text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Start browsing jobs and submit your first application!
                </p>
                <Button onClick={() => setActiveTab('browse')} className="hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
                  Browse Jobs
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
} 