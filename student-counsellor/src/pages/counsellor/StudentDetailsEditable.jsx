import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {
    ArrowLeft,
    Save,
    Loader,
    Plus,
    Trash2,
    Calendar,
    MessageSquare,
    User,
    Edit2,
    X,
    FileText
} from 'lucide-react'

const StudentDetailsEditable = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const academicYears = ["I", "II", "III", "IV"]
    const semesters = ["I", "II"]

    const occupationOptions = [
        "Government Employee",
        "Private Employee",
        "Business",
        "Farmer",
        "Labourer",
        "Teacher",
        "Doctor",
        "Engineer",
        "Lawyer",
        "Other"
    ]

    const residenceOptions = [
        { value: "hosteller", label: "Hosteller" },
        { value: "dayscholar", label: "Dayscholar" }
    ]

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
            const studentData = response.data || {}

            // Flatten attendance_data and backlogs_data (if present) into top-level keys for form reset
            const flattened = { ...studentData }
            if (studentData.attendance_data && typeof studentData.attendance_data === 'object') {
                Object.entries(studentData.attendance_data).forEach(([k, v]) => {
                    flattened[k] = v
                })
            }
            if (studentData.backlogs_data && typeof studentData.backlogs_data === 'object') {
                Object.entries(studentData.backlogs_data).forEach(([k, v]) => {
                    flattened[k] = v
                })
            }

            setStudent(studentData)
            reset(flattened)
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
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/counsellor/students"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Students
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {student.users?.name}
                        </h1>
                        <p className="text-gray-600">
                            {student.roll_no} • {student.branch} • Year {student.year}
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
                            ? 'btn-secondary'
                            : 'btn-primary'
                            }`}
                    >
                        {isEditMode ? (
                            <>
                                <X className="w-4 h-4 mr-2" />
                                Cancel Edit
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Information
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Message Alert */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* PERSONAL DETAILS */}
                    <div className="card">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-6 bg-blue-600 rounded-r mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Roll No
                                </label>
                                <input
                                    {...register("roll_no")}
                                    readOnly
                                    className="input-field bg-gray-50 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    {...register("name")}
                                    readOnly
                                    value={student?.users?.name || ''}
                                    className="input-field bg-gray-50 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Aadhar Number
                                </label>
                                <input
                                    {...register("aadhar_number")}
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter 12-digit Aadhar"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Place
                                </label>
                                <input
                                    {...register("place")}
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter your city/town"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    District
                                </label>
                                <input
                                    {...register("district")}
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter district"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    {...register("state")}
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter state"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pincode
                                </label>
                                <input
                                    {...register("pincode")}
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter 6-digit pincode"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    {...register("mobile")}
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter mobile number"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    {...register("address")}
                                    className={`input-field min-h-[100px] ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter your complete address"
                                    readOnly={!isEditMode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* PARENT DETAILS */}
                    <div className="card">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-6 bg-green-600 rounded-r mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Parent Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Father Details */}
                            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-medium text-blue-900">Father's Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Name
                                    </label>
                                    <input
                                        {...register("father_name")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter father's name"
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Mobile
                                    </label>
                                    <input
                                        {...register("father_mobile")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter 10-digit mobile number"
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Occupation
                                    </label>
                                    <select
                                        {...register("father_occupation")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        disabled={!isEditMode}
                                    >
                                        <option value="">Select occupation</option>
                                        {occupationOptions.map((occupation) => (
                                            <option key={occupation} value={occupation}>
                                                {occupation}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Mother Details */}
                            <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                                <h3 className="font-medium text-purple-900">Mother's Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mother's Name
                                    </label>
                                    <input
                                        {...register("mother_name")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter mother's name"
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mother's Mobile
                                    </label>
                                    <input
                                        {...register("mother_mobile")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter 10-digit mobile number"
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mother's Occupation
                                    </label>
                                    <select
                                        {...register("mother_occupation")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        disabled={!isEditMode}
                                    >
                                        <option value="">Select occupation</option>
                                        {occupationOptions.map((occupation) => (
                                            <option key={occupation} value={occupation}>
                                                {occupation}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FEE DETAILS */}
                    <div className="card">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-6 bg-amber-600 rounded-r mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Fee Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tuition Fee (RTF)
                                </label>
                                <input
                                    {...register("tuition_rtf")}
                                    type="number"
                                    step="0.01"
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="0.00"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tuition Fee (MQ)
                                </label>
                                <input
                                    {...register("tuition_mq")}
                                    type="number"
                                    step="0.01"
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="0.00"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tuition Fee (NRTF)
                                </label>
                                <input
                                    {...register("tuition_nrtf")}
                                    type="number"
                                    step="0.01"
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="0.00"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Concession
                                </label>
                                <input
                                    {...register("concession")}
                                    type="number"
                                    step="0.01"
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="0.00"
                                    readOnly={!isEditMode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RESIDENCE DETAILS */}
                    <div className="card">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-6 bg-indigo-600 rounded-r mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Residence Details</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-6">
                                {residenceOptions.map((option) => (
                                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value={option.value}
                                            {...register("residence")}
                                            className="h-4 w-4 text-blue-600"
                                            disabled={!isEditMode}
                                        />
                                        <span className="text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hostel Name
                                    </label>
                                    <input
                                        {...register("hostel_name")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter hostel name"
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hostel Admission Date
                                    </label>
                                    <input
                                        {...register("hostel_admission_date")}
                                        type="date"
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hostel Fee (₹)
                                    </label>
                                    <input
                                        {...register("hostel_fee")}
                                        type="number"
                                        step="0.01"
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="0.00"
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Balance Hostel Fee (₹)
                                    </label>
                                    <input
                                        {...register("hostel_balance")}
                                        type="number"
                                        step="0.01"
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="0.00"
                                        readOnly={!isEditMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BUS DETAILS */}
                    <div className="card">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-6 bg-teal-600 rounded-r mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Transport Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bus Number
                                </label>
                                <input
                                    {...register("bus_no")}
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter bus number"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bus Route
                                </label>
                                <input
                                    {...register("bus_route")}
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter bus route"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bus Fee (₹)
                                </label>
                                <input
                                    {...register("bus_fee")}
                                    type="number"
                                    step="0.01"
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="0.00"
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Balance Bus Fee (₹)
                                </label>
                                <input
                                    {...register("bus_balance")}
                                    type="number"
                                    step="0.01"
                                    className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="0.00"
                                    readOnly={!isEditMode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ACADEMIC PERFORMANCE - ATTENDANCE & BACKLOGS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* ATTENDANCE */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <div className="w-3 h-6 bg-emerald-600 rounded-r mr-3"></div>
                                <h2 className="text-xl font-semibold text-gray-900">Attendance (%)</h2>
                            </div>

                            <div className="space-y-4">
                                {academicYears.map((year) => (
                                    <div key={year} className="space-y-3">
                                        <h3 className="font-medium text-gray-700">{year} Year</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {semesters.map((sem) => (
                                                <div key={sem}>
                                                    <label className="block text-sm text-gray-600 mb-2">
                                                        Semester {sem}
                                                    </label>
                                                    <input
                                                        {...register(`attendance_${year}_sem${sem}`)}
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                        placeholder={`${year}-${sem} Sem`}
                                                        readOnly={!isEditMode}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* BACKLOGS */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <div className="w-3 h-6 bg-red-600 rounded-r mr-3"></div>
                                <h2 className="text-xl font-semibold text-gray-900">Academic Backlogs</h2>
                            </div>

                            <div className="space-y-4">
                                {academicYears.map((year) => (
                                    <div key={year} className="space-y-3">
                                        <h3 className="font-medium text-gray-700">{year} Year</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {semesters.map((sem) => (
                                                <div key={sem}>
                                                    <label className="block text-sm text-gray-600 mb-2">
                                                        Semester {sem}
                                                    </label>
                                                    <input
                                                        {...register(`backlogs_${year}_sem${sem}`)}
                                                        type="number"
                                                        min="0"
                                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                        placeholder={`${year}-${sem} Sem`}
                                                        readOnly={!isEditMode}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* EXTRA DETAILS */}
                    <div className="card">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-6 bg-purple-600 rounded-r mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CSP Project Title
                                    </label>
                                    <input
                                        {...register("csp_project")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter project title"
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guide Name
                                    </label>
                                    <input
                                        {...register("guide")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter guide name"
                                        readOnly={!isEditMode}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Internship Details
                                    </label>
                                    <input
                                        {...register("internship")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter internship details"
                                        readOnly={!isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        MOOCs Course
                                    </label>
                                    <input
                                        {...register("moocs")}
                                        className={`input-field ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter MOOCs course"
                                        readOnly={!isEditMode}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Extra Activities
                                </label>
                                <textarea
                                    {...register("extra_activities")}
                                    className={`input-field min-h-[100px] ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter any extracurricular activities, achievements, etc."
                                    readOnly={!isEditMode}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    {...register("remarks")}
                                    className={`input-field min-h-[100px] ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter remarks"
                                    readOnly={!isEditMode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    {isEditMode && (
                        <div className="flex justify-end sticky bottom-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
                            >
                                {saving ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
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
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        remarks: ''
    })
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleAddSession = async (e) => {
        e.preventDefault()
        if (!formData.remarks.trim()) {
            setMessage({ type: 'error', text: 'Please enter remarks for the session' })
            return
        }

        setSaving(true)
        try {
            const response = await axios.post('/api/counsellor/counselling-record', {
                student_id: studentId,
                remarks: formData.remarks,
                counselling_date: formData.date + 'T12:00:00'
            })

            if (response.status === 200 || response.status === 201) {
                setMessage({ type: 'success', text: 'Counselling session added successfully!' })
                setFormData({ date: new Date().toISOString().split('T')[0], remarks: '' })
                setShowForm(false)
                onRefresh()
                setTimeout(() => setMessage({ type: '', text: '' }), 3000)
            }
        } catch (error) {
            console.error('Error adding session:', error)
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to add counselling session' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Add New Session Form */}
            {showForm && (
                <div className="card border-blue-200 bg-blue-50">
                    <h3 className="font-medium text-gray-900 mb-4">Add New Counselling Session</h3>
                    {message.text && (
                        <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleAddSession} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Session Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Remarks
                            </label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                placeholder="Enter counselling notes, observations, advice, etc."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                {saving ? 'Saving...' : 'Save Session'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Add Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Counselling Session
                </button>
            )}

            {/* Sessions List */}
            {records.length === 0 ? (
                <div className="text-center py-12 card">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No counselling records found</h3>
                    <p className="text-gray-600 mb-6">
                        No counselling sessions have been recorded for this student yet.
                    </p>
                </div>
            ) : (
                <div className="card">
                    <div className="flex items-center mb-6">
                        <div className="w-3 h-6 bg-pink-600 rounded-r mr-3"></div>
                        <h2 className="text-xl font-semibold text-gray-900">Counselling Sessions</h2>
                    </div>

                    <div className="space-y-4">
                        {records.map((record, index) => (
                            <div
                                key={record.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 text-lg">
                                            Session {index + 1}
                                        </h4>
                                        <div className="flex items-center text-gray-600 mt-1">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>{new Date(record.counselling_date).toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Recorded
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-medium text-gray-700 mb-2">Remarks:</h5>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {record.remarks || 'No remarks provided for this session.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Counselling Records Tab Component
const CounsellingRecordsTab = ({ records, studentId, onRefresh }) => {
    const navigate = useNavigate()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        remarks: ''
    })
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleAddSession = async (e) => {
        e.preventDefault()
        if (!formData.remarks.trim()) {
            setMessage({ type: 'error', text: 'Please enter remarks for the session' })
            return
        }

        setSaving(true)
        try {
            const response = await axios.post('/api/counsellor/counselling-record', {
                student_id: studentId,
                remarks: formData.remarks,
                counselling_date: formData.date + 'T12:00:00'
            })

            if (response.status === 200 || response.status === 201) {
                setMessage({ type: 'success', text: 'Counselling session added successfully!' })
                setFormData({ date: new Date().toISOString().split('T')[0], remarks: '' })
                setShowForm(false)
                onRefresh()
                setTimeout(() => setMessage({ type: '', text: '' }), 3000)
            }
        } catch (error) {
            console.error('Error adding session:', error)
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to add counselling session' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Add New Session Form */}
            {showForm && (
                <div className="card border-blue-200 bg-blue-50">
                    <h3 className="font-medium text-gray-900 mb-4">Add New Counselling Session</h3>
                    {message.text && (
                        <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleAddSession} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Session Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Remarks
                            </label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                placeholder="Enter counselling notes, observations, advice, etc."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                {saving ? 'Saving...' : 'Save Session'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Add Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Counselling Session
                </button>
            )}

            {/* Sessions List */}
            {records.length === 0 ? (
                <div className="text-center py-12 card">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No counselling records found</h3>
                    <p className="text-gray-600 mb-6">
                        No counselling sessions have been recorded for this student yet.
                    </p>
                </div>
            ) : (
                <div className="card">
                    <div className="flex items-center mb-6">
                        <div className="w-3 h-6 bg-pink-600 rounded-r mr-3"></div>
                        <h2 className="text-xl font-semibold text-gray-900">Counselling Sessions</h2>
                    </div>

                    <div className="space-y-4">
                        {records.map((record, index) => (
                            <div
                                key={record.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 text-lg">
                                            Session {index + 1}
                                        </h4>
                                        <div className="flex items-center text-gray-600 mt-1">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>{new Date(record.counselling_date).toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Recorded
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-medium text-gray-700 mb-2">Remarks:</h5>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {record.remarks || 'No remarks provided for this session.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default StudentDetailsEditable