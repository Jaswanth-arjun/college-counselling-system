import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { UserCog, ArrowLeft, Save } from 'lucide-react'

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    assigned_year: yup.number().required('Year is required').min(1).max(4),
    assigned_semester: yup.number().required('Semester is required').min(1).max(2),
    assigned_branch: yup.string().required('Branch is required'),
    assigned_section: yup.string().required('Section is required'),
    max_students: yup.number().required('Max students is required').min(1).max(100)
})

const EditCounsellor = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    })

    const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT']
    const sections = ['A', 'B', 'C', 'D']
    const years = [1, 2, 3, 4]
    const semesters = [1, 2]

    useEffect(() => {
        fetchCounsellor()
    }, [id])

    const fetchCounsellor = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/admin/counsellor/${id}`)
            const counsellor = response.data

            // Pre-fill the form
            reset({
                name: counsellor.users?.name,
                email: counsellor.users?.email,
                assigned_year: counsellor.assigned_year,
                assigned_semester: counsellor.assigned_semester,
                assigned_branch: counsellor.assigned_branch,
                assigned_section: counsellor.assigned_section,
                max_students: counsellor.max_students
            })
        } catch (error) {
            console.error('Error fetching counsellor:', error)
            setError('Failed to load counsellor details')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data) => {
        setSubmitting(true)
        setError('')
        setMessage('')

        try {
            const response = await axios.put(`/api/admin/counsellor/${id}`, data)
            setMessage({ type: 'success', text: response.data.message })

            // Redirect after success
            setTimeout(() => {
                navigate('/dashboard/counsellors')
            }, 2000)
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to update counsellor')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Counsellor</h1>
                <p className="text-gray-600 mt-2">Update counsellor details and assignments</p>
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
                        <UserCog className="w-6 h-6 text-blue-600 mr-2" />
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        <strong>Note:</strong> To change the password, please contact the counsellor or use the password reset feature.
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
                        disabled={submitting}
                        className="btn-primary flex items-center px-6 py-3"
                    >
                        {submitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                            <Save className="w-5 h-5 mr-2" />
                        )}
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditCounsellor
