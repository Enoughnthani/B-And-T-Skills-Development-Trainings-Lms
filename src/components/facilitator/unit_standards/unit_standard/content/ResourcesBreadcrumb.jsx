import { FaArrowLeft, FaHome, FaChevronRight } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

export default function ResourcesBreadcrumb({ currentPath, onNavigate, onBack, canGoBack }) {
  return (
    <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-gray-100">
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm transition ${
          canGoBack 
            ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-800' 
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        <FaArrowLeft size={14} />
        <span>Back</span>
      </button>

      <span className="text-gray-300">|</span>

      {/* Breadcrumb Items */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* Root / Home */}
        <button
          onClick={() => onNavigate(-1)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <FaHome size={14} />
          <span>Content</span>
        </button>

        {/* Path items */}
        {currentPath.map((folder, index) => (
          <div key={index} className="flex items-center gap-1">
            <FaChevronRight size={12} className="text-gray-400" />
            <button
              onClick={() => onNavigate(index)}
              className="px-2 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition max-w-[200px] truncate"
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}