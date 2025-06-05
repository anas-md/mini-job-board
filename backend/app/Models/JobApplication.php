<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class JobApplication extends Model
{
    /** @use HasFactory<\Database\Factories\JobApplicationFactory> */
    use HasFactory;

    /**
     * Attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'job_id',
        'user_id',
        'message',
        'resume_path',
        'applied_at',
    ];

    /**
     * Retrieve attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'applied_at' => 'datetime',
        ];
    }

    /**
     * Retrieve job that application belongs to.
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * Retrieve user that made the application.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Retrieve applicant that made the application (alias for user).
     */
    public function applicant(): BelongsTo
    {
        return $this->user();
    }

    /**
     * Scope a query to only include applications for a specific job.
     */
    public function scopeForJob($query, int $jobId)
    {
        return $query->where('job_id', $jobId);
    }

    /**
     * Scope a query to only include applications by a specific user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Get the full URL for the resume file.
     */
    public function getResumeUrlAttribute(): ?string
    {
        if (!$this->resume_path) {
            return null;
        }

        return asset('storage/' . $this->resume_path);
    }

    /**
     * Check if the application has a resume attached.
     */
    public function hasResume(): bool
    {
        return !empty($this->resume_path);
    }
}
