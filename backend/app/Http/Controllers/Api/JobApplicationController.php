<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class JobApplicationController extends Controller
{
    /**
     * Apply to a specific job.
     */
    public function store(StoreJobApplicationRequest $request, Job $job): JsonResponse
    {
        $application = JobApplication::create([
            'job_id' => $job->id,
            'user_id' => $request->user()->id,
            'message' => $request->validated('message'),
            'applied_at' => now(),
        ]);

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
            'pagination' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
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

        $applications = JobApplication::with(['job.user:id,name', 'job:id,title,status,created_at'])
            ->byUser($user->id)
            ->latest('applied_at')
            ->paginate(15);

        return response()->json([
            'data' => $applications->items(),
            'pagination' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
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

        $application->delete();

        return response()->json([
            'message' => 'Application withdrawn successfully',
        ]);
    }
}
