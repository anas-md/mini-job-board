<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class JobApplicationConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly JobApplication $application,
        private readonly Job $job,
        private readonly User $employer
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        
        return (new MailMessage)
            ->subject("Application Confirmed: {$this->job->title}")
            ->markdown('emails.job-application-confirmation', [
                'applicant' => $notifiable,
                'job' => $this->job,
                'employer' => $this->employer,
                'application' => $this->application,
                'actionUrl' => $frontendUrl . '/dashboard/applicant',
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'job_id' => $this->job->id,
            'job_title' => $this->job->title,
            'application_id' => $this->application->id,
            'employer_name' => $this->employer->name,
            'applied_at' => $this->application->applied_at,
        ];
    }
} 