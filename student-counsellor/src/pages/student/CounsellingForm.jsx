import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Save, Loader } from 'lucide-react'

const CounsellingForm = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [studentData, setStudentData] = useState(null)

    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        fetchStudentData()
    }, [])

    const fetchStudentData = async () => {
        try {
            const response = await axios.get('/api/student/profile')
            setStudentData(response.data)
            // Pre-populate form with existing data
            if (response.data) {
                reset(response.data)
            }
        } catch (error) {
            console.error('Error fetching student data:', error)
        }
    }

    const onSubmit = async (data) => {
        setLoading(true)
        setMessage('')

        try {
            const response = await axios.post('/api/student/counselling-form', data)
            setMessage({ type: 'success', text: response.data.message })
            fetchStudentData() // Refresh data
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to submit form'
            })
        }

        setLoading(false)
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Counselling Information Form</h1>
                <p className="text-gray-600 mt-2">Fill in your personal and academic details</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Roll No.</label>
                            <input
                                type="text"
                                {...register('roll_no', { required: true })}
                                className="input-field bg-gray-50"
                                readOnly
                                defaultValue={studentData?.roll_no}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                {...register('name', { required: true })}
                                className="input-field bg-gray-50"
                                readOnly
                                defaultValue={studentData?.users?.name}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
                            <input
                                type="text"
                                {...register('father_name', { required: 'Father\'s name is required' })}
                                className="input-field"
                                placeholder="Enter father's name"
                            />
                            {errors.father_name && <p className="text-red-500 text-sm mt-1">{errors.father_name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name *</label>
                            <input
                                type="text"
                                {...register('mother_name', { required: 'Mother\'s name is required' })}
                                className="input-field"
                                placeholder="Enter mother's name"
                            />
                            {errors.mother_name && <p className="text-red-500 text-sm mt-1">{errors.mother_name.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                            <textarea
                                {...register('address', { required: 'Address is required' })}
                                className="input-field min-h-[80px]"
                                placeholder="Enter complete address"
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Place *</label>
                            <input
                                type="text"
                                {...register('place', { required: 'Place is required' })}
                                className="input-field"
                                placeholder="Enter city/town"
                            />
                            {errors.place && <p className="text-red-500 text-sm mt-1">{errors.place.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                            <input
                                type="text"
                                {...register('district', { required: 'District is required' })}
                                className="input-field"
                                placeholder="Enter district"
                            />
                            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                            <input
                                type="text"
                                {...register('state', { required: 'State is required' })}
                                className="input-field"
                                placeholder="Enter state"
                            />
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                            <input
                                type="text"
                                {...register('pincode', {
                                    required: 'Pincode is required',
                                    pattern: {
                                        value: /^[0-9]{6}$/,
                                        message: 'Invalid pincode (6 digits required)'
                                    }
                                })}
                                className="input-field"
                                placeholder="Enter 6-digit pincode"
                            />
                            {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No. *</label>
                            <input
                                type="tel"
                                {...register('mobile', {
                                    required: 'Mobile number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Invalid mobile number (10 digits required)'
                                    }
                                })}
                                className="input-field"
                                placeholder="Enter 10-digit mobile number"
                            />
                            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Father's Mobile No.</label>
                            <input
                                type="tel"
                                {...register('father_mobile')}
                                className="input-field"
                                placeholder="Enter father's mobile number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
                            <input
                                type="text"
                                {...register('aadhar_number', {
                                    required: 'Aadhar number is required',
                                    pattern: {
                                        value: /^[0-9]{12}$/,
                                        message: 'Invalid Aadhar number (12 digits required)'
                                    }
                                })}
                                className="input-field"
                                placeholder="Enter 12-digit Aadhar number"
                            />
                            {errors.aadhar_number && <p className="text-red-500 text-sm mt-1">{errors.aadhar_number.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Fee Information */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Fee Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tuition Fee (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('tuition_fee')}
                                className="input-field"
                                placeholder="Enter tuition fee"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Fee (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('hostel_fee')}
                                className="input-field"
                                placeholder="Enter hostel fee"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bus Fee (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('bus_fee')}
                                className="input-field"
                                placeholder="Enter bus fee"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Concession (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('concession')}
                                className="input-field"
                                placeholder="Enter concession amount"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Balance Fee (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('balance_fee')}
                                className="input-field"
                                placeholder="Enter balance fee"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Attendance %</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('attendance_percentage')}
                                className="input-field"
                                placeholder="Enter attendance percentage"
                                max="100"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Accommodation Details */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Accommodation Details</h2>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    {...register('is_hosteller')}
                                    value="true"
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Hosteller</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    {...register('is_dayscholar')}
                                    value="true"
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Dayscholar</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
                                <input
                                    type="text"
                                    {...register('hostel_name')}
                                    className="input-field"
                                    placeholder="Enter hostel name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bus Route</label>
                                <input
                                    type="text"
                                    {...register('bus_route')}
                                    className="input-field"
                                    placeholder="Enter bus route"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bus No.</label>
                                <input
                                    type="text"
                                    {...register('bus_no')}
                                    className="input-field"
                                    placeholder="Enter bus number"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center px-6 py-3"
                    >
                        {loading ? (
                            <Loader className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <Save className="w-5 h-5 mr-2" />
                        )}
                        {loading ? 'Saving...' : 'Save Information'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CounsellingForm