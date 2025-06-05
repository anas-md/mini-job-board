<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
final class JobFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Job::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $salaryRanges = [
            '$40,000 - $60,000',
            '$60,000 - $80,000',
            '$80,000 - $100,000',
            '$100,000 - $120,000',
            '$120,000 - $150,000',
            '$150,000 - $200,000',
        ];

        return [
            'user_id' => User::factory(),
            'title' => fake()->jobTitle(),
            'description' => fake()->paragraphs(3, true),
            'location' => fake()->city() . ', ' . fake()->stateAbbr(),
            'salary_range' => fake()->randomElement($salaryRanges),
            'is_remote' => fake()->boolean(30), // 30% chance of being remote
            'status' => fake()->randomElement(['draft', 'published', 'closed']),
        ];
    }

    /**
     * Indicate that the job should be published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    /**
     * Indicate that the job should be a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * Indicate that the job should be closed.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed',
        ]);
    }

    /**
     * Indicate that the job should be remote.
     */
    public function remote(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_remote' => true,
        ]);
    }

    /**
     * Indicate that the job should be on-site.
     */
    public function onSite(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_remote' => false,
        ]);
    }
} 