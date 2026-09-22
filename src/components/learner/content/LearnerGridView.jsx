import { FaFolder, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaVideo, FaFileAlt, FaFileImage, FaMusic, FaFileArchive, FaFileCode } from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';

const getIcon = (type, size = 64) => {
  const iconSize = size;
  switch (type) {
    case 'PDF': return <FaFilePdf size={iconSize} className="text-red-500" />;
    case 'DOCX': return <FaFileWord size={iconSize} className="text-blue-600" />;
    case 'XLSX': return <FaFileExcel size={iconSize} className="text-green-600" />;
    case 'PPTX': return <FaFilePowerpoint size={iconSize} className="text-orange-500" />;
    case 'VIDEO': return <FaVideo size={iconSize} className="text-purple-500" />;
    case 'AUDIO': return <FaMusic size={iconSize} className="text-pink-500" />;
    case 'IMAGE': return <FaFileImage size={iconSize} className="text-blue-500" />;
    case 'TEXT': return <FaFileCode size={iconSize} className="text-yellow-600" />;
    case 'ARCHIVE': return <FaFileArchive size={iconSize} className="text-amber-600" />;
    case 'FOLDER': return <FaFolder size={iconSize} className="text-amber-400" />;
    default: return <FaFileAlt size={iconSize} className="text-gray-500" />;
  }
};



export default function LearnerGridView({ items, onFolderClick, onPreview }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => {
        const isFolder = item.type === 'FOLDER';
        const isImage = item.type === 'IMAGE';
        const imageUrl = isImage ? `${BASE_URL}${item.url}` : null;

        return (
          <div
            key={item.id}
            onClick={() => isFolder ? onFolderClick(item) : onPreview(item)}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer group"
          >
            <div className="aspect-square flex flex-col p-3">
              <div className="flex-1 flex items-center justify-center">
                {isFolder ? (
                  <FaFolder size={56} className="text-amber-400 group-hover:scale-105 transition" />
                ) : isImage && imageUrl ? (
                  <img src={imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                ) : (
                  getIcon(item.type, 56)
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 break-words text-center line-clamp-2">
                  {item.name}
                </p>
                {!isFolder && item.size && (
                  <p className="text-xs text-gray-400 mt-1 text-center">{item.size}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}