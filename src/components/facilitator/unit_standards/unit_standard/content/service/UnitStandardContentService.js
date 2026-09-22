import { apiFetch } from '@/api/api';
import { BASE_URL } from '@/utils/apiEndpoint';

// Helper to detect content type from file extension
// Helper to detect content type from file extension
const getContentTypeFromFile = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const typeMap = {
    // Documents
    'pdf': 'PDF',
    'docx': 'DOCX',
    'doc': 'DOCX',
    'xlsx': 'XLSX',
    'xls': 'XLSX',
    'pptx': 'PPTX',
    'ppt': 'PPTX',
    // Images - Changed from OTHER to IMAGE
    'jpg': 'IMAGE',
    'jpeg': 'IMAGE',
    'png': 'IMAGE',
    'gif': 'IMAGE',
    'webp': 'IMAGE',
    'svg': 'IMAGE',
    'bmp': 'IMAGE',
    // Videos
    'mp4': 'VIDEO',
    'mov': 'VIDEO',
    'avi': 'VIDEO',
    'webm': 'VIDEO',
    'mkv': 'VIDEO',
    // Audio
    'mp3': 'AUDIO',
    'wav': 'AUDIO',
    'ogg': 'AUDIO',
    'm4a': 'AUDIO',
    'flac': 'AUDIO',
    // Text/Code
    'txt': 'TEXT',
    'js': 'TEXT',
    'jsx': 'TEXT',
    'ts': 'TEXT',
    'tsx': 'TEXT',
    'css': 'TEXT',
    'scss': 'TEXT',
    'html': 'TEXT',
    'htm': 'TEXT',
    'json': 'TEXT',
    'xml': 'TEXT',
    'csv': 'TEXT',
    'md': 'TEXT',
    // Archives
    'zip': 'ARCHIVE',
    'rar': 'ARCHIVE',
    '7z': 'ARCHIVE'
  };

  return typeMap[ext] || 'OTHER';
};

export const UnitStandardContentService = {
  // Get root content for a unit standard - MAIN METHOD
  getContents: (unitStandardId, folderId = null) => {
    if (folderId) {
      return apiFetch(`/api/content/unit-standard/${unitStandardId}/children/${folderId}`);
    }
    return apiFetch(`/api/content/unit-standard/${unitStandardId}`);
  },

  // Get root content for a unit standard (alias)
  getUnitStandardContents: (unitStandardId) =>
    apiFetch(`/api/content/unit-standard/${unitStandardId}`),

  // Get children of a folder
  getChildren: (parentId) =>
    apiFetch(`/api/content/children/${parentId}`),

  // Get children for a specific unit standard folder
  getUnitStandardChildren: (parentId, unitStandardId) =>
    apiFetch(`/api/content/unit-standard/${unitStandardId}/children/${parentId}`),

  // Create folder for a unit standard
  createFolder: (name, unitStandardId, parentId = null) =>
    apiFetch("/api/content", {
      method: "POST",
      body: JSON.stringify({
        name,
        type: "FOLDER",
        unitStandardId: parseInt(unitStandardId),
        parentId
      })
    }),

  // Upload file for a unit standard
  uploadFile: (file, unitStandardId, parentId = null, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      formData.append("name", file.name);
      const contentType = getContentTypeFromFile(file.name);
      formData.append("type", contentType);
      formData.append("unitStandardId", unitStandardId);
      if (parentId) formData.append("parentId", parentId);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress?.(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Upload timeout'));

      xhr.open('POST', `${BASE_URL}/api/content/upload`);
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  },

  // Rename content
  renameItem: (id, newName) =>
    apiFetch(`/api/content/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name: newName })
    }),

  // Delete content
  deleteItem: (id) =>
    apiFetch(`/api/content/${id}`, { method: "DELETE" }),

  bulkDeleteItems: (ids) =>
    apiFetch(`/api/content/bulk`, {
      method: "DELETE",
      body: JSON.stringify(ids)
    }),

  downloadContentFile: (fileUrl, originalFileName) => {
    const filename = fileUrl.split('/').pop();
    const downloadUrl = `${BASE_URL}/uploads/content/${filename}/download?originalName=${encodeURIComponent(originalFileName)}`;
    window.open(downloadUrl, '_blank');
  },
};

