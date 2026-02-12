import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { UserCog, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required')
})

const EditCounsellor = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [assignments, setAssignments] = useState([])
    const [assignmentCounts, setAssignmentCounts] = useState([])

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
                email: counsellor.users?.email
            })

            // Set assignments from the response
            if (counsellor.assignments && Array.isArray(counsellor.assignments) && counsellor.assignments.length > 0) {
                setAssignments(counsellor.assignments)
            } else {
                // Fallback to old single assignment format for backward compatibility
                setAssignments([{
                    assigned_year: counsellor.assigned_year || '',
                    assigned_semester: counsellor.assigned_semester || '',
                    assigned_branch: counsellor.assigned_branch || '',
                    assigned_section: counsellor.assigned_section || '',
                    max_students: counsellor.max_students || '30'
                }])
            }

            // Set assignment counts
            if (counsellor.assignment_counts) {
                setAssignmentCounts(counsellor.assignment_counts)
            }
        } catch (error) {
            console.error('Error fetching counsellor:', error)
            setError('Failed to load counsellor details')
        } finally {
            setLoading(false)
        }
    }

    const handleAddAssignment = () => {
        setAssignments([
            ...assignments,
            {
                assigned_year: '',
                assigned_semester: '',
                assigned_branch: '',
                assigned_section: '',
                max_students: '30'
            }
        ])
    }

    const handleRemoveAssignment = (index) => {
        if (assignments.length === 1) {
            setError('At least one class assignment is required')
            return
        }
        setAssignments(assignments.filter((_, i) => i !== index))
        setError('')
    }

    const handleAssignmentChange = (index, field, value) => {
        const newAssignments = [...assignments]
        newAssignments[index][field] = field === 'max_students' ? parseInt(value) :
            ['assigned_year', 'assigned_semester'].includes(field) ? parseInt(value) : value
        setAssignments(newAssignments)
    }

    const validateAssignments = () => {
        for (let i = 0; i < assignments.length; i++) {
            const assignment = assignments[i]
            if (!assignment.assigned_year || !assignment.assigned_semester ||
                !assignment.assigned_branch || !assignment.assigned_section || !assignment.max_students) {
                setError('Please complete all fields in the class assignments')
                return false
            }
        }
        return true
    }

    const onSubmit = async (data) => {
        if (!validateAssignments()) {
            return
        }

        setSubmitting(true)
        setError('')
        setMessage('')

        try {
            const payload = {
                ...data,
                assignments: assignments.map(a => ({
                    assigned_year: parseInt(a.assigned_year),
                    assigned_semester: parseInt(a.assigned_semester),
                    assigned_branch: a.assigned_branch,
                    assigned_section: a.assigned_section,
                    max_students: parseInt(a.max_students)
                }))
            }
            const response = await axios.put(`/api/admin/counsellor/${id}`, payload)
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
                <p className="text-gray-600 mt-2">Update counsellor details and class assignments</p>
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

                {/* Class Assignments */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Class Assignments</h2>
                        <button
                            type="button"
                            onClick={handleAddAssignment}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Assignment
                        </button>
                    </div>

                    <div className="space-y-6">
                        {assignments.map((assignment, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700">Assignment {index + 1}</h3>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Students Assigned: <span className="font-semibold text-blue-600">{assignmentCounts[index] || 0}</span>/{assignment.max_students || 30}
                                        </div>
                                    </div>
                                    {assignments.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAssignment(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Year *
                                        </label>
                                        <select
                                            value={assignment.assigned_year}
                                            onChange={(e) => handleAssignmentChange(index, 'assigned_year', e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Select Year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>Year {year}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Semester *
                                        </label>
                                        <select
                                            value={assignment.assigned_semester}
                                            onChange={(e) => handleAssignmentChange(index, 'assigned_semester', e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Select Semester</option>
                                            {semesters.map(sem => (
                                                <option key={sem} value={sem}>Semester {sem}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Branch *
                                        </label>
                                        <select
                                            value={assignment.assigned_branch}
                                            onChange={(e) => handleAssignmentChange(index, 'assigned_branch', e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Select Branch</option>
                                            {branches.map(branch => (
                                                <option key={branch} value={branch}>{branch}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Section *
                                        </label>
                                        <select
                                            value={assignment.assigned_section}
                                            onChange={(e) => handleAssignmentChange(index, 'assigned_section', e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Select Section</option>
                                            {sections.map(section => (
                                                <option key={section} value={section}>Section {section}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Maximum Students *
                                    </label>
                                    <input
                                        type="number"
                                        value={assignment.max_students}
                                        onChange={(e) => handleAssignmentChange(index, 'max_students', e.target.value)}
                                        className="input-field"
                                        placeholder="Enter maximum number of students"
                                        min="1"
                                        max="100"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Maximum number of students for this class (recommended: 20-30)
                                    </p>
                                </div>
                            </div>
                        ))}
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
