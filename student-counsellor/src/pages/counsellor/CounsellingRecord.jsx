import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Save, X, Plus, Trash2 } from 'lucide-react'

const CounsellingRecord = () => {
    const { id } = useParams() // student id from URL if editing
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [student, setStudent] = useState(null)
    const [backlogs, setBacklogs] = useState([])
    const [moocs, setMoocs] = useState([])
    const [activities, setActivities] = useState([])
    const [newBacklog, setNewBacklog] = useState('')
    const [newMooc, setNewMooc] = useState('')
    const [newActivity, setNewActivity] = useState('')

    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    useEffect(() => {
        if (id) {
            fetchStudentDetails()
        }
    }, [id])

    const fetchStudentDetails = async () => {
        try {
            const response = await axios.get(`/api/counsellor/student/${id}`)
            setStudent(response.data)
            // Pre-fill semester and year from student data
            setValue('semester', response.data.semester)
            setValue('academic_year', `${response.data.year} B.Tech`)
        } catch (error) {
            console.error('Error fetching student details:', error)
        }
    }

    const addBacklog = () => {
        if (newBacklog.trim()) {
            setBacklogs([...backlogs, newBacklog.trim()])
            setNewBacklog('')
        }
    }

    const removeBacklog = (index) => {
        setBacklogs(backlogs.filter((_, i) => i !== index))
    }

    const addMooc = () => {
        if (newMooc.trim()) {
            setMoocs([...moocs, newMooc.trim()])
            setNewMooc('')
        }
    }

    const removeMooc = (index) => {
        setMoocs(moocs.filter((_, i) => i !== index))
    }

    const addActivity = () => {
        if (newActivity.trim()) {
            setActivities([...activities, newActivity.trim()])
            setNewActivity('')
        }
    }

    const removeActivity = (index) => {
        setActivities(activities.filter((_, i) => i !== index))
    }

    const onSubmit = async (data) => {
        setLoading(true)
        setMessage('')

        const formData = {
            ...data,
            student_id: id || data.student_id,
            backlogs,
            moocs_courses: moocs,
            extra_activities: activities,
            semester: parseInt(data.semester)
        }

        try {
            const response = await axios.post('/api/counsellor/counselling-record', formData)
            setMessage({ type: 'success', text: response.data.message })

            // Redirect after success
            setTimeout(() => {
                if (id) {
                    navigate(`/counsellor/students/${id}`)
                } else {
                    navigate('/counsellor/students')
                }
            }, 2000)
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to save counselling record'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    {id ? `Add Counselling Record for ${student?.users?.name}` : 'New Counselling Record'}
                </h1>
                <p className="text-gray-600 mt-2">
                    Record counselling session details for the student
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Session Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {!id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Student Roll No. *
                                </label>
                                <input
                                    type="text"
                                    {...register('student_id', { required: 'Student ID is required' })}
                                    className="input-field"
                                    placeholder="Enter student roll number"
                                />
                                {errors.student_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.student_id.message}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Semester *
                            </label>
                            <select
                                {...register('semester', { required: 'Semester is required' })}
                                className="input-field"
                            >
                                <option value="">Select Semester</option>
                                {[1, 2].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                            {errors.semester && (
                                <p className="text-red-500 text-sm mt-1">{errors.semester.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Academic Year *
                            </label>
                            <input
                                type="text"
                                {...register('academic_year', { required: 'Academic year is required' })}
                                className="input-field"
                                placeholder="e.g., 2024-2025"
                            />
                            {errors.academic_year && (
                                <p className="text-red-500 text-sm mt-1">{errors.academic_year.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Counselling Date
                            </label>
                            <input
                                type="date"
                                {...register('counselling_date')}
                                className="input-field"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Performance */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Performance</h2>

                    {/* Backlogs */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Backlogs (if any)
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newBacklog}
                                onChange={(e) => setNewBacklog(e.target.value)}
                                className="input-field flex-1"
                                placeholder="Enter subject name"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBacklog())}
                            />
                            <button
                                type="button"
                                onClick={addBacklog}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {backlogs.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {backlogs.map((backlog, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full"
                                    >
                                        <span>{backlog}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeBacklog(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CSP Project */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CSP Project Title
                        </label>
                        <input
                            type="text"
                            {...register('csp_project_title')}
                            className="input-field"
                            placeholder="Enter project title if any"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Guide
                            </label>
                            <input
                                type="text"
                                {...register('project_guide')}
                                className="input-field"
                                placeholder="Enter guide name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Internship Details
                            </label>
                            <textarea
                                {...register('internship_details')}
                                className="input-field min-h-[100px]"
                                placeholder="Enter internship details if any"
                            />
                        </div>
                    </div>
                </div>

                {/* MOOCs & Extra Activities */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">MOOCs & Extra Activities</h2>

                    {/* MOOCs Courses */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            MOOCs Courses Completed
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newMooc}
                                onChange={(e) => setNewMooc(e.target.value)}
                                className="input-field flex-1"
                                placeholder="Enter MOOC course name"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMooc())}
                            />
                            <button
                                type="button"
                                onClick={addMooc}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {moocs.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {moocs.map((mooc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full"
                                    >
                                        <span>{mooc}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeMooc(index)}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Extra Activities */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Extra-Curricular Activities
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newActivity}
                                onChange={(e) => setNewActivity(e.target.value)}
                                className="input-field flex-1"
                                placeholder="Enter activity name"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
                            />
                            <button
                                type="button"
                                onClick={addActivity}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {activities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {activities.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                                    >
                                        <span>{activity}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeActivity(index)}
                                            className="text-purple-600 hover:text-purple-800"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Counsellor Remarks *
                        </label>
                        <textarea
                            {...register('remarks', { required: 'Remarks are required' })}
                            className="input-field min-h-[120px]"
                            placeholder="Enter your observations, suggestions, and remarks for the student..."
                        />
                        {errors.remarks && (
                            <p className="text-red-500 text-sm mt-1">{errors.remarks.message}</p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
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
                        {loading ? 'Saving...' : 'Save Counselling Record'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CounsellingRecord