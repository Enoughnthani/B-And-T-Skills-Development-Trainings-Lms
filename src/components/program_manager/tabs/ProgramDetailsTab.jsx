import React from 'react';

export default function ProgramDetailsTab({ program }) {
    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Description Section */}
                <div className="lg:col-span-2">
                    <div
                        className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: program.description || 'No description provided.' }}
                    />
                </div>

                {/* Program Details Sidebar */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Start Date</span>
                            <span className="font-medium text-gray-900">{formatDate(program.startDate)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">End Date</span>
                            <span className="font-medium text-gray-900">{formatDate(program.endDate)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Capacity</span>
                            <span className="font-medium text-gray-900">{program.capacity || 'N/A'} seats</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Current Enrollment</span>
                            <span className="font-medium text-gray-900">{program.enrolledCount || 0} enrolled</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Location</span>
                            <span className="font-medium text-gray-900 truncate px-1">{program.location || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Program Type</span>
                            <span className="font-medium text-gray-900">{program.type || 'Not specified'}</span>
                        </div>
                        
                        {/* Optional: Add status badge */}
                        {program.status && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    program.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                    program.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {program.status}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}