# Quick Start Guide - Running All Three Services

## Prerequisites
- Node.js v14+ installed
- npm installed
- A running Supabase instance with proper configuration in `server/.env`

## Installation (Already Done)

All dependencies have been installed:
- ✅ Server: `server/node_modules`
- ✅ Admin Portal: `admin-portal/node_modules`
- ✅ Student-Counsellor: `student-counsellor/node_modules`

## Running the Application

### Option 1: Run All Services in Separate Terminals (Recommended)

Open 3 different terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 - Admin Portal:**
```bash
cd admin-portal
npm run dev
# Admin portal will start on http://localhost:5174
```

**Terminal 3 - Student-Counsellor App:**
```bash
cd student-counsellor
npm run dev
# Student-counsellor app will start on http://localhost:5173
```

### Option 2: Run Using npm Concurrently (Install First)

From the root directory:
```bash
npm install concurrently --save-dev
npm run dev:all
```

## Accessing the Applications

- **Backend API:** http://localhost:5000
- **Admin Portal:** http://localhost:5174
- **Student-Counsellor Portal:** http://localhost:5173

## Troubleshooting

### Port Already in Use
If a port is already in use, you can specify a different port:
- Admin Portal: Change port 5174 in `admin-portal/vite.config.js`
- Student-Counsellor: Change port 5173 in `student-counsellor/vite.config.js`
- Server: Change PORT in `server/.env`

### Supabase Connection Error
Verify that `server/.env` has the correct:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`

### CORS Errors
If you get CORS errors, ensure the server is running and the client is trying to connect to the correct server address.

### Dependencies Not Found
If you get "module not found" errors, try:
```bash
# In the specific folder where you got the error
npm install
```

## File Structure Summary

```
college-counselling-system/
├── server/
│   ├── package.json         ✅ Now present
│   ├── server.js            ✅ Now present with full API routes
│   ├── .env                 ✅ Contains Supabase config
│   └── node_modules/
├── admin-portal/
│   ├── .env                 ✅ Now present with API URL
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/
├── student-counsellor/
│   ├── .env                 ✅ Now present with API URL
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/
└── database.sql             (Use this to set up Supabase)
```

## Environment Variables Set Up

### Server (.env) - Already Configured
- PORT=5000
- SUPABASE_URL
- SUPABASE_KEY
- SUPABASE_SERVICE_KEY
- JWT_SECRET
- Email configuration (Brevo)

### Admin Portal (.env) - Created
- VITE_API_URL=http://localhost:5000/api

### Student-Counsellor (.env) - Created
- VITE_API_URL=http://localhost:5000/api

## What Was Fixed

1. ✅ Created missing `server/package.json`
2. ✅ Created complete `server/server.js` with all API endpoints
3. ✅ Created `.env` file in `admin-portal/` with API configuration
4. ✅ Created `.env` file in `student-counsellor/` with API configuration
5. ✅ Installed all dependencies for all three services

All three applications are now ready to run!
