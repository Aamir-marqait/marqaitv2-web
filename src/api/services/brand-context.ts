/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import { handleApiError } from '../utils';

export interface BrandContextRequest {
  business_name: string;
  industry_category: string;
  brand_personality: string;
  brand_tone: string;
  color_palette: {
    primary: string;
    secondary: string;
    accent?: string;
    others?: string;
  };
  typography: string[];
  literature: {
    tagline?: string;
    mission?: string;
    story?: string;
  };
  core_values: string[];
}

export interface BrandContextResponse {
  success: boolean;
  message: string;
  business_id: string;
  data: BrandContextRequest;
}

class BrandContextService {
  private readonly baseUrl = '/api/v2/business-information';

  /**
   * Create initial brand context with brand identity information
   * This endpoint stores brand details and returns a business_id
   *
   * @param data - Brand context data including business name, personality, colors, etc.
   * @returns Promise with business_id and stored data
   */
  async createBrandContext(data: BrandContextRequest): Promise<BrandContextResponse> {
    try {
      const response = await axiosInstance.post<BrandContextResponse>(
        `${this.baseUrl}/brand-context`,
        data,
        { timeout: 30000 }
      );

      // Store business_id in localStorage for future use
      if (response.data.business_id) {
        localStorage.setItem('business_id', response.data.business_id);
        console.log('✅ Business ID stored:', response.data.business_id);
      }

      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get business_id from localStorage
   * @returns business_id or null if not found
   */
  getBusinessId(): string | null {
    return localStorage.getItem('business_id');
  }

  /**
   * Clear business_id from localStorage
   */
  clearBusinessId(): void {
    localStorage.removeItem('business_id');
  }
}

export const brandContextService = new BrandContextService();
