// Strategy Project Types
export type StrategyStatus =
  | 'DRAFT'
  | 'GENERATING_STRATEGY'
  | 'STRATEGY_READY'
  | 'EDITING_STRATEGY'
  | 'STRATEGY_APPROVED'
  | 'GENERATING_CALENDAR'
  | 'COMPLETED'
  | 'FAILED';

export type Platform = 'instagram' | 'linkedin' | 'facebook' | 'x' | 'tiktok' | 'pinterest';

export type FocusArea =
  | 'brand_awareness'
  | 'sales_conversions'
  | 'lead_generation'
  | 'community_engagement'
  | 'thought_leadership'
  | 'education'
  | 'event_promotion'
  | 'employer_branding'
  | 'customer_retention'
  | 'product_launches'
  | 'user_generated_content'
  | 'brand_storytelling';

export type PostFrequencyPreference = 'ai_decide' | '3x_per_week' | 'daily';

export interface SpecialDate {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'business' | 'festival' | 'holiday';
}

export interface ContentPreferences {
  prioritize_user_images?: boolean;
  allow_ai_generation?: boolean;
  quality_tier?: 'standard' | 'premium';
  competitive_differentiation?: any;
}

export interface CompetitorAnalysis {
  [key: string]: any;
}

export interface MarketTrends {
  [key: string]: any;
}

export interface TargetAudienceInsights {
  [key: string]: any;
}

export interface FestivalCalendar {
  [key: string]: any;
}

export interface Research {
  competitor_analysis: CompetitorAnalysis;
  market_trends: MarketTrends;
  target_audience_insights: TargetAudienceInsights;
  festival_calendar: FestivalCalendar[];
}

export interface ExamplePost {
  platform: string;
  hook: string;
  content_description: string;
  why_shareable: string;
  conversion_tactic: string;
}

export interface ContentTheme {
  theme: string;
  description: string;
  frequency: string;
  platforms: Platform[];
  target_segment?: string;
  organic_growth_rationale?: string;
  differentiation?: string;
  viral_potential?: string;
  recommended_platforms?: Platform[];
  example_posts?: ExamplePost[];
  engagement_tactics?: string;
}

export interface PostingFrequency {
  [platform: string]: {
    posts_per_week: number;
  };
}

export interface KPIs {
  reach_target: number;
  engagement_rate: number;
  conversions: number;
  primary_metrics?: string[];
  targets?: any;
  measurement_approach?: string;
  focus_alignment?: string;
}

export interface Strategy {
  strategy_summary: string;
  content_themes: ContentTheme[];
  posting_frequency: PostingFrequency;
  kpis: KPIs;
}

export interface EditHistory {
  edit_number: number;
  feedback: string;
  edited_at: string;
  credits_charged: number;
}

export interface CreditBreakdown {
  strategy_credits: number;
  edit_credits: number;
  calendar_credits: number;
  total_credits: number;
}

// Strategy Project Request/Response Types
export interface CreateStrategyProjectRequest {
  business_info_id: string;
  project_name: string;
  duration_days: number; // 7-30
  selected_platforms: Platform[];
  user_brief: string; // 20-5000 characters
  start_date?: string; // YYYY-MM-DD (default: today)
  focus_areas?: FocusArea[]; // max 5
  special_dates?: SpecialDate[];
  post_frequency_preference?: PostFrequencyPreference;
  content_preferences?: ContentPreferences;
}

export interface CreateStrategyProjectResponse {
  project_id: string;
  status: StrategyStatus;
  message: string;
}

