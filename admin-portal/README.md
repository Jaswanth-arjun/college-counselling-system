# College Counselling System - Admin Portal

A modern React-based admin dashboard for managing the College Counselling System.

## 📋 Overview

The Admin Portal provides administrators with tools to:
- Register and manage counsellors
- Monitor all students in the system
- Track counselling records
- View admin activity logs
- Manage system configurations

## 🏗️ Project Structure

```
admin-portal/
├── src/
│   ├── components/           # Reusable React components
│   │   └── PrivateRoute.jsx # Protected route component
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── pages/                # Page components
│   │   ├── Login.jsx         # Admin login
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── DashboardHome.jsx # Dashboard home
│   │   ├── Counsellors.jsx   # Counsellor management
│   │   ├── Students.jsx      # Student listing
│   │   ├── RegisterCounsellor.jsx # Counsellor registration
│   │   └── AdminLogs.jsx     # Activity logs
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
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
Admin portal will start on `http://localhost:5177` (or next available port)

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 📚 Features

### Authentication
- ✅ Secure admin login
- ✅ JWT token management
- ✅ Protected routes with PrivateRoute component
- ✅ Automatic logout on token expiry

### Counsellor Management
- ✅ Register new counsellors
- ✅ View all counsellors
- ✅ Assign students to counsellors
- ✅ Manage counsellor details
- ✅ View counsellor workload

### Student Management
- ✅ View all registered students
- ✅ Search and filter students
- ✅ View student details and assignments
- ✅ Track student progress
- ✅ Pagination support

### Counselling Records
- ✅ View all counselling records
- ✅ Track counselling session details
- ✅ Monitor student academic progress
- ✅ Review counsellor recommendations

### Admin Logs
- ✅ View all admin activities
- ✅ Track system changes
- ✅ Audit trail for compliance
- ✅ Filter logs by action type
- ✅ Export logs (optional)

### Dashboard
- ✅ Overview of system statistics
- ✅ Quick access to key features
- ✅ Recent activity summary
- ✅ System health indicators

## 🎨 UI Components

### PrivateRoute Component
Protects routes that require authentication:
```jsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

## 🔐 Authentication Flow

1. Admin enters credentials on login page
2. Request sent to `/api/auth/login`
3. JWT token received and stored in localStorage
4. Token sent with all API requests in `x-auth-token` header
5. PrivateRoute protects authenticated pages
6. Logout clears token and redirects to login

## 📱 Pages

### Login Page (`/login`)
- Email and password input
- Form validation
- Error message display
- Responsive design

### Dashboard (`/dashboard`)
- Home overview with statistics
- Navigation to all sections
- Quick links to common tasks
- System status display

### Counsellors Page (`/counsellors`)
- List of all counsellors
- Filter and search functionality
- Counsellor registration form
- Edit counsellor details
- View assigned students count

### Students Page (`/students`)
- Paginated student listing
- Search by roll number, name, email
- Filter by year, semester, branch, section
- View student details
- Track assigned counsellor
- Sort options

### Register Counsellor Page (`/register-counsellor`)
- Counsellor registration form
- Input fields:
  - Counsellor ID
  - Name
  - Email
  - Password
  - Assignment details (year, semester, branch, section)
  - Maximum students
- Form validation
- Success/error notifications

### Admin Logs Page (`/admin-logs`)
- Activity log display
- Pagination support
- Filter by action type
- Filter by date range
- View detailed log information
- Timestamps and admin details

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

#### Login
```
POST /auth/login
```

#### Register Counsellor
```
POST /admin/register-counsellor
```

#### Get Students
```
GET /admin/students?page=1&limit=20
```

#### Get Counsellors
```
GET /admin/counsellors
```

#### Get Logs
```
GET /admin/logs?page=1&limit=50
```

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom configuration in `tailwind.config.js`
- Responsive design with mobile-first approach

### Icons
Uses **lucide-react** icons:
- LayoutDashboard
- Users
- FileText
- LogOut
- Menu
- Filter
- And many more

## 🔧 Configuration

### Vite Configuration
- HMR enabled for dev server
- React plugin for JSX
- Optimized build output

### Tailwind Configuration
- Custom color scheme
- Extended spacing
- Custom fonts
- Plugin support

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
  "tailwindcss": "^3.4.19",
  "autoprefixer": "^10.4.24",
  "postcss": "^8.5.6"
}
```

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ Error handling
- ✅ Secure token storage (localStorage)
- ✅ CORS protection

## 🚨 Troubleshooting

### Port Already in Use
Vite will automatically try the next available port. Check console for actual URL.

### API Connection Failed
- Verify backend server is running on port 5000
- Check network connectivity
- Verify API_URL in environment
- Check browser console for CORS errors

### Login Not Working
- Verify backend is running
- Check credentials
- Review browser console for errors
- Check network tab in DevTools

### Styles Not Loading
- Clear cache: `npm run build && npm run preview`
- Check Tailwind configuration
- Restart dev server

### Page Not Found
- Verify routing in App.jsx
- Check route path spelling
- Ensure component is exported properly

## 📝 Form Validation

Uses **react-hook-form** with **Yup** validators:
```javascript
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  name: yup.string().required()
});
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Flexible navigation
- ✅ Touch-friendly interfaces

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Hosting
1. Build the project
2. Upload `dist/` folder to static hosting
3. Configure server redirects for SPA routing
4. Set environment variables on hosting platform

### Environment Variables on Deployment
Set `VITE_API_URL` to point to production backend

## 📊 Performance Optimization

- ✅ Code splitting with Vite
- ✅ Lazy loading for routes
- ✅ Image optimization
- ✅ Minified production builds
- ✅ CSS purging with Tailwind

## 📞 Support

For issues or contributing:
1. Check browser console for errors
2. Verify backend is running
3. Check network requests in DevTools
4. Review component console logs
5. Check parent README for system-wide setup
