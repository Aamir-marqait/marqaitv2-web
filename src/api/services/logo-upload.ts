/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import { handleApiError } from '../utils';

export interface LogoUploadResponse {
  id: string;
  business_name: string;
  selected_logo_url: string;
}

class LogoUploadService {
  private readonly baseUrl = '/api/v2/business-information';

  /**
   * Upload logo file for existing brand
   *
   * @param businessId - Business ID from brand context API
   * @param file - Logo file (PNG, JPG, JPEG, SVG, WebP - max 10MB)
   * @returns Promise with uploaded logo URL
   */
  async uploadLogo(businessId: string, file: File): Promise<LogoUploadResponse> {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Uploading logo for business_id:', businessId);
      console.log('📁 File:', file.name, '-', (file.size / 1024 / 1024).toFixed(2), 'MB');

      const response = await axiosInstance.post<LogoUploadResponse>(
        `${this.baseUrl}/${businessId}/logo/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 0, // No timeout
        }
      );

      console.log('✅ Logo uploaded successfully:', response.data.selected_logo_url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Logo upload failed:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Validate logo file before upload
   *
   * @param file - File to validate
   * @returns Error message if invalid, null if valid
   */
  validateLogoFile(file: File): string | null {
    // Check file size (max 10MB)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      return `File size exceeds 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    // Check file type
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: PNG, JPG, JPEG, SVG, WebP. Current: ${file.type}`;
    }

    return null; // Valid
  }
}

export const logoUploadService = new LogoUploadService();
