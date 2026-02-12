import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Save, Filter, Users } from 'lucide-react'

const UpdateSemester = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [counsellors, setCounsellors] = useState([])
    const [selectedCounsellorId, setSelectedCounsellorId] = useState(null)
    const [currentStudentData, setCurrentStudentData] = useState(null)
    const [filters, setFilters] = useState({
        year: '',
        semester: '',
        branch: '',
        section: ''
    })

    // Years and branches data
    const years = [1, 2, 3, 4]
    const semesters = [1, 2]
    const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT']
    const sections = ['A', 'B', 'C', 'D']

    // Load student's current data on component mount
    useEffect(() => {
        const loadStudentData = async () => {
            try {
                const response = await axios.get('/api/student/profile')
                setCurrentStudentData(response.data)

                // Pre-fill filters with student's current data if available
                if (response.data.year && response.data.semester && response.data.branch && response.data.section) {
                    const newFilters = {
                        year: response.data.year.toString(),
                        semester: response.data.semester.toString(),
                        branch: response.data.branch || '',
                        section: response.data.section || ''
                    }
                    setFilters(newFilters)

                    // Auto-fetch counsellors if filters are complete
                    try {
                        const counsellorResponse = await axios.get('/api/student/available-counsellors', {
                            params: newFilters
                        })
                        setCounsellors(counsellorResponse.data)
                    } catch (error) {
                        console.error('Error fetching counsellors:', error)
                    }
                }

                // Set the selected counsellor if already assigned
                if (response.data.counsellor_id) {
                    setSelectedCounsellorId(response.data.counsellor_id)
                }
            } catch (error) {
                console.error('Error loading student data:', error)
            }
        }

        loadStudentData()
    }, [])

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const fetchCounsellors = async () => {
        if (!filters.year || !filters.semester || !filters.branch || !filters.section) {
            setMessage({ type: 'error', text: 'Please select all filter options' })
            return
        }

        try {
            setLoading(true)
            const response = await axios.get('/api/student/available-counsellors', {
                params: filters
            })
            setCounsellors(response.data)
            setMessage('')
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to fetch counsellors'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (counsellorIdToSelect) => {
        if (!filters.year || !filters.semester || !filters.branch || !filters.section) {
            setMessage({ type: 'error', text: 'Please select all options' })
            return
        }

        try {
            setLoading(true)
            const response = await axios.post('/api/student/update-semester', {
                ...filters,
                counsellor_id: counsellorIdToSelect
            })

            setMessage({
                type: 'success',
                text: 'Semester updated successfully! Counsellor assigned.'
            })

            // Update student data to reflect the new assignment
            setCurrentStudentData(prev => ({
                ...prev,
                counsellor_id: counsellorIdToSelect
            }))

            // Set the selected counsellor ID
            setSelectedCounsellorId(counsellorIdToSelect)

            // Refresh counsellors list to reflect updated counts and availability
            await fetchCounsellors()
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to update semester'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Update Semester & Assign Counsellor</h1>
                <p className="text-gray-600 mt-2">Update your current semester and select a counsellor</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Current Assignment Display */}
            {currentStudentData && currentStudentData.counsellor_id && (
                <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-700">Currently Assigned Counsellor</p>
                            <p className="text-gray-700 mt-1">
                                <span className="font-semibold">{currentStudentData.year}</span> Year,
                                <span className="font-semibold"> Semester {currentStudentData.semester}</span>,
                                <span className="font-semibold"> {currentStudentData.branch}</span> -
                                <span className="font-semibold"> Section {currentStudentData.section}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                ✓ Assigned
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Section */}
            <div className="card mb-8">
                <div className="flex items-center mb-6">
                    <Filter className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Select Your Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Year Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year *
                        </label>
                        <select
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select Year</option>
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year} B.Tech
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Semester Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Semester *
                        </label>
                        <select
                            name="semester"
                            value={filters.semester}
                            onChange={handleFilterChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select Semester</option>
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>
                                    Semester {sem}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch *
                        </label>
                        <select
                            name="branch"
                            value={filters.branch}
                            onChange={handleFilterChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Section Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section *
                        </label>
                        <select
                            name="section"
                            value={filters.section}
                            onChange={handleFilterChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select Section</option>
                            {sections.map(section => (
                                <option key={section} value={section}>
                                    Section {section}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={fetchCounsellors}
                        disabled={loading || !filters.year || !filters.semester || !filters.branch || !filters.section}
                        className="btn-primary flex items-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                            <Filter className="w-5 h-5 mr-2" />
                        )}
                        Find Available Counsellors
                    </button>
                </div>
            </div>

            {/* Counsellors List */}
            {counsellors.length > 0 && (
                <div className="card">
                    <div className="flex items-center mb-6">
                        <Users className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-900">Available Counsellors</h2>
                        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {counsellors.length} available
                        </span>
                    </div>

                    <div className="space-y-4">
                        {counsellors.map((counsellor) => (
                            <div
                                key={counsellor.id}
                                className={`border rounded-lg p-4 transition-colors ${selectedCounsellorId === counsellor.id
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {counsellor.users?.name || 'Counsellor'}
                                        </h3>
                                        <div className="flex items-center mt-1 text-sm text-gray-600">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded mr-3">
                                                ID: {counsellor.counsellor_id}
                                            </span>
                                            <span>Email: {counsellor.users?.email}</span>
                                        </div>
                                        <div className="mt-2 text-sm">
                                            <span className="text-gray-500">Assigned Students: </span>
                                            <span className="font-medium">
                                                {counsellor.current_students} / {counsellor.max_students}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSubmit(counsellor.id)}
                                        disabled={loading}
                                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${selectedCounsellorId === counsellor.id
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {selectedCounsellorId === counsellor.id ? 'Counsellor Selected' : 'Select Counsellor'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Counsellors Message */}
            {counsellors.length === 0 && filters.year && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Counsellors Available</h3>
                    <p className="text-gray-600">
                        Click "Find Available Counsellors" to search for counsellors matching your selected criteria.
                    </p>
                </div>
            )}
        </div>
    )
}

export default UpdateSemester