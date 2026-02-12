import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Cropper from 'react-cropper'
import 'react-cropper/node_modules/cropperjs/dist/cropper.css'
import {
    User,
    Camera,
    Save,
    Upload,
    X,
    Mail,
    Phone,
    MapPin,
    BookOpen
} from 'lucide-react'

const Profile = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [profileData, setProfileData] = useState(null)
    const [showCropper, setShowCropper] = useState(false)
    const [imageSrc, setImageSrc] = useState('')
    const [croppedImage, setCroppedImage] = useState('')
    const cropperRef = useRef(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchProfileData()
    }, [])

    const fetchProfileData = async () => {
        try {
            const response = await axios.get('/api/student/profile')
            setProfileData(response.data)
            if (response.data?.users?.profile_image) {
                setCroppedImage(response.data.users.profile_image)
            }
        } catch (error) {
            console.error('Error fetching profile data:', error)
        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file' })
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size should be less than 5MB' })
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setImageSrc(reader.result)
            setShowCropper(true)
        }
        reader.readAsDataURL(file)
    }

    const handleCrop = () => {
        if (cropperRef.current) {
            const cropper = cropperRef.current.cropper
            setCroppedImage(cropper.getCroppedCanvas().toDataURL())
            setShowCropper(false)
        }
    }

    const handleSaveImage = async () => {
        if (!croppedImage) return

        try {
            setLoading(true)
            const formData = new FormData()
            const blob = await fetch(croppedImage).then(r => r.blob())
            formData.append('photo', blob, 'profile.jpg')

            await axios.post('/api/student/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            setMessage({ type: 'success', text: 'Profile image updated successfully!' })
            fetchProfileData() // Refresh data
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to update profile image'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveImage = () => {
        setCroppedImage('')
        // Optionally call API to remove image from server
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-2">Manage your profile information and photo</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Image */}
                <div className="lg:col-span-1">
                    <div className="card">
                        <div className="text-center">
                            {/* Profile Image */}
                            <div className="relative inline-block">
                                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                                    {croppedImage ? (
                                        <img
                                            src={croppedImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                            <User className="w-24 h-24 text-blue-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Camera Icon Overlay */}
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />

                            {/* User Info */}
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {profileData?.users?.name || user?.name}
                                </h2>
                                <p className="text-gray-600 mt-1">{user?.roll_no}</p>
                                <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
                                    <Mail className="w-4 h-4 mr-1" />
                                    {user?.email}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={handleSaveImage}
                                    disabled={loading || !croppedImage || croppedImage === profileData?.users?.profile_image}
                                    className="w-full btn-primary flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Save Profile Image
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full btn-secondary flex items-center justify-center"
                                >
                                    <Upload className="w-5 h-5 mr-2" />
                                    Upload New Photo
                                </button>

                                {croppedImage && (
                                    <button
                                        onClick={handleRemoveImage}
                                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 py-2 px-4 rounded-lg border border-red-200 transition-colors flex items-center justify-center"
                                    >
                                        <X className="w-5 h-5 mr-2" />
                                        Remove Photo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Academic Info Card */}
                    <div className="card mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                            Academic Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Year</span>
                                <span className="font-medium">{profileData?.year || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Semester</span>
                                <span className="font-medium">{profileData?.semester || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Branch</span>
                                <span className="font-medium">{profileData?.branch || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Section</span>
                                <span className="font-medium">{profileData?.section || 'Not set'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Profile Details */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Father's Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Father's Name
                                </label>
                                <div className="input-field bg-gray-50">
                                    {profileData?.father_name || 'Not provided'}
                                </div>
                            </div>

                            {/* Mother's Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mother's Name
                                </label>
                                <div className="input-field bg-gray-50">
                                    {profileData?.mother_name || 'Not provided'}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Address
                                </label>
                                <div className="input-field bg-gray-50 min-h-[80px]">
                                    {profileData?.address || 'Not provided'}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Mobile Number
                                </label>
                                <div className="input-field bg-gray-50">
                                    {profileData?.mobile || 'Not provided'}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="input-field bg-gray-50">
                                    {user?.email}
                                </div>
                            </div>

                            {/* Counsellor Info */}
                            {profileData?.counsellors && (
                                <div className="md:col-span-2 mt-6 pt-6 border-t">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Counsellor</h3>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                                <User className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {profileData.counsellors.users?.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    ID: {profileData.counsellors.counsellor_id}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {profileData.counsellors.users?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fee Information Card */}
                    <div className="card mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Fee Information</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Tuition Fee</p>
                                <p className="text-lg font-semibold">
                                    ₹{profileData?.tuition_fee || '0'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Hostel Fee</p>
                                <p className="text-lg font-semibold">
                                    ₹{profileData?.hostel_fee || '0'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Bus Fee</p>
                                <p className="text-lg font-semibold">
                                    ₹{profileData?.bus_fee || '0'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Attendance</p>
                                <p className="text-lg font-semibold">
                                    {profileData?.attendance_percentage || '0'}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">Crop Profile Image</h3>
                                <button
                                    onClick={() => setShowCropper(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="h-96">
                                <Cropper
                                    src={imageSrc}
                                    style={{ height: '100%', width: '100%' }}
                                    initialAspectRatio={1}
                                    aspectRatio={1}
                                    guides={true}
                                    ref={cropperRef}
                                    viewMode={1}
                                    minCropBoxHeight={100}
                                    minCropBoxWidth={100}
                                    background={false}
                                    responsive={true}
                                    autoCropArea={1}
                                    checkOrientation={false}
                                />
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowCropper(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCrop}
                                    className="btn-primary"
                                >
                                    Crop & Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile