import { FaFolder, FaEye, FaFileCode } from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';
import { getFileIcon } from './FileIcons';

export default function LearnerListView({ items, onFolderClick, onPreview }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Size</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => {
              const isFolder = item.type === 'FOLDER';
              const isImage = item.type === 'IMAGE';
              const imageUrl = isImage ? `${BASE_URL}${item.url}` : null;

              return (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => isFolder ? onFolderClick(item) : onPreview(item)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {isImage && imageUrl ? (
                          <img src={imageUrl} alt={item.name} className="w-6 h-6 object-cover rounded" />
                        ) : (
                          getFileIcon(item.type, 20)
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-gray-500">{isFolder ? 'Folder' : item.type}</span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">{!isFolder && item.size ? item.size : '-'}</td>
                  <td className="p-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEye size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}