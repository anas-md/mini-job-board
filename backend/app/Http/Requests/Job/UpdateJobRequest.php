<?php

declare(strict_types=1);

namespace App\Http\Requests\Job;

use App\Models\Job;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateJobRequest extends FormRequest
{
    /**
     * Determine if user is authorized to make request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $job = $this->route('job');
        
        return $user?->isEmployer() && $job instanceof Job && $job->isOwnedBy($user);
    }

    /**
     * Retrieve validation rules that apply to request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'salary_range' => ['nullable', 'string', 'max:255'],
            'is_remote' => ['boolean'],
            'status' => ['sometimes', 'required', 'string', Rule::in(['draft', 'published', 'closed'])],
        ];
    }

    /**
     * Retrieve custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.in' => 'The status must be one of: draft, published, closed.',
        ];
    }
}
