import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    BookOpen,
    DollarSign,
    Home,
    Bus,
    Clock,
    FileText
} from 'lucide-react'

const StudentDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [student, setStudent] = useState(null)
    const [counsellingRecords, setCounsellingRecords] = useState([])
    const [activeTab, setActiveTab] = useState('personal')

    useEffect(() => {
        fetchStudentDetails()
        fetchCounsellingRecords()
    }, [id])

    const fetchStudentDetails = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/counsellor/student/${id}`)
            setStudent(response.data)
        } catch (error) {
            console.error('Error fetching student details:', error)
            navigate('/counsellor/students')
        } finally {
            setLoading(false)
        }
    }

    const fetchCounsellingRecords = async () => {
        try {
            const response = await axios.get(`/api/counsellor/counselling-records?student_id=${id}`)
            setCounsellingRecords(response.data || [])
        } catch (error) {
            console.error('Error fetching counselling records:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Student not found</h3>
                <Link to="/counsellor/students" className="text-blue-600 hover:text-blue-700">
                    Back to Students List
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/counsellor/students"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Students
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {student.users?.name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {student.roll_no} • {student.branch} - Year {student.year}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            to={`/counsellor/students/${id}/counselling/new`}
                            className="btn-primary flex items-center"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            New Counselling Record
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'personal' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Personal Information
                    </button>
                    <button
                        onClick={() => setActiveTab('academic')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'academic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Academic Details
                    </button>
                    <button
                        onClick={() => setActiveTab('counselling')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'counselling' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Counselling Records ({counsellingRecords.length})
                    </button>
                </nav>
            </div>

            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                                    {student.users?.profile_image ? (
                                        <img
                                            src={student.users.profile_image}
                                            alt={student.users.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                            <User className="w-16 h-16 text-blue-400" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {student.users?.name}
                                </h2>
                                <p className="text-gray-600">{student.roll_no}</p>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center text-gray-700">
                                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                    <span>{student.users?.email}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                    <span>{student.mobile || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Family Information */}
                        <div className="bg-white rounded-xl shadow p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Family Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Father's Name</p>
                                    <p className="font-medium">{student.father_name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Mother's Name</p>
                                    <p className="font-medium">{student.mother_name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Father's Mobile</p>
                                    <p className="font-medium">{student.father_mobile || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                                Address Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Address</p>
                                    <p className="font-medium">{student.address || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Place</p>
                                    <p className="font-medium">{student.place || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">District</p>
                                    <p className="font-medium">{student.district || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">State</p>
                                    <p className="font-medium">{student.state || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pincode</p>
                                    <p className="font-medium">{student.pincode || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Aadhar Number</p>
                                    <p className="font-medium">{student.aadhar_number || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Accommodation Details */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Accommodation & Fees
                            </h3>
                            <div className="space-y-6">
                                {/* Accommodation Type */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Accommodation Type</p>
                                    <div className="flex items-center space-x-4">
                                        {student.is_hosteller && (
                                            <div className="flex items-center">
                                                <Home className="w-5 h-5 text-blue-600 mr-2" />
                                                <span className="font-medium">Hosteller</span>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {student.hostel_name}
                                                </span>
                                            </div>
                                        )}
                                        {student.is_dayscholar && (
                                            <div className="flex items-center">
                                                <Bus className="w-5 h-5 text-green-600 mr-2" />
                                                <span className="font-medium">Dayscholar</span>
                                                {student.bus_route && (
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Bus: {student.bus_route} ({student.bus_no})
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Fee Information */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-sm text-gray-600">Tuition Fee</p>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            ₹{student.tuition_fee || '0'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <Home className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-sm text-gray-600">Hostel Fee</p>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            ₹{student.hostel_fee || '0'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <Bus className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-sm text-gray-600">Bus Fee</p>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            ₹{student.bus_fee || '0'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Concession</p>
                                        <p className="text-lg font-semibold">
                                            ₹{student.concession || '0'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Balance Fee</p>
                                        <p className="text-lg font-semibold">
                                            ₹{student.balance_fee || '0'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                            <p className="text-sm text-gray-600">Attendance</p>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            {student.attendance_percentage || '0'}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Academic Details Tab */}
            {activeTab === 'academic' && (
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                        Academic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Current Academic Details</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Year</span>
                                    <span className="font-medium">Year {student.year}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Semester</span>
                                    <span className="font-medium">Semester {student.semester}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Branch</span>
                                    <span className="font-medium">{student.branch}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Section</span>
                                    <span className="font-medium">{student.section}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Performance</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Overall Attendance</span>
                                    <span className="font-medium">{student.attendance_percentage || '0'}%</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Fee Status</span>
                                    <span className={`font-medium ${student.balance_fee > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {student.balance_fee > 0 ? 'Pending' : 'Cleared'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Counselling Records Tab */}
            {activeTab === 'counselling' && (
                <CounsellingRecordsTab
                    records={counsellingRecords}
                    studentId={id}
                    onRefresh={fetchCounsellingRecords}
                />
            )}
        </div>
    )
}

// Counselling Records Tab Component
const CounsellingRecordsTab = ({ records, studentId, onRefresh }) => {
    const navigate = useNavigate()

    if (records.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No counselling records found</h3>
                <p className="text-gray-600 mb-6">
                    No counselling sessions have been recorded for this student yet.
                </p>
                <button
                    onClick={() => navigate(`/counsellor/students/${studentId}/counselling/new`)}
                    className="btn-primary"
                >
                    Add First Counselling Record
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Counselling Records</h3>
                <button
                    onClick={() => navigate(`/counsellor/students/${studentId}/counselling/new`)}
                    className="btn-primary text-sm"
                >
                    Add New Record
                </button>
            </div>

            <div className="divide-y divide-gray-200">
                {records.map((record) => (
                    <div key={record.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Session on {new Date(record.counselling_date).toLocaleDateString()}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Academic Year: {record.academic_year} • Semester: {record.semester}
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Recorded
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {record.csp_project_title && (
                                <div>
                                    <span className="text-gray-600">Project:</span>
                                    <p className="font-medium">{record.csp_project_title}</p>
                                </div>
                            )}
                            {record.project_guide && (
                                <div>
                                    <span className="text-gray-600">Guide:</span>
                                    <p className="font-medium">{record.project_guide}</p>
                                </div>
                            )}
                            {record.backlogs?.length > 0 && (
                                <div className="md:col-span-2">
                                    <span className="text-gray-600">Backlogs:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {record.backlogs.map((backlog, index) => (
                                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                {backlog}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {record.remarks && (
                                <div className="md:col-span-2">
                                    <span className="text-gray-600">Remarks:</span>
                                    <p className="mt-1 text-gray-800">{record.remarks}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StudentDetails