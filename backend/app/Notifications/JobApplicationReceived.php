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

final class JobApplicationReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly JobApplication $application,
        private readonly Job $job,
        private readonly User $applicant
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
            ->subject("New Application for: {$this->job->title}")
            ->markdown('emails.job-application-received', [
                'employer' => $notifiable,
                'job' => $this->job,
                'applicant' => $this->applicant,
                'application' => $this->application,
                'actionUrl' => $frontendUrl . '/dashboard/employer',
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
            'applicant_name' => $this->applicant->name,
            'applied_at' => $this->application->applied_at,
        ];
    }
} 