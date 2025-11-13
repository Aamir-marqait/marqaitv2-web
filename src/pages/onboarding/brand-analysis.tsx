import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Sparkles, Lightbulb } from "lucide-react";
import LinearProgress from "@/components/ui/linear-progress";
import BrandbookSlider from "@/components/onboarding/BrandbookSlider";

export default function BrandAnalysis() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const _logoPreview = (location.state as { logoPreview?: string })?.logoPreview;
  const [showSlider, setShowSlider] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    // Open brandbook slider
    setShowSlider(true);
  };

  const handleCloseSlider = () => {
    setShowSlider(false);
    // Navigate to business content setup (step 2)
    navigate("/onboarding/business-content-setup");
  };

  return (
    <div className="bg-linear-to-b  from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={1} totalSteps={3} />
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Brand <span className="text-[#8F00FF]">Analysis</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          We've analyzed your brand and created a comprehensive profile
        </p>

        {/* Main Container */}
        <div
          className="w-full max-w-4xl bg-white rounded-[20px] border border-[#E4E4E4] p-8 mb-8"
          style={{
            // maxWidth: "872px",
            // minHeight: "444px",
          }}
        >
          {/* Your Brand Analysis Section */}
          <div className="mb-8">
            <h2 className="flex items-center gap-2 font-inter font-medium text-[20px] leading-[30px] align-middle text-[#0A0A0A] mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              Your Brand Analysis:
            </h2>

            <div className="space-y-4">
              {/* Logo Style */}
              <div className="flex items-start gap-3">
                <div className="w-[18px] h-[18px] rounded-sm bg-[#02C24B] flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div>
                  <span className="font-inter font-semibold text-[16px] leading-5 tracking-[-0.03em] align-middle text-gray-800">
                    Logo Style:{" "}
                  </span>
                  <span className="font-inter font-normal text-[16px] leading-5 tracking-[-0.03em] align-middle text-[#181A2A]">
                    Friendly and approachable
                  </span>
                </div>
              </div>

              {/* Color Detection */}
              <div className="flex items-start gap-3">
                <div className="w-[18px] h-[18px] rounded-sm bg-[#02C24B] flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div>
                  <span className="font-inter font-semibold text-[16px] leading-5 tracking-[-0.03em] align-middle text-gray-800">
                    Color Detection:{" "}
                  </span>
                  <span className="font-inter font-normal text-[16px] leading-5 tracking-[-0.03em] align-middle text-[#181A2A]">
                    Warm pink (#FF6B9D) and cream (#FFF5E1)
                  </span>
                </div>
              </div>

              {/* Personality */}
              <div className="flex items-start gap-3">
                <div className="w-[18px] h-[18px] rounded-sm bg-[#02C24B] flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div>
                  <span className="font-inter font-semibold text-[16px] leading-5 tracking-[-0.03em] align-middle text-gray-800">
                    Personality:{" "}
                  </span>
                  <span className="font-inter font-normal text-[16px] leading-5 tracking-[-0.03em] align-middle text-[#181A2A]">
                    Welcoming, artisan, homemade feel
                  </span>
                </div>
              </div>

              {/* Industry Match */}
              <div className="flex items-start gap-3">
                <div className="w-[18px] h-[18px] rounded-sm bg-[#02C24B] flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div>
                  <span className="font-inter font-semibold text-[16px] leading-5 tracking-[-0.03em] align-middle text-gray-800">
                    Industry Match:{" "}
                  </span>
                  <span className="font-inter font-normal text-[16px] leading-5 tracking-[-0.03em] align-middle text-[#181A2A]">
                    Perfect for a bakery brand
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Enhancements Section */}
          <div>
            <h2 className="flex items-center gap-2 font-inter font-medium text-[20px] leading-[30px] align-middle text-[#0A0A0A] mb-6">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Suggested Enhancements:
            </h2>

            <ol className="space-y-3 list-decimal list-inside">
              <li className="font-inter font-normal text-[16px] leading-5 tracking-[-0.03em] align-middle text-[#181A2A]">
                We'll add complementary colors for variety
              </li>
              <li className="font-inter font-normal text-[16px] leading-5 tracking-[-0.03em] align-middle text-[#181A2A]">
                Typography that matches your warm aesthetic
              </li>
              <li className="font-inter font-normal text-[16px] leading-5 tracking-[-0.03em] align-middle text-[#181A2A]">
                Social media templates in your style
              </li>
            </ol>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="cursor-pointer px-10 py-3 font-inter text-base font-semibold leading-5 tracking-normal uppercase text-[#2A2A2A] transition-all hover:bg-gray-50"
            style={{
              borderRadius: "16px",
              border: "1px solid #E4E4E4",
            }}
          >
            BACK
          </button>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="cursor-pointer px-10 py-3 rounded-xl font-inter text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all"
            style={{
              background:
                "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              borderImage:
                "linear-gradient(0deg, #8F00FF 0%, #DAABFF 99.37%) 1",
            }}
          >
            CONTINUE
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
