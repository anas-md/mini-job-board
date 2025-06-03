<?php

declare(strict_types=1);

namespace App\Http\Requests\JobApplication;

use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

final class StoreJobApplicationRequest extends FormRequest
{
    /**
     * Determine if user is authorized to make request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $job = $this->route('job');
        
        if (!$user?->isApplicant()) {
            return false;
        }
        
        if (!$job instanceof Job || !$job->isPublished()) {
            return false;
        }
        
        // Check if user already applied to job posting
        $existingApplication = JobApplication::where('job_id', $job->id)
            ->where('user_id', $user->id)
            ->exists();
            
        if ($existingApplication) {
            throw ValidationException::withMessages([
                'job' => ['You have already applied to this job.'],
            ]);
        }
        
        return true;
    }

    /**
     * Get validation rules that apply to request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'message.required' => 'Please provide a message explaining why you are interested in this position.',
            'message.max' => 'Your application message cannot exceed 1000 characters.',
        ];
    }
}
