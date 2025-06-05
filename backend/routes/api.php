<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public job browsing
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{job}', [JobController::class, 'show']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });

    // Job management (employers)
    Route::middleware(['role:employer'])->group(function () {
        Route::post('/jobs', [JobController::class, 'store']);
        Route::put('/jobs/{job}', [JobController::class, 'update']);
        Route::delete('/jobs/{job}', [JobController::class, 'destroy']);
        Route::get('/my-jobs', [JobController::class, 'myJobs']);
        Route::get('/jobs/{job}/applications', [JobApplicationController::class, 'jobApplications']);
    });

    // Job applications (applicants)
    Route::middleware(['role:applicant'])->group(function () {
        Route::post('/jobs/{job}/apply', [JobApplicationController::class, 'store']);
        Route::get('/my-applications', [JobApplicationController::class, 'myApplications']);
        Route::delete('/applications/{application}', [JobApplicationController::class, 'destroy']);
    });

    // Shared application routes (both roles can view specific applications they're involved with)
    Route::get('/applications/{application}', [JobApplicationController::class, 'show']);
    Route::get('/applications/{application}/resume', [JobApplicationController::class, 'downloadResume']);
    Route::get('/applications/{application}/resume/view', [JobApplicationController::class, 'viewResume']);

    // Legacy user endpoint for compatibility
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
