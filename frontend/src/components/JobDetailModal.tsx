'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { applyToJob, fetchMyApplications } from '@/lib/store/slices/applicationsSlice';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { FileUpload } from './ui/FileUpload';
import { 
  MapPin, 
  Clock, 
  Building, 
  DollarSign,
  Wifi,
  CheckCircle 
} from 'lucide-react';
import { toast } from '@/lib/utils/toast';
import type { Job } from '@/lib/api';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { applications, isLoading } = useAppSelector((state) => state.applications);
  
  const [applicationMessage, setApplicationMessage] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isApplicant = user?.role === 'applicant';

  // Fetch user's applications when modal opens to ensure current data
  useEffect(() => {
    if (isOpen && isApplicant && job) {
      dispatch(fetchMyApplications());
    }
  }, [isOpen, isApplicant, job, dispatch]);

  if (!job) return null;

  // Check if user has already applied to this job
  const hasApplied = applications.some(app => app.job_id === job.id);

  const handleApply = async () => {
    if (!applicationMessage.trim()) {
      toast.warning('Please write a message for your application');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(applyToJob({
        jobId: job.id.toString(),
        message: applicationMessage,
        resume: resumeFile || undefined
      })).unwrap();
      
      toast.success('Application submitted successfully!');
      setApplicationMessage('');
      setResumeFile(null);
      setShowApplicationForm(false);
      onClose();
    } catch (error: unknown) {
      // Show the specific error message from the server
      const errorMessage = typeof error === 'string' ? error : 'Failed to submit application';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job.title}
      footer={
        isApplicant && !showApplicationForm && !hasApplied ? (
          <>
            <Button variant="outline" onClick={onClose} className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
              Close
            </Button>
            <Button onClick={() => setShowApplicationForm(true)} className="hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
              Apply Now
            </Button>
          </>
        ) : showApplicationForm ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => setShowApplicationForm(false)}
              disabled={isLoading}
              className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
            >
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={isLoading} className="hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onClose} className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
            Close
          </Button>
        )
      }
    >
      <div className="space-y-6">
        {/* Already Applied Notice */}
        {isApplicant && hasApplied && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Application Submitted</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              You have already applied to this job. You can view your application in your dashboard.
            </p>
          </div>
        )}

        {/* Job Details */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center text-muted-foreground">
              <Building className="h-4 w-4 mr-2" />
              <span className="text-sm">{job.user.name}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">{job.location}</span>
            </div>
            {job.is_remote && (
              <div className="flex items-center text-green-600">
                <Wifi className="h-4 w-4 mr-2" />
                <span className="text-sm">Remote</span>
              </div>
            )}
            {job.salary_range && (
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.salary_range}</span>
              </div>
            )}
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">Posted {formatDate(job.created_at)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-foreground mb-2">Job Description</h4>
          <div className="text-foreground whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        {/* Application Form */}
        {showApplicationForm && (
          <div className="border-t border-border pt-6 space-y-6">
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">Application Message</h4>
              <Textarea
                placeholder="Tell the employer why you're interested in this position and what you can bring to the role..."
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                rows={6}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Write a compelling message to increase your chances of getting noticed.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">Resume (Optional)</h4>
              <FileUpload
                onFileSelect={setResumeFile}
                selectedFile={resumeFile}
                accept=".pdf,.doc,.docx"
                maxSizeMB={5}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Upload your resume to provide more details about your experience and qualifications.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
} 