import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaUserCircle, FaCalendarAlt, FaDownload, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';
import {assessmentService}  from './services/AssessmentService';

export default function SubmissionsModal({ show, onHide, assessment }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show && assessment) {
      loadSubmissions();
    }
  }, [show, assessment]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await assessmentService.getSubmissions(assessment.id);
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="border-0 pb-0">
        <Modal.Title>
          Submissions: {assessment?.title}
        </Modal.Title>
        <button onClick={onHide} className="text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8">
            <FaUserCircle className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-gray-500">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {submissions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-gray-400 text-2xl" />
                  <div>
                    <p className="font-medium text-gray-800">{sub.learnerName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FaCalendarAlt size={10} /> Submitted: {new Date(sub.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {sub.fileUrl && (
                  <button 
                    onClick={() => window.open(BASE_URL + sub.fileUrl, '_blank')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FaDownload size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}