import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, User, GraduationCap } from 'lucide-react'

const Login = () => {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('student')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await login(identifier, password, role)

        if (result.success) {
            // Redirect based on role
            if (role === 'student') {
                navigate('/student/dashboard')
            } else if (role === 'counsellor') {
                navigate('/counsellor/dashboard')
            }
        } else {
            setError(result.error)
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">College Counselling System</h1>
                    <p className="text-gray-600 mt-2">Login to access your account</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Role Selection */}
                    <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${role === 'student' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('counsellor')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${role === 'counsellor' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <GraduationCap className="w-4 h-4 inline mr-2" />
                            Counsellor
                        </button>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {role === 'student' ? 'Roll Number or Email' : 'Counsellor ID or Email'}
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="input-field"
                                placeholder={role === 'student' ? "Enter your roll number or email" : "Enter your counsellor ID or email"}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    {/* For Students - Registration Link */}
                    {role === 'student' && (
                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* For Counsellors - Admin Contact */}
                    {role === 'counsellor' && (
                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have credentials? Contact administrator for access
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login