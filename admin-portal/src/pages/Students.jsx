import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Search, Filter, User, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react'

const Students = () => {
    const [loading, setLoading] = useState(true)
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20
    })

    const limit = 20

    useEffect(() => {
        fetchStudents()
    }, [currentPage, searchTerm])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/admin/students', {
                params: {
                    page: currentPage,
                    limit,
                    search: searchTerm
                }
            })

            setStudents(response.data.students)
            setFilteredStudents(response.data.students)
            setPagination(response.data.pagination)
            setTotalPages(response.data.pagination.totalPages)
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            return
        }

        try {
            await axios.delete(`/api/admin/student/${id}`)
            fetchStudents() // Refresh list
        } catch (error) {
            console.error('Error deleting student:', error)
            alert('Failed to delete student')
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset to first page on new search
    }

    if (loading && students.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
                <p className="text-gray-600 mt-2">Manage all registered students in the system</p>
            </div>

            {/* Search and Stats Bar */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search students by name, roll number, or email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="text-sm text-gray-600">
                        Showing {filteredStudents.length} of {pagination.total} students
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="table-header">Student</th>
                                <th className="table-header">Contact</th>
                                <th className="table-header">Academic Info</th>
                                <th className="table-header">Status</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                                        <p className="text-gray-600">
                                            {searchTerm ? 'Try changing your search term' : 'No students registered yet'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {student.users?.profile_image ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={student.users.profile_image}
                                                            alt={student.users.name}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <User className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.users?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {student.roll_no}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                    {student.users?.email}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                    {student.mobile || 'Not provided'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {student.branch || 'N/A'}
                                                </span>
                                                <div className="mt-1 text-sm text-gray-500">
                                                    Year {student.year} • Sem {student.semester}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Sec {student.section}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.balance_fee > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {student.balance_fee > 0 ? 'Fee Pending' : 'Active'}
                                            </span>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {student.users?.is_verified ? 'Verified' : 'Unverified'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {/* View student details */ }}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {/* Edit student */ }}
                                                    className="text-yellow-600 hover:text-yellow-900 p-1"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Students