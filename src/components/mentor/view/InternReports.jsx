import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Badge } from 'react-bootstrap';
import {
  FaArrowLeft, FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaComment,
  FaDownload,
  FaFileAlt,
  FaPaperPlane,
  FaStar,
  FaThumbsDown,
  FaThumbsUp,
  FaTimesCircle,
  FaUserCircle,
  FaEnvelope
} from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function InternReports() {
  const location = useLocation();
  const navigate = useNavigate();
  const { intern } = location.state || {};
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const { user } = useAuth();
  const { programId, internId } = useParams();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (reports.length === 0 && user) {
      const p = user?.assignedPrograms?.find(p => p.id === parseInt(programId)) || {};
      const i = p?.enrollmentData?.find(i => i.id === parseInt(internId)) || {};
      setReports(i?.reports || []);
    }
  }, [internId, user, reports.length, programId]);

  if (!intern) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50/20 p-6">
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm max-w-md mx-auto">
          <FaUserCircle className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">No intern selected</p>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate(`/user/mentor/program-view/${programId}/interns`)}
            className="mt-2 px-4 rounded-lg"
          >
            Back to Interns
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="px-2 py-1 bg-emerald-100 text-emerald-700 border-0">Approved</Badge>;
      case 'rejected':
        return <Badge className="px-2 py-1 bg-rose-100 text-rose-700 border-0">Rejected</Badge>;
      default:
        return <Badge className="px-2 py-1 bg-amber-100 text-amber-700 border-0">Pending</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-emerald-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-rose-500" />;
      default:
        return <FaClock className="text-amber-500" />;
    }
  };

  const handleApprove = (report) => {
    setSelectedReport(report);
    setRating(0);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  const handleReject = (report) => {
    setSelectedReport(report);
    setRating(0);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      alert('Please provide feedback');
      return;
    }

    const updatedReports = reports.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          status: rating >= 3 ? 'approved' : 'rejected',
          feedback: feedbackText,
          rating: rating,
          reviewedBy: `${user?.firstname} ${user?.lastname}`,
          reviewedDate: new Date().toISOString().split('T')[0]
        };
      }
      return report;
    });

    setReports(updatedReports);
    setShowFeedbackModal(false);
    setFeedbackText('');
    setRating(0);
    setSelectedReport(null);

  };

  const handleDownload = (attachment) => {
    window.open(attachment.url, '_blank');
  };

  const stats = {
    total: reports.length,
    approved: reports.filter(r => r.status === 'approved').length,
    pending: reports.filter(r => r.status === 'pending').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-y-auto">
      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/user/mentor/program-view/${programId}/interns`)}
            className="bg-transparent flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 text-sm transition-colors"
          >
            <FaArrowLeft size={14} /> Back to Interns
          </button>

          {/* Intern Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center  text-xl font-bold border">
                {intern?.firstname?.[0]}{intern?.lastname?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-0.5">{intern?.firstname} {intern?.lastname}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <FaEnvelope size={12} className="text-blue-400" /> {intern?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt size={12} className="text-emerald-400" /> Enrolled: {intern?.enrollmentDate?.split('T')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <FaFileAlt className="text-blue-500" size={18} />
              Monthly Reports
            </h3>
            <p className="text-gray-500 text-sm">Review and evaluate monthly reports submitted</p>
          </div>
        </div>

        {/* Stats Cards - Colorful */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Total Reports</p>
              <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-gray-500 text-xs" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-0">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Approved</p>
              <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-emerald-500 text-xs" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mb-0">{stats.approved}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Pending</p>
              <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-amber-500 text-xs" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600 mb-0">{stats.pending}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Rejected</p>
              <div className="w-7 h-7 bg-rose-100 rounded-lg flex items-center justify-center">
                <FaTimesCircle className="text-rose-500 text-xs" />
              </div>
            </div>
            <p className="text-2xl font-bold text-rose-600 mb-0">{stats.rejected}</p>
          </div>
        </div>

        {/* Reports List */}
        {reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((report, idx) => (
              <div key={report.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(report.status)}
                        {getStatusBadge(report.status)}
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1 text-base">{report.title}</h5>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt size={10} /> {report.month}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock size={10} /> Submitted: {report.submittedDate}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 leading-relaxed">{report.content}</p>
                      
                      {report.feedback && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mt-2 border border-blue-100">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <FaComment size={12} className="text-blue-500" />
                            <span className="text-xs font-semibold text-blue-700">Mentor Feedback:</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{report.feedback}</p>
                          {report.rating > 0 && (
                            <div className="flex items-center gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} size={12} className={i < Math.floor(report.rating) ? 'text-amber-400' : 'text-gray-200'} />
                              ))}
                              <span className="text-xs text-gray-500 ml-1.5">({report.rating})</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Attachments */}
                      {report.attachments && report.attachments.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {report.attachments.map((att, idx) => (
                            <Button
                              key={idx}
                              variant="link"
                              size="sm"
                              onClick={() => handleDownload(att)}
                              className="text-blue-500 p-0 text-xs hover:underline decoration-0"
                            >
                              <FaDownload size={10} className="inline mr-1" /> {att.name || att}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {report.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleApprove(report)}
                          className="flex items-center gap-1.5 px-3 rounded-lg border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                        >
                          <FaThumbsUp size={12} /> Approve
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleReject(report)}
                          className="flex items-center gap-1.5 px-3 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                        >
                          <FaThumbsDown size={12} /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaFileAlt className="text-gray-300 text-2xl" />
            </div>
            <p className="text-gray-500 font-medium">No reports submitted yet</p>
            <p className="text-gray-400 text-sm mt-1">Reports will appear here once the intern submits them</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} size="md" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-lg font-semibold text-gray-800">Review Report</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-2">Rating</Form.Label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={32}
                    className={`cursor-pointer transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-gray-200 hover:text-gray-300'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-sm font-medium text-gray-700 mb-2">Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Provide detailed feedback to help the intern improve..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="text-sm rounded-xl border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 pb-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setShowFeedbackModal(false)}
            className="rounded-lg px-4"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={submitFeedback}
            disabled={!feedbackText.trim()}
            className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
          >
            <FaPaperPlane size={12} className="me-1.5" /> Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}