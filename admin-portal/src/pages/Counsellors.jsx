import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, UserCog, Mail, Users, Edit, Trash2 } from 'lucide-react'

const Counsellors = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [counsellors, setCounsellors] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchCounsellors()
    }, [])

    const fetchCounsellors = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/admin/counsellors')
            setCounsellors(response.data)
        } catch (error) {
            console.error('Error fetching counsellors:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditCounsellor = (id) => {
        navigate(`/dashboard/edit-counsellor/${id}`)
    }

    const handleDeleteCounsellor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this counsellor? This will remove all their assignments and records.')) {
            return
        }

        try {
            await axios.delete(`/api/admin/counsellor/${id}`)
            // Show success message and refresh
            alert('Counsellor deleted successfully')
            fetchCounsellors() // Refresh list
        } catch (error) {
            console.error('Error deleting counsellor:', error)
            const errorMessage = error.response?.data?.error || 'Failed to delete counsellor'
            alert(errorMessage)
        }
    }

    const filteredCounsellors = counsellors.filter(counsellor =>
        counsellor.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        counsellor.counsellor_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        counsellor.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Counsellors Management</h1>
                        <p className="text-gray-600 mt-2">Manage all counsellors in the system</p>
                    </div>
                    <Link
                        to="/dashboard/register-counsellor"
                        className="btn-primary flex items-center"
                    >
                        <UserCog className="w-5 h-5 mr-2" />
                        Register New Counsellor
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search counsellors by name, ID, or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Counsellors Grid */}
            {filteredCounsellors.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                    <UserCog className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No counsellors found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm ? 'Try changing your search term' : 'No counsellors registered yet'}
                    </p>
                    <Link to="/dashboard/register-counsellor" className="btn-primary">
                        Register First Counsellor
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCounsellors.map((counsellor) => (
                        <div
                            key={counsellor.id}
                            className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                {/* Counsellor Header */}
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            {counsellor.users?.profile_image ? (
                                                <img
                                                    src={counsellor.users.profile_image}
                                                    alt={counsellor.users.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <UserCog className="w-6 h-6 text-green-600" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {counsellor.users?.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{counsellor.counsellor_id}</p>
                                        <div className="flex items-center mt-1">
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                Year {counsellor.assigned_year}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                Max: {counsellor.max_students} students
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Counsellor Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{counsellor.users?.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>
                                            Assigned: {counsellor.current_students}/{counsellor.max_students} students
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <div className="font-medium">Assigned To:</div>
                                        <div>
                                            {counsellor.assigned_branch} - Semester {counsellor.assigned_semester}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Section {counsellor.assigned_section}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Capacity</span>
                                        <span>
                                            {Math.round((counsellor.current_students / counsellor.max_students) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.min((counsellor.current_students / counsellor.max_students) * 100, 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleEditCounsellor(counsellor.id)}
                                            className="text-yellow-600 hover:text-yellow-700 flex items-center"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            <span className="text-sm">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCounsellor(counsellor.id)}
                                            className="text-red-600 hover:text-red-700 flex items-center"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            <span className="text-sm">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Counsellors