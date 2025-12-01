import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";
import logo from "@/assets/app-logo/logo.png";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export default function StrategyCreationChat() {
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Add CSS to hide scrollbar
  useEffect(() => {
    const style = document.createElement('style');
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

  // Extract first name from user name
  const firstName = user?.name?.split(" ")[0] || "there";

  // Get current time
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Initialize chat with welcome messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        type: "ai",
        content: "Perfect! Let me ask you a few quick questions to create your marketing strategy.",
        timestamp: getCurrentTime(),
      },
      {
        id: "2",
        type: "ai",
        content:
          "First, what do you want to focus on this month? First, what do you want to focus on this month?",
        timestamp: getCurrentTime(),
        suggestions: ["Question 01", "Question 01", "Question 01", "Question 01", "Question 01"],
      },
    ];

    // If there's an initial message from the previous page, add it as a user message
    const initialMessage = location.state?.initialMessage;
    if (initialMessage) {
      const userMessage: Message = {
        id: "0",
        type: "user",
        content: initialMessage,
        timestamp: getCurrentTime(),
      };
      setMessages([userMessage, ...initialMessages]);
    } else {
      setMessages(initialMessages);
    }
  }, [location.state]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickActions = ["Hi!", "Tell me more"];

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: getCurrentTime(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      // TODO: Add AI response logic here
    }
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-linear-to-b from-[#F3E8FF] to-white" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-[900px] w-full mx-auto px-4 overflow-hidden">
        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto mb-4 space-y-4 hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center pt-4 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-[#8F00FF]" />
              <h1 className="font-inter text-[32px] md:text-[40px] font-bold text-[#8F00FF]">
                Marqait A.I
              </h1>
              <Sparkles className="w-6 h-6 text-[#8F00FF]" />
            </div>
            <p className="font-inter text-sm text-gray-600">Your AI Marketing Assistant</p>
          </div>

          {/* Chat Messages */}
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.type === "ai" ? (
                // AI Message
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#E6D4FF] flex items-center justify-center">
                    <img src={logo} alt="AI" className="w-4 h-4 object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#F3E8FF] rounded-2xl rounded-tl-none px-5 py-4 max-w-[600px]">
                      <p className="font-inter text-sm text-gray-800 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
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
                      <div
                        className="rounded-2xl rounded-tr-none px-5 py-4 text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #A855F7 0%, #8F00FF 100%)",
                        }}
                      >
                        <p className="font-inter text-sm leading-relaxed">{msg.content}</p>
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
        <div className="bg-white rounded-3xl shadow-lg p-6 shrink-0">
          <div className="bg-[#F9F9F9] rounded-2xl p-4 mb-4 min-h-[100px]">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full h-full bg-transparent border-none outline-none resize-none font-inter text-sm text-gray-700 placeholder:text-gray-400"
              rows={3}
            />
          </div>

          {/* Quick Actions and Send Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-inter text-xs text-gray-500">Quick actions:</span>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white font-inter text-xs text-gray-700 hover:border-[#8F00FF] hover:bg-purple-50 transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                background:
                  "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
