import { useEffect, useState } from 'react';
import { FaArrowLeft, FaFolder, FaList, FaSearch, FaThLarge } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LearnerGridView from './LearnerGridView';
import LearnerListView from './LearnerListView';
import LearnerPreviewModal from './LearnerPreviewModal';
import { apiFetch } from '@/api/api';

export default function LearnerContentPage() {
  const { unitStandardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [fileSystem, setFileSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [unitStandard, setUnitStandard] = useState(location?.state?.unitStandard || null);

  useEffect(() => {
    if (unitStandard) {
      buildFileSystem(unitStandard);
    } else if (unitStandardId) {
      fetchUnitStandard();
    } else {
      setLoading(false);
    }
  }, [unitStandard, unitStandardId]);

  const fetchUnitStandard = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/unit-standards/${unitStandardId}`);
      const data = response?.payload || response;
      setUnitStandard(data);
      buildFileSystem(data);
    } catch (error) {
      console.error('Error fetching unit standard:', error);
      setLoading(false);
    }
  };

  const buildFileSystem = (unitStandardData) => {
    if (unitStandardData?.contents) {
      const rootChildren = [];
      const folderMap = new Map();

      unitStandardData.contents.forEach(content => {
        const isFolder = content.type === 'FOLDER';
        const item = {
          id: content.id,
          name: content.name,
          type: content.type,
          size: content.fileSize,
          url: content.fileUrl,
          parentId: content.parentId,
          children: [],
          isFolder
        };
        folderMap.set(content.id, item);
        if (!content.parentId) rootChildren.push(item);
      });

      folderMap.forEach(item => {
        if (item.parentId && folderMap.has(item.parentId)) {
          folderMap.get(item.parentId).children.push(item);
        }
      });

      setFileSystem({ children: rootChildren });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const getCurrentContent = () => {
    if (!fileSystem) return [];
    const items = !currentFolder ? fileSystem.children : currentFolder.children;
    
    if (searchTerm) {
      return items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return items;
  };

  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, folder]);
    setCurrentFolder(folder);
  };

  const handleBackClick = () => {
    if (currentFolder) {
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);
      setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null);
    }
  };

  const handleNavigateToRoot = () => {
    setCurrentFolder(null);
    setCurrentPath([]);
  };

  const handlePreview = (item) => {
    setPreviewItem(item);
    setShowPreviewModal(true);
  };

  const content = getCurrentContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!unitStandard) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <FaFolder size={60} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Unit Standard not found</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 mt-3">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm"
        >
          <FaArrowLeft size={14} /> Back
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                  ID: {unitStandard?.unitStandardId}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  unitStandard?.type === 'CORE' ? 'bg-green-100 text-green-700' :
                  unitStandard?.type === 'FUNDAMENTAL' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {unitStandard?.type}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-2">{unitStandard?.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>⭐ {unitStandard?.credits} credits</span>
                <span>🎓 {unitStandard?.nqfLevel}</span>
                <span>📚 {unitStandard?.contentCount || 0} resources</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={handleNavigateToRoot} 
              className={`px-2 py-1 rounded hover:bg-gray-100 ${!currentFolder ? 'font-semibold text-gray-800' : 'text-gray-500'}`}
            >
              Content
            </button>
            {currentPath.map((folder, index) => (
              <span key={index} className="flex items-center gap-1">
                <span className="text-gray-400">/</span>
                <button 
                  onClick={() => {
                    const newPath = currentPath.slice(0, index + 1);
                    setCurrentPath(newPath);
                    setCurrentFolder(newPath[newPath.length - 1]);
                  }} 
                  className="text-gray-600 hover:text-gray-800"
                >
                  {folder.name}
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`px-3 py-1.5 text-sm transition ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <FaThLarge size={14} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`px-3 py-1.5 text-sm transition ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <FaList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {content.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FaFolder size={60} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">This folder is empty</p>
          </div>
        ) : viewMode === 'grid' ? (
          <LearnerGridView 
            items={content} 
            onFolderClick={handleFolderClick} 
            onPreview={handlePreview} 
          />
        ) : (
          <LearnerListView 
            items={content} 
            onFolderClick={handleFolderClick} 
            onPreview={handlePreview} 
          />
        )}
      </div>

      <LearnerPreviewModal 
        show={showPreviewModal} 
        onHide={() => setShowPreviewModal(false)} 
        item={previewItem} 
      />
    </div>
  );
}