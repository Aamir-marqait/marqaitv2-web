import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Target,
  Clock,
  Layers,
  LayoutGrid,
  Grid3x3,
  TrendingUp,
  FileText,
  Loader2,
  Edit2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { strategyService } from "@/api/services";
import type { StrategyProject } from "@/api/types";
import { Toast } from "@/components/ui/toast";

interface ToastState {
  show: boolean;
  message: string;
  type: "error" | "success" | "info";
}

export default function StrategyDetail() {
  const { slug: strategyId } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [strategy, setStrategy] = useState<StrategyProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editFeedback, setEditFeedback] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "error",
  });

  const showToast = (
    message: string,
    type: "error" | "success" | "info" = "error"
  ) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  // Add CSS to hide scrollbar
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch strategy details
  useEffect(() => {
    const fetchStrategy = async () => {
      if (!strategyId) {
        setError("Strategy ID not found");
        setIsLoading(false);
        return;
      }

      try {
        const data = await strategyService.getStrategyProject(strategyId);
        setStrategy(data);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching strategy:", err);
        setError(err?.response?.data?.detail || "Failed to load strategy");
        setIsLoading(false);
      }
    };

    fetchStrategy();
  }, [strategyId]);

  // Poll for strategy status updates when generating
  useEffect(() => {
    if (!strategy || !strategyId) return;

    if (
      strategy.status === "GENERATING_STRATEGY" ||
      strategy.status === "EDITING_STRATEGY" ||
      strategy.status === "GENERATING_CALENDAR"
    ) {
      const interval = setInterval(async () => {
        try {
          const updated = await strategyService.getStrategyProject(strategyId);
          setStrategy(updated);

          // Stop polling if generation is complete
          if (
            updated.status !== "GENERATING_STRATEGY" &&
            updated.status !== "EDITING_STRATEGY" &&
            updated.status !== "GENERATING_CALENDAR"
          ) {
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Error polling strategy:", err);
        }
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [strategy?.status, strategyId]);

  const handleEditStrategy = () => {
    setShowEditModal(true);
  };

  const handleSubmitEdit = async () => {
    if (!strategyId || !editFeedback.trim()) return;

    setIsProcessing(true);
    try {
      await strategyService.editStrategy(strategyId, {
        feedback: editFeedback,
      });
      setShowEditModal(false);
      setEditFeedback("");

      // Refresh strategy data
      const updated = await strategyService.getStrategyProject(strategyId);
      setStrategy(updated);
      showToast("Strategy edited successfully!", "success");
    } catch (err: any) {
      console.error("Error editing strategy:", err);
      showToast(
        err?.response?.data?.message || "Failed to edit strategy",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveStrategy = async () => {
    if (!strategyId) return;

    setIsProcessing(true);
    try {
      await strategyService.approveStrategy(strategyId);

      // Refresh strategy data
      const updated = await strategyService.getStrategyProject(strategyId);
      setStrategy(updated);
      showToast("Strategy approved successfully!", "success");
    } catch (err: any) {
      console.error("Error approving strategy:", err);
      showToast(
        err?.response?.data?.message || "Failed to approve strategy",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCalendar = async () => {
    if (!strategyId) return;

    setIsProcessing(true);
    try {
      const response = await strategyService.generateCalendar(strategyId);

      // Refresh strategy data
      const updated = await strategyService.getStrategyProject(strategyId);
      setStrategy(updated);

      // Show appropriate message and navigate based on response
      if (response.status === "COMPLETED") {
        showToast(
          response.message || "Calendar generated successfully!",
          "success"
        );
        // Navigate to content calendar with strategy ID
        setTimeout(() => {
          navigate(`/content-calendar?strategy_id=${strategyId}`);
        }, 1500); // Small delay to show the toast
      } else {
        showToast(
          "Calendar generation started! This will take 5-7 minutes.",
          "info"
        );
      }
    } catch (err: any) {
      console.error("Error generating calendar:", err);
      showToast(
        err?.response?.data?.message || "Failed to generate calendar",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewCalendar = () => {
    if (strategyId) {
      navigate(`/strategy/${strategyId}/calendar`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-[#F3E8FF] to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#8F00FF] mx-auto mb-4" />
          <p className="text-gray-600">Loading strategy...</p>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-[#F3E8FF] to-white">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error || "Strategy not found"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 bg-[#8F00FF] text-white rounded-lg hover:bg-[#7a00d9] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Status messages
  const getStatusMessage = () => {
    switch (strategy.status) {
      case "DRAFT":
        return {
          text: "Draft - Ready to generate",
          color: "text-gray-600",
          icon: FileText,
        };
      case "GENERATING_STRATEGY":
        return {
          text: "Generating strategy... (2-3 min)",
          color: "text-blue-600",
          icon: Loader2,
        };
      case "STRATEGY_READY":
        return {
          text: "Strategy ready - Review & approve or edit",
          color: "text-green-600",
          icon: CheckCircle,
        };
      case "EDITING_STRATEGY":
        return {
          text: "Editing strategy... (1-2 min)",
          color: "text-blue-600",
          icon: Loader2,
        };
      case "STRATEGY_APPROVED":
        return {
          text: "Strategy approved - Ready to generate calendar",
          color: "text-green-600",
          icon: CheckCircle,
        };
      case "GENERATING_CALENDAR":
        return {
          text: "Generating calendar... (5-7 min)",
          color: "text-blue-600",
          icon: Loader2,
        };
      case "COMPLETED":
        return {
          text: "Completed - Calendar ready",
          color: "text-green-600",
          icon: CheckCircle,
        };
      case "FAILED":
        return {
          text: "Failed - Please try again",
          color: "text-red-600",
          icon: AlertCircle,
        };
      default:
        return {
          text: strategy.status,
          color: "text-gray-600",
          icon: FileText,
        };
    }
  };

  const statusInfo = getStatusMessage();
  const StatusIcon = statusInfo.icon;

  // Define tabs structure
  const tabs = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "themes", label: "Content Themes", icon: LayoutGrid },
    { id: "frequency", label: "Posting Schedule", icon: Grid3x3 },
    { id: "kpis", label: "KPIs & Goals", icon: TrendingUp },
    { id: "competitors", label: "Competitors", icon: Target },
    { id: "festivals", label: "Events Calendar", icon: Clock },
  ];

  // Render tab content based on active tab
  const renderTabContent = () => {
    if (!strategy?.strategy) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Strategy Summary */}
            <div className="bg-linear-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-[#8F00FF]" />
                <h3 className="font-inter text-lg font-semibold text-gray-900">
                  Strategy Summary
                </h3>
              </div>
              <p className="font-inter text-sm text-gray-700 leading-relaxed">
                {strategy.strategy.strategy_summary}
              </p>
            </div>

            {/* Timeline & Duration */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[#8F00FF]" />
                  <h4 className="font-inter text-sm font-semibold text-gray-900">
                    Timeline & Duration
                  </h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium">Duration:</span> {strategy.duration_days} days</p>
                  <p><span className="font-medium">Start Date:</span> {strategy.start_date}</p>
                  <p><span className="font-medium">Status:</span> {strategy.status.replace(/_/g, " ")}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-[#8F00FF]" />
                  <h4 className="font-inter text-sm font-semibold text-gray-900">
                    Platforms
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strategy.selected_platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-purple-50 text-[#8F00FF] rounded-full text-xs font-medium"
                    >
                      {platform.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-[#8F00FF]" />
                <h4 className="font-inter text-sm font-semibold text-gray-900">
                  Focus Areas
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {strategy.focus_areas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                  >
                    {area.replace(/_/g, " ").toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Special Dates */}
            {strategy.special_dates && strategy.special_dates.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[#8F00FF]" />
                  <h4 className="font-inter text-sm font-semibold text-gray-900">
                    Special Dates
                  </h4>
                </div>
                <div className="space-y-2">
                  {strategy.special_dates.map((date, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">📅</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{date.name}</p>
                        <p className="text-xs text-gray-600">{date.date} • {date.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "themes":
        return (
          <div className="space-y-4">
            {strategy.strategy.content_themes?.map((theme, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <h3 className="font-inter text-lg font-semibold text-gray-900">
                    {theme.theme}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-inter text-sm text-gray-700 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">TARGET SEGMENT</p>
                      <p className="text-sm text-gray-900">{theme.target_segment || "General Audience"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">FREQUENCY</p>
                      <p className="text-sm text-gray-900">{theme.frequency}</p>
                    </div>
                  </div>

                  {theme.organic_growth_rationale && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-green-700 mb-2">🚀 ORGANIC GROWTH STRATEGY</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{theme.organic_growth_rationale}</p>
                    </div>
                  )}

                  {theme.differentiation && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-blue-700 mb-2">💎 DIFFERENTIATION</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{theme.differentiation}</p>
                    </div>
                  )}

                  {theme.viral_potential && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-purple-700 mb-2">🎭 VIRAL POTENTIAL</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{theme.viral_potential}</p>
                    </div>
                  )}

                  {theme.recommended_platforms && theme.recommended_platforms.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">📱 RECOMMENDED PLATFORMS</p>
                      <div className="flex flex-wrap gap-2">
                        {theme.recommended_platforms.map((platform) => (
                          <span
                            key={platform}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                          >
                            {platform.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {theme.example_posts && theme.example_posts.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-3">💡 EXAMPLE POSTS</p>
                      <div className="space-y-3">
                        {theme.example_posts.map((post, i) => (
                          <div key={i} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                                {post.platform}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">"{post.hook}"</p>
                            <p className="text-xs text-gray-600 mb-2">{post.content_description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="font-semibold text-gray-700">Why Shareable:</span>
                                <p className="text-gray-600">{post.why_shareable}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Conversion:</span>
                                <p className="text-gray-600">{post.conversion_tactic}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {theme.engagement_tactics && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-yellow-700 mb-2">🎯 ENGAGEMENT TACTICS</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{theme.engagement_tactics}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "frequency":
        return (
          <div className="space-y-4">
            {Object.entries(strategy.strategy.posting_frequency || {}).map(([platform, freq]: [string, any]) => (
              <div key={platform} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Grid3x3 className="w-5 h-5 text-[#8F00FF]" />
                  <h3 className="font-inter text-lg font-semibold text-gray-900">
                    {platform.toUpperCase()}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-50 px-4 py-2 rounded-lg">
                      <p className="text-2xl font-bold text-[#8F00FF]">{freq.posts_per_week}</p>
                      <p className="text-xs text-gray-600">Posts/Week</p>
                    </div>

                    {freq.best_posting_times && (
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1">⏰ BEST TIMES</p>
                        <p className="text-sm text-gray-700">{freq.best_posting_times.join(", ")}</p>
                      </div>
                    )}
                  </div>

                  {freq.content_type_distribution && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">📋 CONTENT MIX</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(freq.content_type_distribution).map(([type, count]: [string, any]) => (
                          <div key={type} className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="text-lg font-bold text-gray-900">{count}</p>
                            <p className="text-xs text-gray-600">{type}/week</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {freq.engagement_goal && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-green-700 mb-1">🎯 ENGAGEMENT GOAL</p>
                      <p className="text-sm text-gray-700">{freq.engagement_goal}</p>
                    </div>
                  )}

                  {freq.organic_growth_rationale && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-blue-700 mb-2">💡 STRATEGY RATIONALE</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{freq.organic_growth_rationale}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "kpis":
        const kpis = strategy.strategy.kpis;
        return (
          <div className="space-y-6">
            {kpis?.primary_metrics && (
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#8F00FF]" />
                  <h3 className="font-inter text-lg font-semibold text-gray-900">
                    Primary Metrics
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {kpis.primary_metrics.map((metric: string) => (
                    <span
                      key={metric}
                      className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                    >
                      {metric.replace(/_/g, " ").toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {kpis?.targets && (
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-[#8F00FF]" />
                  <h3 className="font-inter text-lg font-semibold text-gray-900">
                    Targets
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(kpis.targets).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-linear-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        {key.replace(/_/g, " ").toUpperCase()}
                      </p>
                      {typeof value === "object" ? (
                        <div className="space-y-1">
                          {Object.entries(value).map(([k, v]: [string, any]) => (
                            <p key={k} className="text-sm text-gray-700">
                              <span className="font-medium">{k.replace(/_/g, " ")}:</span> {v}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-[#8F00FF]">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {kpis?.measurement_approach && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-3">📈 MEASUREMENT APPROACH</p>
                <p className="font-inter text-sm text-gray-700 leading-relaxed">{kpis.measurement_approach}</p>
              </div>
            )}

            {kpis?.focus_alignment && (
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <p className="text-xs font-semibold text-green-700 mb-3">🎯 FOCUS ALIGNMENT</p>
                <p className="font-inter text-sm text-gray-700 leading-relaxed">{kpis.focus_alignment}</p>
              </div>
            )}
          </div>
        );

      case "competitors":
        return (
          <div className="space-y-4">
            {strategy.research?.competitor_analysis?.competitors?.map((comp: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="font-inter text-lg font-semibold text-gray-900">
                    {comp.name}
                  </h3>
                </div>

                <div className="space-y-4">
                  {comp.platforms && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">PLATFORMS</p>
                      <div className="flex flex-wrap gap-2">
                        {comp.platforms.map((platform: string) => (
                          <span
                            key={platform}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {comp.engagement_rate && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 mb-1">📊 ENGAGEMENT</p>
                        <p className="text-sm text-gray-700">{comp.engagement_rate}</p>
                      </div>
                    )}
                    {comp.posting_frequency && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-green-700 mb-1">📅 POSTING</p>
                        <p className="text-sm text-gray-700">{comp.posting_frequency}</p>
                      </div>
                    )}
                  </div>

                  {comp.organic_strengths && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-green-700 mb-2">✅ STRENGTHS</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{comp.organic_strengths}</p>
                    </div>
                  )}

                  {comp.weaknesses && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-red-700 mb-2">❌ WEAKNESSES</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{comp.weaknesses}</p>
                    </div>
                  )}

                  {comp.opportunities_for_us && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-purple-700 mb-2">💡 OUR OPPORTUNITY</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{comp.opportunities_for_us}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {strategy.research?.competitor_analysis?.competitive_landscape_summary && (
              <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-3">📊 COMPETITIVE LANDSCAPE SUMMARY</p>
                <p className="font-inter text-sm text-gray-700 leading-relaxed">
                  {strategy.research.competitor_analysis.competitive_landscape_summary}
                </p>
              </div>
            )}

            {strategy.research?.competitor_analysis?.white_space_opportunities && (
              <div className="bg-linear-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                <p className="text-xs font-semibold text-purple-700 mb-3">💎 WHITE SPACE OPPORTUNITIES</p>
                <p className="font-inter text-sm text-gray-700 leading-relaxed">
                  {strategy.research.competitor_analysis.white_space_opportunities}
                </p>
              </div>
            )}
          </div>
        );

      case "festivals":
        return (
          <div className="space-y-4">
            {strategy.research?.festival_calendar?.map((event: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📅</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-inter text-lg font-semibold text-gray-900">
                        {event.name}
                      </h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        {event.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <span>📍 {event.region}</span>
                      <span>🗓️ {event.date}</span>
                    </div>

                    <div className="space-y-3">
                      {event.marketing_relevance && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-blue-700 mb-1">📈 MARKETING RELEVANCE</p>
                          <p className="text-sm text-gray-700">{event.marketing_relevance}</p>
                        </div>
                      )}

                      {event.content_opportunities && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-green-700 mb-1">💡 CONTENT OPPORTUNITIES</p>
                          <p className="text-sm text-gray-700">{event.content_opportunities}</p>
                        </div>
                      )}

                      {event.pre_event_buildup && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-purple-700 mb-1">⏰ PRE-EVENT PREPARATION</p>
                          <p className="text-sm text-gray-700">{event.pre_event_buildup}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{
        background: "linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)",
        height: "calc(100vh - 4rem)",
      }}
    >
      {/* Main Content */}
      <div className="flex-1 flex justify-center px-4 py-8 overflow-hidden">
        <div className="w-full max-w-[800px] flex flex-col">
          {/* Strategy Card */}
          <div
            className="bg-white rounded-[24px] flex flex-col overflow-hidden"
            style={{
              boxShadow: "0px 10px 40px 0px rgba(143, 0, 255, 0.15)",
              height: "100%",
            }}
          >
            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto p-8 md:p-12 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-inter text-[32px] md:text-[36px] font-semibold leading-tight text-gray-900 mb-3">
                  {strategy.project_name}
                </h1>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <StatusIcon
                    className={`h-5 w-5 ${statusInfo.color} ${
                      statusInfo.icon === Loader2 ? "animate-spin" : ""
                    }`}
                  />
                  <p
                    className={`font-inter text-sm ${statusInfo.color} font-medium`}
                  >
                    {statusInfo.text}
                  </p>
                </div>
                <p className="font-inter text-sm text-gray-500">
                  {strategy.selected_platforms.join(" • ").toUpperCase()} |{" "}
                  {strategy.duration_days} Days
                </p>
                {strategy.edit_count > 0 && (
                  <p className="font-inter text-xs text-gray-400 mt-1">
                    Edited {strategy.edit_count} time
                    {strategy.edit_count > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Show message if strategy is still being generated */}
              {(strategy.status === "GENERATING_STRATEGY" ||
                strategy.status === "EDITING_STRATEGY") && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="font-inter text-sm text-blue-800 font-medium">
                    {strategy.status === "GENERATING_STRATEGY"
                      ? "AI is researching your market, analyzing competitors, and creating your strategy..."
                      : "AI is refining your strategy based on your feedback..."}
                  </p>
                  <p className="font-inter text-xs text-blue-600 mt-2">
                    This page will automatically update when ready
                  </p>
                </div>
              )}

              {/* Tab Navigation */}
              {strategy.strategy && (
                <>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar border-b border-gray-200 mb-6">
                    {tabs.map((tab) => {
                      const TabIcon = tab.icon;
                      const isActive = activeTab === tab.id;

                      // Hide tabs if no data
                      if (tab.id === "competitors" && !strategy.research?.competitor_analysis?.competitors) return null;
                      if (tab.id === "festivals" && (!strategy.research?.festival_calendar || strategy.research.festival_calendar.length === 0)) return null;
                      if (tab.id === "themes" && (!strategy.strategy?.content_themes || strategy.strategy.content_themes.length === 0)) return null;

                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-3 font-inter text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                            isActive
                              ? "text-[#8F00FF] border-[#8F00FF]"
                              : "text-gray-600 border-transparent hover:text-gray-900"
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="space-y-6">
                    {renderTabContent()}
                  </div>
                </>
              )}

              {/* Credit Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits used:</span>
                  <span className="font-semibold text-gray-900">
                    {strategy.credit_breakdown.total_credits} credits
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Strategy: {strategy.credit_breakdown.strategy_credits} •
                  Edits: {strategy.credit_breakdown.edit_credits} • Calendar:{" "}
                  {strategy.credit_breakdown.calendar_credits}
                </div>
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="border-t border-gray-200 p-6 md:px-12">
              <div className="flex justify-end gap-3 flex-wrap">
                {/* Edit Strategy Button */}
                {strategy.can_edit_strategy &&
                  strategy.status === "STRATEGY_READY" && (
                    <button
                      onClick={handleEditStrategy}
                      disabled={isProcessing}
                      className="px-5 py-2 pointer-cursor rounded-lg border-2 border-gray-300 bg-white font-inter text-sm font-semibold text-gray-700 hover:border-[#8F00FF] hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      EDIT STRATEGY (10 credits)
                    </button>
                  )}

                {/* Approve Strategy Button */}
                {strategy.can_approve_strategy &&
                  strategy.status === "STRATEGY_READY" && (
                    <button
                      onClick={handleApproveStrategy}
                      disabled={isProcessing}
                      className="px-5 pointer-cursor py-2 rounded-lg font-inter text-sm font-semibold text-white transition-all hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                      }}
                    >
                      APPROVE STRATEGY
                    </button>
                  )}

                {/* Generate Calendar Button */}
                {strategy.can_generate_calendar &&
                  strategy.status === "STRATEGY_APPROVED" && (
                    <button
                      onClick={handleGenerateCalendar}
                      disabled={isProcessing}
                      className="px-5 pointer-cursor py-2 rounded-lg font-inter text-sm font-semibold text-white transition-all hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                      }}
                    >
                      GENERATE CALENDAR (30 credits)
                    </button>
                  )}

                {/* View Calendar Button */}
                {strategy.status === "COMPLETED" && (
                  <button
                    onClick={handleViewCalendar}
                    className="px-5 pointer-cursor py-2 rounded-lg font-inter text-sm font-semibold text-white transition-all hover:shadow-lg whitespace-nowrap"
                    style={{
                      background:
                        "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                    }}
                  >
                    VIEW CONTENT CALENDAR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Edit Strategy
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Tell the AI what you'd like to change about your strategy. Be
              specific! This will cost 10 credits.
            </p>
            <textarea
              value={editFeedback}
              onChange={(e) => setEditFeedback(e.target.value)}
              placeholder="E.g., 'Make the strategy more aggressive and growth-focused. Add TikTok content themes with viral video ideas. Increase Instagram posting to daily.'"
              className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8F00FF] font-inter text-sm"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFeedback("");
                }}
                disabled={isProcessing}
                className="px-6 py-2 border border-gray-300 rounded-lg font-inter text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={isProcessing || !editFeedback.trim()}
                className="px-6 py-2 rounded-lg font-inter text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  background:
                    "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Editing...
                  </>
                ) : (
                  "Submit Edit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
