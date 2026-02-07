import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard,
    Users,
    UserCog,
    LogOut,
    Shield,
    Menu,
    X,
    BarChart3,
    FileText,
    Settings
} from 'lucide-react'
import DashboardHome from './DashboardHome'
import Students from './Students'
import Counsellors from './Counsellors'
import RegisterCounsellor from './RegisterCounsellor'
import EditCounsellor from './EditCounsellor'
import AdminLogs from './AdminLogs'

const Dashboard = () => {
    const { user, logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            <nav className="bg-gray-900 shadow-sm border-b border-gray-800">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-white lg:hidden"
                            >
                                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div className="ml-4 flex items-center">
                                <Shield className="h-6 w-6 text-blue-400 mr-2" />
                                <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden md:block">
                                <span className="block text-sm font-medium text-gray-300">
                                    {user?.name || 'Administrator'}
                                </span>
                                <span className="block text-xs text-gray-400">System Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:flex lg:flex-col`}>
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        {/* Profile Section */}
                        <div className="flex items-center px-6 pb-6 border-b border-gray-800">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-800">
                                    <Shield className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-gray-400">Administrator</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="mt-6 flex-1 px-4 space-y-1">
                            <Link
                                to="/dashboard"
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg group"
                            >
                                <LayoutDashboard className="mr-3 h-5 w-5" />
                                Dashboard
                            </Link>

                            <Link
                                to="/dashboard/students"
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg group"
                            >
                                <Users className="mr-3 h-5 w-5" />
                                Students
                            </Link>

                            <Link
                                to="/dashboard/counsellors"
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg group"
                            >
                                <UserCog className="mr-3 h-5 w-5" />
                                Counsellors
                            </Link>

                            <Link
                                to="/dashboard/register-counsellor"
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg group"
                            >
                                <UserCog className="mr-3 h-5 w-5" />
                                Register Counsellor
                            </Link>

                            <Link
                                to="/dashboard/logs"
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg group"
                            >
                                <FileText className="mr-3 h-5 w-5" />
                                Admin Logs
                            </Link>

                            <Link
                                to="/dashboard/settings"
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg group"
                            >
                                <Settings className="mr-3 h-5 w-5" />
                                Settings
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg group mt-8"
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
                        <Route path="/" element={<Navigate to="home" />} />
                        <Route path="home" element={<DashboardHome />} />
                        <Route path="students" element={<Students />} />
                        <Route path="counsellors" element={<Counsellors />} />
                        <Route path="register-counsellor" element={<RegisterCounsellor />} />
                        <Route path="edit-counsellor/:id" element={<EditCounsellor />} />
                        <Route path="logs" element={<AdminLogs />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

// Admin Settings Component
const AdminSettings = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="card">
                <p className="text-gray-600">System settings will be implemented in the next phase.</p>
            </div>
        </div>
    )
}

export default Dashboard