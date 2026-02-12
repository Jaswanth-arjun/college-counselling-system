import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import {
    LayoutDashboard,
    FileEdit,
    Calendar,
    LogOut,
    User,
    Menu,
    X
} from 'lucide-react'
import Profile from './Profile'
import CounsellingForm from './CounsellingForm'
import UpdateSemester from './UpdateSemester'

const StudentDashboard = () => {
    const { user, logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [profileImage, setProfileImage] = useState(null)

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get('/api/student/profile')
                if (response.data?.users?.profile_image) {
                    setProfileImage(response.data.users.profile_image)
                }
            } catch (error) {
                console.error('Error fetching profile image:', error)
            }
        }
        fetchProfileImage()
    }, [])

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 lg:hidden"
                            >
                                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div className="ml-4 flex items-center">
                                <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
                                <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Welcome, {user?.name || user?.roll_no}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:flex lg:flex-col`}>
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        {/* Profile Section */}
                        <div className="flex items-center px-6 pb-6 border-b">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-blue-600" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.roll_no}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="mt-6 flex-1 px-4 space-y-2">
                            <Link
                                to="/student/dashboard"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg group"
                            >
                                <LayoutDashboard className="mr-3 h-5 w-5" />
                                Dashboard
                            </Link>

                            <Link
                                to="/student/profile"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg group"
                            >
                                <User className="mr-3 h-5 w-5" />
                                My Profile
                            </Link>

                            <Link
                                to="/student/counselling-form"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg group"
                            >
                                <FileEdit className="mr-3 h-5 w-5" />
                                Fill Counselling Form
                            </Link>

                            <Link
                                to="/student/update-semester"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg group"
                            >
                                <Calendar className="mr-3 h-5 w-5" />
                                Update Semester
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg group mt-8"
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <Routes>
                        <Route path="/" element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<StudentHome />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="counselling-form" element={<CounsellingForm />} />
                        <Route path="update-semester" element={<UpdateSemester />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

// Student Home Component
const StudentHome = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Student Portal</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Counselling Form</h3>
                    <p className="text-gray-600 mb-4">Fill or update your counselling information</p>
                    <Link to="/student/counselling-form" className="btn-primary inline-block">
                        Go to Form
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Semester Update</h3>
                    <p className="text-gray-600 mb-4">Update your current semester and counsellor</p>
                    <Link to="/student/update-semester" className="btn-primary inline-block">
                        Update Semester
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">My Profile</h3>
                    <p className="text-gray-600 mb-4">View and update your profile information</p>
                    <Link to="/student/profile" className="btn-primary inline-block">
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard