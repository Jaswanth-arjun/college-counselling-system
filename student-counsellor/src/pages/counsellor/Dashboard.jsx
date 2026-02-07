import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import CounsellingRecord from './CounsellingRecord'
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    User,
    Menu,
    X,
    Filter,
    Settings
} from 'lucide-react'
import StudentList from './StudentList'
import StudentDetailsEditable from './StudentDetailsEditable'

const CounsellorDashboard = () => {
    const { user, logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(true)

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
                                <h1 className="text-xl font-semibold text-gray-900">Counsellor Dashboard</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <span className="block text-sm font-medium text-gray-900">
                                    {user?.name || user?.counsellorInfo?.counsellor_id}
                                </span>
                                <span className="block text-xs text-gray-500">Counsellor</span>
                            </div>
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
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">ID: {user?.counsellorInfo?.counsellor_id}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="mt-6 flex-1 px-4 space-y-2">
                            <Link
                                to="/counsellor/dashboard"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg group"
                            >
                                <LayoutDashboard className="mr-3 h-5 w-5" />
                                Dashboard
                            </Link>

                            <Link
                                to="/counsellor/students"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg group"
                            >
                                <Users className="mr-3 h-5 w-5" />
                                My Students
                            </Link>

                            <Link
                                to="/counsellor/counselling-records"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg group"
                            >
                                <FileText className="mr-3 h-5 w-5" />
                                Counselling Records
                            </Link>

                            <Link
                                to="/counsellor/settings"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg group"
                            >
                                <Settings className="mr-3 h-5 w-5" />
                                Settings
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg group mt-8"
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Logout
                            </button>
                        </nav>

                        {/* Stats */}
                        <div className="px-4 mt-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Assigned Students</span>
                                    <span className="text-sm font-semibold text-blue-600">
                                        {user?.counsellorInfo?.current_students || 0}/{user?.counsellorInfo?.max_students || 30}
                                    </span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${((user?.counsellorInfo?.current_students || 0) / (user?.counsellorInfo?.max_students || 30)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
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
                        <Route path="dashboard" element={<CounsellorHome />} />
                        <Route path="students" element={<StudentList />} />
                        <Route path="students/:id" element={<StudentDetailsEditable />} />
                        <Route path="counselling-records" element={<CounsellingRecord />} />
                        <Route path="settings" element={<CounsellorSettings />} />
                        <Route path="students/:id/counselling/new" element={<CounsellingRecord />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

// Counsellor Home Component
const CounsellorHome = () => {
    const { user } = useAuth()

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
                <p className="text-gray-600 mt-2">Manage your assigned students and counselling sessions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Assigned Students</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {user?.counsellorInfo?.current_students || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg mr-4">
                            <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Counselling Sessions</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg mr-4">
                            <Filter className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Assigned To</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {user?.counsellorInfo?.assigned_branch || 'All'} -
                                Year {user?.counsellorInfo?.assigned_year || ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/counsellor/students"
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                    >
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">View Students</span>
                    </Link>

                    <Link
                        to="/counsellor/counselling-records"
                        className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center"
                    >
                        <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">Records</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

// Settings Component
const CounsellorSettings = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-600">Settings page will be implemented in the next phase.</p>
            </div>
        </div>
    )
}

export default CounsellorDashboard