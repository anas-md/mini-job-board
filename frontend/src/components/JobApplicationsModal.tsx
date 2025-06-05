'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchJobApplications, clearJobApplications } from '@/lib/store/slices/applicationsSlice';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ResumeDownload } from './ResumeDownload';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  MessageSquare,
  Users,
  FileText
} from 'lucide-react';
import type { Job } from '@/lib/api';

interface JobApplicationsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobApplicationsModal({ job, isOpen, onClose }: JobApplicationsModalProps) {
  const dispatch = useAppDispatch();
  const { jobApplications, isLoading, error } = useAppSelector((state) => state.applications);

  useEffect(() => {
    if (isOpen && job) {
      dispatch(fetchJobApplications(job.id.toString()));
    }
    
    return () => {
      if (!isOpen) {
        dispatch(clearJobApplications());
      }
    };
  }, [isOpen, job, dispatch]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Applications for &quot;{job?.title}&quot;
            </h2>
            <p className="text-muted-foreground mt-1">
              {jobApplications.length} application{jobApplications.length !== 1 ? 's' : ''} received
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading applications...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">Error loading applications</div>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : jobApplications.length > 0 ? (
            <div className="space-y-4">
              {jobApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <User className="h-5 w-5 mr-2 text-muted-foreground" />
                          {application.user?.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-2" />
                          {application.user?.email}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied {formatDate(application.applied_at)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium text-card-foreground">Application Message:</span>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-card-foreground whitespace-pre-wrap">
                          {application.message}
                        </p>
                      </div>
                    </div>

                    {/* Resume Section */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center mb-2">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium text-card-foreground">Resume:</span>
                        </div>
                        <ResumeDownload
                          applicationId={application.id.toString()}
                          hasResume={!!application.resume_path}
                          applicantName={application.user?.name}
                          jobTitle={job?.title}
                          variant="both"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground">
                No one has applied to this job posting yet. Applications will appear here once candidates start applying.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose} className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
} 