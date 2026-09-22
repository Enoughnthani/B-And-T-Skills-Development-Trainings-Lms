import { Modal, ProgressBar } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';

export default function UploadProgress({ progress, onClose }) {
  return (
    <Modal show={progress !== null && progress < 100} centered backdrop="static" keyboard={false}>
      <Modal.Body className="py-4">
        <div className="text-center">
          <FaUpload size={32} className="text-blue-500 mb-3 animate-pulse" />
          <h6 className="mb-3">Uploading file...</h6>
          <ProgressBar 
            now={progress} 
            label={`${progress}%`} 
            className="h-2"
            variant="primary"
          />
          <p className="text-xs text-gray-400 mt-2">Please wait while your file uploads</p>
        </div>
      </Modal.Body>
    </Modal>
  );
}