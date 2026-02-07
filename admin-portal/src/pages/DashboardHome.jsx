import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Users, UserCog, BarChart3, TrendingUp, AlertCircle } from 'lucide-react'

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCounsellors: 0,
        recentRegistrations: [],
        recentSessions: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get('/api/admin/dashboard-stats')
            setStats(response.data)
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of the counselling system</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.totalStudents}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>Active</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg mr-4">
                            <UserCog className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Counsellors</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.totalCounsellors}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm text-blue-600">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            <span>Active</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg mr-4">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Counselling Sessions</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.recentSessions?.length || 0}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-sm text-gray-600">Today</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending Actions</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-sm text-gray-600">No pending tasks</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Registrations */}
                <div className="bg-white rounded-xl shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Student Registrations</h2>
                    </div>
                    <div className="p-6">
                        {stats.recentStudents?.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentStudents.slice(0, 5).map((student) => (
                                    <div key={student.id} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{student.users?.name}</p>
                                            <p className="text-sm text-gray-600">{student.roll_no}</p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(student.users?.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent registrations</p>
                        )}
                    </div>
                </div>

                {/* Recent Counselling Sessions */}
                <div className="bg-white rounded-xl shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Counselling Sessions</h2>
                    </div>
                    <div className="p-6">
                        {stats.recentSessions?.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentSessions.slice(0, 5).map((session) => (
                                    <div key={session.id} className="py-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {session.students?.users?.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    with {session.counsellors?.users?.name}
                                                </p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(session.counselling_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {session.remarks && (
                                            <p className="text-sm text-gray-600 mt-1 truncate">
                                                {session.remarks}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent sessions</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome