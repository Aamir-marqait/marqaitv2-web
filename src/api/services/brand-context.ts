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
  id: string;
  business_name: string;
  industry_category: string;
  brand_personality: string;
  brand_tone: string;
  color_palette: {
    primary: string;
    secondary: string;
    accent: string;
    other: string | null;
  };
  typography: string[];
  literature: {
    tagline: string;
    mission: string;
    story: string;
  };
  core_values: string[];
  target_audience: string[];
  selected_logo_url: string | null;
  brand_book_pdf_url: string | null;
  llm_generated_data: any;
  created_at: string;
  updated_at: string;
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
        { timeout: 0 }
      );

      // Store business_id in localStorage for future use
      if (response.data.id) {
        localStorage.setItem('business_id', response.data.id);
        console.log('✅ Business ID stored in localStorage:', response.data.id);
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

  /**
   * Save selected logo URL to business profile
   * @param businessId - The business ID
   * @param logoUrl - The selected logo URL
   */
  async saveLogoUrl(businessId: string, logoUrl: string): Promise<void> {
    try {
      await axiosInstance.put(
        `${this.baseUrl}/${businessId}/logo`,
        { logo_url: logoUrl },
        { timeout: 0 }
      );
      console.log('✅ Logo URL saved to business profile:', logoUrl);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const brandContextService = new BrandContextService();
