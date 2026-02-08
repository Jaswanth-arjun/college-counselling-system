import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Search, Filter, User, Mail, Phone, Edit, Trash2, Eye, X } from 'lucide-react'

const Students = () => {
    const navigate = useNavigate()
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
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showModal, setShowModal] = useState(false)

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

    const handleViewStudent = (student) => {
        setSelectedStudent(student)
        setShowModal(true)
    }

    const handleEditStudent = (studentId) => {
        navigate(`/dashboard/edit-student/${studentId}`)
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

    const closeModal = () => {
        setShowModal(false)
        setSelectedStudent(null)
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
                                                    onClick={() => handleViewStudent(student)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition"
                                                    title="View"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditStudent(student.id)}
                                                    className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-50 rounded transition"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition"
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

            {/* Student Details Modal */}
            {showModal && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Student Details & Counselling Form</h2>
                            <button
                                onClick={closeModal}
                                className="text-white hover:bg-blue-700 p-2 rounded transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Profile Section */}
                            <div className="flex items-center gap-4 border-b pb-6">
                                <div className="flex-shrink-0 h-16 w-16">
                                    {selectedStudent.users?.profile_image ? (
                                        <img
                                            className="h-16 w-16 rounded-full object-cover"
                                            src={selectedStudent.users.profile_image}
                                            alt={selectedStudent.users.name}
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                            <User className="h-8 w-8 text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {selectedStudent.users?.name}
                                    </h3>
                                    <p className="text-gray-600">Roll No: {selectedStudent.roll_no}</p>
                                    <p className="text-sm text-gray-500">{selectedStudent.users?.email}</p>
                                </div>
                            </div>

                            {/* Basic Academic Information */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">Branch</p>
                                    <p className="font-semibold text-gray-900">{selectedStudent.branch || '-'}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">Year</p>
                                    <p className="font-semibold text-gray-900">{selectedStudent.year || '-'}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">Semester</p>
                                    <p className="font-semibold text-gray-900">{selectedStudent.semester || '-'}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase">Status</p>
                                    <span className={`inline-block text-xs font-semibold rounded px-2 py-1 ${selectedStudent.users?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {selectedStudent.users?.is_verified ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                            </div>

                            {/* Personal Details from Counselling Form */}
                            {(selectedStudent.aadhar_number || selectedStudent.address) && (
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Details (Counselling Form)</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        {selectedStudent.aadhar_number && (
                                            <div>
                                                <p className="text-gray-600">Aadhar:</p>
                                                <p className="font-medium">{selectedStudent.aadhar_number}</p>
                                            </div>
                                        )}
                                        {selectedStudent.place && (
                                            <div>
                                                <p className="text-gray-600">Place:</p>
                                                <p className="font-medium">{selectedStudent.place}</p>
                                            </div>
                                        )}
                                        {selectedStudent.district && (
                                            <div>
                                                <p className="text-gray-600">District:</p>
                                                <p className="font-medium">{selectedStudent.district}</p>
                                            </div>
                                        )}
                                        {selectedStudent.state && (
                                            <div>
                                                <p className="text-gray-600">State:</p>
                                                <p className="font-medium">{selectedStudent.state}</p>
                                            </div>
                                        )}
                                        {selectedStudent.pincode && (
                                            <div>
                                                <p className="text-gray-600">Pincode:</p>
                                                <p className="font-medium">{selectedStudent.pincode}</p>
                                            </div>
                                        )}
                                    </div>
                                    {selectedStudent.address && (
                                        <div className="mt-3">
                                            <p className="text-gray-600">Address:</p>
                                            <p className="font-medium">{selectedStudent.address}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Parent Details */}
                            {(selectedStudent.father_name || selectedStudent.mother_name) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedStudent.father_name && (
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Father's Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedStudent.father_name || '-'}</span></div>
                                                <div><span className="text-gray-600">Mobile:</span> <span className="font-medium">{selectedStudent.father_mobile || '-'}</span></div>
                                                <div><span className="text-gray-600">Occupation:</span> <span className="font-medium">{selectedStudent.father_occupation || '-'}</span></div>
                                            </div>
                                        </div>
                                    )}
                                    {selectedStudent.mother_name && (
                                        <div className="bg-pink-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Mother's Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedStudent.mother_name || '-'}</span></div>
                                                <div><span className="text-gray-600">Mobile:</span> <span className="font-medium">{selectedStudent.mother_mobile || '-'}</span></div>
                                                <div><span className="text-gray-600">Occupation:</span> <span className="font-medium">{selectedStudent.mother_occupation || '-'}</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fee Information */}
                            {(selectedStudent.tuition_rtf || selectedStudent.tuition_mq || selectedStudent.tuition_nrtf || selectedStudent.concession) && (
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Fee Details</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        {selectedStudent.tuition_rtf && <div><span className="text-gray-600">Tuition RTF:</span> <span className="font-medium">₹{selectedStudent.tuition_rtf}</span></div>}
                                        {selectedStudent.tuition_mq && <div><span className="text-gray-600">Tuition MQ:</span> <span className="font-medium">₹{selectedStudent.tuition_mq}</span></div>}
                                        {selectedStudent.tuition_nrtf && <div><span className="text-gray-600">Tuition NRTF:</span> <span className="font-medium">₹{selectedStudent.tuition_nrtf}</span></div>}
                                        {selectedStudent.concession && <div><span className="text-gray-600">Concession:</span> <span className="font-medium">₹{selectedStudent.concession}</span></div>}
                                    </div>
                                    {selectedStudent.balance_fee && selectedStudent.balance_fee > 0 && (
                                        <div className="mt-3 p-2 bg-red-100 rounded">
                                            <span className="text-gray-600">Balance Fee:</span> <span className="font-bold text-red-700">₹{selectedStudent.balance_fee}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Residence Details */}
                            {(selectedStudent.residence || selectedStudent.hostel_name) && (
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Residence Details</h4>
                                    <div className="space-y-2 text-sm">
                                        {selectedStudent.residence && <div><span className="text-gray-600">Type:</span> <span className="font-medium capitalize">{selectedStudent.residence}</span></div>}
                                        {selectedStudent.hostel_name && <div><span className="text-gray-600">Hostel Name:</span> <span className="font-medium">{selectedStudent.hostel_name}</span></div>}
                                        {selectedStudent.hostel_admission_date && <div><span className="text-gray-600">Admission Date:</span> <span className="font-medium">{new Date(selectedStudent.hostel_admission_date).toLocaleDateString()}</span></div>}
                                        {selectedStudent.hostel_fee && <div><span className="text-gray-600">Hostel Fee:</span> <span className="font-medium">₹{selectedStudent.hostel_fee}</span></div>}
                                        {selectedStudent.hostel_balance && <div><span className="text-gray-600">Hostel Balance:</span> <span className="font-medium">₹{selectedStudent.hostel_balance}</span></div>}
                                    </div>
                                </div>
                            )}

                            {/* Transport Details */}
                            {(selectedStudent.bus_no || selectedStudent.bus_route) && (
                                <div className="bg-teal-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Transport Details</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        {selectedStudent.bus_no && <div><span className="text-gray-600">Bus No:</span> <span className="font-medium">{selectedStudent.bus_no}</span></div>}
                                        {selectedStudent.bus_route && <div><span className="text-gray-600">Route:</span> <span className="font-medium">{selectedStudent.bus_route}</span></div>}
                                        {selectedStudent.bus_fee && <div><span className="text-gray-600">Fee:</span> <span className="font-medium">₹{selectedStudent.bus_fee}</span></div>}
                                        {selectedStudent.bus_balance && <div><span className="text-gray-600">Balance:</span> <span className="font-medium">₹{selectedStudent.bus_balance}</span></div>}
                                    </div>
                                </div>
                            )}

                            {/* Additional Information */}
                            {(selectedStudent.csp_project_title || selectedStudent.project_guide || selectedStudent.internship_details) && (
                                <div className="bg-indigo-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
                                    <div className="space-y-2 text-sm">
                                        {selectedStudent.csp_project_title && <div><span className="text-gray-600">CSP Project:</span> <span className="font-medium">{selectedStudent.csp_project_title}</span></div>}
                                        {selectedStudent.project_guide && <div><span className="text-gray-600">Project Guide:</span> <span className="font-medium">{selectedStudent.project_guide}</span></div>}
                                        {selectedStudent.internship_details && <div><span className="text-gray-600">Internship:</span> <span className="font-medium">{selectedStudent.internship_details}</span></div>}
                                        {selectedStudent.moocs_courses && <div><span className="text-gray-600">MOOCs:</span> <span className="font-medium">{selectedStudent.moocs_courses}</span></div>}
                                        {selectedStudent.extra_activities && <div><span className="text-gray-600">Extra Activities:</span> <span className="font-medium">{selectedStudent.extra_activities}</span></div>}
                                        {selectedStudent.remarks && <div className="col-span-full"><span className="text-gray-600">Remarks:</span> <p className="font-medium">{selectedStudent.remarks}</p></div>}
                                    </div>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        closeModal()
                                        navigate(`/dashboard/edit-student/${selectedStudent.id}`)
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                                >
                                    Edit Student
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Students