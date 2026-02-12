import React, { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import axios from "axios"
import { Save, Loader, Calendar } from "lucide-react"

const CounsellingForm = () => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm()
    const residenceValue = useWatch({ control, name: 'residence' })

    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [studentData, setStudentData] = useState(null)
    const [counsellingRecords, setCounsellingRecords] = useState([])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isFilled, setIsFilled] = useState(false)

    // Set up axios with auth header from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token
        }
    }, [])

    useEffect(() => {
        fetchStudentData()
    }, [])

    // Effect to reset form when studentData changes
    useEffect(() => {
        if (studentData) {
            console.log('Resetting form with studentData:', studentData)
            console.log('Residence value from DB:', studentData.residence)

            // Flatten JSONB fields and map DB column names to form field names
            const formData = {
                ...studentData,
                // Map DB columns to form field names
                csp_project: studentData.csp_project_title || '',
                guide: studentData.project_guide || '',
                internship: studentData.internship_details || '',
                moocs: studentData.moocs_courses || '',
                aadhar: studentData.aadhar_number || '',
                father_occupation: studentData.father_occupation || '',
                mother_occupation: studentData.mother_occupation || '',
                // Ensure residence is properly set
                residence: studentData.residence || '',
                // Ensure extra_activities is a string, not an array
                extra_activities: typeof studentData.extra_activities === 'string' ? studentData.extra_activities : (Array.isArray(studentData.extra_activities) ? studentData.extra_activities.join(', ') : '') || ''
            }

            // Flatten attendance_data JSONB into individual fields
            if (studentData.attendance_data && typeof studentData.attendance_data === 'object') {
                console.log('Flattening attendance_data:', studentData.attendance_data)
                Object.entries(studentData.attendance_data).forEach(([key, value]) => {
                    formData[key] = value
                })
            }

            // Flatten backlogs_data JSONB into individual fields
            if (studentData.backlogs_data && typeof studentData.backlogs_data === 'object') {
                console.log('Flattening backlogs_data:', studentData.backlogs_data)
                Object.entries(studentData.backlogs_data).forEach(([key, value]) => {
                    formData[key] = value
                })
            }

            console.log('Form data after flattening:', formData)
            reset(formData)
        }
    }, [studentData, reset])

    const fetchStudentData = async () => {
        try {
            console.log('Fetching student profile...')
            const response = await axios.get("/api/student/profile")
            console.log('Profile response:', response.data)
            console.log('Residence from response:', response.data.residence)
            setStudentData(response.data)

            // Check if any counselling form fields are filled
            const hasFilledFields = checkIfFormFilled(response.data)
            setIsFilled(hasFilledFields)
            setIsSubmitted(hasFilledFields)

            // Fetch counselling records (sessions created by counsellor)
            await fetchCounsellingRecords()
        } catch (error) {
            console.error("Error fetching student data:", error)
            console.error("Error response data:", error.response?.data)
            console.error("Error message:", error.message)
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to load student data. Please check your authentication.'
            })
        }
    }

    const fetchCounsellingRecords = async () => {
        try {
            const response = await axios.get('/api/student/counselling-records')
            console.log('Counselling records:', response.data)
            setCounsellingRecords(response.data || [])
        } catch (error) {
            console.error('Error fetching counselling records:', error)
            // Don't show error to user - this is optional
        }
    }

    // Check if any counselling form field is filled
    const checkIfFormFilled = (data) => {
        if (!data) return false
        // Check for any non-empty counselling-related fields
        const counsellingFields = [
            'aadhar_number', 'place', 'district', 'state', 'pincode', 'address', 'mobile',
            'father_name', 'mother_name', 'father_mobile', 'mother_mobile', 'father_occupation', 'mother_occupation',
            'residence', 'hostel_name', 'hostel_admission_date', 'hostel_fee', 'hostel_balance',
            'bus_no', 'bus_route', 'bus_fee', 'bus_balance',
            'tuition_rtf', 'tuition_mq', 'tuition_nrtf', 'concession', 'balance_fee', 'attendance_percentage',
            'csp_project_title', 'project_guide', 'internship_details', 'moocs_courses', 'extra_activities', 'remarks'
        ]
        return counsellingFields.some(field => data[field] !== null && data[field] !== undefined && data[field] !== '')
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        setMessage({ type: '', text: '' })
        try {
            await fetchStudentData()
            await fetchCounsellingRecords()
            setMessage({
                type: 'success',
                text: 'Data refreshed! Any updates from your counsellor are now visible.'
            })
            setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Failed to refresh data. Please try again.'
            })
        } finally {
            setRefreshing(false)
        }
    }

    const onSubmit = async (data) => {
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            // Clean the data - remove empty strings and undefined values
            const cleanData = Object.keys(data).reduce((acc, key) => {
                const value = data[key]
                // Only include fields that have actual values
                if (value !== '' && value !== undefined && value !== null) {
                    acc[key] = value
                }
                return acc
            }, {})

            console.log('Submitting cleaned form data:', cleanData)
            const response = await axios.put("/api/student/counselling-form", cleanData)

            console.log('Save response:', response.data)

            // Show success message
            setMessage({
                type: 'success',
                text: 'Your information has been saved successfully!'
            })

            // Mark as submitted
            setIsSubmitted(true)
            setIsFilled(true)

            // Wait a moment then refresh student data to ensure database write completes
            setTimeout(() => {
                fetchStudentData()
            }, 500)

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        } catch (error) {
            console.error('Form submission error:', error)
            console.error('Error response:', error.response?.data)

            let errorText = 'Failed to submit form. Please try again.'

            if (error.response?.data?.error) {
                errorText = error.response.data.error
            } else if (error.response?.data?.details) {
                errorText = `Error: ${JSON.stringify(error.response.data.details)}`
            } else if (error.message) {
                errorText = error.message
            }

            setMessage({
                type: 'error',
                text: errorText
            })
        }

        setLoading(false)
    }

    // Years array for academic sections
    const academicYears = ["I", "II", "III", "IV"]
    const semesters = ["I", "II"]

    // Parent occupation options
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

    // Residence options
    const residenceOptions = [
        { value: "hosteller", label: "Hosteller" },
        { value: "dayscholar", label: "Dayscholar" }
    ]

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Header with Refresh Button */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselling Information Form</h1>
                    <p className="text-gray-600">Complete your personal, academic, and counselling details</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    title="Refresh to see updates from your counsellor"
                >
                    {refreshing ? 'Refreshing...' : '↻ Refresh'}
                </button>
            </div>



            {/* Message Alert */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* PERSONAL DETAILS */}
                <div className="card">
                    <div className="flex items-center mb-6">
                        <div className="w-3 h-6 bg-blue-600 rounded-r mr-3"></div>
                        <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Read-only fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Roll No
                            </label>
                            <input
                                {...register("roll_no")}
                                readOnly
                                value={studentData?.roll_no || ''}
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
                                value={studentData?.users?.name || ''}
                                className="input-field bg-gray-50 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aadhar Number *
                            </label>
                            <input
                                {...register("aadhar_number", {
                                    required: "Aadhar number is required",
                                    pattern: {
                                        value: /^[0-9]{12}$/,
                                        message: "Invalid Aadhar number (12 digits required)"
                                    }
                                })}
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter 12-digit Aadhar"
                                readOnly={isSubmitted}
                            />
                            {errors.aadhar_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.aadhar_number.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Place *
                            </label>
                            <input
                                {...register("place", { required: "Place is required" })}
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter your city/town"
                                readOnly={isSubmitted}
                            />
                            {errors.place && (
                                <p className="text-red-500 text-sm mt-1">{errors.place.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                District *
                            </label>
                            <input
                                {...register("district", { required: "District is required" })}
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter district"
                                readOnly={isSubmitted}
                            />
                            {errors.district && (
                                <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State *
                            </label>
                            <input
                                {...register("state", { required: "State is required" })}
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter state"
                                readOnly={isSubmitted}
                            />
                            {errors.state && (
                                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pincode *
                            </label>
                            <input
                                {...register("pincode", {
                                    required: "Pincode is required",
                                    pattern: {
                                        value: /^[0-9]{6}$/,
                                        message: "Invalid pincode (6 digits required)"
                                    }
                                })}
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter 6-digit pincode"
                                readOnly={isSubmitted}
                            />
                            {errors.pincode && (
                                <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                {...register("address", { required: "Address is required" })}
                                className={`input-field min-h-[100px] ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter your complete address"
                                readOnly={isSubmitted}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                            )}
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
                                    Father's Name *
                                </label>
                                <input
                                    {...register("father_name", { required: "Father's name is required" })}
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter father's name"
                                    readOnly={isSubmitted}
                                />
                                {errors.father_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.father_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Father's Mobile
                                </label>
                                <input
                                    {...register("father_mobile", {
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Invalid mobile number"
                                        }
                                    })}
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter 10-digit mobile number"
                                    readOnly={isSubmitted}
                                />
                                {errors.father_mobile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.father_mobile.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Father's Occupation
                                </label>
                                <select
                                    {...register("father_occupation")}
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitted}
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
                                    Mother's Name *
                                </label>
                                <input
                                    {...register("mother_name", { required: "Mother's name is required" })}
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter mother's name"
                                    readOnly={isSubmitted}
                                />
                                {errors.mother_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mother_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mother's Mobile
                                </label>
                                <input
                                    {...register("mother_mobile", {
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Invalid mobile number"
                                        }
                                    })}
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter 10-digit mobile number"
                                    readOnly={isSubmitted}
                                />
                                {errors.mother_mobile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mother_mobile.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mother's Occupation
                                </label>
                                <select
                                    {...register("mother_occupation")}
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitted}
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
                                        checked={residenceValue === option.value}
                                        className="h-4 w-4 text-blue-600"
                                        disabled={isSubmitted}
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
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter hostel name"
                                    readOnly={isSubmitted}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hostel Admission Date
                                </label>
                                <input
                                    {...register("hostel_admission_date")}
                                    type="date"
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    readOnly={isSubmitted}
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
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="0.00"
                                    readOnly={isSubmitted}
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
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="0.00"
                                    readOnly={isSubmitted}
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
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter bus number"
                                readOnly={isSubmitted}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bus Route
                            </label>
                            <input
                                {...register("bus_route")}
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter bus route"
                                readOnly={isSubmitted}
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
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="0.00"
                                readOnly={isSubmitted}
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
                                className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="0.00"
                                readOnly={isSubmitted}
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
                                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    placeholder={`${year}-${sem} Sem`}
                                                    readOnly={isSubmitted}
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
                                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    placeholder={`${year}-${sem} Sem`}
                                                    readOnly={isSubmitted}
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
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter project title"
                                    readOnly={isSubmitted}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Guide Name
                                </label>
                                <input
                                    {...register("guide")}
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter guide name"
                                    readOnly={isSubmitted}
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
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter internship details"
                                    readOnly={isSubmitted}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    MOOCs Course
                                </label>
                                <input
                                    {...register("moocs")}
                                    className={`input-field ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter MOOCs course"
                                    readOnly={isSubmitted}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Extra Activities
                            </label>
                            <textarea
                                {...register("extra_activities")}
                                className={`input-field min-h-[100px] ${isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter any extracurricular activities, achievements, etc."
                                readOnly={isSubmitted}
                            />
                        </div>
                    </div>
                </div>

                {/* COUNSELLING SESSIONS FROM COUNSELLOR */}
                {
                    counsellingRecords.length > 0 && (
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <div className="w-3 h-6 bg-pink-600 rounded-r mr-3"></div>
                                <h2 className="text-xl font-semibold text-gray-900">Counselling Sessions by Your Counsellor</h2>
                            </div>

                            <div className="space-y-4">
                                {counsellingRecords.map((record, index) => (
                                    <div
                                        key={record.id}
                                        className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900 text-lg">
                                                    Session {index + 1}
                                                </h4>
                                                <div className="flex items-center text-gray-600 mt-1">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <span>
                                                        {new Date(record.counselling_date).toLocaleDateString('en-IN', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                From Counsellor
                                            </span>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                                            <h5 className="font-medium text-gray-700 mb-2">Session Notes:</h5>
                                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {record.remarks || 'No notes provided for this session.'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* SUBMIT BUTTON */}
                {!isSubmitted && (
                    <div className="flex justify-end sticky bottom-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save All Information</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default CounsellingForm

