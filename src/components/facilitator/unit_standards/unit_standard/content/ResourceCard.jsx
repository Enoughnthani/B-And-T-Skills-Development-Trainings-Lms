import { useState, useRef } from 'react';
import {
  FaFolder, FaFilePdf, FaFileWord, FaFileExcel,
  FaFilePowerpoint, FaVideo, FaFileAlt, FaEllipsisV,
  FaEye,
  FaFileCode,
  FaFileImage,
  FaMusic,
  FaFileArchive,
  FaCheckSquare,
  FaSquare
} from 'react-icons/fa';
import { Overlay, Popover, Button, Form } from 'react-bootstrap';
import { BASE_URL } from '@/utils/apiEndpoint';

const getFileIcon = (type, size = 90) => {
  const iconSize = size;
  const className = "text-4xl";

  switch (type) {
    case 'PDF': return <FaFilePdf size={iconSize} className={`text-red-500 ${className}`} />;
    case 'DOCX': return <FaFileWord size={iconSize} className={`text-blue-600 ${className}`} />;
    case 'XLSX': return <FaFileExcel size={iconSize} className={`text-green-600 ${className}`} />;
    case 'PPTX': return <FaFilePowerpoint size={iconSize} className={`text-orange-500 ${className}`} />;
    case 'VIDEO': return <FaVideo size={iconSize} className={`text-purple-500 ${className}`} />;
    case 'AUDIO': return <FaMusic size={iconSize} className={`text-pink-500 ${className}`} />;
    case 'TEXT': return <FaFileCode size={iconSize} className={`text-yellow-600 ${className}`} />;
    case 'ARCHIVE': return <FaFileArchive size={iconSize} className={`text-amber-600 ${className}`} />;
    case 'FOLDER': return <FaFolder size={iconSize} className="text-amber-400" />;
    default: return <FaFileAlt size={iconSize} className={`text-gray-500 ${className}`} />;
  }
};

export default function ResourceCard({
  item,
  onOpen,
  onRename,
  onDelete,
  onPreview,
  isSelected,
  onSelect,
  selectionMode
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const targetRef = useRef(null);

  const isFolder = item.type === 'FOLDER';
  const isImage = item.type === 'IMAGE';

  const handleCardClick = (e) => {
    if (selectionMode) {
      e.stopPropagation();
      onSelect(item.id);
    } else if (isFolder) {
      onOpen(item);
    } else {
      onPreview(item);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(item);
  };

  const handleRenameClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onRename(item);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onPreview(item);
  };

  const imageUrl = isImage && item.fileUrl ? `${BASE_URL}${item.fileUrl}` : null;

  return (
    <div
      className={`bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-pointer border relative group ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
        }`}
      onClick={handleCardClick}
    >
      {/* Checkbox for selection mode */}
      {selectionMode && (
        <div className="absolute top-2 bg-white left-2 z-10">
          <Form.Check checked={isSelected} />
        </div>
      )}

      <div className="flex justify-center pt-2 pb-3">
        {isFolder ? (
          <FaFolder size={90} className="text-amber-400" />
        ) : isImage && imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          getFileIcon(item.type)
        )}
      </div>

      <p className="text-sm font-medium text-center truncate px-1">{item.name}</p>

      {!isFolder && item.size && (
        <p className="text-xs text-gray-400 text-center mt-0.5">{item.size}</p>
      )}

      {!selectionMode && (
        <button
          ref={targetRef}
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute top-2 right-2 bg-transparent"
        >
          <FaEllipsisV className='text-gray-500' size={14} />
        </button>
      )}

      <Overlay
        target={targetRef.current}
        show={showMenu}
        placement="auto"
        rootClose
        onHide={() => setShowMenu(false)}
      >
        <Popover className="shadow-sm">
          <Popover.Body className="p-1">
            <div className="d-flex flex-column gap-1">
              <Button
                size="sm"
                variant="link"
                className="text-start text-decoration-none"
                onClick={handleRenameClick}
              >
                ✏️ Rename
              </Button>
              <Button
                size="sm"
                variant="link"
                className="text-start text-danger text-decoration-none"
                onClick={handleDeleteClick}
              >
                🗑️ Delete
              </Button>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}