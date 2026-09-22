import { FaFolder, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaVideo, FaFileAlt, FaFileImage, FaMusic, FaFileArchive } from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';

const getIcon = (type) => {
  switch (type) {
    case 'PDF': return <FaFilePdf className="text-red-500 text-5xl" />;
    case 'DOCX': return <FaFileWord className="text-blue-600 text-5xl" />;
    case 'XLSX': return <FaFileExcel className="text-green-600 text-5xl" />;
    case 'PPTX': return <FaFilePowerpoint className="text-orange-500 text-5xl" />;
    case 'VIDEO': return <FaVideo className="text-purple-500 text-5xl" />;
    case 'AUDIO': return <FaMusic className="text-pink-500 text-5xl" />;
    case 'IMAGE': return <FaFileImage className="text-blue-500 text-5xl" />;
    case 'ARCHIVE': return <FaFileArchive className="text-amber-600 text-5xl" />;
    case 'FOLDER': return <FaFolder className="text-amber-400 text-5xl" />;
    default: return <FaFileAlt className="text-gray-500 text-5xl" />;
  }
};

export default function LearnerFileGrid({ items, onFolderClick, onPreview }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => {
        const isFolder = item.type === 'FOLDER';
        const isImage = item.type === 'IMAGE';
        const imageUrl = isImage ? `${BASE_URL}${item.url}` : null;

        return (
          <div
            key={item.id}
            onClick={() => isFolder ? onFolderClick(item) : onPreview(item)}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition cursor-pointer text-center"
          >
            {isImage && imageUrl ? (
              <img src={imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg mx-auto" />
            ) : (
              <div className="flex justify-center py-2">{getIcon(item.type)}</div>
            )}
            <p className="mt-2 text-sm font-medium text-gray-700 break-words">{item.name}</p>
            {!isFolder && item.size && <p className="text-xs text-gray-400">{item.size}</p>}
          </div>
        );
      })}
    </div>
  );
}