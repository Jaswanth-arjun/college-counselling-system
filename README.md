# College Counselling System

A comprehensive full-stack web application designed to manage student-counsellor interactions and admin operations for a college counselling system.

## 📋 Project Overview

The College Counselling System is a three-tier application that enables:
- **Students** to register, create profiles, and request counselling sessions
- **Counsellors** to manage assigned students and track counselling records
- **Admins** to oversee the entire system, register counsellors, and maintain logs

## 🏗️ Architecture

```
college-counselling-system/
├── server/                    # Node.js Express backend API
├── admin-portal/              # React admin dashboard
├── student-counsellor/        # React app for students and counsellors
└── package.json               # Root package configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14+)
- **npm** or **yarn**
- **Supabase** account (for database)
- **Brevo** account (for email, optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd college-counselling-system
```

2. Install dependencies for all modules:
```bash
# Install server dependencies
cd server && npm install & cd ..

# Install admin-portal dependencies
cd admin-portal && npm install & cd ..

# Install student-counsellor dependencies
cd student-counsellor && npm install & cd ..
```

### Environment Setup

Create a `.env` file in the `server/` directory:
```env
# Supabase Configuration
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Brevo)
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_brevo_email
BREVO_SMTP_PASS=your_brevo_api_key
FROM_EMAIL=noreply@counsellingsystem.com

# Frontend URLs
FRONTEND_URL=http://localhost:5179
ADMIN_FRONTEND_URL=http://localhost:5177
```

### Running the Application

**Start Backend Server:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Start Admin Portal:**
```bash
cd admin-portal
npm run dev
# Admin portal runs on http://localhost:5177
```

**Start Student-Counsellor App:**
```bash
cd student-counsellor
npm run dev
# Student-counsellor app runs on http://localhost:5179
```

## 📁 Folder Structure

### Root Level
- `package.json` - Root package configuration
- `README.md` - Project documentation

### Server (`/server`)
Backend API built with Express.js
- Handles authentication, student registration, counsellor management
- Supabase integration for database
- Email notifications
- Admin logging and auditing

### Admin Portal (`/admin-portal`)
React-based admin dashboard
- Register and manage counsellors
- View all students and counselling records
- Track admin activities with logs
- Manage system settings

### Student-Counsellor (`/student-counsellor`)
React app for dual role (student and counsellor)
- Student registration and profile management
- Counsellor dashboard for student management
- Counselling record tracking
- Profile picture upload with image cropping

## 🔑 Key Features

### For Students
- ✅ User registration with email verification
- ✅ Profile creation and management
- ✅ Request counselling sessions
- ✅ View assigned counsellor information
- ✅ Track counselling records

### For Counsellors
- ✅ Dashboard to view assigned students
- ✅ Student detail viewing
- ✅ Create and manage counselling records
- ✅ Track student progress
- ✅ Settings management

### For Admins
- ✅ Register and manage counsellors
- ✅ View all students in the system
- ✅ Monitor counselling records
- ✅ Track all admin activities
- ✅ System logs and audit trails

## 🗄️ Database

The system uses **Supabase** (PostgreSQL) with the following main tables:
- `users` - User accounts (students, counsellors, admins)
- `students` - Student information and metadata
- `counsellors` - Counsellor profiles and assignments
- `counselling_records` - Counselling session records
- `admin_logs` - Admin actions and audit trails

## 🔐 Authentication

- JWT-based authentication
- Password hashing with bcryptjs
- Email verification for student registration
- Role-based access control (RBAC): student, counsellor, admin

## 📧 Email Notifications

- Student registration verification emails
- Password reset notifications
- Counselling session bookings (when configured)
- Admin action alerts (optional)

**Note:** Email sending requires Brevo SMTP credentials configured in `.env`

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register/student` - Student registration
- `POST /api/auth/register/counsellor` - Counsellor registration (admin only)
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/verify-email` - Manual email verification

### Student Routes
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `POST /api/student/profile-picture` - Upload profile picture

### Counsellor Routes
- `GET /api/counsellor/students` - Get assigned students
- `GET /api/counsellor/students/:id` - Get student details
- `POST /api/counsellor/counselling-record` - Create counselling record

### Admin Routes
- `POST /api/admin/register-counsellor` - Register new counsellor
- `GET /api/admin/students` - Get all students
- `GET /api/admin/counsellors` - Get all counsellors
- `GET /api/admin/logs` - Get admin activity logs

## 🧪 Testing

### Create Admin User Script
Run the admin user creation script to generate password hashes:
```bash
cd server
node create-admin.js
```

This will output hashed passwords for admin accounts. Use these hashes when inserting admin records into the database.

## 📦 Dependencies

### Server
- express - Web framework
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- @supabase/supabase-js - Supabase client
- nodemailer - Email sending
- express-validator - Input validation

### Client (Admin & Student-Counsellor)
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- tailwindcss - CSS framework
- lucide-react - Icons
- react-cropper - Image cropping

## 🚨 Troubleshooting

### Port Already in Use
If ports are in use, the Vite dev servers will automatically try the next available port.

### Email Not Sending
- Verify Brevo credentials in `.env`
- Check network connectivity
- Review server console for email error logs
- Use manual verification endpoint if email fails: `POST /api/auth/verify-email`

### Database Connection Issues
- Verify Supabase credentials
- Check database table structure
- Ensure service role key has proper permissions

## 📝 License

This project is part of a college management system.

## 👥 Support

For issues or questions, please contact the development team or refer to individual module README files:
- [Server README](./server/README.md)
- [Admin Portal README](./admin-portal/README.md)
- [Student-Counsellor README](./student-counsellor/README.md)

## 🔗 Repository

This workspace is pushed to GitHub: https://github.com/Jaswanth-arjun/college-counselling-system.git

If you want me to open a PR, create tags, or add CI, tell me which workflow you'd like and I will add it.
