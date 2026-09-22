import { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaEye, FaDownload, FaFileAlt, FaFileWord, FaFilePdf, FaFileExcel, FaFilePowerpoint, FaVideo, FaMusic, FaFileImage, FaFileCode } from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';


export default function PreviewModal({ show, onHide, item }) {
  const [loading, setLoading] = useState(true);
  const [textContent, setTextContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && item) {
      loadPreview();
    }
    return () => {
      setLoading(true);
      setError(null);
      setTextContent(null);
    };
  }, [show, item]);

  const getFileExtension = () => {
    if (!item?.fileUrl) return '';
    const urlParts = item.fileUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const lastDot = filename.lastIndexOf('.');
    if (lastDot !== -1 && lastDot !== 0) {
      return filename.substring(lastDot + 1).toLowerCase();
    }
    return '';
  };

  const getDownloadUrl = () => {
    if (!item?.fileUrl) return '';
    const filename = item.fileUrl.split('/').pop();
    
    if (item?.name) {
      return `${BASE_URL}/uploads/content/${filename}/download?originalName=${encodeURIComponent(item?.name)}`;
    }
    return `${BASE_URL}/uploads/content/${filename}/download`;
  };

  const handleDownload = () => {
    const downloadUrl = getDownloadUrl();
    
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const loadPreview = async () => {
    setLoading(true);
    setError(null);

    try {
      const fileUrl = `${BASE_URL}${item.fileUrl}`;
      const fileType = item.type;
      const extension = getFileExtension();

      // For text/code files, fetch the content
      const isTextFile = ['txt', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json', 'xml', 'csv', 'md'].includes(extension);
      if (fileType === 'TEXT' || (fileType === 'OTHER' && isTextFile)) {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setTextContent(text);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load preview');
      console.error('Preview error:', err);
      setLoading(false);
    }
  };

  const getFileUrl = () => {
    return `${BASE_URL}${item?.fileUrl}`;
  };

  const renderPreview = () => {
    if (!item) return null;

    const fileUrl = getFileUrl();
    const fileType = item.type;
    const fileName = item.name;
    const fileSize = item.fileSize;
    const extension = getFileExtension();

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner animation="border" variant="primary" />
          <p className="text-gray-500 mt-3">Loading preview...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <FaFileAlt className="text-gray-400 text-5xl mx-auto mb-3" />
          <p className="text-red-500">{error}</p>
          <Button variant="primary" size="sm" onClick={handleDownload} className="mt-3">
            <FaDownload className="inline mr-2" /> Download
          </Button>
        </div>
      );
    }

    // IMAGE Preview
    if (fileType === 'IMAGE' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return (
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-[70vh] object-contain mx-auto"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        </div>
      );
    }

    // PDF Preview
    if (fileType === 'PDF' || extension === 'pdf') {
      return (
        <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
          <iframe
            src={fileUrl}
            className="w-full h-[70vh] border-0 rounded-lg"
            title={fileName}
          />
        </div>
      );
    }

    // Video Preview
    if (fileType === 'VIDEO' || ['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return (
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            controls
            autoPlay
            className="w-full"
            style={{ maxHeight: '70vh' }}
          >
            <source src={fileUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Audio Preview
    if (fileType === 'AUDIO' || ['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
      return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h4 className="font-semibold text-gray-800 mb-2">{fileName}</h4>
          <p className="text-sm text-gray-500 mb-4">{fileSize}</p>
          <audio controls className="w-full">
            <source src={fileUrl} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // Word Document Preview
    if (fileType === 'DOCX' || extension === 'docx' || extension === 'doc') {
      return (
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <FaFileWord size={80} className="text-blue-600 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-800 mb-2">{fileName}</h4>
          <p className="text-gray-500 mb-4">{fileSize}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700">
              📄 Word document preview is not available in the browser.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Click Download to view in Microsoft Word.
            </p>
          </div>
          <Button variant="primary" onClick={handleDownload}>
            <FaDownload className="inline mr-2" /> Download
          </Button>
        </div>
      );
    }

    // Excel Document Preview
    if (fileType === 'XLSX' || extension === 'xlsx' || extension === 'xls') {
      return (
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <FaFileExcel size={80} className="text-green-600 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-800 mb-2">{fileName}</h4>
          <p className="text-gray-500 mb-4">{fileSize}</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-700">
              📊 Excel spreadsheet preview is not available in the browser.
            </p>
            <p className="text-xs text-green-600 mt-1">
              Click Download to view in Microsoft Excel.
            </p>
          </div>
          <Button variant="primary" onClick={handleDownload}>
            <FaDownload className="inline mr-2" /> Download
          </Button>
        </div>
      );
    }

    // PowerPoint Document Preview
    if (fileType === 'PPTX' || extension === 'pptx' || extension === 'ppt') {
      return (
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <FaFilePowerpoint size={80} className="text-orange-600 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-800 mb-2">{fileName}</h4>
          <p className="text-gray-500 mb-4">{fileSize}</p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-orange-700">
              📽️ PowerPoint preview is not available in the browser.
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Click Download to view in Microsoft PowerPoint.
            </p>
          </div>
          <Button variant="primary" onClick={handleDownload}>
            <FaDownload className="inline mr-2" /> Download
          </Button>
        </div>
      );
    }

    // Text/Code Preview
    if (fileType === 'TEXT' || ['txt', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json', 'xml', 'csv', 'md'].includes(extension)) {
      const maxLength = 50000;
      const content = textContent || '';
      const truncated = content.length > maxLength ? content.substring(0, maxLength) + '\n\n... (file truncated, only showing first 50,000 characters)' : content;

      return (
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="bg-gray-800 rounded-lg p-2 mb-3 flex justify-between items-center">
            <code className="text-xs text-gray-400">File type: .{extension}</code>
            <code className="text-xs text-gray-400">Size: {fileSize}</code>
          </div>
          <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap break-words max-h-[60vh] overflow-auto p-3 bg-gray-800 rounded-lg">
            {truncated}
          </pre>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="text-center py-20">
        <FaFileAlt className="text-gray-400 text-5xl mx-auto mb-3" />
        <h5 className="text-gray-700 mb-2">Preview not available</h5>
        <p className="text-gray-500 text-sm mb-2">
          File type: {fileType || extension || 'Unknown'}
        </p>
        <p className="text-gray-400 text-xs mb-4">
          This file type cannot be previewed in the modal
        </p>
        <Button variant="primary" onClick={handleDownload}>
          <FaDownload className="inline mr-2" /> Download
        </Button>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="flex items-center gap-2">
          <FaEye className="text-blue-500" />
          Preview: {item?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {renderPreview()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDownload}>
          <FaDownload className="inline mr-2" /> Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
}