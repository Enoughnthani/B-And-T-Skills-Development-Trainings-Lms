import { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaEye, FaDownload, FaFileAlt, FaFileCode, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaVideo, FaMusic, FaFileImage } from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';

export default function LearnerPreviewModal({ show, onHide, item }) {
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
    if (!item?.url) return '';
    const filename = item.url.split('/').pop();
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : '';
  };

  const getPreviewUrl = () => {
    const filename = item?.url?.split('/').pop();
    return `${BASE_URL}/uploads/content/${filename}`;
  };

  const getDownloadUrl = () => {
    if (!item?.url) return '';

    const filename = item.url.split('/').pop();
    const originalName = item.name; // This should be the full filename with extension

    // Get the file extension from the URL
    const extension = filename.split('.').pop();

    // Ensure the original name has the correct extension
    let fullName = originalName;
    if (originalName && !originalName.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
      fullName = `${originalName}.${extension}`;
    }

    return `${BASE_URL}/uploads/content/${filename}/download?originalName=${encodeURIComponent(fullName)}`;
  };





  const loadPreview = async () => {
    setLoading(true);
    setError(null);

    try {
      const fileUrl = getPreviewUrl();
      const extension = getFileExtension();
      const isTextFile = ['txt', 'js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'html', 'htm', 'json', 'xml', 'csv', 'md', 'yaml', 'yml', 'log'].includes(extension);

      if (isTextFile || item.type === 'TEXT') {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setTextContent(text);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load preview');
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!item) return null;

    const fileUrl = getPreviewUrl();
    const extension = getFileExtension();
    const isImage = item.type === 'IMAGE' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
    const isVideo = item.type === 'VIDEO' || ['mp4', 'webm', 'mov', 'avi'].includes(extension);
    const isAudio = item.type === 'AUDIO' || ['mp3', 'wav', 'ogg', 'm4a'].includes(extension);
    const isPdf = item.type === 'PDF' || extension === 'pdf';
    const isText = item.type === 'TEXT' || ['txt', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json', 'xml', 'csv', 'md'].includes(extension);
    const isDocx = item.type === 'DOCX' || extension === 'docx';
    const isXlsx = item.type === 'XLSX' || extension === 'xlsx';
    const isPptx = item.type === 'PPTX' || extension === 'pptx';

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
          <Button variant="primary" onClick={() => window.open(getDownloadUrl(), '_blank')} className="mt-3">
            <FaDownload className="inline mr-2" /> Download
          </Button>
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <img src={fileUrl} alt={item.name} className="max-w-full max-h-[70vh] object-contain mx-auto" />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="bg-black rounded-lg">
          <video controls autoPlay className="w-full" style={{ maxHeight: '70vh' }}>
            <source src={fileUrl} />
          </video>
          <div className="p-3 bg-gray-800 text-white text-sm">{item.name}</div>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
          <audio controls className="w-full"><source src={fileUrl} /></audio>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
          <iframe src={fileUrl} className="w-full h-[70vh] border-0" title={item.name} />
        </div>
      );
    }

    if (isText && textContent) {
      const maxLength = 50000;
      const truncated = textContent.length > maxLength ? textContent.substring(0, maxLength) + '\n\n... (file truncated)' : textContent;

      return (
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="bg-gray-800 rounded-lg p-2 mb-3 flex justify-between items-center">
            <code className="text-xs text-gray-400">File type: .{extension}</code>
            <code className="text-xs text-gray-400">{item.size}</code>
          </div>
          <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap break-words max-h-[60vh] overflow-auto p-3 bg-gray-800 rounded-lg">
            {truncated}
          </pre>
        </div>
      );
    }

    if (isDocx || isXlsx || isPptx) {
      const googleViewer = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      return (
        <div className="min-h-[500px]">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3 text-center text-sm text-yellow-700">
            Preview via Google Docs. If not loading, please download.
          </div>
          <iframe src={googleViewer} className="w-full h-[60vh] border-0" title={item.name} />
        </div>
      );
    }

    return (
      <div className="text-center py-20">
        <FaFileAlt className="text-gray-400 text-5xl mx-auto mb-3" />
        <p className="text-gray-500">Preview not available for this file type</p>
        <Button variant="primary" className="mt-3" onClick={() => window.open(getDownloadUrl(), '_blank')}>
          <FaDownload className="inline mr-2" /> Download
        </Button>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title><FaEye className="text-blue-500 inline mr-2" /> {item?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">{renderPreview()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={() => window.open(getDownloadUrl(), '_blank')}>
          <FaDownload className="inline mr-2" /> Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
}