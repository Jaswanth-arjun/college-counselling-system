import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/student/Dashboard'
import CounsellorDashboard from './pages/counsellor/Dashboard'
import VerificationSuccess from './pages/VerificationSuccess'
import VerificationFailed from './pages/VerificationFailed'
import PrivateRoute from './components/PrivateRoute'
import CounsellingRecord from './pages/counsellor/CounsellingRecord'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/verification-failed" element={<VerificationFailed />} />

          {/* Student Routes */}
          <Route path="/student/*" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />

          {/* Counsellor Routes */}
          <Route path="/counsellor/*" element={
            <PrivateRoute allowedRoles={['counsellor']}>
              <CounsellorDashboard />
            </PrivateRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App