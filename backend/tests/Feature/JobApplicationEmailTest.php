<?php

declare(strict_types=1);

use App\Models\Job;
use App\Models\User;
use App\Notifications\JobApplicationConfirmation;
use App\Notifications\JobApplicationReceived;
use App\Services\JobApplicationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('employer receives email notification when application is submitted', function () {
    // Fake notifications
    Notification::fake();
    Storage::fake('public');

    // Create users
    $employer = User::factory()->create(['role' => 'employer']);
    $applicant = User::factory()->create(['role' => 'applicant']);

    // Create job
    $job = Job::factory()->create([
        'user_id' => $employer->id,
        'status' => 'published',
    ]);

    // Create application service
    $applicationService = app(JobApplicationService::class);

    // Submit application
    $application = $applicationService->createApplication(
        job: $job,
        user: $applicant,
        message: 'I am very interested in this position.'
    );

    // Assert employer notification was sent
    Notification::assertSentTo($employer, JobApplicationReceived::class);
});

test('applicant receives confirmation email when application is submitted', function () {
    // Fake notifications
    Notification::fake();
    Storage::fake('public');

    // Create users
    $employer = User::factory()->create(['role' => 'employer']);
    $applicant = User::factory()->create(['role' => 'applicant']);

    // Create job
    $job = Job::factory()->create([
        'user_id' => $employer->id,
        'status' => 'published',
    ]);

    // Create application service
    $applicationService = app(JobApplicationService::class);

    // Submit application
    $application = $applicationService->createApplication(
        job: $job,
        user: $applicant,
        message: 'I am very interested in this position.'
    );

    // Assert applicant confirmation was sent
    Notification::assertSentTo($applicant, JobApplicationConfirmation::class);
});

test('email notifications include correct data', function () {
    // Fake notifications
    Notification::fake();

    // Create users
    $employer = User::factory()->create([
        'role' => 'employer',
        'name' => 'Test Employer',
        'email' => 'employer@test.com'
    ]);
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'name' => 'Test Applicant',
        'email' => 'applicant@test.com'
    ]);

    // Create job
    $job = Job::factory()->create([
        'user_id' => $employer->id,
        'title' => 'Senior Developer',
        'location' => 'Remote',
        'status' => 'published',
    ]);

    // Create application service
    $applicationService = app(JobApplicationService::class);

    // Submit application
    $application = $applicationService->createApplication(
        job: $job,
        user: $applicant,
        message: 'I have 5 years of experience and would love to join your team.'
    );

    // Test employer notification content
    Notification::assertSentTo(
        $employer,
        JobApplicationReceived::class,
        function ($notification) use ($job, $employer) {
            $mailMessage = $notification->toMail($employer);
            $subject = $mailMessage->subject;
            
            return str_contains($subject, 'Senior Developer')
                && str_contains($subject, 'New Application');
        }
    );

    // Test applicant confirmation content
    Notification::assertSentTo(
        $applicant,
        JobApplicationConfirmation::class,
        function ($notification) use ($job, $applicant) {
            $mailMessage = $notification->toMail($applicant);
            $subject = $mailMessage->subject;
            
            return str_contains($subject, 'Senior Developer')
                && str_contains($subject, 'Application Confirmed');
        }
    );
});

test('email notifications work with resume attachments', function () {
    // Fake notifications and storage
    Notification::fake();
    Storage::fake('public');

    // Create users
    $employer = User::factory()->create(['role' => 'employer']);
    $applicant = User::factory()->create(['role' => 'applicant']);

    // Create job
    $job = Job::factory()->create([
        'user_id' => $employer->id,
        'status' => 'published',
    ]);

    // Create fake resume file
    $resumeFile = UploadedFile::fake()->create('resume.pdf', 1024);

    // Create application service
    $applicationService = app(JobApplicationService::class);

    // Submit application with resume
    $application = $applicationService->createApplication(
        job: $job,
        user: $applicant,
        message: 'Please find my resume attached.',
        resume: $resumeFile
    );

    // Assert notifications were sent
    Notification::assertSentToTimes($employer, JobApplicationReceived::class, 1);
    Notification::assertSentToTimes($applicant, JobApplicationConfirmation::class, 1);

    // Verify application has resume
    expect($application->resume_path)->not()->toBeNull();
    expect($application->hasResume())->toBeTrue();
}); 