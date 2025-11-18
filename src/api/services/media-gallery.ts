/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import { handleApiError } from '../utils';

export type MediaFolder = 'Products' | 'Venue' | 'Team' | 'Events' | 'Other';

export interface MediaUploadResponse {
  id: string;
  filename: string;
  file_url: string;
  file_type: 'image' | 'video';
  file_size: number;
  size_formatted: string;
  folder: MediaFolder;
  uploaded_at: string;
  message: string;
}

export interface BulkUploadResponse {
  successful_uploads: MediaUploadResponse[];
  failed_uploads: any[];
  total_uploaded: number;
  total_failed: number;
  message: string;
}

class MediaGalleryService {
  private getBaseUrl(businessId: string) {
    return `/api/v2/business-information/${businessId}/media`;
  }

  /**
   * Upload single media file
   * @param businessId - Business ID
   * @param file - Media file
   * @param folder - Folder category
   * @param description - Optional description
   * @param tags - Optional tags (comma-separated string)
   */
  async uploadSingle(
    businessId: string,
    file: File,
    folder: MediaFolder,
    description?: string,
    tags?: string
  ): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      if (description) formData.append('description', description);
      if (tags) formData.append('tags', tags);

      const response = await axiosInstance.post<MediaUploadResponse>(
        this.getBaseUrl(businessId),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 0,
        }
      );

      console.log('✅ Media uploaded:', response.data.filename);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Bulk upload media files (max 10 files)
   * @param businessId - Business ID
   * @param files - Array of files (max 10)
   * @param folder - Folder category
   * @param description - Optional description
   * @param tags - Optional tags (comma-separated string)
   */
  async uploadBulk(
    businessId: string,
    files: File[],
    folder: MediaFolder,
    description?: string,
    tags?: string
  ): Promise<BulkUploadResponse> {
    try {
      if (files.length > 10) {
        throw new Error('Maximum 10 files allowed per upload');
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', folder);
      if (description) formData.append('description', description);
      if (tags) formData.append('tags', tags);

      const response = await axiosInstance.post<BulkUploadResponse>(
        `${this.getBaseUrl(businessId)}/bulk`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 0,
        }
      );

      console.log(`✅ Bulk upload: ${response.data.total_uploaded}/${files.length} files uploaded`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Delete media file
   * @param businessId - Business ID
   * @param mediaId - Media ID to delete
   */
  async deleteMedia(businessId: string, mediaId: string): Promise<void> {
    try {
      await axiosInstance.delete(
        `${this.getBaseUrl(businessId)}/${mediaId}`,
        { timeout: 0 }
      );
      console.log('✅ Media deleted:', mediaId);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Validate file for media upload
   * @param file - File to validate
   * @returns Error message if invalid, null if valid
   */
  validateMediaFile(file: File): string | null {
    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return `Invalid file type: ${file.type}. Only images and videos are allowed.`;
    }

    // Check size limits
    const maxImageSize = 30 * 1024 * 1024; // 30MB
    const maxVideoSize = 500 * 1024 * 1024; // 500MB

    if (isImage && file.size > maxImageSize) {
      return `Image size exceeds 30MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    if (isVideo && file.size > maxVideoSize) {
      return `Video size exceeds 500MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    return null;
  }
}

export const mediaGalleryService = new MediaGalleryService();
