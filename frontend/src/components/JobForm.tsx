'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { createJob, updateJob } from '@/lib/store/slices/jobsSlice';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { toast } from '@/lib/utils/toast';
import type { Job, CreateJobData } from '@/lib/api';

interface JobFormProps {
  job?: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function JobForm({ job, isOpen, onClose, onSuccess }: JobFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    description: '',
    location: '',
    salary_range: '',
    is_remote: false,
    status: 'draft',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        salary_range: job.salary_range || '',
        is_remote: job.is_remote,
        status: job.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        salary_range: '',
        is_remote: false,
        status: 'draft',
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.warning('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      if (job) {
        await dispatch(updateJob({ 
          id: job.id.toString(), 
          data: formData 
        })).unwrap();
        toast.success('Job updated successfully!');
      } else {
        await dispatch(createJob(formData)).unwrap();
        toast.success('Job created successfully!');
      }
      
      onSuccess?.();
      onClose();
    } catch {
      toast.error(job ? 'Failed to update job' : 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job ? 'Edit Job' : 'Create New Job'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
            Cancel
          </Button>
          <Button type="submit" form="job-form" disabled={isLoading} className="hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
            {isLoading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
          </Button>
        </>
      }
    >
      <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
            Job Title *
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
            Location *
          </label>
          <Input
            id="location"
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g. New York, NY"
          />
        </div>

        {/* Salary Range */}
        <div>
          <label htmlFor="salary_range" className="block text-sm font-medium text-foreground mb-1">
            Salary Range
          </label>
          <Input
            id="salary_range"
            name="salary_range"
            type="text"
            value={formData.salary_range}
            onChange={handleInputChange}
            placeholder="e.g. $80,000 - $120,000"
          />
        </div>

        {/* Remote Work */}
        <div className="flex items-center">
          <input
            id="is_remote"
            name="is_remote"
            type="checkbox"
            checked={formData.is_remote}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="is_remote" className="ml-2 block text-sm text-foreground">
            Remote work available
          </label>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
            Job Description *
          </label>
          <Textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the role, responsibilities, requirements, and benefits..."
            rows={8}
          />
        </div>
      </form>
    </Modal>
  );
} 