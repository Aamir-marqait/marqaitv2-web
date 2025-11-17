/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import { handleApiError } from '../utils';

export interface SixLogosRequest {
  parameters: {
    business_id: string;
    business_name: string;
    industry_category: string;
    brand_personality: string;
    brand_tone: string;
    color_palette: {
      primary: string;
      secondary: string;
      accent: string;
      other: string;
    };
    core_values: string[];
    target_audience: string[];
  };
  priority: string;
  max_retries: number;
}

export interface SixLogosResponse {
  id: string;
  status: string;
  output_data?: {
    logos?: Array<{
      logo_image_url: string;
      style: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  message?: string;
  [key: string]: any;
}

class SixLogosService {
  private readonly baseUrl = '/api/v1/agents/six_logos_generator';

  /**
   * Generate six logo variations for a brand
   * This endpoint creates 6 different logo designs based on brand identity
   *
   * @param data - Six logos request data including business_id, brand details, colors, etc.
   * @returns Promise with task_id and logo URLs when ready
   */
  async generateSixLogos(data: SixLogosRequest): Promise<SixLogosResponse> {
    try {
      const response = await axiosInstance.post<SixLogosResponse>(
        `${this.baseUrl}/execute`,
        data,
        { timeout: 0 } // No timeout - wait as long as needed for logo generation
      );

      // Extract logo URLs from output_data.logos array
      const logoUrls = response.data.output_data?.logos?.map(logo => logo.logo_image_url) || [];

      // Store logo URLs in localStorage if available
      if (logoUrls.length > 0) {
        localStorage.setItem('generated_logo_urls', JSON.stringify(logoUrls));
        console.log('✅ Logo URLs stored in localStorage:', logoUrls);
      }

      // Add logo_urls to response for compatibility
      return {
        ...response.data,
        logo_urls: logoUrls
      };
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get generated logo URLs from localStorage
   * @returns array of logo URLs or null if not found
   */
  getLogoUrls(): string[] | null {
    const urls = localStorage.getItem('generated_logo_urls');
    return urls ? JSON.parse(urls) : null;
  }

  /**
   * Clear logo URLs from localStorage
   */
  clearLogoUrls(): void {
    localStorage.removeItem('generated_logo_urls');
  }
}

export const sixLogosService = new SixLogosService();
