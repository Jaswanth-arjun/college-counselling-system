import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { User, ArrowLeft, Save, ChevronDown, ChevronUp } from 'lucide-react'

const schema = yup.object({
    year: yup.number().required('Year is required').min(1).max(4),
    semester: yup.number().required('Semester is required').min(1).max(2),
    branch: yup.string().required('Branch is required'),
    section: yup.string().required('Section is required'),
    mobile: yup.string().nullable(),
    balance_fee: yup.number().nullable().typeError('Balance fee must be a number'),
    aadhar_number: yup.string().nullable(),
    place: yup.string().nullable(),
    district: yup.string().nullable(),
    state: yup.string().nullable(),
    pincode: yup.string().nullable(),
    address: yup.string().nullable(),
    father_name: yup.string().nullable(),
    father_mobile: yup.string().nullable(),
    mother_name: yup.string().nullable(),
    tuition_fee: yup.number().nullable(),
    concession: yup.number().nullable(),
    is_hosteller: yup.boolean().nullable(),
    is_dayscholar: yup.boolean().nullable(),
    hostel_name: yup.string().nullable(),
    hostel_fee: yup.number().nullable(),
    bus_no: yup.string().nullable(),
    bus_route: yup.string().nullable(),
    bus_fee: yup.number().nullable(),
    attendance_percentage: yup.number().nullable()
})

const EditStudent = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [studentData, setStudentData] = useState(null)
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        academic: true,
        parents: false,
        fees: false,
        residence: false,
        transport: false
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    })

    const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT']
    const sections = ['A', 'B', 'C', 'D']
    const years = [1, 2, 3, 4]
    const semesters = [1, 2]

    useEffect(() => {
        fetchStudent()
    }, [id])

    const fetchStudent = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/admin/students?limit=100`)
            const student = response.data.students.find(s => s.id === id)
            if (!student) {
                setError('Student not found')
                return
            }

            setStudentData(student)
            reset({
                year: student.year || 1,
                semester: student.semester || 1,
                branch: student.branch || '',
                section: student.section || '',
                mobile: student.mobile || '',
                balance_fee: student.balance_fee || 0,
                aadhar_number: student.aadhar_number || '',
                place: student.place || '',
                district: student.district || '',
                state: student.state || '',
                pincode: student.pincode || '',
                address: student.address || '',
                father_name: student.father_name || '',
                father_mobile: student.father_mobile || '',
                mother_name: student.mother_name || '',
                tuition_fee: student.tuition_fee || 0,
                concession: student.concession || 0,
                is_hosteller: student.is_hosteller || false,
                is_dayscholar: student.is_dayscholar || false,
                hostel_name: student.hostel_name || '',
                hostel_fee: student.hostel_fee || 0,
                bus_no: student.bus_no || '',
                bus_route: student.bus_route || '',
                bus_fee: student.bus_fee || 0,
                attendance_percentage: student.attendance_percentage || 0
            })
        } catch (error) {
            console.error('Error fetching student:', error)
            setError('Failed to load student details')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data) => {
        setSubmitting(true)
        setError('')
        setMessage('')

        try {
            const updateData = {
                year: parseInt(data.year),
                semester: parseInt(data.semester),
                branch: data.branch,
                section: data.section,
                mobile: data.mobile || '',
                balance_fee: parseFloat(data.balance_fee) || 0,
                aadhar_number: data.aadhar_number || '',
                place: data.place || '',
                district: data.district || '',
                state: data.state || '',
                pincode: data.pincode || '',
                address: data.address || '',
                father_name: data.father_name || '',
                father_mobile: data.father_mobile || '',
                mother_name: data.mother_name || '',
                tuition_fee: data.tuition_fee ? parseFloat(data.tuition_fee) : null,
                concession: data.concession ? parseFloat(data.concession) : null,
                is_hosteller: data.is_hosteller || false,
                is_dayscholar: data.is_dayscholar || false,
                hostel_name: data.hostel_name || '',
                hostel_fee: data.hostel_fee ? parseFloat(data.hostel_fee) : null,
                bus_no: data.bus_no || '',
                bus_route: data.bus_route || '',
                bus_fee: data.bus_fee ? parseFloat(data.bus_fee) : null,
                attendance_percentage: data.attendance_percentage ? parseFloat(data.attendance_percentage) : null
            }

            await axios.put(`/api/admin/student/${id}`, updateData)
            setMessage({ type: 'success', text: 'Student updated successfully!' })

            setTimeout(() => {
                navigate('/dashboard/students')
            }, 2000)
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to update student')
        } finally {
            setSubmitting(false)
        }
    }

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!studentData) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    Student not found. <button onClick={() => navigate('/dashboard/students')} className="underline">Go back</button>
                </div>
            </div>
        )
    }

    const SectionHeader = ({ title, section }) => (
        <button
            onClick={() => toggleSection(section)}
            className="w-full flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition"
        >
            {title}
            {expandedSections[section] ? <ChevronUp /> : <ChevronDown />}
        </button>
    )

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/dashboard/students')}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Students
                </button>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
                <p className="text-gray-600 mt-2">Update student details and counselling form information</p>
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* ACADEMIC INFORMATION */}
                <div className="bg-white rounded-xl shadow p-6">
                    <SectionHeader title="📚 Academic Information" section="academic" />
                    {expandedSections.academic && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                                <select {...register('branch')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select Branch</option>
                                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                                <select {...register('year', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select Year</option>
                                    {years.map(y => <option key={y} value={y}>Year {y}</option>)}
                                </select>
                                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
                                <select {...register('semester', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select Semester</option>
                                    {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                                </select>
                                {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                                <select {...register('section')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select Section</option>
                                    {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                                </select>
                                {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* PERSONAL DETAILS */}
                <div className="bg-white rounded-xl shadow p-6">
                    <SectionHeader title="👤 Personal Details" section="personal" />
                    {expandedSections.personal && (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                    <input {...register('mobile')} type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attendance %</label>
                                    <input {...register('attendance_percentage')} type="number" step="0.01" min="0" max="100" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                                <input {...register('aadhar_number')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input {...register('place')} placeholder="Place" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                <input {...register('district')} placeholder="District" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                <input {...register('state')} placeholder="State" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                <input {...register('pincode')} placeholder="Pincode" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <textarea {...register('address')} placeholder="Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-20" />
                        </div>
                    )}
                </div>

                {/* PARENT DETAILS */}
                <div className="bg-white rounded-xl shadow p-6">
                    <SectionHeader title="👨‍👩‍👧 Parent Details" section="parents" />
                    {expandedSections.parents && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900">Father's Details</h4>
                                <input {...register('father_name')} placeholder="Father's Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                <input {...register('father_mobile')} placeholder="Father's Mobile" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div className="space-y-4 p-4 bg-pink-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900">Mother's Details</h4>
                                <input {...register('mother_name')} placeholder="Mother's Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                    )}
                </div>

                {/* FEE DETAILS */}
                <div className="bg-white rounded-xl shadow p-6">
                    <SectionHeader title="💰 Fee Details" section="fees" />
                    {expandedSections.fees && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tuition Fee</label>
                                <input {...register('tuition_fee')} type="number" placeholder="Tuition Fee" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Concession</label>
                                <input {...register('concession')} type="number" placeholder="Concession" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Balance Fee</label>
                                <input {...register('balance_fee')} type="number" placeholder="Balance Fee" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                    )}
                </div>

                {/* RESIDENCE DETAILS */}
                <div className="bg-white rounded-xl shadow p-6">
                    <SectionHeader title="🏠 Residence Details" section="residence" />
                    {expandedSections.residence && (
                        <div className="mt-6 space-y-4">
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2">
                                    <input {...register('is_hosteller')} type="checkbox" className="w-4 h-4" />
                                    <span>Hosteller</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input {...register('is_dayscholar')} type="checkbox" className="w-4 h-4" />
                                    <span>Dayscholar</span>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input {...register('hostel_name')} placeholder="Hostel Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
                                <input {...register('hostel_fee')} type="number" placeholder="Hostel Fee" step="0.01" className="px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                    )}
                </div>

                {/* TRANSPORT DETAILS */}
                <div className="bg-white rounded-xl shadow p-6">
                    <SectionHeader title="🚌 Transport Details" section="transport" />
                    {expandedSections.transport && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input {...register('bus_no')} placeholder="Bus Number" className="px-4 py-2 border border-gray-300 rounded-lg" />
                            <input {...register('bus_route')} placeholder="Bus Route" className="px-4 py-2 border border-gray-300 rounded-lg" />
                            <input {...register('bus_fee')} type="number" placeholder="Bus Fee" step="0.01" className="px-4 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {submitting ? 'Saving...' : 'Save All Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/students')}
                        className="inline-flex items-center px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded-lg transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditStudent
