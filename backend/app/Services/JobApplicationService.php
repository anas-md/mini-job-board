<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
use App\Notifications\JobApplicationConfirmation;
use App\Notifications\JobApplicationReceived;
use Illuminate\Http\UploadedFile;

final class JobApplicationService
{
    public function __construct(
        private readonly FileUploadService $fileUploadService
    ) {}

    /**
     * Create a new job application with optional resume.
     */
    public function createApplication(
        Job $job,
        User $user,
        string $message,
        ?UploadedFile $resume = null
    ): JobApplication {
        $resumePath = null;
        
        if ($resume) {
            $resumePath = $this->fileUploadService->uploadResume($resume);
        }

        $application = JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $user->id,
            'message' => $message,
            'resume_path' => $resumePath,
            'applied_at' => now(),
        ]);

        // Load the employer for notifications
        $job->load('user');
        $employer = $job->user;

        // Send notification to employer about new application
        $employer->notify(new JobApplicationReceived($application, $job, $user));

        // Send confirmation notification to applicant
        $user->notify(new JobApplicationConfirmation($application, $job, $employer));

        return $application;
    }

    /**
     * Delete an application and its associated resume.
     */
    public function deleteApplication(JobApplication $application): bool
    {
        // Delete resume file if it exists
        if ($application->resume_path) {
            $this->fileUploadService->deleteResume($application->resume_path);
        }

        return $application->delete();
    }
} 