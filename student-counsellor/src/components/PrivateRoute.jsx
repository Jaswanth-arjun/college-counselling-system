import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect based on role
        if (user?.role === 'student') {
            return <Navigate to="/student/dashboard" replace />
        } else if (user?.role === 'counsellor') {
            return <Navigate to="/counsellor/dashboard" replace />
        }
        return <Navigate to="/login" replace />
    }

    return children
}

export default PrivateRoute