<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create test employer
        $employer = User::create([
            'name' => 'John Employer',
            'email' => 'employer@example.com',
            'password' => Hash::make('password'),
            'role' => 'employer',
        ]);

        // Create test applicant
        $applicant = User::create([
            'name' => 'Jane Applicant',
            'email' => 'applicant@example.com',
            'password' => Hash::make('password'),
            'role' => 'applicant',
        ]);

        // Create additional test users
        $employer2 = User::create([
            'name' => 'Tech Corp',
            'email' => 'hr@techcorp.com',
            'password' => Hash::make('password'),
            'role' => 'employer',
        ]);

        $applicant2 = User::create([
            'name' => 'Bob Developer',
            'email' => 'bob@example.com',
            'password' => Hash::make('password'),
            'role' => 'applicant',
        ]);

        // Create test jobs
        $job1 = Job::create([
            'user_id' => $employer->id,
            'title' => 'Senior Laravel Developer',
            'description' => 'We are looking for an experienced Laravel developer to join our team. Must have 5+ years of experience with PHP and Laravel framework.',
            'location' => 'New York, NY',
            'salary_range' => '$80,000 - $120,000',
            'is_remote' => false,
            'status' => 'published',
        ]);

        $job2 = Job::create([
            'user_id' => $employer->id,
            'title' => 'Frontend React Developer',
            'description' => 'Remote position for a skilled React developer. Experience with Next.js and TypeScript preferred.',
            'location' => 'Remote',
            'salary_range' => '$70,000 - $100,000',
            'is_remote' => true,
            'status' => 'published',
        ]);

        $job3 = Job::create([
            'user_id' => $employer2->id,
            'title' => 'Full Stack Engineer',
            'description' => 'Join our startup as a full stack engineer. Work with modern technologies and shape the future of our product.',
            'location' => 'San Francisco, CA',
            'salary_range' => '$90,000 - $130,000',
            'is_remote' => false,
            'status' => 'published',
        ]);

        $job4 = Job::create([
            'user_id' => $employer2->id,
            'title' => 'DevOps Engineer',
            'description' => 'Help us build and maintain our cloud infrastructure. Experience with AWS and Docker required.',
            'location' => 'Austin, TX',
            'salary_range' => '$85,000 - $125,000',
            'is_remote' => true,
            'status' => 'published',
        ]);

        // Create test job applications
        JobApplication::create([
            'job_id' => $job1->id,
            'user_id' => $applicant->id,
            'message' => 'I am very interested in this position. I have 6 years of experience with Laravel and have worked on several large-scale applications.',
            'applied_at' => now()->subDays(2),
        ]);

        JobApplication::create([
            'job_id' => $job3->id,
            'user_id' => $applicant->id,
            'message' => 'This role aligns perfectly with my career goals. I have experience with both frontend and backend development.',
            'applied_at' => now()->subDay(),
        ]);

        JobApplication::create([
            'job_id' => $job2->id,
            'user_id' => $applicant2->id,
            'message' => 'I have been working with React for 4 years and have extensive experience with Next.js and TypeScript.',
            'applied_at' => now()->subHours(5),
        ]);
    }
}
