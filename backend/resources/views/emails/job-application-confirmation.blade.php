@component('mail::message')
# Application Confirmed ✅

Hello **{{ $applicant->name }}**,

Your job application has been successfully submitted!

@component('mail::panel')
**Job Title:** {{ $job->title }}  
**Company:** {{ $employer->name }}  
**Location:** {{ $job->location }}  
@if($job->is_remote)
**Work Type:** Remote  
@endif
**Applied On:** {{ $application->applied_at->format('F j, Y \a\t g:i A') }}  
@if($application->resume_path)
**Resume:** Attached to your application
@endif
@endcomponent

## Your Application Message:

{{ $application->message }}

---

**What happens next?**

Your application is now being reviewed by the employer. You will be contacted directly if you are selected for an interview.

@component('mail::button', ['url' => $actionUrl])
View Your Applications
@endcomponent

You can track the status of all your applications in your dashboard.

Good luck with your application! 🚀

Thanks,<br>
{{ config('app.name') }} Team
@endcomponent 