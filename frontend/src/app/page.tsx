'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchJobs } from '@/lib/store/slices/jobsSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { JobDetailModal } from '@/components/JobDetailModal';

import { ThemeToggle } from '@/components/theme-toggle';
import { Search, MapPin, Briefcase, Clock, Building, Heart } from 'lucide-react';
import type { JobFilters, Job } from '@/lib/api';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const jobsState = useAppSelector((state) => state.jobs);
  const authState = useAppSelector((state) => state.auth);
  
  const { jobs, isLoading, pagination } = jobsState;
  const { user } = authState;
  
  const [filters, setFilters] = useState<JobFilters>({});
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch, filters]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-accent/10">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground font-serif">
                  Mini Job Board
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <span className="text-muted-foreground">Welcome, {user.name}</span>
                  <Link href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/applicant'}>
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button 
                      variant="outline" 
                      className="group relative overflow-hidden border-2 border-primary/20 bg-card/80 hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                    >
                      <span className="relative z-10 text-foreground group-hover:text-primary transition-colors duration-300">
                        Login
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="shadow-lg hover:shadow-xl transition-shadow">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-background to-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                {/* Text Content */}
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Find your next</span>{' '}
                    <span className="block text-primary xl:inline">opportunity</span>
                  </h1>
                  <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Connect with top employers and discover exciting career opportunities. 
                    Whether you&apos;re looking for your dream job or seeking talented professionals, 
                    we&apos;ve got you covered.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow-lg">
                      <Link href="/register">
                        <Button size="lg" className="w-full shadow-lg hover:shadow-xl transition-all">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link href="#jobs">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="group relative w-full overflow-hidden border-2 border-accent/100 dark:border-accent/40 bg-gradient-to-r from-card/90 to-background/90 hover:from-accent/10 hover:to-primary/10 hover:border-accent/70 dark:hover:border-accent/80 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
                        >
                          <span className="relative z-10 text-foreground group-hover:text-gray-800 dark:group-hover:text-gray-800 font-semibold transition-colors duration-300">
                            Browse Jobs
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-primary/30 rounded-lg blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                          {/* Floating bubble effect */}
                          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-accent/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" style={{ animationDelay: '0.1s' }}></div>
                          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" style={{ animationDelay: '0.3s' }}></div>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Poster Image */}
                <div className="mt-12 lg:mt-0 relative">
                  <div className="relative mx-auto max-w-md lg:max-w-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl transform rotate-3 scale-105"></div>
                    <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-4 transform hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/job_board_poster.png"
                        alt="Mini Job Board - Connecting talent with opportunities"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-xl shadow-lg object-cover"
                        priority
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/10 via-transparent to-transparent"></div>
                    </div>
                    {/* Floating elements for bubblegum effect */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                    <div className="absolute -bottom-2 -left-6 w-6 h-6 bg-primary rounded-full shadow-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                    <div className="absolute top-1/2 -left-3 w-4 h-4 bg-secondary rounded-full shadow-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div id="jobs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Discover Opportunities
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground sm:mt-4">
            Search through hundreds of job opportunities from top companies
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-8 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Button type="submit" className="w-full shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
              Search Jobs
            </Button>
          </div>
        </form>

        {/* Job Listings */}
        <div className="mt-12">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading jobs...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job: Job) => (
                  <Card 
                    key={job.id} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer border-border bg-card/50 backdrop-blur-sm hover:bg-card/80"
                    onClick={() => handleJobClick(job)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">{job.title}</CardTitle>
                      <CardDescription className="flex items-center text-muted-foreground">
                        <Building className="h-4 w-4 mr-1" />
                        {job.user.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                          {job.is_remote && (
                            <span className="ml-2 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.salary_range}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          Posted {formatDate(job.created_at)}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>
                      <div className="mt-4">
                        <Button 
                          size="sm" 
                          className="w-full shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJobClick(job);
                          }}
                        >
                          {user?.role === 'applicant' ? 'View & Apply' : 'View Details'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      disabled={pagination.current_page === 1}
                      onClick={() => setFilters({ ...filters, page: pagination.current_page - 1 })}
                      className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <Button
                      variant="outline"
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => setFilters({ ...filters, page: pagination.current_page + 1 })}
                      className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {jobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria to find more opportunities.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-card to-muted border-t border-border">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground font-serif">Mini Job Board</h3>
              </div>
              <p className="text-muted-foreground">
                Connecting talent with opportunity. Find your next career move or hire the perfect candidate.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors">
                    Browse Jobs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">For Employers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                    Employer Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8">
            <p className="text-center text-muted-foreground">
              © 2025 Mini Job Board. Built with Next.js and Laravel. Made with{' '}
              <Heart className="inline h-4 w-4 text-primary mx-1" />
              and bubblegum vibes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
