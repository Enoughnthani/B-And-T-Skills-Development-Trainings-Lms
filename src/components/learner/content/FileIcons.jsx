import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaVideo, FaFileAlt, FaFileImage, FaMusic, FaFileArchive, FaFileCode, FaFolder } from 'react-icons/fa';

export const getFileIcon = (type, size = 20) => {
  switch (type) {
    case 'PDF': return <FaFilePdf size={size} className="text-red-500" />;
    case 'DOCX': return <FaFileWord size={size} className="text-blue-600" />;
    case 'XLSX': return <FaFileExcel size={size} className="text-green-600" />;
    case 'PPTX': return <FaFilePowerpoint size={size} className="text-orange-500" />;
    case 'VIDEO': return <FaVideo size={size} className="text-purple-500" />;
    case 'AUDIO': return <FaMusic size={size} className="text-pink-500" />;
    case 'IMAGE': return <FaFileImage size={size} className="text-blue-500" />;
    case 'TEXT': return <FaFileCode size={size} className="text-yellow-600" />;
    case 'ARCHIVE': return <FaFileArchive size={size} className="text-amber-600" />;
    case 'FOLDER': return <FaFolder size={size} className="text-amber-400" />;
    default: return <FaFileAlt size={size} className="text-gray-500" />;
  }
};