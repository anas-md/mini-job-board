<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Models\Job;
use App\Models\JobApplication;
use App\Services\JobApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class JobApplicationController extends Controller
{
    public function __construct(
        private readonly JobApplicationService $jobApplicationService
    ) {}

    /**
     * Apply to a specific job.
     */
    public function store(StoreJobApplicationRequest $request, Job $job): JsonResponse
    {
        $application = $this->jobApplicationService->createApplication(
            job: $job,
            user: $request->user(),
            message: $request->validated('message'),
            resume: $request->file('resume')
        );

        $application->load(['job:id,title', 'user:id,name']);

        return response()->json([
            'message' => 'Application submitted successfully',
            'data' => $application,
        ], 201);
    }

    /**
     * Retrieve applications for a specific job.
     */
    public function jobApplications(Request $request, Job $job): JsonResponse
    {
        $user = $request->user();

        if (!$user->isEmployer() || !$job->isOwnedBy($user)) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You can only view applications for your own jobs',
            ], 403);
        }

        $applications = JobApplication::with(['user:id,name,email', 'job:id,title'])
            ->forJob($job->id)
            ->latest('applied_at')
            ->paginate(15);

        return response()->json([
            'data' => $applications->items(),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
                'from' => $applications->firstItem(),
                'to' => $applications->lastItem(),
            ],
        ]);
    }

    /**
     * Retrieve applications made by registered applicants.
     */
    public function myApplications(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isApplicant()) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'Only applicants can access this endpoint',
            ], 403);
        }

        $applications = JobApplication::with([
                'job:id,title,status,created_at,location,is_remote,user_id',
                'job.user:id,name'
            ])
            ->byUser($user->id)
            ->latest('applied_at')
            ->paginate(15);

        return response()->json([
            'data' => $applications->items(),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
                'from' => $applications->firstItem(),
                'to' => $applications->lastItem(),
            ],
        ]);
    }

    /**
     * Retrieve specific application.
     */
    public function show(Request $request, JobApplication $application): JsonResponse
    {
        $user = $request->user();
        $job = $application->job;

        // Check if user can view application
        $canView = ($user->isApplicant() && $application->user_id === $user->id) ||
                   ($user->isEmployer() && $job->isOwnedBy($user));

        if (!$canView) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You cannot view this application',
            ], 403);
        }

        $application->load(['job:id,title,status', 'user:id,name,email']);

        return response()->json([
            'data' => $application,
        ]);
    }

    /**
     * Withdraw application (applicants only).
     */
    public function destroy(Request $request, JobApplication $application): JsonResponse
    {
        $user = $request->user();

        if (!$user->isApplicant() || $application->user_id !== $user->id) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You can only withdraw your own applications',
            ], 403);
        }

        $this->jobApplicationService->deleteApplication($application);

        return response()->json([
            'message' => 'Application withdrawn successfully',
        ]);
    }

    /**
     * Download resume for a specific application.
     */
    public function downloadResume(Request $request, JobApplication $application)
    {
        $user = $request->user();
        $job = $application->job;

        // Check if user can download resume
        $canDownload = ($user->isApplicant() && $application->user_id === $user->id) ||
                      ($user->isEmployer() && $job->isOwnedBy($user));

        if (!$canDownload) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You cannot download this resume',
            ], 403);
        }

        if (!$application->hasResume()) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'No resume attached to this application',
            ], 404);
        }

        $resumePath = storage_path('app/public/' . $application->resume_path);

        if (!file_exists($resumePath)) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'Resume file not found',
            ], 404);
        }

        $originalName = pathinfo($application->resume_path, PATHINFO_BASENAME);
        $applicantName = $application->user->name;
        $jobTitle = $application->job->title;
        $originalExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $downloadName = sprintf('%s_Resume_%s.%s', 
            str_replace(' ', '_', $applicantName),
            str_replace(' ', '_', $jobTitle),
            $originalExtension
        );

        // Set appropriate content type for download
        $contentType = match ($originalExtension) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            default => 'application/octet-stream'
        };

        return response()->download($resumePath, $downloadName, [
            'Content-Type' => $contentType,
        ]);
    }

    /**
     * View/stream resume for a specific application (for viewing in browser).
     */
    public function viewResume(Request $request, JobApplication $application)
    {
        $user = $request->user();
        $job = $application->job;

        // Check if user can view resume
        $canView = ($user->isApplicant() && $application->user_id === $user->id) ||
                  ($user->isEmployer() && $job->isOwnedBy($user));

        if (!$canView) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You cannot view this resume',
            ], 403);
        }

        if (!$application->hasResume()) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'No resume attached to this application',
            ], 404);
        }

        $resumePath = storage_path('app/public/' . $application->resume_path);

        if (!file_exists($resumePath)) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'Resume file not found',
            ], 404);
        }

        $fileExtension = strtolower(pathinfo($application->resume_path, PATHINFO_EXTENSION));
        
        // Set appropriate content type for viewing
        $contentType = match ($fileExtension) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            default => 'application/octet-stream'
        };

        return response()->file($resumePath, [
            'Content-Type' => $contentType,
            'Content-Disposition' => 'inline', // This tells browser to try to display instead of download
        ]);
    }
}
