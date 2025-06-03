'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchJobs } from '@/lib/store/slices/jobsSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, MapPin, Briefcase, Clock, Building } from 'lucide-react';
import type { JobFilters, Job } from '@/lib/api';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const jobsState = useAppSelector((state) => state.jobs);
  const authState = useAppSelector((state) => state.auth);
  
  const { jobs, isLoading, pagination } = jobsState;
  const { user } = authState;
  
  const [filters, setFilters] = useState<JobFilters>({});

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Mini Job Board
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <Link href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/applicant'}>
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Find your next</span>{' '}
                  <span className="block text-indigo-600 xl:inline">opportunity</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Connect with top employers and discover exciting career opportunities. 
                  Whether you're looking for your dream job or seeking talented professionals, 
                  we've got you covered.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/register">
                      <Button size="lg" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="#jobs">
                      <Button variant="outline" size="lg" className="w-full">
                        Browse Jobs
                      </Button>
                    </Link>
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
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Discover Opportunities
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Search through hundreds of job opportunities from top companies
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Job title or keyword"
                className="pl-10"
                defaultValue={filters.search || ''}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                name="location"
                placeholder="Location"
                className="pl-10"
                defaultValue={filters.location || ''}
              />
            </div>
            <Button type="submit" className="w-full">
              Search Jobs
            </Button>
          </div>
        </form>

        {/* Job Listings */}
        <div className="mt-12">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-500">Loading jobs...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job: Job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {job.user.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                          {job.is_remote && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.salary_range}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          Posted {formatDate(job.created_at)}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                        {job.description}
                      </p>
                      <div className="mt-4">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {jobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No jobs found matching your criteria.</p>
                </div>
              )}

              {pagination && pagination.last_page > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === pagination.current_page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilters({ ...filters, page })}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Mini Job Board</h3>
              <p className="mt-2 text-gray-600">
                Connecting talent with opportunity. Find your next career move or hire the perfect candidate.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">For Job Seekers</h3>
              <ul className="mt-2 space-y-1">
                <li><Link href="/register" className="text-gray-600 hover:text-gray-900">Create Account</Link></li>
                <li><Link href="/jobs" className="text-gray-600 hover:text-gray-900">Browse Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">For Employers</h3>
              <ul className="mt-2 space-y-1">
                <li><Link href="/register" className="text-gray-600 hover:text-gray-900">Post a Job</Link></li>
                <li><Link href="/login" className="text-gray-600 hover:text-gray-900">Employer Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-gray-500">
              © 2024 Mini Job Board. Built with Next.js and Laravel.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
