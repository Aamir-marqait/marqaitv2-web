import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Send, ArrowUpRight } from "lucide-react";
import logo from "@/assets/app-logo/logo.png";

export default function WelcomeChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Extract first name from user name
  const firstName = user?.name?.split(" ")[0] || "there";

  const quickActions = [
    { text: "Yes!" },
    { text: "Tell me more" },
    { text: "What should I do?" },
  ];

  const exploreLinks = [
    { text: "Dashboard", href: "/dashboard" },
    { text: "Generate Quick Post", href: "/generate-post" },
    { text: "Watch Tutorial (2 min)", href: "/tutorial" },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Handle sending message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleQuickAction = (action: string) => {
    // TODO: Handle quick action click
    console.log("Quick action clicked:", action);
  };

  const handleExploreLink = (href: string) => {
    navigate(href);
  };

  return (
    <div
      className=" flex justify-center px-4 py-8"
      style={{
        background: "linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)",
      }}
    >
      <div className="w-full max-w-[1100px]">
        {/* Logo and Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Marqait AI" className="h-16 w-auto" />
          </div>
          <h1 className="font-inter text-[40px] md:text-[48px] font-semibold leading-tight text-gray-900 mb-2">
            Welcome <span className="text-[#8F00FF]">{firstName}!</span>
          </h1>
          <p className="font-inter text-base text-gray-500">
            Your AI marketing assistant is ready to help you grow
          </p>
        </div>

        {/* Chat Container */}
        <div
          className="w-full bg-white rounded-[20px] p-6 md:p-8 mb-6"
          style={{
            boxShadow: "0px 10px 40px 0px rgba(143, 0, 255, 0.15)",
          }}
        >
          {/* AI Message */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0">
                <img src={logo} alt="Marqait AI" className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-inter text-sm font-semibold text-gray-900">
                    MARQAIT AI
                  </span>
                  <span className="font-inter text-xs text-gray-400">
                    4:33 PM
                  </span>
                </div>
                <div className="font-inter text-sm text-gray-700">
                  <p className="mb-2">Hi {firstName}!</p>
                  <p>
                    Your brand looks amazing. Ready to plan your marketing for
                    this month?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Input Area */}
          <div
            className="w-full bg-[#F5F5F5] rounded-2xl p-4 mb-4"
            style={{
              minHeight: "180px",
            }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type here..."
              className="w-full h-full bg-transparent border-none outline-none resize-none font-inter text-sm text-gray-700 placeholder:text-gray-400"
              style={{
                minHeight: "48px",
              }}
            />
          </div>

          {/* Quick Actions and Send Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-inter text-xs text-gray-500 mr-1">
                Quick actions:
              </span>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.text)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white font-inter text-xs text-gray-700 hover:border-[#8F00FF] hover:bg-purple-50 transition-all"
                >
                  {action.text}
                </button>
              ))}
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-inter text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                background:
                  "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              }}
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>

        {/* Explore More Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="font-inter text-sm text-gray-600">
              Explore more:
            </span>
            {exploreLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleExploreLink(link.href)}
                className="flex items-center gap-1 font-inter text-sm text-gray-600 hover:text-[#8F00FF] underline transition-colors group"
              >
                {link.text}
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
