import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Search, Filter, User, Phone, Mail, Calendar, RefreshCw } from 'lucide-react'

const StudentList = () => {
    const [loading, setLoading] = useState(true)
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [filters, setFilters] = useState({
        year: '',
        semester: '',
        branch: '',
        section: ''
    })

    // Filter options
    const years = [1, 2, 3, 4]
    const semesters = [1, 2]
    const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT']
    const sections = ['A', 'B', 'C', 'D']

    useEffect(() => {
        fetchStudents()

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchStudents, 30000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        filterStudents()
    }, [searchTerm, filters, students])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            setError('')
            console.log('Fetching students...')
            const response = await axios.get('/api/counsellor/students')
            console.log('Students fetched:', response.data)
            setStudents(response.data || [])
            setFilteredStudents(response.data || [])
        } catch (error) {
            console.error('Error fetching students:', error)
            setError(error.response?.data?.error || error.message || 'Failed to fetch students')
            setStudents([])
            setFilteredStudents([])
        } finally {
            setLoading(false)
        }
    }

    const filterStudents = () => {
        let filtered = [...students]

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(student =>
                student.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.roll_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply other filters
        if (filters.year) {
            filtered = filtered.filter(student => student.year === parseInt(filters.year))
        }
        if (filters.semester) {
            filtered = filtered.filter(student => student.semester === parseInt(filters.semester))
        }
        if (filters.branch) {
            filtered = filtered.filter(student => student.branch === filters.branch)
        }
        if (filters.section) {
            filtered = filtered.filter(student => student.section === filters.section)
        }

        setFilteredStudents(filtered)
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const clearFilters = () => {
        setFilters({
            year: '',
            semester: '',
            branch: '',
            section: ''
        })
        setSearchTerm('')
    }

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
                <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
                <p className="text-gray-600 mt-2">View and manage your assigned students</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search students by name, roll number, or email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Filter Button */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={fetchStudents}
                            disabled={loading}
                            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 flex items-center disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Filter Options */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year
                        </label>
                        <select
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year}>Year {year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Semester
                        </label>
                        <select
                            name="semester"
                            value={filters.semester}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All Semesters</option>
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>Sem {sem}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch
                        </label>
                        <select
                            name="branch"
                            value={filters.branch}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All Branches</option>
                            {branches.map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section
                        </label>
                        <select
                            name="section"
                            value={filters.section}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All Sections</option>
                            {sections.map(section => (
                                <option key={section} value={section}>Sec {section}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Students Count */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <span className="text-gray-600">
                        Showing {filteredStudents.length} of {students.length} students
                    </span>
                </div>
                <div className="text-sm text-gray-500">
                    {Object.values(filters).some(f => f) && 'Filters applied'}
                </div>
            </div>

            {/* Students Grid */}
            {filteredStudents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                    <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                    <p className="text-gray-600">
                        {searchTerm || Object.values(filters).some(f => f)
                            ? 'Try changing your search or filters'
                            : 'No students are assigned to you yet'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                {/* Student Header */}
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            {student.users?.profile_image ? (
                                                <img
                                                    src={student.users.profile_image}
                                                    alt={student.users.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-6 h-6 text-blue-600" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {student.users?.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{student.roll_no}</p>
                                        <div className="flex items-center mt-1">
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                {student.branch} - Year {student.year}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Student Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{student.users?.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{student.mobile || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>Sem {student.semester} - Sec {student.section}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex space-x-3">
                                        <Link
                                            to={`/counsellor/students/${student.id}`}
                                            className="flex-1 btn-primary text-center"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            to={`/counsellor/students/${student.id}/counselling`}
                                            className="flex-1 btn-secondary text-center"
                                        >
                                            Add Record
                                        </Link>
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

export default StudentList