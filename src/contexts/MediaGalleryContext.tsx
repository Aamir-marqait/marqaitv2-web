/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, type ReactNode } from 'react';

export type MediaFolder = 'products' | 'venue' | 'team' | 'events';

export interface MediaFile {
  id: string;
  file: File;
  preview: string;
  folder: MediaFolder;
  uploadedAt: Date;
}

export interface MediaGalleryContextType {
  mediaByFolder: Record<MediaFolder, MediaFile[]>;
  addMedia: (folder: MediaFolder, files: File[]) => void;
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
    products: [],
    venue: [],
    team: [],
    events: [],
  });

  const addMedia = useCallback((folder: MediaFolder, files: File[]) => {
    const newMediaFiles: MediaFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
