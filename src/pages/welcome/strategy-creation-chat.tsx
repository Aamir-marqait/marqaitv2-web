import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Send, Loader2 } from "lucide-react";
import logo from "@/assets/app-logo/logo.png";
import star from "@/assets/star.png";
import { strategyService } from "@/api/services";
import type { Platform, FocusArea, SpecialDate } from "@/api/types";
import { Toast } from "@/components/ui/toast";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

// Strategy creation workflow steps - using const instead of enum for compatibility
const Step = {
  WELCOME: "WELCOME",
  PROJECT_NAME: "PROJECT_NAME",
  DURATION: "DURATION",
  START_DATE: "START_DATE",
  PLATFORMS: "PLATFORMS",
  USER_BRIEF: "USER_BRIEF",
  FOCUS_AREAS: "FOCUS_AREAS",
  SPECIAL_DATES: "SPECIAL_DATES",
  CONFIRMATION: "CONFIRMATION",
  GENERATING: "GENERATING",
  COMPLETE: "COMPLETE",
} as const;

type StepType = typeof Step[keyof typeof Step];

interface ToastState {
  show: boolean;
  message: string;
  type: "error" | "success" | "info";
}

export default function StrategyCreationChat() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<StepType>(Step.WELCOME);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "error",
  });

  // Strategy data collection
  const [strategyData, setStrategyData] = useState({
    projectName: "",
    durationDays: 30,
    startDate: new Date().toISOString().split("T")[0],
    selectedPlatforms: [] as Platform[],
    userBrief: "",
    focusAreas: [] as FocusArea[],
    specialDates: [] as SpecialDate[],
  });


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

  const firstName = user?.name?.split(" ")[0] || "there";

  const showToast = (message: string, type: "error" | "success" | "info" = "error") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Initialize chat
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;

    const welcomeMessage: Message = {
      id: "1",
      type: "ai",
      content: "Perfect! Let me ask you a few quick questions to create your marketing strategy.",
      timestamp: getCurrentTime(),
    };

    const firstQuestion: Message = {
      id: "2",
      type: "ai",
      content: "First, what would you like to name this strategy project?",
      timestamp: getCurrentTime(),
      suggestions: [
        "Q1 2025 Campaign",
        "Product Launch Strategy",
        "Holiday Marketing Plan",
        "Brand Awareness Campaign",
      ],
    };

    if (initialMessage) {
      const userMessage: Message = {
        id: "0",
        type: "user",
        content: initialMessage,
        timestamp: getCurrentTime(),
      };
      setMessages([userMessage, welcomeMessage, firstQuestion]);
    } else {
      setMessages([welcomeMessage, firstQuestion]);
    }

    setCurrentStep(Step.PROJECT_NAME);
  }, [location.state]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content: string, type: "ai" | "user", suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: getCurrentTime(),
      suggestions,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleStepResponse = async (userResponse: string) => {
    setIsProcessing(true);

    try {
      switch (currentStep) {
        case Step.PROJECT_NAME:
          setStrategyData((prev) => ({ ...prev, projectName: userResponse }));
          addMessage(userResponse, "user");
          setTimeout(() => {
            addMessage(
              "Great! How many days should this strategy cover?",
              "ai",
              ["7 days", "14 days", "30 days"]
            );
            setCurrentStep(Step.DURATION);
            setIsProcessing(false);
          }, 500);
          break;

        case Step.DURATION:
          const days = parseInt(userResponse.replace(/\D/g, "")) || 30;
          if (days < 7 || days > 30) {
            addMessage("Duration must be between 7 and 30 days. Please try again.", "ai");
            setIsProcessing(false);
            return;
          }
          setStrategyData((prev) => ({ ...prev, durationDays: days }));
          addMessage(userResponse, "user");
          setTimeout(() => {
            addMessage(
              "Perfect! When would you like this strategy to start?",
              "ai",
              ["Today", "Next Monday", "Start of next month"]
            );
            setCurrentStep(Step.START_DATE);
            setIsProcessing(false);
          }, 500);
          break;

        case Step.START_DATE:
          let startDate = strategyData.startDate;
          if (userResponse.toLowerCase() === "today") {
            startDate = new Date().toISOString().split("T")[0];
          } else if (userResponse.toLowerCase() === "next monday") {
            const nextMonday = new Date();
            nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7));
            startDate = nextMonday.toISOString().split("T")[0];
          } else if (userResponse.match(/^\d{4}-\d{2}-\d{2}$/)) {
            startDate = userResponse;
          }
          setStrategyData((prev) => ({ ...prev, startDate }));
          addMessage(userResponse, "user");
          setTimeout(() => {
            addMessage(
              "Which social media platforms do you want to focus on? (Select multiple if needed)",
              "ai",
              ["Instagram", "LinkedIn", "Facebook", "TikTok", "X (Twitter)", "Pinterest"]
            );
            setCurrentStep(Step.PLATFORMS);
            setIsProcessing(false);
          }, 500);
          break;

        case Step.PLATFORMS:
          const platformMap: Record<string, Platform> = {
            instagram: "instagram",
            linkedin: "linkedin",
            facebook: "facebook",
            tiktok: "tiktok",
            "x (twitter)": "x",
            twitter: "x",
            pinterest: "pinterest",
          };
          const selectedPlatforms = userResponse
            .toLowerCase()
            .split(/,|\sand\s/)
            .map((p) => p.trim())
            .filter((p) => platformMap[p])
            .map((p) => platformMap[p]);

          if (selectedPlatforms.length === 0) {
            addMessage("Please select at least one platform.", "ai");
            setIsProcessing(false);
            return;
          }

          setStrategyData((prev) => ({ ...prev, selectedPlatforms }));
          addMessage(userResponse, "user");
          setTimeout(() => {
            addMessage(
              "Now, tell me about your goals and what you want to achieve. Be as detailed as possible! (20-5000 characters)",
              "ai"
            );
            setCurrentStep(Step.USER_BRIEF);
            setIsProcessing(false);
          }, 500);
          break;

        case Step.USER_BRIEF:
          if (userResponse.length < 20 || userResponse.length > 5000) {
            addMessage("Please provide a brief between 20 and 5000 characters.", "ai");
            setIsProcessing(false);
            return;
          }
          setStrategyData((prev) => ({ ...prev, userBrief: userResponse }));
          addMessage(userResponse, "user");
          setTimeout(() => {
            addMessage(
              "What are your main focus areas? (You can select up to 5)",
              "ai",
              [
                "Brand Awareness",
                "Sales Conversions",
                "Lead Generation",
                "Product Launches",
                "Community Engagement",
                "Thought Leadership",
              ]
            );
            setCurrentStep(Step.FOCUS_AREAS);
            setIsProcessing(false);
          }, 500);
          break;

        case Step.FOCUS_AREAS:
          const focusAreaMap: Record<string, FocusArea> = {
            "brand awareness": "brand_awareness",
            "sales conversions": "sales_conversions",
            "lead generation": "lead_generation",
            "product launches": "product_launches",
            "community engagement": "community_engagement",
            "thought leadership": "thought_leadership",
            education: "education",
            "event promotion": "event_promotion",
            "employer branding": "employer_branding",
            "customer retention": "customer_retention",
            "user generated content": "user_generated_content",
            "brand storytelling": "brand_storytelling",
          };

          const focusAreas = userResponse
            .toLowerCase()
            .split(/,|\sand\s/)
            .map((f) => f.trim())
            .filter((f) => focusAreaMap[f])
            .map((f) => focusAreaMap[f])
            .slice(0, 5);

          if (focusAreas.length === 0) {
            addMessage("Please select at least one focus area.", "ai");
            setIsProcessing(false);
            return;
          }

          setStrategyData((prev) => ({ ...prev, focusAreas }));
          addMessage(userResponse, "user");
          setTimeout(() => {
            addMessage(
              "Do you have any special dates or events to promote? (Type 'none' to skip, or provide dates and events)",
              "ai",
              ["None", "Product Launch on Dec 15", "Holiday Sale on Dec 25"]
            );
            setCurrentStep(Step.SPECIAL_DATES);
            setIsProcessing(false);
          }, 500);
          break;

        case Step.SPECIAL_DATES:
          // For now, just skip special dates parsing - can be enhanced later
          setStrategyData((prev) => ({ ...prev, specialDates: [] }));
          addMessage(userResponse, "user");
          setTimeout(() => {
            addMessage(
              `Perfect! Let me summarize:\n\n📋 Project: ${strategyData.projectName}\n⏱️ Duration: ${strategyData.durationDays} days\n📅 Start Date: ${strategyData.startDate}\n📱 Platforms: ${strategyData.selectedPlatforms.join(", ")}\n🎯 Focus: ${strategyData.focusAreas.join(", ")}\n\nReady to create your strategy? This will cost 20 credits.`,
              "ai",
              ["Yes, Create Strategy!", "Let me make changes"]
            );
            setCurrentStep(Step.CONFIRMATION);
            setIsProcessing(false);
          }, 500);
          break;

        case Step.CONFIRMATION:
          if (userResponse.toLowerCase().includes("yes") || userResponse.toLowerCase().includes("create")) {
            addMessage(userResponse, "user");
            await createStrategy();
          } else {
            addMessage(userResponse, "user");
            addMessage("Let's start over. What would you like to name this strategy project?", "ai");
            setCurrentStep(Step.PROJECT_NAME);
            setIsProcessing(false);
          }
          break;

        default:
          setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error processing step:", error);
      addMessage("Sorry, something went wrong. Please try again.", "ai");
      setIsProcessing(false);
    }
  };

  const createStrategy = async () => {
    setIsProcessing(true);
    setCurrentStep(Step.GENERATING);

    addMessage(
      "🚀 Creating your strategy project... This will take a moment.",
      "ai"
    );

    try {
      // Get business_id from localStorage
      // It's stored during onboarding as 'business_id' or from signin as 'primary_business_id'
      let businessId = localStorage.getItem("business_id") || localStorage.getItem("primary_business_id");

      console.log("🔍 Checking for business ID...");
      console.log("business_id:", localStorage.getItem("business_id"));
      console.log("primary_business_id:", localStorage.getItem("primary_business_id"));
      console.log("Using business_id:", businessId);

      if (!businessId) {
        throw new Error("Business ID not found. Please complete onboarding first.");
      }

      // Create strategy project
      const createResponse = await strategyService.createStrategyProject({
        business_info_id: businessId,
        project_name: strategyData.projectName,
        duration_days: strategyData.durationDays,
        start_date: strategyData.startDate,
        selected_platforms: strategyData.selectedPlatforms,
        user_brief: strategyData.userBrief,
        focus_areas: strategyData.focusAreas,
        special_dates: strategyData.specialDates,
        post_frequency_preference: "ai_decide",
      });

      addMessage(
        "✅ Strategy project created! Now generating your AI-powered marketing strategy...",
        "ai"
      );

      // Generate strategy (20 credits, 2-3 minutes)
      await strategyService.generateStrategy(createResponse.project_id);

      addMessage(
        `🎉 Strategy generated successfully! You can now review and approve it.`,
        "ai"
      );

      setCurrentStep(Step.COMPLETE);
      setIsProcessing(false);

      // Navigate to strategy detail page - using correct route
      setTimeout(() => {
        navigate(`/strategy-creation-chat/${createResponse.project_id}`);
      }, 1500);

    } catch (error: any) {
      console.error("Error creating strategy:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create strategy";
      showToast(errorMessage, "error");
      addMessage(
        `❌ Error: ${errorMessage}. Please try again or contact support.`,
        "ai"
      );
      setCurrentStep(Step.CONFIRMATION);
      setIsProcessing(false);
    }
  };

  const handleSend = () => {
    if (message.trim() && !isProcessing) {
      handleStepResponse(message);
      setMessage("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isProcessing) {
      handleStepResponse(suggestion);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col bg-linear-to-b from-[#F3E8FF] to-white"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-[900px] w-full mx-auto px-4 overflow-hidden">
        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto mb-4 space-y-4 hide-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center pt-4 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <img src={star} alt="Star" className="w-10 h-10" />
              <h1 className="font-inter text-[48px] font-semibold leading-[100%] tracking-[0%] align-middle text-[#8F00FF]">
                Marqait A.I
              </h1>
              <img src={star} alt="Star" className="w-10 h-10" />
            </div>
            <p className="font-inter text-[16px] font-normal leading-[100%] tracking-[0%] align-middle text-[#3B3C4A]">
              Create Campaign Strategy
            </p>
          </div>

          {/* Chat Messages */}
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.type === "ai" ? (
                // AI Message
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#E6D4FF] flex items-center justify-center">
                    <img
                      src={logo}
                      alt="AI"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#f8edff] rounded-2xl rounded-tl-none px-5 py-4 max-w-[600px]">
                      <p className="font-inter text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </p>
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && !isProcessing && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 rounded-full border border-[#8F00FF] bg-white font-inter text-xs text-gray-700 hover:bg-[#F3E8FF] transition-all"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <span className="font-inter text-xs text-gray-400 mt-2 inline-block">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ) : (
                // User Message
                <div className="flex justify-end">
                  <div className="flex items-start gap-3 max-w-[600px]">
                    <div className="flex-1">
                      <div className="rounded-2xl rounded-tr-none px-5 py-4 text-white bg-[#a633ff]">
                        <p className="font-inter text-sm leading-relaxed whitespace-pre-line">
                          {msg.content}
                        </p>
                      </div>
                      <span className="font-inter text-xs text-gray-400 mt-2 inline-block text-right w-full">
                        {msg.timestamp}
                      </span>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-[#A855F7] to-[#8F00FF] flex items-center justify-center text-white font-inter text-sm font-semibold">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {currentStep !== Step.GENERATING && currentStep !== Step.COMPLETE && (
          <div className="bg-white rounded-3xl shadow-lg p-6 shrink-0">
            <div className="bg-[#F9F9F9] rounded-2xl p-4 mb-4 min-h-[100px]">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder="Type your message here..."
                className="w-full h-full bg-transparent border-none outline-none resize-none font-inter text-sm text-gray-700 placeholder:text-gray-400 disabled:opacity-50"
                rows={3}
              />
            </div>

            {/* Send Button */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={handleSend}
                disabled={!message.trim() || isProcessing}
                className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{
                  background:
                    "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

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
