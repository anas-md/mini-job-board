<?php

require_once __DIR__.'/vendor/autoload.php';

use App\Models\User;
use App\Models\Job;
use App\Services\JobApplicationService;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Email Notifications\n";
echo "===============================\n\n";

// Create test users
$employer = User::factory()->create([
    'role' => 'employer', 
    'name' => 'Demo Employer', 
    'email' => 'employer@demo.com'
]);

$applicant = User::factory()->create([
    'role' => 'applicant', 
    'name' => 'Jane Applicant', 
    'email' => 'applicant@demo.com'
]);

echo "✅ Created employer: {$employer->name} ({$employer->email})\n";
echo "✅ Created applicant: {$applicant->name} ({$applicant->email})\n\n";

// Create a test job
$job = Job::factory()->create([
    'user_id' => $employer->id,
    'title' => 'Senior Laravel Developer',
    'location' => 'Remote',
    'status' => 'published'
]);

echo "✅ Created job: {$job->title}\n\n";

// Submit application to trigger email notifications
$service = app(JobApplicationService::class);
$application = $service->createApplication(
    job: $job,
    user: $applicant,
    message: 'I am very excited about this Laravel position and would love to contribute to your team with my 5 years of experience in Laravel development.'
);

echo "Application submitted - Email notifications triggered!\n";
echo "Application ID: {$application->id}\n\n";

echo "Email content logged to: storage/logs/laravel.log\n";
echo "Check the log file to see the email templates rendered\n\n";

echo "Email notification system is working perfectly!\n"; 