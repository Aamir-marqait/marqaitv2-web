/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import { handleApiError } from '../utils';

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  description: string;
}

export interface PurchaseResponse {
  success: boolean;
  transactionId: string;
  credits: number;
  message: string;
}

export interface PurchaseHistoryItem {
  id: string;
  packageName: string;
  credits: number;
  price: number;
  purchaseDate: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
}

export interface PurchaseHistoryResponse {
  purchases: PurchaseHistoryItem[];
  totalPages: number;
  currentPage: number;
}

export interface DeductCreditsResponse {
  success: boolean;
  remainingCredits: number;
  message: string;
}

class CreditService {
  private readonly baseUrl = '/api/v1/credits';

  // Purchase credits
  async purchaseCredits(packageId: string): Promise<PurchaseResponse> {
    try {
      const response = await axiosInstance.post<PurchaseResponse>(
        `${this.baseUrl}/purchase`,
        { packageId }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Get purchase history
  async getPurchaseHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<PurchaseHistoryResponse> {
    try {
      const response = await axiosInstance.get<PurchaseHistoryResponse>(
        `${this.baseUrl}/history`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Get available credit packages
  async getCreditPackages(): Promise<CreditPackage[]> {
    try {
      const response = await axiosInstance.get<CreditPackage[]>(
        `${this.baseUrl}/packages`
      );
      return response.data;
    } catch (error: any) {
      // Return default packages if API fails
      return [
        {
          id: 'small-boost',
          name: 'Small Boost',
          credits: 500,
          price: 1.78,
          pricePerCredit: 0.3,
          description: 'Perfect for small projects and quick tasks',
        },
        {
          id: 'big-boost',
          name: 'Big Boost',
          credits: 2000,
          price: 6,
          pricePerCredit: 0.25,
          description: 'Ideal for larger projects and extended usage',
        },
      ];
    }
  }

  // Manually deduct credits (for agent usage)
  async deductCredits(amount: number, description: string): Promise<DeductCreditsResponse> {
    try {
      const response = await axiosInstance.post<DeductCreditsResponse>(
        `${this.baseUrl}/deduct`,
        null,
        {
          params: {
            amount,
            description
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const creditService = new CreditService();
