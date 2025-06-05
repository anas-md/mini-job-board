<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobApplication>
 */
final class JobApplicationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = JobApplication::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $messages = [
            'I am very interested in this position and believe my skills would be a great fit for your team.',
            'With over 5 years of experience in this field, I am confident I can contribute to your company\'s success.',
            'I am passionate about this role and excited about the opportunity to work with your organization.',
            'My background in technology and proven track record make me an ideal candidate for this position.',
            'I would love to bring my expertise and enthusiasm to this role at your company.',
        ];

        return [
            'job_id' => Job::factory(),
            'user_id' => User::factory()->create(['role' => 'applicant']),
            'message' => fake()->randomElement($messages),
            'resume_path' => null,
            'applied_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Indicate that the application has a resume attached.
     */
    public function withResume(): static
    {
        return $this->state(fn (array $attributes) => [
            'resume_path' => 'resumes/' . fake()->uuid() . '.pdf',
        ]);
    }

    /**
     * Set a specific application message.
     */
    public function withMessage(string $message): static
    {
        return $this->state(fn (array $attributes) => [
            'message' => $message,
        ]);
    }

    /**
     * Set the application for a specific job.
     */
    public function forJob(Job $job): static
    {
        return $this->state(fn (array $attributes) => [
            'job_id' => $job->id,
        ]);
    }

    /**
     * Set the application from a specific user.
     */
    public function fromUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
} 