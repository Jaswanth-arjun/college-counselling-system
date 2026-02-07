import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText, Search, Calendar, User, Database } from 'lucide-react'

const AdminLogs = () => {
    const [loading, setLoading] = useState(true)
    const [logs, setLogs] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchLogs()
    }, [currentPage])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/admin/logs', {
                params: { page: currentPage, limit: 50 }
            })

            setLogs(response.data.logs)
            setTotalPages(response.data.pagination.totalPages)
        } catch (error) {
            console.error('Error fetching admin logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const getActionColor = (action) => {
        if (action.includes('DELETE')) return 'bg-red-100 text-red-800'
        if (action.includes('CREATE') || action.includes('REGISTER')) return 'bg-green-100 text-green-800'
        if (action.includes('UPDATE')) return 'bg-yellow-100 text-yellow-800'
        return 'bg-gray-100 text-gray-800'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Activity Logs</h1>
                <p className="text-gray-600 mt-2">Track all administrative actions in the system</p>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-lg font-semibold text-gray-900">Activity Logs</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        {logs.length} activities logged
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="table-header">Action</th>
                                <th className="table-header">Table</th>
                                <th className="table-header">Details</th>
                                <th className="table-header">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs found</h3>
                                        <p className="text-gray-600">No administrative actions have been recorded yet</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Database className="w-4 h-4 mr-2 text-gray-400" />
                                                {log.table_name || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {log.details && typeof log.details === 'object' ? (
                                                    <div className="space-y-1">
                                                        {Object.entries(log.details).map(([key, value]) => (
                                                            <div key={key} className="text-xs">
                                                                <span className="font-medium">{key}:</span>{' '}
                                                                <span className="text-gray-600">{String(value)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">No details</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {new Date(log.created_at).toLocaleString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminLogs