@component('mail::message')
# New Job Application Received

Hello **{{ $employer->name }}**,

You have received a new job application for your position:

@component('mail::panel')
**Job Title:** {{ $job->title }}  
**Applicant:** {{ $applicant->name }}  
**Applied On:** {{ $application->applied_at->format('F j, Y \a\t g:i A') }}  
@if($application->resume_path)
**Resume:** Attached to application
@endif
@endcomponent

## Application Message:

{{ $application->message }}

@component('mail::button', ['url' => $actionUrl])
View Application Details
@endcomponent

You can review the full application and any attached resume in your employer dashboard.

Thanks,<br>
{{ config('app.name') }} Team
@endcomponent 