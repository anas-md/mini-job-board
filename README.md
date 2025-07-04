# Mini Job Board Application

A full-stack job board application built with Laravel and Next.js that allows employers to post job listings and applicants to browse and apply to jobs.

This project is an assessment for the Full Stack Engineer role at Agmo Artisan Sdn. Bhd.

## 🛠 Tech Stack

### Backend
- **Laravel 12.0+** - PHP framework
- **PHP 8.2+** - Programming language
- **Laravel Sanctum** - API authentication
- **MySQL/SQLite** - Database
- **Pest** - Testing framework

### Frontend
- **Next.js 15.3.3** - React framework
- **React 19** - JavaScript library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## ✨ Features

### Authentication & Authorization
- User registration and login
- Role-based access control (Employer/Applicant)
- JWT token authentication via Laravel Sanctum
- Protected routes and middleware

### For Employers
- Create, edit, and delete job listings
- View and manage job applications
- Dashboard with job statistics
- Job status management (draft, published, closed)

### For Applicants
- Browse published job listings
- Apply to jobs with custom messages
- View application history
- Job search and filtering

### General Features
- Responsive design (mobile-first)
- Real-time form validation
- Pagination for job listings
- Error handling and user feedback
- RESTful API architecture
- **Email notifications for job applications** ✨
- Background job processing with queues

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm/yarn
- MySQL (or SQLite for development)

### Backend Setup (Laravel)

1. Navigate to backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your database in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mini_job_board
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Configure email settings in `.env`:
```env
# For development (emails logged to storage/logs/laravel.log)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@minijobboard.com"
MAIL_FROM_NAME="${APP_NAME}"
APP_FRONTEND_URL=http://localhost:3000
```

7. Run migrations and seeders:
```bash
php artisan migrate --seed
```

8. Start the queue worker (for email notifications):
```bash
php artisan queue:work
```

9. Start the development server:
```bash
php artisan serve
```

The Laravel API will be available at `http://localhost:8000`

### Frontend Setup (Next.js)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

5. Start the development server:
```bash
npm run dev
```

The Next.js application will be available at `http://localhost:3000`

## 📁 Project Structure

```
mini-job-board/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Notifications/  # Email notification 
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── resources/views/emails/ 
│   ├── routes/api.php
│   └── ...
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and configurations
│   │   └── store/        # Redux store
│   └── ...
└── README.md
```

## 🔗 API Documentation

The API follows RESTful conventions with the following main endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Jobs
- `GET /api/jobs` - Get all published jobs (public)
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs` - Create job (employer only)
- `PUT /api/jobs/{id}` - Update job (employer only)
- `DELETE /api/jobs/{id}` - Delete job (employer only)
- `GET /api/my-jobs` - Get employer's jobs

### Applications
- `POST /api/jobs/{id}/apply` - Apply to job (applicant only)
- `GET /api/my-applications` - Get applicant's applications
- `GET /api/jobs/{id}/applications` - Get job applications (employer only)
- `DELETE /api/applications/{id}` - Withdraw application

## 🧪 Testing

### Backend Tests
The Laravel backend includes comprehensive tests covering:
- Authentication (registration, login, logout)
- Job CRUD operations
- Application management
- Email notifications
- Resume upload/download

```bash
cd backend
php artisan test
# or
php artisan test --parallel
```

### Frontend Tests
React Testing Library tests for components:
- Authentication forms
- Job listings
- Application management
- UI components

```bash
cd frontend
npm install  # Install test dependencies
npm run test
# or for watch mode
npm run test:watch
```

### API Testing
Use the provided Postman collection:
```bash
# Import mini-job-board-api.postman_collection.json
# Set base_url variable to: http://localhost:8000
# Test all endpoints with authentication
```

## 🔐 Test Accounts

After running the database seeder, you can use these test accounts:

**Employer Account:**
- Email: `employer@example.com`
- Password: `password`

**Applicant Account:**
- Email: `applicant@example.com`
- Password: `password`

## 🎯 Development Scripts

### Backend
```bash
php artisan serve     # Start Laravel server
php artisan queue:work # Start queue worker for emails
php artisan test      # Run tests
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔧 Environment Variables

### Backend (.env)
```env
APP_NAME="Mini Job Board"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mini_job_board
DB_USERNAME=
DB_PASSWORD=

# Email Configuration
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# For production SMTP:
# MAIL_MAILER=smtp
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=your-email@gmail.com
# MAIL_PASSWORD=your-app-password
# MAIL_ENCRYPTION=tls
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

