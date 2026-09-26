import { useEffect, useState } from 'react';
import {
  FaDownload,
  FaEye,
  FaFileAlt,
  FaFileCode,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaMusic,
  FaVideo,
} from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';

const TEXT_EXTENSIONS = [
  'txt', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json', 'xml', 'csv', 'md',
];

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi'];
const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a'];
const WORD_EXTENSIONS = ['doc', 'docx'];
const EXCEL_EXTENSIONS = ['xls', 'xlsx'];
const POWERPOINT_EXTENSIONS = ['ppt', 'pptx'];

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

  if (!show || !item) return null;

  function getFileExtension() {
    if (!item?.fileUrl) return '';
    const filename = item.fileUrl.split('/').pop();
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 && lastDot !== 0
      ? filename.substring(lastDot + 1).toLowerCase()
      : '';
  }

  function getFileUrl() {
    return `${BASE_URL}${item?.fileUrl}`;
  }

  function getDownloadUrl() {
    if (!item?.fileUrl) return '';
    const filename = item.fileUrl.split('/').pop();
    if (item?.name) {
      return `${BASE_URL}/uploads/content/${filename}/download?originalName=${encodeURIComponent(item.name)}`;
    }
    return `${BASE_URL}/uploads/content/${filename}/download`;
  }

  function handleDownload() {
    const url = getDownloadUrl();
    if (url) window.open(url, '_blank');
  }

  async function loadPreview() {
    setLoading(true);
    setError(null);

    try {
      const extension = getFileExtension();
      const fileUrl = getFileUrl();
      const isTextFile = TEXT_EXTENSIONS.includes(extension);

      if (item.type === 'TEXT' || (item.type === 'OTHER' && isTextFile)) {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setTextContent(text);
      }

      setLoading(false);
    } catch {
      setError('Failed to load preview.');
      setLoading(false);
    }
  }

  function renderPreview() {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading preview…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 px-6">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFileAlt className="text-zinc-400 text-xl" />
          </div>
          <p className="text-sm text-[#E30613] mb-4">{error}</p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaDownload size={12} />
            Download
          </button>
        </div>
      );
    }

    const extension = getFileExtension();
    const fileUrl = getFileUrl();

    if (
      item.type === 'IMAGE' ||
      IMAGE_EXTENSIONS.includes(extension)
    ) {
      return (
        <div className="bg-zinc-50 rounded-lg p-4">
          <img
            src={fileUrl}
            alt={item.name}
            className="max-w-full max-h-[70vh] object-contain mx-auto rounded"
          />
        </div>
      );
    }

    if (item.type === 'PDF' || extension === 'pdf') {
      return (
        <div className="bg-zinc-50 rounded-lg p-4">
          <iframe
            src={fileUrl}
            className="w-full h-[70vh] border-0 rounded"
            title={item.name}
          />
        </div>
      );
    }

    if (
      item.type === 'VIDEO' ||
      VIDEO_EXTENSIONS.includes(extension)
    ) {
      return (
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            controls
            autoPlay
            className="w-full max-h-[70vh]"
          >
            <source src={fileUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (
      item.type === 'AUDIO' ||
      AUDIO_EXTENSIONS.includes(extension)
    ) {
      return (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMusic className="text-zinc-500" size={24} />
          </div>
          <h4 className="font-bold text-zinc-900 mb-1 break-words">
            {item.name}
          </h4>
          <p className="text-xs text-zinc-500 mb-4">{item.fileSize}</p>
          <audio controls className="w-full">
            <source src={fileUrl} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    if (WORD_EXTENSIONS.includes(extension)) {
      return (
        <UnavailablePreview
          icon={FaFileWord}
          name={item.name}
          size={item.fileSize}
          message="Word documents can't be previewed in the browser."
          hint="Click Download to open it in Microsoft Word."
          onDownload={handleDownload}
        />
      );
    }

    if (EXCEL_EXTENSIONS.includes(extension)) {
      return (
        <UnavailablePreview
          icon={FaFileExcel}
          name={item.name}
          size={item.fileSize}
          message="Excel spreadsheets can't be previewed in the browser."
          hint="Click Download to open it in Microsoft Excel."
          onDownload={handleDownload}
        />
      );
    }

    if (POWERPOINT_EXTENSIONS.includes(extension)) {
      return (
        <UnavailablePreview
          icon={FaFilePowerpoint}
          name={item.name}
          size={item.fileSize}
          message="PowerPoint presentations can't be previewed in the browser."
          hint="Click Download to open it in Microsoft PowerPoint."
          onDownload={handleDownload}
        />
      );
    }

    if (
      item.type === 'TEXT' ||
      TEXT_EXTENSIONS.includes(extension)
    ) {
      const maxLength = 50000;
      const content = textContent || '';
      const truncated =
        content.length > maxLength
          ? content.substring(0, maxLength) +
            '\n\n… (file truncated, showing first 50,000 characters)'
          : content;

      return (
        <div>
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2">
              <FaFileCode className="text-zinc-500" size={12} />
              <span className="text-[11px] font-mono text-zinc-400">
                .{extension}
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {item.fileSize}
            </span>
          </div>
          <pre className="text-zinc-300 text-sm font-mono whitespace-pre-wrap break-words max-h-[60vh] overflow-auto p-4 bg-zinc-900">
            {truncated}
          </pre>
        </div>
      );
    }

    return (
      <UnavailablePreview
        icon={FaFileAlt}
        name={item.name}
        size={item.fileSize}
        message={`Preview not available for this file type.`}
        hint={`File type: ${item.type || extension || 'Unknown'}`}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
              <FaEye className="text-zinc-700" size={14} />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-zinc-900 truncate text-sm sm:text-base">
                {item.name}
              </h2>
              <p className="text-xs text-zinc-500 truncate">
                Preview
              </p>
            </div>
          </div>

          <button
            onClick={onHide}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors text-xl leading-none shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {renderPreview()}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-4 sm:px-5 py-3 border-t border-zinc-200 bg-zinc-50 shrink-0">
          <button
            onClick={onHide}
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] transition-colors"
          >
            <FaDownload size={12} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function UnavailablePreview({ icon: Icon, name, size, message, hint, onDownload }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="text-zinc-500" size={24} />
      </div>

      <h4 className="font-bold text-zinc-900 mb-1 break-words">
        {name}
      </h4>
      {size && <p className="text-xs text-zinc-500 mb-4">{size}</p>}

      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 mb-5 max-w-md mx-auto">
        <p className="text-sm text-zinc-700 mb-1">{message}</p>
        {hint && <p className="text-xs text-zinc-500">{hint}</p>}
      </div>

      <button
        onClick={onDownload}
        className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
      >
        <FaDownload size={12} />
        Download
      </button>
    </div>
  );
}