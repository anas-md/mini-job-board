<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class JobController extends Controller
{
    /**
     * Display listing of published jobs (public access).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Job::with('user:id,name')
            ->published()
            ->latest();

        // Optional filtering
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->get('location') . '%');
        }

        if ($request->filled('is_remote')) {
            $query->where('is_remote', $request->boolean('is_remote'));
        }

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        $jobs = $query->paginate(15);

        return response()->json([
            'data' => $jobs->items(),
            'pagination' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage(),
                'total' => $jobs->total(),
            ],
        ]);
    }

    /**
     * Store newly created job.
     */
    public function store(StoreJobRequest $request): JsonResponse
    {
        $job = Job::create([
            'user_id' => $request->user()->id,
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
            'location' => $request->validated('location'),
            'salary_range' => $request->validated('salary_range'),
            'is_remote' => $request->validated('is_remote', false),
            'status' => $request->validated('status'),
        ]);

        $job->load('user:id,name');

        return response()->json([
            'message' => 'Job created successfully',
            'data' => $job,
        ], 201);
    }

    /**
     * Display specified job.
     */
    public function show(Job $job): JsonResponse
    {
        // Only show published jobs to non-owners
        if (!$job->isPublished() && !$job->isOwnedBy(auth()->user())) {
            return response()->json([
                'error' => 'Job not found',
            ], 404);
        }

        $job->load(['user:id,name', 'applications.user:id,name']);

        return response()->json([
            'data' => $job,
        ]);
    }

    /**
     * Update specified job.
     */
    public function update(UpdateJobRequest $request, Job $job): JsonResponse
    {
        $job->update($request->validated());
        
        $job->load('user:id,name');

        return response()->json([
            'message' => 'Job updated successfully',
            'data' => $job,
        ]);
    }

    /**
     * Remove specified job.
     */
    public function destroy(Job $job): JsonResponse
    {
        // Authorization handled by middleware/policy
        if (!$job->isOwnedBy(auth()->user())) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You can only delete your own jobs',
            ], 403);
        }

        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }

    /**
     * Retrieve jobs posted by registered employers.
     */
    public function myJobs(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user->isEmployer()) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'Only employers can access this endpoint',
            ], 403);
        }

        $jobs = Job::with('applications.user:id,name')
            ->byUser($user->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => $jobs->items(),
            'pagination' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage(),
                'total' => $jobs->total(),
            ],
        ]);
    }
}
