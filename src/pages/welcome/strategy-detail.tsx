import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Target,
  Clock,
  Layers,
  LayoutGrid,
  Grid3x3,
  TrendingUp,
  FileText,
} from "lucide-react";


export default function StrategyDetail() {
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
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Get strategy name from location state or format from slug
  const strategyName =
    location.state?.strategyName ||
    slug
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") ||
    "Strategy";

  const strategyData = [
    {
      icon: Target,
      title: "CAMPAIGN OBJECTIVE",
      content:
        "Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet",
    },
    {
      icon: Clock,
      title: "TIMELINE",
      content:
        "Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet",
    },
    {
      icon: Layers,
      title: "PLATFORMS & CONTENT",
      content:
        "Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet",
    },
    {
      icon: LayoutGrid,
      title: "CONTENT BREAKDOWN",
      content:
        "Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet",
    },
    {
      icon: Grid3x3,
      title: "CONTENT THEMES",
      content:
        "Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet",
    },
    {
      icon: TrendingUp,
      title: "CREATIVE ELEMENTS",
      content:
        "Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet",
    },
    {
      icon: Target,
      title: "EXPECTED RESULTS",
      content:
        "Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet",
    },
    {
      icon: FileText,
      title: "CONTENT MIX (30 days)",
      content:
        "Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet",
    },
  ];

  const handleMakeChanges = () => {
    // Navigate back to the chat
    navigate("/strategy-creation-chat");
  };

  const handleApproveAndCreate = () => {
    // Navigate to content calendar or next step
    navigate("/content-calendar");
  };

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
                  {strategyName}
                </h1>
                <p className="font-inter text-sm text-gray-500">
                  November 25-29, 2025 | Catering Sale | Organic Social
                </p>
              </div>

              {/* Strategy Sections */}
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
                      <p className="font-inter text-sm text-gray-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="border-t border-gray-200 p-6 md:px-12">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleMakeChanges}
                  className="px-5 py-2 pointer-cursor rounded-lg border-2 border-gray-300 bg-white font-inter text-sm font-semibold text-gray-700 hover:border-[#8F00FF] hover:bg-purple-50 transition-all"
                >
                  MAKE CHANGES
                </button>
                <button
                  onClick={handleApproveAndCreate}
                  className="px-5 pointer-cursor py-2 rounded-lg font-inter text-sm font-semibold text-white transition-all hover:shadow-lg whitespace-nowrap"
                  style={{
                    background:
                      "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                  }}
                >
                  APPROVE & CREATE CAMPAIGN CALENDAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
