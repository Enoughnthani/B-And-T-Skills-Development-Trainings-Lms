import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaVideo, FaTimes, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import { Download, Maximize2, Minimize2, Eye } from 'lucide-react';

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file } = location.state || {};
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) {
      setError('No file selected');
      setLoading(false);
      return;
    }

    setLoading(true);
    // Simulate loading file content
    setTimeout(() => {
      try {
        if (file.type === 'video') {
          setContent({
            url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            type: 'video'
          });
        } else if (file.type === 'pdf') {
          setContent({
            type: 'pdf',
            text: 'PDF content would appear here...'
          });
        } else if (file.type === 'docx' || file.type === 'txt') {
          setContent({
            type: 'text',
            content: `# ${file.name}\n\n## Introduction\nThis is a detailed guide to help you understand the key concepts of ${file.name}.\n\n## Key Topics\n- Topic 1: Understanding the basics\n- Topic 2: Advanced concepts and practical applications\n- Topic 3: Real-world examples and case studies\n\n## Summary\nThe material covers all essential information needed for your learnership. Make sure to review all sections carefully.\n\n## Additional Resources\nCheck the reference section for more details and supplementary materials.`
          });
        } else if (file.type === 'xlsx') {
          setContent({
            type: 'excel',
            data: [
              { name: 'Module 1', value: 100, status: 'Complete' },
              { name: 'Module 2', value: 250, status: 'Pending' },
              { name: 'Module 3', value: 175, status: 'Complete' },
              { name: 'Module 4', value: 300, status: 'In Progress' },
            ]
          });
        } else if (file.type === 'pptx') {
          setContent({
            type: 'powerpoint',
            slides: [
              { title: 'Introduction', content: 'Welcome and learning objectives' },
              { title: 'Key Concepts', content: 'Main topics covered in this presentation' },
              { title: 'Examples', content: 'Practical demonstrations and use cases' },
              { title: 'Summary', content: 'Key takeaways and next steps' },
            ]
          });
        } else {
          setContent({
            type: 'generic',
            content: `Preview not available for ${file.type} files. Please download to view.`
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load preview');
        setLoading(false);
      }
    }, 1000);
  }, [file]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner animation="border" variant="primary" />
          <p className="text-gray-500 mt-3 text-sm">Loading preview...</p>
        </div>
      );
    }

    if (error || !file) {
      return (
        <div className="bg-red-50 rounded-lg p-8 text-center">
          <p className="text-red-600">{error || 'No file selected'}</p>
          <Button variant="outline-danger" size="sm" onClick={() => navigate(-1)} className="mt-3">
            Go Back
          </Button>
        </div>
      );
    }

    // Video Player
    if (file.type === 'video') {
      return (
        <div className="bg-black rounded-lg overflow-hidden">
          <video 
            controls 
            autoPlay 
            className="w-full"
            style={{ maxHeight: '70vh' }}
          >
            <source src={content?.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="p-4 bg-gray-800 text-white">
            <h5 className="font-semibold text-base">{file.name}</h5>
            <p className="text-gray-300 text-xs">Duration: {file.duration}</p>
          </div>
        </div>
      );
    }

    // PDF Viewer
    if (file.type === 'pdf') {
      return (
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="bg-white rounded-lg shadow-inner p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <div className="flex items-center gap-2">
                <FaFilePdf className="text-red-500 text-lg" />
                <h6 className="font-semibold text-gray-800 m-0 text-sm">{file.name}</h6>
              </div>
              <span className="text-xs text-gray-400">{file.size}</span>
            </div>
            <div className="text-center py-8">
              <FaFilePdf className="text-red-400 text-5xl mx-auto mb-3" />
              <p className="text-gray-500 text-sm">PDF Document Preview</p>
              <p className="text-gray-400 text-xs mt-2">Click Download to view full document</p>
            </div>
          </div>
        </div>
      );
    }

    // Text/Document Viewer (DOCX, TXT)
    if (file.type === 'docx' || file.type === 'txt') {
      return (
        <div className="bg-white rounded-lg shadow-inner p-5 max-h-[500px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
            {file.type === 'docx' ? (
              <FaFileWord className="text-blue-500 text-lg" />
            ) : (
              <FaFileAlt className="text-gray-500 text-lg" />
            )}
            <h5 className="font-semibold text-gray-800 m-0 text-sm">{file.name}</h5>
          </div>
          <div className="whitespace-pre-wrap text-gray-700 text-xs leading-relaxed">
            {content?.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h4 key={i} className="text-base font-bold mt-3 mb-2">{line.substring(2)}</h4>;
              } else if (line.startsWith('## ')) {
                return <h5 key={i} className="text-sm font-semibold mt-2 mb-1">{line.substring(3)}</h5>;
              } else if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 text-xs">{line.substring(2)}</li>;
              } else if (line.trim() === '') {
                return <br key={i} />;
              } else {
                return <p key={i} className="mb-1 text-xs">{line}</p>;
              }
            })}
          </div>
        </div>
      );
    }

    // Excel Preview
    if (file.type === 'xlsx') {
      return (
        <div className="bg-white rounded-lg shadow-inner p-4 max-h-[500px] overflow-auto">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
            <FaFileExcel className="text-green-500 text-lg" />
            <h6 className="font-semibold text-gray-800 m-0 text-sm">{file.name}</h6>
          </div>
          <table className="min-w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Module</th>
                <th className="border p-2 text-left">Score</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {content?.data.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{row.name}</td>
                  <td className="border p-2">{row.value}</td>
                  <td className={`border p-2 ${row.status === 'Complete' ? 'text-green-600' : row.status === 'Pending' ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // PowerPoint Preview
    if (file.type === 'pptx') {
      return (
        <div className="bg-white rounded-lg shadow-inner p-4 max-h-[500px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
            <FaFilePowerpoint className="text-orange-500 text-lg" />
            <h6 className="font-semibold text-gray-800 m-0 text-sm">{file.name}</h6>
          </div>
          <div className="space-y-2">
            {content?.slides.map((slide, idx) => (
              <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">
                    {idx + 1}
                  </div>
                  <h6 className="font-medium text-gray-800 m-0 text-sm">{slide.title}</h6>
                </div>
                <p className="text-gray-600 text-xs ml-7">{slide.content}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default/Generic Preview
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Eye className="text-gray-400 mx-auto mb-3" size={40} />
        <p className="text-gray-500 text-sm">{content?.content || "Preview not available"}</p>
      </div>
    );
  };

  const handleDownload = () => {
    alert(`Downloading: ${file?.name}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-xl flex flex-col ${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl max-h-[90vh]'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-white" />
            <h5 className="text-white font-medium m-0 text-sm">Preview: {file?.name}</h5>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:text-gray-300 transition"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-300 transition"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {renderContent()}
        </div>
        
        {/* Footer */}
        <div className="border-t px-4 py-3 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {file?.type?.toUpperCase()} • {file?.size || file?.duration}
            </div>
            <div className="flex gap-2">
              <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownload}>
                <Download size={14} className="inline mr-1" /> Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}