import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const VerificationSuccess = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Email Verified Successfully!
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Your email has been verified. You can now login to your account and access all features.
                    </p>

                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Proceed to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VerificationSuccess