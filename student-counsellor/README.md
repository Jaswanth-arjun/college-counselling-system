# College Counselling System - Student & Counsellor Portal

A comprehensive React application for students and counsellors to manage academic counselling interactions.

## 📋 Overview

This dual-role application serves:
- **Students**: Register, manage profiles, request counselling sessions, track academic progress
- **Counsellors**: Manage assigned students, create and track counselling records, monitor student progress

## 🏗️ Project Structure

```
student-counsellor/
├── src/
│   ├── components/           # Reusable React components
│   │   └── PrivateRoute.jsx # Protected route component
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication & user context
│   ├── pages/
│   │   ├── Login.jsx         # User login page
│   │   ├── Register.jsx      # Student registration
│   │   ├── VerificationSuccess.jsx # Email verification success
│   │   ├── VerificationFailed.jsx  # Email verification failure
│   │   ├── student/
│   │   │   ├── Dashboard.jsx        # Student dashboard
│   │   │   ├── Profile.jsx          # Student profile management
│   │   │   ├── UpdateSemester.jsx   # Update academic info
│   │   │   └── CounsellingForm.jsx  # Request counselling
│   │   └── counsellor/
│   │       ├── Dashboard.jsx        # Counsellor dashboard
│   │       ├── StudentList.jsx      # View assigned students
│   │       ├── StudentDetails.jsx   # Student details view
│   │       └── CounsellingRecord.jsx # Record counselling session
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🚀 Installation

### Prerequisites
- Node.js v14+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```
Application will start on `http://localhost:5179` (or next available port)

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 📚 Features

### Student Features

#### Authentication
- ✅ User registration with email verification
- ✅ Secure login with JWT
- ✅ Email verification link
- ✅ Password management
- ✅ Automatic logout on token expiry

#### Profile Management
- ✅ View and edit personal information
- ✅ Upload and crop profile picture
- ✅ Update academic details (year, semester, branch, section)
- ✅ View assigned counsellor
- ✅ Track academic progress

#### Counselling
- ✅ Request counselling sessions
- ✅ View counselling history
- ✅ Track counselling records
- ✅ Receive recommendations from counsellor
- ✅ Schedule follow-up sessions

### Counsellor Features

#### Student Management
- ✅ View all assigned students
- ✅ Filter students by year, semester, branch, section
- ✅ Search students by name/roll number
- ✅ View detailed student information
- ✅ Track student progress

#### Counselling Records
- ✅ Create new counselling records
- ✅ Record academic details (CGPA, backlogs, attendance)
- ✅ Add counselling notes
- ✅ Provide recommendations
- ✅ View counselling history

#### Dashboard
- ✅ Overview of assigned students count
- ✅ Quick access to students
- ✅ Recent activities
- ✅ Assignment information

## 🎨 Pages

### Authentication Pages

#### Login (`/login`)
- Email/Roll number input
- Password input
- "Remember me" option
- Forgot password link
- Register link for new students
- Error message display

#### Register (`/register`)
- Roll number input
- Email input
- Password with strength indicator
- Name input
- Email verification prompt
- Success/error notifications

#### Email Verification Pages
- **Success Page** (`/verification-success`): Confirmation message
- **Failed Page** (`/verification-failed`): Retry options

### Student Pages

#### Student Dashboard (`/student/dashboard`)
- Assigned counsellor information
- Quick statistics
- Recent counselling records
- Quick action buttons
- Profile status

#### Student Profile (`/student/profile`)
- Personal information (name, email, roll number)
- Profile picture with crop functionality
- Academic details (year, semester, branch, section)
- Contact information
- Edit capabilities
- Image upload with preview

#### Update Semester (`/student/update-semester`)
- Current academic details display
- Update year and semester
- Confirmation before saving
- Success/error notifications

#### Counselling Form (`/student/counselling-form`)
- Request new counselling session
- Select counselling type
- Describe concerns/topics
- Schedule preference
- Optional attachments
- Submit and confirmation

### Counsellor Pages

#### Counsellor Dashboard (`/counsellor/dashboard`)
- Navigation sidebar
- Current assignments overview
- Assigned students count
- Quick access to students list
- Recent activities
- Settings access

#### Student List (`/counsellor/students`)
- Pagination support
- Filter by year, semester, branch, section
- Search functionality
- Student cards with key info
- Quick links to student details
- Contact information

#### Student Details (`/counsellor/students/:id`)
- Full student profile information
- Academic records
- Counselling history
- Create new counselling record button
- Previous recommendations
- Contact methods

#### Counselling Record (`/counsellor/counselling-record`)
- Student selection
- Semester and academic year selection
- Academic information (CGPA, backlogs, attendance)
- Counselling notes text area
- Recommendations field
- Session date tracking
- Save and confirmation

## 🔐 Authentication & Authorization

### Authentication Flow
1. User enters credentials on login page
2. POST request to `/api/auth/login`
3. JWT token received and stored in localStorage
4. User redirected to dashboard based on role
5. Token sent with all API requests

### Role-based Access Control
- **Student Role**: Can access student pages only
- **Counsellor Role**: Can access counsellor pages only
- **Unverified Students**: Prompted to verify email

### PrivateRoute Component
```jsx
<PrivateRoute requiredRole="student">
  <StudentDashboard />
</PrivateRoute>
```

## 🔌 API Integration

### Base URL
```
http://localhost:5000/api
```

### Headers Required
```javascript
{
  'x-auth-token': 'jwt-token-here',
  'Content-Type': 'application/json'
}
```

### Key Endpoints Used

#### Authentication
```
POST /auth/register/student
POST /auth/login
GET /auth/verify-email/:token
POST /auth/verify-email
```

#### Student Routes
```
GET /student/profile
PUT /student/profile
POST /student/profile-picture
GET /student/counsellors
```

#### Counsellor Routes
```
GET /counsellor/students
GET /counsellor/students/:id
POST /counsellor/counselling-record
```

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Custom color scheme
- Smooth animations

### Icons
Uses **lucide-react** icons:
- User, Mail, Phone, MapPin
- LayoutDashboard, Users, FileText
- LogOut, Menu, X, Filter
- Camera, Save, Upload, Crop
- Edit, Plus, Trash, Check
- And many more

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "axios": "^1.13.4",
  "lucide-react": "^0.563.0",
  "react-hook-form": "^7.71.1",
  "@hookform/resolvers": "^5.2.2",
  "yup": "^1.7.1",
  "react-cropper": "^2.3.3",
  "cropperjs": "^2.1.0",
  "tailwindcss": "^3.4.19",
  "autoprefixer": "^10.4.24",
  "postcss": "^8.5.6"
}
```

## 🖼️ Image Handling

### Profile Picture Upload
- File upload with preview
- Image cropper (react-cropper)
- Aspect ratio preservation
- Drag and drop support
- File size validation (max 5MB)

### Cropper Features
- Customize crop area
- Rotate image
- Reset to original
- Preview before upload
- Responsive cropper

## 📝 Form Validation

Uses **react-hook-form** with **Yup** validators:
```javascript
const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(6).required('Password required'),
  roll_no: yup.string().required('Roll number required'),
  name: yup.string().required('Name is required')
});
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Breakpoints: sm, md, lg, xl, 2xl
- ✅ Flexible navigation
- ✅ Touch-friendly interface
- ✅ Optimized for tablets and desktops

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Hosting
1. Build the project
2. Upload `dist/` folder to static hosting
3. Configure SPA routing redirects
4. Set environment variables

## 🚨 Troubleshooting

### Email Verification Not Working
- Check backend email configuration
- Use manual verification token from server logs
- Verify email address in database
- Check spam/junk folders

### Profile Picture Upload Failed
- Verify file size (max 5MB)
- Check image format (JPEG, PNG)
- Verify backend file storage
- Check CORS configuration

### Login Not Working
- Verify credentials in database
- Check backend is running
- Review browser console errors
- Check network tab in DevTools

### Styles Not Loading
- Clear browser cache
- Restart dev server
- Check Tailwind configuration
- Verify CSS imports

### API Connection Failed
- Verify backend server is running
- Check API_URL environment variable
- Check network connectivity
- Review CORS settings

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure token storage
- ✅ Password hashing (backend)

## 📊 Performance Optimization

- ✅ Code splitting
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Minified builds
- ✅ CSS purging with Tailwind

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify backend server is running
3. Check network requests in DevTools
4. Review server logs
5. Check parent README for system-wide setup
