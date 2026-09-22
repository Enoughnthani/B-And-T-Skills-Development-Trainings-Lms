import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    IdCard,
    Award,
    FileText,
    Download,
    Star,
    MessageSquare,
    Send,
    X,
    CheckCircle,
    AlertCircle,
    Clock
} from "lucide-react";

export default function ModeratorLearnerView() {
    const location = useLocation();
    const navigate = useNavigate();
    const { program, learner } = location.state || {};
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [accuracyRating, setAccuracyRating] = useState(null);
    const [submissions, setSubmissions] = useState([
        // Mock submissions data - replace with actual data from your API
        {
            id: 1,
            title: "Module 1: Introduction to HR",
            description: "Complete the HR fundamentals assessment",
            dueDate: "2026-04-15",
            submitted: true,
            submittedDate: "2026-04-10",
            fileUrl: "#",
            accuracy: null,
            feedback: null,
            status: "PENDING"
        },
        {
            id: 2,
            title: "Module 2: Recruitment Process",
            description: "Submit recruitment case study",
            dueDate: "2026-04-20",
            submitted: false,
            fileUrl: null,
            accuracy: null,
            feedback: null,
            status: "NOT_SUBMITTED"
        },
        {
            id: 3,
            title: "Module 3: Performance Management",
            description: "Performance review simulation",
            dueDate: "2026-04-25",
            submitted: false,
            fileUrl: null,
            accuracy: null,
            feedback: null,
            status: "NOT_SUBMITTED"
        }
    ]);

    const handleDownloadSubmission = (assessmentId) => {
    
    };

    const handleSubmitFeedback = () => {
        if (!accuracyRating || !feedbackText.trim()) return;
        
        // Update the submission with feedback
        const updatedSubmissions = submissions.map(sub => 
            sub.id === selectedAssessment.id 
                ? { ...sub, accuracy: accuracyRating, feedback: feedbackText, status: "REVIEWED" }
                : sub
        );
        setSubmissions(updatedSubmissions);
        setShowFeedbackModal(false);
        setSelectedAssessment(null);
        setFeedbackText("");
        setAccuracyRating(null);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case "SUBMITTED":
            case "PENDING":
                return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"><Clock size={12} /> Pending Review</span>;
            case "REVIEWED":
                return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"><CheckCircle size={12} /> Reviewed</span>;
            case "NOT_SUBMITTED":
                return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"><AlertCircle size={12} /> Not Submitted</span>;
            default:
                return null;
        }
    };

    if (!program || !learner) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
                    <p className="text-gray-600">Learner or program information not found</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Learner Assessment Review</h1>
                            <p className="text-sm text-gray-500">{program.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar - Learner Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-20">
                            {/* Profile Header */}
                            <div className="p-6 text-center border-b">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                                    {learner.firstname?.[0]}{learner.lastname?.[0]}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {learner.firstname} {learner.lastname}
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Learner</p>
                            </div>

                            {/* Contact Info */}
                            <div className="p-6 space-y-4 border-b">
                                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">{learner.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">{learner.contactNumber}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">DOB: {new Date(learner.dob).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <IdCard className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">ID: {learner.idNo}</span>
                                </div>
                            </div>

                            {/* Program Info */}
                            <div className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Program Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Program:</span>
                                        <span className="font-medium text-gray-900">{program.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Type:</span>
                                        <span className="font-medium text-gray-900">{program.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Enrolled:</span>
                                        <span className="font-medium text-gray-900">{new Date(learner.enrollmentDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                            {learner.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Assessments */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Assessments & Submissions</h2>
                                <Award className="h-5 w-5 text-gray-400" />
                            </div>

                            {submissions.map((assessment) => (
                                <div key={assessment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                                                    {getStatusBadge(assessment.status)}
                                                </div>
                                                <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        Due: {new Date(assessment.dueDate).toLocaleDateString()}
                                                    </span>
                                                    {assessment.submitted && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            Submitted: {new Date(assessment.submittedDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {assessment.submitted ? (
                                            <div className="mt-4 pt-4 border-t">
                                                {assessment.feedback ? (
                                                    // Already reviewed
                                                    <div className="bg-green-50 rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                                <span className="font-medium text-green-900">Feedback Provided</span>
                                                            </div>
                                                            {assessment.accuracy && (
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                                    <span className="font-medium text-gray-900">{assessment.accuracy}/5</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-700 text-sm">{assessment.feedback}</p>
                                                        <button
                                                            onClick={() => handleDownloadSubmission(assessment.id)}
                                                            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Download size={14} />
                                                            Download Submission
                                                        </button>
                                                    </div>
                                                ) : (
                                                    // Pending review
                                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                                            <span className="text-sm text-gray-600">Awaiting your review</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleDownloadSubmission(assessment.id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                                            >
                                                                <Download size={14} />
                                                                Download
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedAssessment(assessment);
                                                                    setShowFeedbackModal(true);
                                                                }}
                                                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                            >
                                                                <MessageSquare size={14} />
                                                                Review & Give Feedback
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mt-4 pt-4 border-t">
                                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                    <p className="text-sm text-gray-500">No submission yet</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedbackModal && selectedAssessment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Review Assessment: {selectedAssessment.title}
                            </h2>
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Submission Preview */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Submission</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-3">
                                        Submitted on: {new Date(selectedAssessment.submittedDate).toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() => handleDownloadSubmission(selectedAssessment.id)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                    >
                                        <Download size={16} />
                                        <span>Download Submission File</span>
                                    </button>
                                </div>
                            </div>

                            {/* Accuracy Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Accuracy Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setAccuracyRating(rating)}
                                            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                                                accuracyRating === rating
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Feedback Comments
                                </label>
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Provide detailed feedback on the submission. What was done well? What needs improvement?"
                                />
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={!accuracyRating || !feedbackText.trim()}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                Submit Feedback
                            </button>
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}