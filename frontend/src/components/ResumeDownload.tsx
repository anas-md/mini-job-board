'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Download, FileText, Eye, ExternalLink } from 'lucide-react';
import { applicationsAPI } from '@/lib/api';
import { toast } from '@/lib/utils/toast';

interface ResumeDownloadProps {
  applicationId: string;
  hasResume: boolean;
  applicantName?: string;
  jobTitle?: string;
  className?: string;
  variant?: 'button' | 'link' | 'both';
}

export function ResumeDownload({
  applicationId,
  hasResume,
  applicantName,
  jobTitle,
  className = '',
  variant = 'button'
}: ResumeDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleDownload = async () => {
    if (!hasResume) {
      toast.warning('No resume attached to this application');
      return;
    }

    setIsDownloading(true);

    try {
      const response = await applicationsAPI.downloadResume(applicationId);
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      
      // Extract filename or create one
      let filename = 'resume.pdf';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      } else if (applicantName && jobTitle) {
        // Get file extension from content-type
        const contentType = response.headers['content-type'] || '';
        let extension = 'pdf';
        if (contentType.includes('msword')) {
          extension = 'doc';
        } else if (contentType.includes('wordprocessingml')) {
          extension = 'docx';
        }
        filename = `${applicantName}_Resume_${jobTitle}.${extension}`;
      }

      // Create download link and click it
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = async () => {
    if (!hasResume) {
      toast.warning('No resume attached to this application');
      return;
    }

    setIsViewing(true);

    try {
      const response = await applicationsAPI.viewResume(applicationId);
      
      // Create blob URL for viewing
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        toast.error('Please allow popups to view the resume');
        window.URL.revokeObjectURL(url);
        return;
      }

      // Clean up the blob URL after a delay to allow the browser to load it
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('View error:', error);
      toast.error('Failed to view resume');
    } finally {
      setIsViewing(false);
    }
  };

  if (!hasResume) {
    return (
      <div className={`flex items-center space-x-2 text-gray-400 ${className}`}>
        <FileText className="h-4 w-4" />
        <span className="text-sm">No resume attached</span>
      </div>
    );
  }

  if (variant === 'link') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <button
          onClick={handleView}
          disabled={isViewing}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Eye className="h-4 w-4" />
          <span>{isViewing ? 'Opening...' : 'View Resume'}</span>
          <ExternalLink className="h-3 w-3" />
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Download className="h-4 w-4" />
          <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
        </button>
      </div>
    );
  }

  if (variant === 'both') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          onClick={handleView}
          disabled={isViewing}
          variant="outline"
          size="sm"
        >
          <Eye className="h-4 w-4 mr-2" />
          {isViewing ? 'Opening...' : 'View'}
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          variant="outline"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download'}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      size="sm"
      className={className}
    >
      <FileText className="h-4 w-4 mr-2" />
      {isDownloading ? 'Downloading...' : 'Download Resume'}
      {!isDownloading && <Download className="h-3 w-3 ml-1" />}
    </Button>
  );
}
