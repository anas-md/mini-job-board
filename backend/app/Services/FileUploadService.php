<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class FileUploadService
{
    /**
     * Upload a resume file and return the path.
     */
    public function uploadResume(UploadedFile $file): string
    {
        $filename = $this->generateSecureFilename($file);
        $path = $file->storeAs('resumes', $filename, 'public');
        
        return $path;
    }

    /**
     * Delete a resume file.
     */
    public function deleteResume(string $path): bool
    {
        return Storage::disk('public')->delete($path);
    }

    /**
     * Generate a secure filename for uploaded files.
     */
    private function generateSecureFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('Y-m-d_H-i-s');
        $randomString = Str::random(10);
        
        return sprintf('%s_%s.%s', $timestamp, $randomString, $extension);
    }

    /**
     * Check if a file exists in storage.
     */
    public function fileExists(string $path): bool
    {
        return Storage::disk('public')->exists($path);
    }
} 