export interface StrategyProject {
  id: string;
  business_info_id: string;
  project_name: string;
  duration_days: number;
  start_date: string;
  status: StrategyStatus;
  selected_platforms: Platform[];
  focus_areas: FocusArea[];
  user_brief: string;
  special_dates: SpecialDate[];
  post_frequency_preference: PostFrequencyPreference;
  content_preferences: ContentPreferences;
  research: Research | null;
  strategy: Strategy | null;
  edit_count: number;
  edit_history: EditHistory[];
  approved_at: string | null;
  credit_breakdown: CreditBreakdown;
  total_posts: number;
  approved_posts: number;
  published_posts: number;
  can_edit_strategy: boolean;
  can_approve_strategy: boolean;
  can_generate_calendar: boolean;
  is_strategy_approved: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export interface StrategyProjectSummary {
  id: string;
  project_name: string;
  duration_days: number;
  status: StrategyStatus;
  selected_platforms: Platform[];
  created_at: string;
  completed_at: string | null;
  approved_at: string | null;
  total_posts: number;
  approved_posts: number;
  published_posts: number;
  edit_count: number;
  credits_used: number;
}

export interface ListStrategyProjectsResponse {
  projects: StrategyProjectSummary[];
  total: number;
  page: number;
  page_size: number;
}

export interface StrategyStatistics {
  total_strategies: number;
  completed_strategies: number;
  total_posts_generated: number;
  published_posts: number;
}

export interface GenerateStrategyResponse {
  status: StrategyStatus;
  message: string;
  strategy_project_id: string;
  estimated_completion_time: string;
  credits_charged: number;
}

export interface EditStrategyRequest {
  feedback: string;
}

export interface EditStrategyResponse {
  status: StrategyStatus;
  message: string;
  strategy_project_id: string;
  edit_number: number;
  credits_charged: number;
}

export interface ApproveStrategyResponse {
  status: StrategyStatus;
  message: string;
  strategy_project_id: string;
  approved_at: string;
}

export interface GenerateCalendarResponse {
  status: StrategyStatus;
  message: string;
  strategy_project_id: string;
  estimated_completion_time: string;
  credits_charged: number;
}

// Calendar Item Types
export type ContentType = 'post' | 'reel' | 'story' | 'carousel';
export type PublishStatus = 'PENDING' | 'APPROVED' | 'GENERATING' | 'GENERATED' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
export type Tone = 'professional' | 'casual' | 'friendly' | 'inspirational' | 'humorous' | 'formal';
export type MediaSourceType = 'ai_generate' | 'user_gallery' | 'hybrid';

export interface PostAgentParams {
  image_generation?: {
    style: string;
    aspect_ratio: string;
    primary_color: string;
    elements: string[];
  };
}

export interface CalendarItem {
  id: string;
  strategy_project_id: string;
  scheduled_date: string;
  scheduled_time: string;
  timezone: string;
  platform: Platform;
  content_type: ContentType;
  publish_status: PublishStatus;
  content_theme: string;
  caption_brief: string;
  visual_brief: string;
  tone: Tone;
  call_to_action: string;
  hashtags: string[];
  media_source_type: MediaSourceType;
  selected_media_ids: string[] | null;
  media_selection_locked: boolean;
  post_agent_params: PostAgentParams;
  generated_caption: string | null;
  generated_media_url: string | null;
  generation_metadata: any | null;
  expected_engagement_score: number;
  strategy_rationale: string;
  target_audience_segment: string;
  user_approved: boolean;
  user_approved_at: string | null;
  user_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarItemSummary {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  platform: Platform;
  content_type: ContentType;
  content_theme: string;
  publish_status: PublishStatus;
  user_approved: boolean;
  needs_media_selection: boolean;
  is_generated: boolean;
  is_published: boolean;
}

export interface CalendarView {
  strategy_project_id: string;
  project_name: string;
  duration_days: number;
  calendar_items: CalendarItemSummary[];
  total_items: number;
  approved_items: number;
  pending_approval: number;
  generated_items: number;
  published_items: number;
  date_range: {
    start_date: string;
    end_date: string;
  };
}

export interface UpdateCalendarItemRequest {
  scheduled_date?: string;
  scheduled_time?: string;
  caption_brief?: string;
  visual_brief?: string;
  tone?: Tone;
  call_to_action?: string;
  hashtags?: string[];
  user_notes?: string;
}

export interface SelectMediaRequest {
  media_ids: string[];
  lock_selection: boolean;
}

export interface SelectMediaResponse {
  calendar_item_id: string;
  selected_media_count: number;
  media_selection_locked: boolean;
  message: string;
}

export interface ApproveCalendarItemsRequest {
  calendar_item_ids: string[];
}

export interface ApproveCalendarItemsResponse {
  approved_count: number;
  approved_item_ids: string[];
  message: string;
}

// Utility Types
export interface PlatformOption {
  value: Platform;
  label: string;
}

export interface ContentTypeOption {
  value: ContentType;
  label: string;
}

export interface ToneOption {
  value: Tone;
  label: string;
}
