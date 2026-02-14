import React from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const StudentDashboard = () => {
    return (
        <div className="min-h-screen bg-bg p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Good morning, Student</h1>
                        <p className="text-sm text-gray-600">Here’s what’s happening with your counselling and academics</p>
                    </div>
                    <div>
                        <Button variant="primary">Book Session</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    <div className="lg:col-span-3">
                        <Card className="hero-gradient mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Next Session</h2>
                                    <p className="text-sm text-gray-600">No upcoming sessions. Schedule one with your counsellor.</p>
                                </div>
                                <div>
                                    <Button variant="secondary">View Schedule</Button>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-white/50">No recent activity</div>
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button className="w-full">Fill Counselling Form</Button>
                                <Button variant="secondary" className="w-full">Update Semester</Button>
                            </div>
                        </Card>

                        <Card className="mt-6">
                            <h3 className="text-lg font-medium mb-3">Resources</h3>
                            <p className="text-sm text-gray-600">Helpful articles and guides from your counsellor.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
