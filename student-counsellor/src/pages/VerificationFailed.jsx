import React from 'react'
import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'

const VerificationFailed = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Email Verification Failed
                    </h1>

                    <p className="text-gray-600 mb-6">
                        The verification link is invalid or has expired. Please try registering again or contact support.
                    </p>

                    <div className="space-y-3">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </Link>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerificationFailed