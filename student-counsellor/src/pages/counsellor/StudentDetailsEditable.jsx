import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {
    ArrowLeft,
    User,
    Save,
    X,
    Edit2,
    Loader,
    FileText
} from 'lucide-react'

const StudentDetailsEditable = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [student, setStudent] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [counsellingRecords, setCounsellingRecords] = useState([])
    const [activeTab, setActiveTab] = useState('form')
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchStudentDetails()
        fetchCounsellingRecords()
    }, [id])

    const fetchStudentDetails = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/counsellor/student/${id}`)
            setStudent(response.data)
            reset(response.data)
        } catch (error) {
            console.error('Error fetching student details:', error)
            setMessage({
                type: 'error',
                text: 'Failed to load student details'
            })
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

    const onSubmit = async (data) => {
        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            // Clean the data - remove empty strings
            const cleanData = Object.keys(data).reduce((acc, key) => {
                const value = data[key]
                if (value !== '' && value !== undefined && value !== null) {
                    acc[key] = value
                }
                return acc
            }, {})

            // Update via the counsellor endpoint
            const response = await axios.put(`/api/counsellor/student/${id}`, cleanData)

            setMessage({
                type: 'success',
                text: 'Student data updated successfully!'
            })

            setStudent(response.data)
            setIsEditMode(false)

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        } catch (error) {
            console.error('Update error:', error)
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to update student data'
            })
        }

        setSaving(false)
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
        <div className="max-w-6xl mx-auto">
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
                    <button
                        onClick={() => {
                            if (isEditMode) {
                                reset(student)
                            }
                            setIsEditMode(!isEditMode)
                        }}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium ${isEditMode
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {isEditMode ? (
                            <>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'form'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Student Information
                    </button>
                    <button
                        onClick={() => setActiveTab('records')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'records'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Counselling Records ({counsellingRecords.length})
                    </button>
                </nav>
            </div>

            {/* Form Tab */}
            {activeTab === 'form' && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow">
                    <div className="p-8 space-y-8">
                        {/* Personal Information Section */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Roll Number
                                    </label>
                                    <input
                                        type="text"
                                        {...register('roll_no')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Aadhar Number
                                    </label>
                                    <input
                                        type="text"
                                        {...register('aadhar_number')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        {...register('address')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Place
                                    </label>
                                    <input
                                        type="text"
                                        {...register('place')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        {...register('district')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        {...register('state')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        {...register('pincode')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="text"
                                        {...register('mobile')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Family Information Section */}
                        <div className="border-t pt-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Family Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('father_name')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Mobile
                                    </label>
                                    <input
                                        type="text"
                                        {...register('father_mobile')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Occupation
                                    </label>
                                    <input
                                        type="text"
                                        {...register('father_occupation')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mother's Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('mother_name')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mother's Mobile
                                    </label>
                                    <input
                                        type="text"
                                        {...register('mother_mobile')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mother's Occupation
                                    </label>
                                    <input
                                        type="text"
                                        {...register('mother_occupation')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fee Information Section */}
                        <div className="border-t pt-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Fee Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tuition RTF
                                    </label>
                                    <input
                                        type="number"
                                        {...register('tuition_rtf')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tuition MQ
                                    </label>
                                    <input
                                        type="number"
                                        {...register('tuition_mq')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tuition NRTF
                                    </label>
                                    <input
                                        type="number"
                                        {...register('tuition_nrtf')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hostel Fee
                                    </label>
                                    <input
                                        type="number"
                                        {...register('hostel_fee')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bus Fee
                                    </label>
                                    <input
                                        type="number"
                                        {...register('bus_fee')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Concession
                                    </label>
                                    <input
                                        type="number"
                                        {...register('concession')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Accommodation Section */}
                        <div className="border-t pt-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Accommodation Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Residence Type
                                    </label>
                                    <select
                                        {...register('residence')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Hosteller">Hosteller</option>
                                        <option value="Dayscholar">Dayscholar</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hostel Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('hostel_name')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hostel Admission Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register('hostel_admission_date')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hostel Balance
                                    </label>
                                    <input
                                        type="number"
                                        {...register('hostel_balance')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bus Number
                                    </label>
                                    <input
                                        type="text"
                                        {...register('bus_no')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bus Route
                                    </label>
                                    <input
                                        type="text"
                                        {...register('bus_route')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bus Balance
                                    </label>
                                    <input
                                        type="number"
                                        {...register('bus_balance')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Section */}
                        <div className="border-t pt-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Academic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Attendance Percentage
                                    </label>
                                    <input
                                        type="number"
                                        {...register('attendance_percentage')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Backlogs
                                    </label>
                                    <input
                                        type="number"
                                        {...register('backlogs')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CSP Project Title
                                    </label>
                                    <input
                                        type="text"
                                        {...register('csp_project_title')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Guide
                                    </label>
                                    <input
                                        type="text"
                                        {...register('project_guide')}
                                        disabled={!isEditMode}
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Internship Details
                                    </label>
                                    <textarea
                                        {...register('internship_details')}
                                        disabled={!isEditMode}
                                        rows="3"
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        MOOCs Courses
                                    </label>
                                    <textarea
                                        {...register('moocs_courses')}
                                        disabled={!isEditMode}
                                        rows="3"
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Extra Activities
                                    </label>
                                    <textarea
                                        {...register('extra_activities')}
                                        disabled={!isEditMode}
                                        rows="3"
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remarks
                                    </label>
                                    <textarea
                                        {...register('remarks')}
                                        disabled={!isEditMode}
                                        rows="3"
                                        className={`w-full px-4 py-2 border rounded-lg ${isEditMode
                                                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditMode && (
                            <div className="border-t pt-8 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset(student)
                                        setIsEditMode(false)
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {saving ? (
                                        <>
                                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            )}

            {/* Counselling Records Tab */}
            {activeTab === 'records' && (
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
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
                {records.map((record) => (
                    <div key={record.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Session on {new Date(record.counselling_date).toLocaleDateString()}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {record.remarks || 'No remarks'}
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Recorded
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StudentDetailsEditable
