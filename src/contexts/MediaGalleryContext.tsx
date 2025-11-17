/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, type ReactNode } from 'react';

export type MediaFolder = 'Products' | 'Venue' | 'Team' | 'Events' | 'Other';

export interface MediaFile {
  id: string; // Local ID for preview
  file: File;
  preview: string;
  folder: MediaFolder;
  uploadedAt: Date;
  mediaId?: string; // Backend media ID for deletion
}

export interface MediaGalleryContextType {
  mediaByFolder: Record<MediaFolder, MediaFile[]>;
  addMedia: (folder: MediaFolder, files: File[]) => void;
  updateMediaIds: (folder: MediaFolder, localIdToMediaId: Record<string, string>) => void;
  removeMedia: (folder: MediaFolder, fileId: string) => void;
  getMediaForFolder: (folder: MediaFolder) => MediaFile[];
  clearFolder: (folder: MediaFolder) => void;
  getAllMedia: () => MediaFile[];
}

export const MediaGalleryContext = createContext<MediaGalleryContextType | undefined>(undefined);

interface MediaGalleryProviderProps {
  children: ReactNode;
}

export function MediaGalleryProvider({ children }: MediaGalleryProviderProps) {
  const [mediaByFolder, setMediaByFolder] = useState<Record<MediaFolder, MediaFile[]>>({
    Products: [],
    Venue: [],
    Team: [],
    Events: [],
    Other: [],
  });

  const addMedia = useCallback((folder: MediaFolder, files: File[]) => {
    const newMediaFiles: MediaFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      file,
      preview: URL.createObjectURL(file),
      folder,
      uploadedAt: new Date(),
    }));

    setMediaByFolder((prev) => ({
      ...prev,
      [folder]: [...prev[folder], ...newMediaFiles],
    }));
  }, []);

  const updateMediaIds = useCallback((folder: MediaFolder, localIdToMediaId: Record<string, string>) => {
    console.log('📝 updateMediaIds called for folder:', folder);
    console.log('📝 Mapping object:', localIdToMediaId);

    setMediaByFolder((prev) => {
      const updatedFolder = prev[folder].map((media) => {
        const newMediaId = localIdToMediaId[media.id] || media.mediaId;
        console.log(`📝 Updating media ${media.id}: mediaId ${media.mediaId} → ${newMediaId}`);
        return {
          ...media,
          mediaId: newMediaId,
        };
      });

      return {
        ...prev,
        [folder]: updatedFolder,
      };
    });
  }, []);

  const removeMedia = useCallback((folder: MediaFolder, fileId: string) => {
    setMediaByFolder((prev) => {
      const folderMedia = prev[folder];
      const fileToRemove = folderMedia.find((media) => media.id === fileId);

      // Revoke object URL to free memory
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return {
        ...prev,
        [folder]: folderMedia.filter((media) => media.id !== fileId),
      };
    });
  }, []);

  const getMediaForFolder = useCallback(
    (folder: MediaFolder) => {
      return mediaByFolder[folder];
    },
    [mediaByFolder]
  );

  const clearFolder = useCallback((folder: MediaFolder) => {
    setMediaByFolder((prev) => {
      // Revoke all object URLs for this folder
      prev[folder].forEach((media) => URL.revokeObjectURL(media.preview));

      return {
        ...prev,
        [folder]: [],
      };
    });
  }, []);

  const getAllMedia = useCallback(() => {
    return Object.values(mediaByFolder).flat();
  }, [mediaByFolder]);

  const value: MediaGalleryContextType = {
    mediaByFolder,
    addMedia,
    updateMediaIds,
    removeMedia,
    getMediaForFolder,
    clearFolder,
    getAllMedia,
  };

  return (
    <MediaGalleryContext.Provider value={value}>
      {children}
    </MediaGalleryContext.Provider>
  );
}
