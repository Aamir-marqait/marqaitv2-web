/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import type {
  CreateStrategyProjectRequest,
  CreateStrategyProjectResponse,
  StrategyProject,
  ListStrategyProjectsResponse,
  StrategyStatistics,
  GenerateStrategyResponse,
  EditStrategyRequest,
  EditStrategyResponse,
  ApproveStrategyResponse,
  GenerateCalendarResponse,
  CalendarItem,
  CalendarItemSummary,
  CalendarView,
  UpdateCalendarItemRequest,
  SelectMediaRequest,
  SelectMediaResponse,
  ApproveCalendarItemsRequest,
  ApproveCalendarItemsResponse,
  PlatformOption,
  ContentTypeOption,
  ToneOption,
  Platform,
} from '../types';
import { handleApiError } from '../utils';

class StrategyService {
  private readonly baseUrl = '/api/v2';

  // ═══════════════════════════════════════════════════════════════
  // SECTION 1: STRATEGY PROJECT APIs
  // ═══════════════════════════════════════════════════════════════

  /**
   * 1.1 CREATE STRATEGY PROJECT (DRAFT)
   * POST /strategy-projects/
   * Creates new strategy project (no credits charged)
   */
  async createStrategyProject(data: CreateStrategyProjectRequest): Promise<CreateStrategyProjectResponse> {
    try {
      const response = await axiosInstance.post<CreateStrategyProjectResponse>(
        `${this.baseUrl}/strategy-projects/`,
        data,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.2 LIST STRATEGY PROJECTS
   * GET /strategy-projects/
   * List all strategy projects for user with optional filters
   */
  async listStrategyProjects(params?: {
    business_info_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ListStrategyProjectsResponse> {
    try {
      const response = await axiosInstance.get<ListStrategyProjectsResponse>(
        `${this.baseUrl}/strategy-projects/`,
        { params, timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.3 GET STRATEGY PROJECT DETAILS
   * GET /strategy-projects/{strategy_id}
   * Get complete strategy details
   */
  async getStrategyProject(strategyId: string): Promise<StrategyProject> {
    try {
      const response = await axiosInstance.get<StrategyProject>(
        `${this.baseUrl}/strategy-projects/${strategyId}`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.4 GET STRATEGY STATISTICS
   * GET /strategy-projects/stats
   * Get user's overall strategy statistics
   */
  async getStrategyStats(): Promise<StrategyStatistics> {
    try {
      const response = await axiosInstance.get<StrategyStatistics>(
        `${this.baseUrl}/strategy-projects/stats`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.5 STEP 2: GENERATE STRATEGY (AI - 20 CREDITS)
   * POST /strategy-projects/{strategy_id}/generate-strategy
   * Generate AI-powered marketing strategy (2-3 minutes)
   */
  async generateStrategy(strategyId: string): Promise<GenerateStrategyResponse> {
    try {
      const response = await axiosInstance.post<GenerateStrategyResponse>(
        `${this.baseUrl}/strategy-projects/${strategyId}/generate-strategy`,
        {},
        { timeout: 0 } // No timeout - let it run as long as needed
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.6 STEP 3A (OPTIONAL): EDIT STRATEGY (AI - 10 CREDITS)
   * POST /strategy-projects/{strategy_id}/edit-strategy
   * Refine strategy based on user feedback (1-2 minutes)
   */
  async editStrategy(strategyId: string, data: EditStrategyRequest): Promise<EditStrategyResponse> {
    try {
      const response = await axiosInstance.post<EditStrategyResponse>(
        `${this.baseUrl}/strategy-projects/${strategyId}/edit-strategy`,
        data,
        { timeout: 0 } // No timeout - let it run as long as needed
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.7 STEP 3B: APPROVE STRATEGY (FREE)
   * POST /strategy-projects/{strategy_id}/approve-strategy
   * Approve strategy to proceed to calendar generation
   */
  async approveStrategy(strategyId: string): Promise<ApproveStrategyResponse> {
    try {
      const response = await axiosInstance.post<ApproveStrategyResponse>(
        `${this.baseUrl}/strategy-projects/${strategyId}/approve-strategy`,
        {},
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.8 STEP 4: GENERATE CONTENT CALENDAR (AI - 30 CREDITS)
   * POST /strategy-projects/{strategy_id}/generate-calendar
   * Generate detailed content calendar (5-7 minutes)
   */
  async generateCalendar(strategyId: string): Promise<GenerateCalendarResponse> {
    try {
      const response = await axiosInstance.post<GenerateCalendarResponse>(
        `${this.baseUrl}/strategy-projects/${strategyId}/generate-calendar`,
        {},
        { timeout: 0 } // No timeout - let it run as long as needed
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.9 GET CALENDAR ITEMS (SUMMARY)
   * GET /strategy-projects/{strategy_id}/calendar
   * Get all calendar items for a strategy (summary view)
   */
  async getCalendarItems(strategyId: string, approvedOnly: boolean = false): Promise<CalendarItemSummary[]> {
    try {
      const response = await axiosInstance.get<CalendarItemSummary[]>(
        `${this.baseUrl}/strategy-projects/${strategyId}/calendar`,
        { params: { approved_only: approvedOnly }, timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.10 UPDATE STRATEGY PROJECT
   * PUT /strategy-projects/{strategy_id}
   * Update project metadata (name, dates, preferences)
   */
  async updateStrategyProject(strategyId: string, data: Partial<CreateStrategyProjectRequest>): Promise<StrategyProject> {
    try {
      const response = await axiosInstance.put<StrategyProject>(
        `${this.baseUrl}/strategy-projects/${strategyId}`,
        data,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.11 DELETE STRATEGY PROJECT
   * DELETE /strategy-projects/{strategy_id}
   * Delete strategy and all calendar items
   */
  async deleteStrategyProject(strategyId: string): Promise<void> {
    try {
      await axiosInstance.delete(
        `${this.baseUrl}/strategy-projects/${strategyId}`,
        { timeout: 30000 }
      );
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 1.12 APPROVE ALL CALENDAR ITEMS
   * POST /strategy-projects/{strategy_id}/approve-all
   * Approve all pending items at once
   */
  async approveAllCalendarItems(strategyId: string): Promise<ApproveCalendarItemsResponse> {
    try {
      const response = await axiosInstance.post<ApproveCalendarItemsResponse>(
        `${this.baseUrl}/strategy-projects/${strategyId}/approve-all`,
        {},
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 2: CONTENT CALENDAR APIs
  // ═══════════════════════════════════════════════════════════════

  /**
   * 2.1 GET CALENDAR ITEMS (DETAILED LIST)
   * GET /strategy-projects/{strategy_id}/calendar
   * Get detailed list of calendar items with filters
   */
  async getCalendarItemsDetailed(strategyId: string, params?: {
    platform?: string;
    status?: string;
    approved_only?: boolean;
  }): Promise<CalendarItemSummary[]> {
    try {
      const response = await axiosInstance.get<CalendarItemSummary[]>(
        `${this.baseUrl}/strategy-projects/${strategyId}/calendar`,
        { params, timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 2.2 GET CALENDAR VIEW (WITH STATS)
   * GET /strategy-projects/{strategy_id}/calendar-view
   * Get calendar with summary statistics
   */
  async getCalendarView(strategyId: string): Promise<CalendarView> {
    try {
      const response = await axiosInstance.get<CalendarView>(
        `${this.baseUrl}/strategy-projects/${strategyId}/calendar-view`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 2.3 GET SINGLE CALENDAR ITEM (FULL DETAILS)
   * GET /calendar-items/{calendar_id}
   * Get complete details of one calendar item
   */
  async getCalendarItem(calendarId: string): Promise<CalendarItem> {
    try {
      const response = await axiosInstance.get<CalendarItem>(
        `${this.baseUrl}/calendar-items/${calendarId}`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 2.4 GET CALENDAR ITEMS BY DATE RANGE
   * GET /strategy-projects/{strategy_id}/calendar/by-date-range
   * Filter calendar by date range
   */
  async getCalendarItemsByDateRange(strategyId: string, startDate: string, endDate: string): Promise<CalendarItemSummary[]> {
    try {
      const response = await axiosInstance.get<CalendarItemSummary[]>(
        `${this.baseUrl}/strategy-projects/${strategyId}/calendar/by-date-range`,
        { params: { start_date: startDate, end_date: endDate }, timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 2.5 GET CALENDAR ITEMS BY PLATFORM
   * GET /strategy-projects/{strategy_id}/calendar/by-platform/{platform}
   * Get all items for specific platform
   */
  async getCalendarItemsByPlatform(strategyId: string, platform: Platform): Promise<CalendarItemSummary[]> {
    try {
      const response = await axiosInstance.get<CalendarItemSummary[]>(
        `${this.baseUrl}/strategy-projects/${strategyId}/calendar/by-platform/${platform}`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 2.6 UPDATE CALENDAR ITEM
   * PUT /calendar-items/{calendar_id}
   * Update calendar item details
   */
  async updateCalendarItem(calendarId: string, data: UpdateCalendarItemRequest): Promise<CalendarItem> {
    try {
      const response = await axiosInstance.put<CalendarItem>(
        `${this.baseUrl}/calendar-items/${calendarId}`,
        data,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 2.7 SELECT MEDIA FROM GALLERY
   * POST /calendar-items/{calendar_id}/select-media
   * Select images/videos from media gallery for this post
   */
  async selectMedia(calendarId: string, data: SelectMediaRequest): Promise<SelectMediaResponse> {
    try {
      const response = await axiosInstance.post<SelectMediaResponse>(
        `${this.baseUrl}/calendar-items/${calendarId}/select-media`,
        data,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * 2.8 APPROVE CALENDAR ITEMS (BULK)
   * POST /calendar-items/approve
   * Approve multiple calendar items at once
   */
  async approveCalendarItems(data: ApproveCalendarItemsRequest): Promise<ApproveCalendarItemsResponse> {
    try {
      const response = await axiosInstance.post<ApproveCalendarItemsResponse>(
        `${this.baseUrl}/calendar-items/approve`,
        data,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 3: UTILITY ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * 2.10 GET PLATFORMS
   * GET /utilities/platforms
   * Get supported platforms
   */
  async getPlatforms(): Promise<PlatformOption[]> {
    try {
      const response = await axiosInstance.get<PlatformOption[]>(
        `${this.baseUrl}/utilities/platforms`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * GET CONTENT TYPES
   * GET /utilities/content-types
   * Get content types (post, reel, story, carousel)
   */
  async getContentTypes(): Promise<ContentTypeOption[]> {
    try {
      const response = await axiosInstance.get<ContentTypeOption[]>(
        `${this.baseUrl}/utilities/content-types`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * GET TONE OPTIONS
   * GET /utilities/tone-options
   * Get tone options (professional, casual, friendly, etc.)
   */
  async getToneOptions(): Promise<ToneOption[]> {
    try {
      const response = await axiosInstance.get<ToneOption[]>(
        `${this.baseUrl}/utilities/tone-options`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const strategyService = new StrategyService();
