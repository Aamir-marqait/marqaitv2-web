import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import BrandbookSlider from "@/components/onboarding/BrandbookSlider";

export default function EditLogo() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [showSlider, setShowSlider] = useState(false);

  const handleSave = () => {
    // Open brandbook slider with edited logo
    setShowSlider(true);
  };

  const handleCloseSlider = () => {
    setShowSlider(false);
    // Navigate to business content setup (step 2)
    navigate("/onboarding/business-content-setup");
  };

  const handleQuickAction = (action: string) => {
    setPrompt(action);
  };

  return (
    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-6 md:pt-10 px-4 md:px-6 lg:px-4">
      <div className="w-full mx-auto flex flex-col items-center">
        {/* Header */}
        <h1 className="font-inter text-[28px] md:text-[32px] lg:text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-2 text-center">
          Logo <span className="text-[#8F00FF]">Edit</span>
        </h1>
        <p className="font-inter text-sm md:text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-center mb-6 md:mb-10">
          Fine-tune your logo with AI-powered editing tools
        </p>

        {/* Main Container */}
        <div className="bg-white rounded-[20px] mb-8 max-w-[1250px] w-full p-4 md:p-6 lg:p-10 shadow-[0px_10px_40px_0px_rgba(143,0,255,0.15)]">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Left Side - Logo Preview */}
            <div className="flex items-center justify-center bg-white rounded-[20px] border border-[#E4E4E4] shrink-0 w-full lg:w-[397px] h-[300px] md:h-[350px] lg:h-[400px]">
              {/* Placeholder for logo - will be replaced with actual logo */}
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">LOREM IPSUM</div>
                <div className="text-sm text-gray-500">
                  Logo preview will appear here
                </div>
              </div>
            </div>

            {/* Right Side - AI Editor */}
            <div className="flex flex-col bg-white rounded-[12.75px] border border-black/10 flex-1 w-full lg:max-w-[803px] min-h-[400px] p-4 md:p-6 lg:p-[28.8px] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col mb-3 md:mb-4">
                <h2 className="font-inter font-medium text-[18px] md:text-[20px] leading-[30px] text-[#0A0A0A] mb-1">
                  AI Editor
                </h2>
                <p className="font-inter font-normal text-[12px] md:text-[14px] leading-[21px] text-[#717182]">
                  Ask me any edit for the design
                </p>
              </div>

              {/* Prompt Input */}
              <div className="mb-8 md:mb-12 lg:mb-14">
                <textarea
                  placeholder="Type your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-24 md:h-32 rounded-xl border-none bg-[#F3F3F5] px-3 md:px-4 py-3 md:py-4 font-inter font-normal text-[14px] md:text-[16px] leading-[17.5px] resize-none focus:outline-none placeholder:text-gray-400"
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                  <p className="font-inter font-normal text-[10px] md:text-[12px] leading-[17.5px] text-[#717182]">
                    The result will be reflected on left side
                  </p>
                  <button
                    className="px-4 md:px-6 py-2 rounded-lg font-inter text-xs md:text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 w-full sm:w-auto"
                    style={{
                      background:
                        "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                    }}
                  >
                    <Send className="w-3 md:w-4 h-3 md:h-4" />
                    Run Prompt
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <p className="font-inter text-xs md:text-sm text-gray-700 shrink-0">
                  Quick actions:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickAction("Make it more modern")}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-black/10 cursor-pointer bg-white font-inter font-medium text-[10px] md:text-[12px] leading-[100%] text-center text-[#181A2A] hover:bg-gray-50 transition-all"
                  >
                    Make it more modern
                  </button>
                  <button
                    onClick={() => handleQuickAction("Try different color")}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-black/10 cursor-pointer bg-white font-inter font-medium text-[10px] md:text-[12px] leading-[100%] text-center text-[#181A2A] hover:bg-gray-50 transition-all"
                  >
                    Try different color
                  </button>
                  <button
                    onClick={() => handleQuickAction("Simplify the design")}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-black/10 cursor-pointer bg-white font-inter font-medium text-[10px] md:text-[12px] leading-[100%] text-center text-[#181A2A] hover:bg-gray-50 transition-all"
                  >
                    Simplify the design
                  </button>
                  <button
                    onClick={() => handleQuickAction("Make it bolder")}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border cursor-pointer border-black/10 bg-white font-inter font-medium text-[10px] md:text-[12px] leading-[100%] text-center text-[#181A2A] hover:bg-gray-50 transition-all"
                  >
                    Make it bolder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center w-full max-w-[1250px] px-4">
          <button
            onClick={handleSave}
            className="px-12 md:px-16 py-3 rounded-xl cursor-pointer font-inter text-sm md:text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all hover:opacity-90 w-full sm:w-auto"
            style={{
              background:
                "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
            }}
          >
            SAVE
          </button>
        </div>
      </div>

      {/* Brandbook Slider */}
      <BrandbookSlider
        isOpen={showSlider}
        onClose={handleCloseSlider}
      />
    </div>
  );
}
