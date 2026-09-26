import { useRef, useState } from 'react';
import { FaFolder } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import DeleteResourceConfirm from './DeleteResourceConfirm';
import RenameResourceModal from './modals/RenameResourceModal';
import CreateFolderModal from './modals/CreateFolderModal';
import PreviewModal from './modals/PreviewModal';
import ResourcesBreadcrumb from './ResourcesBreadcrumb';
import ResourcesGrid from './ResourcesGrid';
import ResourcesHeader from './ResourcesHeader';
import UploadProgress from './UploadProgress';
import { useUnitStandardContent } from './hooks/useUnitStandardContent';

export default function UnitStandardResources() {
  const { unitStandardId } = useParams();
  const {
    contents,
    currentFolder,
    currentPath,
    loading,
    uploadProgress,
    openFolder,
    goBack,
    navigateToPath,
    createFolder,
    uploadFile,
    renameItem,
    deleteItem,
  } = useUnitStandardContent(unitStandardId);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => uploadFile(file));
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    files.forEach((file) => uploadFile(file));
    e.target.value = '';
  }

  function handleDeleteClick(item) {
    if (!item) return;
    setSelectedItem(item);
    setShowDeleteModal(true);
  }

  function handleConfirmDelete(id) {
    if (!id) return;
    deleteItem(id);
    setShowDeleteModal(false);
    setSelectedItem(null);
  }

  function handlePreview(item) {
    setPreviewItem(item);
    setShowPreviewModal(true);
  }

  function toggleSelectionMode() {
    setSelectionMode((prev) => {
      if (prev) setSelectedItems(new Set());
      return !prev;
    });
  }

  function handleSelectItem(id) {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectAll() {
    setSelectedItems((prev) =>
      prev.size === contents.length
        ? new Set()
        : new Set(contents.map((item) => item.id))
    );
  }

  async function handleBulkDelete() {
    const idsToDelete = Array.from(selectedItems);
    for (const id of idsToDelete) {
      await deleteItem(id);
    }
    setSelectedItems(new Set());
    setSelectionMode(false);
    setShowBulkDeleteConfirm(false);
  }

  if (loading && contents.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading resources…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 w-full flex flex-col min-h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ResourcesHeader
        onNewFolder={() => setShowFolderModal(true)}
        onUpload={() => fileInputRef.current?.click()}
        onBulkDelete={toggleSelectionMode}
        selectionMode={selectionMode}
        selectedCount={selectedItems.size}
        onSelectAll={handleSelectAll}
        onCancelSelection={toggleSelectionMode}
        onConfirmBulkDelete={() => setShowBulkDeleteConfirm(true)}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {currentPath.length > 0 && (
        <ResourcesBreadcrumb
          currentPath={currentPath}
          onNavigate={navigateToPath}
          onBack={goBack}
          canGoBack={currentPath.length > 0}
        />
      )}

      {uploadProgress !== null && <UploadProgress progress={uploadProgress} />}

      <div className="flex-1">
        {contents.length === 0 ? (
          <EmptyFolder
            onNewFolder={() => setShowFolderModal(true)}
            onUpload={() => fileInputRef.current?.click()}
          />
        ) : (
          <ResourcesGrid
            items={contents}
            onOpenFolder={openFolder}
            onRename={(item) => {
              setSelectedItem(item);
              setShowRenameModal(true);
            }}
            onDelete={handleDeleteClick}
            onPreview={handlePreview}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            selectionMode={selectionMode}
          />
        )}
      </div>

      <CreateFolderModal
        show={showFolderModal}
        onHide={() => setShowFolderModal(false)}
        onSave={createFolder}
      />

      <RenameResourceModal
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        item={selectedItem}
        onSave={renameItem}
      />

      <DeleteResourceConfirm
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        item={selectedItem}
        onConfirm={handleConfirmDelete}
      />

      <PreviewModal
        show={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        item={previewItem}
      />

      <DeleteResourceConfirm
        show={showBulkDeleteConfirm}
        onHide={() => setShowBulkDeleteConfirm(false)}
        item={{ name: `${selectedItems.size} items`, type: 'BULK' }}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}

function EmptyFolder({ onNewFolder, onUpload }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaFolder className="text-zinc-400 text-2xl" />
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">This folder is empty</h3>
      <p className="text-sm text-zinc-500 mb-5">
        Create a folder or upload learning materials.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={onNewFolder}
          className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          New folder
        </button>
        <button
          onClick={onUpload}
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          Upload files
        </button>
      </div>
    </div>
  );
}