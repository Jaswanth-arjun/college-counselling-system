import React, { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import axios from "axios"
import { Save, Loader, Plus, Trash2, Calendar, MessageSquare } from "lucide-react"

const CounsellingForm = () => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "counselling_info"
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [studentData, setStudentData] = useState(null)

    useEffect(() => {
        fetchStudentData()
    }, [])

    const fetchStudentData = async () => {
        try {
            const response = await axios.get("/api/student/profile")
            setStudentData(response.data)
            if (response.data) {
                reset(response.data)
            }
        } catch (error) {
            console.error("Error fetching student data:", error)
            setMessage({
                type: 'error',
                text: 'Failed to load student data'
            })
        }
    }

    const onSubmit = async (data) => {
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await axios.post("/api/student/counselling-form", data)
            setMessage({
                type: 'success',
                text: response.data?.message || 'Saved successfully!'
            })
            fetchStudentData() // Refresh data
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to submit form. Please try again.'
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselling Information Form</h1>
                <p className="text-gray-600">Complete your personal, academic, and counselling details</p>
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
                                {...register("aadhar", {
                                    required: "Aadhar number is required",
                                    pattern: {
                                        value: /^[0-9]{12}$/,
                                        message: "Invalid Aadhar number (12 digits required)"
                                    }
                                })}
                                className="input-field"
                                placeholder="Enter 12-digit Aadhar"
                            />
                            {errors.aadhar && (
                                <p className="text-red-500 text-sm mt-1">{errors.aadhar.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Place *
                            </label>
                            <input
                                {...register("place", { required: "Place is required" })}
                                className="input-field"
                                placeholder="Enter your city/town"
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
                                className="input-field"
                                placeholder="Enter district"
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
                                className="input-field"
                                placeholder="Enter state"
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
                                className="input-field"
                                placeholder="Enter 6-digit pincode"
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
                                className="input-field min-h-[100px]"
                                placeholder="Enter your complete address"
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
                                    className="input-field"
                                    placeholder="Enter father's name"
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
                                    className="input-field"
                                    placeholder="Enter 10-digit mobile number"
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
                                    className="input-field"
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
                                    className="input-field"
                                    placeholder="Enter mother's name"
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
                                    className="input-field"
                                    placeholder="Enter 10-digit mobile number"
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
                                    className="input-field"
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
                                className="input-field"
                                placeholder="0.00"
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
                                className="input-field"
                                placeholder="0.00"
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
                                className="input-field"
                                placeholder="0.00"
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
                                className="input-field"
                                placeholder="0.00"
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
                                    className="input-field"
                                    placeholder="Enter hostel name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hostel Admission Date
                                </label>
                                <input
                                    {...register("hostel_admission_date")}
                                    type="date"
                                    className="input-field"
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
                                    className="input-field"
                                    placeholder="0.00"
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
                                    className="input-field"
                                    placeholder="0.00"
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
                                className="input-field"
                                placeholder="Enter bus number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bus Route
                            </label>
                            <input
                                {...register("bus_route")}
                                className="input-field"
                                placeholder="Enter bus route"
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
                                className="input-field"
                                placeholder="0.00"
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
                                className="input-field"
                                placeholder="0.00"
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
                                                    className="input-field"
                                                    placeholder={`${year}-${sem} Sem`}
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
                                                    className="input-field"
                                                    placeholder={`${year}-${sem} Sem`}
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
                                    className="input-field"
                                    placeholder="Enter project title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Guide Name
                                </label>
                                <input
                                    {...register("guide")}
                                    className="input-field"
                                    placeholder="Enter guide name"
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
                                    className="input-field"
                                    placeholder="Enter internship details"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    MOOCs Course
                                </label>
                                <input
                                    {...register("moocs")}
                                    className="input-field"
                                    placeholder="Enter MOOCs course"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Extra Activities
                            </label>
                            <textarea
                                {...register("extra_activities")}
                                className="input-field min-h-[100px]"
                                placeholder="Enter any extracurricular activities, achievements, etc."
                            />
                        </div>
                    </div>
                </div>

                {/* COUNSELLING INFORMATION */}
                <div className="card">
                    <div className="flex items-center mb-6">
                        <div className="w-3 h-6 bg-pink-600 rounded-r mr-3"></div>
                        <h2 className="text-xl font-semibold text-gray-900">Counselling Sessions</h2>
                    </div>

                    <div className="space-y-4">
                        {fields.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No counselling sessions recorded yet.</p>
                                <p className="text-sm text-gray-400 mt-1">Click 'Add Session' to start recording counselling details</p>
                            </div>
                        )}

                        {fields.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-medium text-gray-700">
                                        Session {index + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="text-sm">Remove</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                {...register(`counselling_info.${index}.date`)}
                                                className="input-field pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Remarks
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`counselling_info.${index}.remarks`)}
                                            className="input-field"
                                            placeholder="Enter counselling remarks"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => append({ date: "", remarks: "" })}
                            className="btn-secondary flex items-center justify-center space-x-2 w-full"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Counselling Session</span>
                        </button>
                    </div>
                </div>

                {/* SUBMIT BUTTON */}
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
            </form>
        </div>
    )
}

export default CounsellingForm