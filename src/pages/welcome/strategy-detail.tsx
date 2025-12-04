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
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "error",
  });

  const showToast = (message: string, type: "error" | "success" | "info" = "error") => {
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

    if (strategy.status === "GENERATING_STRATEGY" || strategy.status === "EDITING_STRATEGY" || strategy.status === "GENERATING_CALENDAR") {
      const interval = setInterval(async () => {
        try {
          const updated = await strategyService.getStrategyProject(strategyId);
          setStrategy(updated);

          // Stop polling if generation is complete
          if (updated.status !== "GENERATING_STRATEGY" && updated.status !== "EDITING_STRATEGY" && updated.status !== "GENERATING_CALENDAR") {
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
      await strategyService.editStrategy(strategyId, { feedback: editFeedback });
      setShowEditModal(false);
      setEditFeedback("");

      // Refresh strategy data
      const updated = await strategyService.getStrategyProject(strategyId);
      setStrategy(updated);
      showToast("Strategy edited successfully!", "success");
    } catch (err: any) {
      console.error("Error editing strategy:", err);
      showToast(err?.response?.data?.message || "Failed to edit strategy", "error");
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
      showToast(err?.response?.data?.message || "Failed to approve strategy", "error");
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
        showToast(response.message || "Calendar generated successfully!", "success");
        // Navigate to content calendar with strategy ID
        setTimeout(() => {
          navigate(`/content-calendar?strategy_id=${strategyId}`);
        }, 1500); // Small delay to show the toast
      } else {
        showToast("Calendar generation started! This will take 5-7 minutes.", "info");
      }
    } catch (err: any) {
      console.error("Error generating calendar:", err);
      showToast(err?.response?.data?.message || "Failed to generate calendar", "error");
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
        return { text: "Draft - Ready to generate", color: "text-gray-600", icon: FileText };
      case "GENERATING_STRATEGY":
        return { text: "Generating strategy... (2-3 min)", color: "text-blue-600", icon: Loader2 };
      case "STRATEGY_READY":
        return { text: "Strategy ready - Review & approve or edit", color: "text-green-600", icon: CheckCircle };
      case "EDITING_STRATEGY":
        return { text: "Editing strategy... (1-2 min)", color: "text-blue-600", icon: Loader2 };
      case "STRATEGY_APPROVED":
        return { text: "Strategy approved - Ready to generate calendar", color: "text-green-600", icon: CheckCircle };
      case "GENERATING_CALENDAR":
        return { text: "Generating calendar... (5-7 min)", color: "text-blue-600", icon: Loader2 };
      case "COMPLETED":
        return { text: "Completed - Calendar ready", color: "text-green-600", icon: CheckCircle };
      case "FAILED":
        return { text: "Failed - Please try again", color: "text-red-600", icon: AlertCircle };
      default:
        return { text: strategy.status, color: "text-gray-600", icon: FileText };
    }
  };

  const statusInfo = getStatusMessage();
  const StatusIcon = statusInfo.icon;

  // Prepare strategy sections for display
  const strategyData = strategy.strategy ? [
    {
      icon: Target,
      title: "STRATEGY SUMMARY",
      content: strategy.strategy.strategy_summary || "Strategy summary will be generated...",
    },
    {
      icon: Clock,
      title: "TIMELINE & DURATION",
      content: `📅 Duration: ${strategy.duration_days} days\n🗓️ Start Date: ${strategy.start_date}\n📊 Status: ${strategy.status.replace(/_/g, " ")}`,
    },
    {
      icon: Layers,
      title: "SELECTED PLATFORMS",
      content: strategy.selected_platforms.map(p => `• ${p.toUpperCase()}`).join("\n"),
    },
    {
      icon: Target,
      title: "FOCUS AREAS",
      content: strategy.focus_areas.map(area => `• ${area.replace(/_/g, " ").toUpperCase()}`).join("\n"),
    },
    {
      icon: Grid3x3,
      title: "POST FREQUENCY PREFERENCE",
      content: strategy.post_frequency_preference.replace(/_/g, " ").toUpperCase(),
    },
    ...(strategy.special_dates && strategy.special_dates.length > 0 ? [{
      icon: Clock,
      title: "SPECIAL DATES",
      content: strategy.special_dates.map(d => `📅 ${d.date}: ${d.name} (${d.type})`).join("\n"),
    }] : []),
    // CONTENT THEMES - Detailed
    ...(strategy.strategy.content_themes?.map((theme, idx) => ({
      icon: LayoutGrid,
      title: `CONTENT THEME ${idx + 1}: ${theme.theme.toUpperCase()}`,
      content: `📝 Description: ${theme.description}\n\n🎯 Target Segment: ${theme.target_segment || 'N/A'}\n\n📊 Frequency: ${theme.frequency}\n\n🚀 Organic Growth Rationale:\n${theme.organic_growth_rationale}\n\n💎 Differentiation:\n${theme.differentiation}\n\n🎭 Viral Potential: ${theme.viral_potential}\n\n📱 Recommended Platforms: ${theme.recommended_platforms?.join(", ").toUpperCase() || 'N/A'}\n\n💡 Example Posts:\n${theme.example_posts?.map((post, i) =>
        `\n${i + 1}. ${post.platform}\n   Hook: "${post.hook}"\n   Description: ${post.content_description}\n   Why Shareable: ${post.why_shareable}\n   Conversion: ${post.conversion_tactic}`
      ).join("\n") || 'No examples available'}\n\n🎯 Engagement Tactics:\n${theme.engagement_tactics}`,
    })) || []),
    // POSTING FREQUENCY - Detailed
    {
      icon: Grid3x3,
      title: "POSTING FREQUENCY BREAKDOWN",
      content: Object.entries(strategy.strategy.posting_frequency || {})
        .map(([platform, freq]: [string, any]) => {
          const details = [];
          details.push(`📱 PLATFORM: ${platform.toUpperCase()}`);
          details.push(`📊 Posts per week: ${freq.posts_per_week}`);
          if (freq.best_posting_times) {
            details.push(`⏰ Best times: ${freq.best_posting_times.join(", ")}`);
          }
          if (freq.content_type_distribution) {
            details.push(`\n📋 Content Mix:`);
            Object.entries(freq.content_type_distribution).forEach(([type, count]) => {
              details.push(`   • ${type}: ${count} per week`);
            });
          }
          if (freq.engagement_goal) {
            details.push(`\n🎯 Engagement Goal: ${freq.engagement_goal}`);
          }
          if (freq.organic_growth_rationale) {
            details.push(`\n💡 Strategy:\n${freq.organic_growth_rationale}`);
          }
          return details.join("\n");
        }).join("\n\n─────────────────\n\n"),
    },
    // KPIs - Detailed
    {
      icon: TrendingUp,
      title: "KEY PERFORMANCE INDICATORS (KPIs)",
      content: (() => {
        const kpis = strategy.strategy.kpis;
        if (!kpis) return "KPIs will be set...";

        const sections = [];

        // Primary Metrics
        if (kpis.primary_metrics) {
          sections.push(`📊 PRIMARY METRICS:\n${kpis.primary_metrics.map(m => `• ${m.replace(/_/g, " ").toUpperCase()}`).join("\n")}`);
        }

        // Targets
        if (kpis.targets) {
          sections.push(`\n🎯 TARGETS:`);
          Object.entries(kpis.targets).forEach(([key, value]: [string, any]) => {
            if (typeof value === 'object') {
              sections.push(`\n${key.replace(/_/g, " ").toUpperCase()}:`);
              Object.entries(value).forEach(([k, v]) => {
                sections.push(`  • ${k.replace(/_/g, " ")}: ${v}`);
              });
            } else {
              sections.push(`• ${key.replace(/_/g, " ")}: ${value}`);
            }
          });
        }

        // Measurement Approach
        if (kpis.measurement_approach) {
          sections.push(`\n📈 MEASUREMENT:\n${kpis.measurement_approach}`);
        }

        // Focus Alignment
        if (kpis.focus_alignment) {
          sections.push(`\n🎯 FOCUS ALIGNMENT:\n${kpis.focus_alignment}`);
        }

        return sections.join("\n");
      })(),
    },
    // COMPETITOR ANALYSIS
    ...(strategy.research?.competitor_analysis?.competitors ? [{
      icon: Target,
      title: "COMPETITOR ANALYSIS",
      content: `${strategy.research.competitor_analysis.competitors.map((comp: any, idx: number) =>
        `${idx + 1}. ${comp.name.toUpperCase()}\n   Platforms: ${comp.platforms?.join(", ")}\n   Strengths: ${comp.organic_strengths}\n   Engagement: ${comp.engagement_rate}\n   Posting: ${comp.posting_frequency}\n   Weaknesses: ${comp.weaknesses}\n   Our Opportunity: ${comp.opportunities_for_us}`
      ).join("\n\n")}\n\n📊 LANDSCAPE SUMMARY:\n${strategy.research.competitor_analysis.competitive_landscape_summary}\n\n💎 WHITE SPACE OPPORTUNITIES:\n${strategy.research.competitor_analysis.white_space_opportunities}`,
    }] : []),
    // FESTIVAL CALENDAR
    ...(strategy.research?.festival_calendar && strategy.research.festival_calendar.length > 0 ? [{
      icon: Clock,
      title: "FESTIVAL & EVENTS CALENDAR",
      content: strategy.research.festival_calendar.map((event: any) =>
        `📅 ${event.date} - ${event.name}\n   Type: ${event.type} | Region: ${event.region}\n   Marketing Relevance: ${event.marketing_relevance}\n   💡 Opportunities: ${event.content_opportunities}\n   ⏰ Prep: ${event.pre_event_buildup}`
      ).join("\n\n"),
    }] : []),
    // CONTENT PREFERENCES (Competitive Differentiation)
    ...(strategy.content_preferences?.competitive_differentiation ? [{
      icon: Target,
      title: "COMPETITIVE DIFFERENTIATION STRATEGY",
      content: (() => {
        const cd = strategy.content_preferences.competitive_differentiation;
        const sections = [];

        if (cd.unique_value_proposition) {
          sections.push(`🎯 UNIQUE VALUE PROPOSITION:\n${cd.unique_value_proposition}`);
        }

        if (cd.organic_content_positioning) {
          sections.push(`\n📢 ORGANIC POSITIONING:\n${cd.organic_content_positioning}`);
        }

        if (cd.competitive_advantages) {
          sections.push(`\n💎 COMPETITIVE ADVANTAGES:`);
          cd.competitive_advantages.forEach((adv: any, i: number) => {
            sections.push(`\n${i + 1}. ${adv.advantage}`);
            sections.push(`   How to Amplify: ${adv.how_to_amplify_organically}`);
            if (adv.content_examples) {
              sections.push(`   Examples: ${adv.content_examples.join(" | ")}`);
            }
          });
        }

        if (cd.brand_voice_for_organic) {
          const voice = cd.brand_voice_for_organic;
          sections.push(`\n🎭 BRAND VOICE:`);
          sections.push(`   Tone: ${voice.tone_description}`);
          sections.push(`   Personality: ${voice.personality_traits?.join(", ")}`);
          sections.push(`   Cultural POV: ${voice.cultural_pov}`);
        }

        return sections.join("\n");
      })(),
    }] : []),
  ] : [];

  return (
    <div
      className="flex flex-col"
      style={{
        background: "linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)",
        height: "calc(100vh - 4rem)"
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
              height: "100%"
            }}
          >
            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto p-8 md:p-12 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-inter text-[32px] md:text-[36px] font-semibold leading-tight text-gray-900 mb-3">
                  {strategy.project_name}
                </h1>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <StatusIcon className={`h-5 w-5 ${statusInfo.color} ${statusInfo.icon === Loader2 ? 'animate-spin' : ''}`} />
                  <p className={`font-inter text-sm ${statusInfo.color} font-medium`}>
                    {statusInfo.text}
                  </p>
                </div>
                <p className="font-inter text-sm text-gray-500">
                  {strategy.selected_platforms.join(" • ").toUpperCase()} | {strategy.duration_days} Days
                </p>
                {strategy.edit_count > 0 && (
                  <p className="font-inter text-xs text-gray-400 mt-1">
                    Edited {strategy.edit_count} time{strategy.edit_count > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Show message if strategy is still being generated */}
              {(strategy.status === "GENERATING_STRATEGY" || strategy.status === "EDITING_STRATEGY") && (
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

              {/* Strategy Sections */}
              {strategy.strategy && strategyData.length > 0 && (
                <div className="space-y-6">
                  {strategyData.map((section, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="shrink-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #A855F7 0%, #8F00FF 100%)",
                          }}
                        >
                          <section.icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-inter text-xs font-semibold text-gray-900 mb-2 tracking-wide">
                          {section.title}
                        </h3>
                        <p className="font-inter text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Credit Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits used:</span>
                  <span className="font-semibold text-gray-900">{strategy.credit_breakdown.total_credits} credits</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Strategy: {strategy.credit_breakdown.strategy_credits} • Edits: {strategy.credit_breakdown.edit_credits} • Calendar: {strategy.credit_breakdown.calendar_credits}
                </div>
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="border-t border-gray-200 p-6 md:px-12">
              <div className="flex justify-end gap-3 flex-wrap">
                {/* Edit Strategy Button */}
                {strategy.can_edit_strategy && strategy.status === "STRATEGY_READY" && (
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
                {strategy.can_approve_strategy && strategy.status === "STRATEGY_READY" && (
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
                {strategy.can_generate_calendar && strategy.status === "STRATEGY_APPROVED" && (
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Edit Strategy</h2>
            <p className="text-sm text-gray-600 mb-4">
              Tell the AI what you'd like to change about your strategy. Be specific! This will cost 10 credits.
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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
