import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserPlus, ArrowLeft, Save } from 'lucide-react'

const schema = yup.object({
    counsellor_id: yup.string().required('Counsellor ID is required'),
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    assigned_year: yup.number().required('Year is required').min(1).max(4),
    assigned_semester: yup.number().required('Semester is required').min(1).max(2),
    assigned_branch: yup.string().required('Branch is required'),
    assigned_section: yup.string().required('Section is required'),
    max_students: yup.number().required('Max students is required').min(1).max(100)
})

const RegisterCounsellor = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT']
    const sections = ['A', 'B', 'C', 'D']
    const years = [1, 2, 3, 4]
    const semesters = [1, 2]

    const onSubmit = async (data) => {
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const response = await axios.post('/api/admin/register-counsellor', data)
            setMessage({ type: 'success', text: response.data.message })

            // Redirect after success
            setTimeout(() => {
                navigate('/dashboard/counsellors')
            }, 2000)
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to register counsellor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/dashboard/counsellors')}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Counsellors
                </button>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Register New Counsellor</h1>
                <p className="text-gray-600 mt-2">Add a new counsellor to the system</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <UserPlus className="w-6 h-6 text-blue-600 mr-2" />
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Counsellor ID *
                            </label>
                            <input
                                type="text"
                                {...register('counsellor_id')}
                                className="input-field"
                                placeholder="Enter unique counsellor ID"
                            />
                            {errors.counsellor_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.counsellor_id.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                {...register('name')}
                                className="input-field"
                                placeholder="Enter counsellor's full name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className="input-field"
                                placeholder="Enter counsellor's email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <input
                                type="password"
                                {...register('password')}
                                className="input-field"
                                placeholder="Create a password (min. 6 characters)"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                className="input-field"
                                placeholder="Confirm the password"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Assignment Information */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Assignment Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Year *
                            </label>
                            <select
                                {...register('assigned_year')}
                                className="input-field"
                            >
                                <option value="">Select Year</option>
                                {years.map(year => (
                                    <option key={year} value={year}>Year {year}</option>
                                ))}
                            </select>
                            {errors.assigned_year && (
                                <p className="text-red-500 text-sm mt-1">{errors.assigned_year.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Semester *
                            </label>
                            <select
                                {...register('assigned_semester')}
                                className="input-field"
                            >
                                <option value="">Select Semester</option>
                                {semesters.map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                            {errors.assigned_semester && (
                                <p className="text-red-500 text-sm mt-1">{errors.assigned_semester.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Branch *
                            </label>
                            <select
                                {...register('assigned_branch')}
                                className="input-field"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                            {errors.assigned_branch && (
                                <p className="text-red-500 text-sm mt-1">{errors.assigned_branch.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section *
                            </label>
                            <select
                                {...register('assigned_section')}
                                className="input-field"
                            >
                                <option value="">Select Section</option>
                                {sections.map(section => (
                                    <option key={section} value={section}>Section {section}</option>
                                ))}
                            </select>
                            {errors.assigned_section && (
                                <p className="text-red-500 text-sm mt-1">{errors.assigned_section.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Students *
                        </label>
                        <input
                            type="number"
                            {...register('max_students')}
                            className="input-field"
                            placeholder="Enter maximum number of students"
                            min="1"
                            max="100"
                            defaultValue="30"
                        />
                        {errors.max_students && (
                            <p className="text-red-500 text-sm mt-1">{errors.max_students.message}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                            Maximum number of students this counsellor can handle (recommended: 20-30)
                        </p>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/counsellors')}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center px-6 py-3"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                            <Save className="w-5 h-5 mr-2" />
                        )}
                        {loading ? 'Registering...' : 'Register Counsellor'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RegisterCounsellor