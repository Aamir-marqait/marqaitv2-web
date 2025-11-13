import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import LinearProgress from "@/components/ui/linear-progress";

export default function BrandbookPreview() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    navigate("/onboarding/business-content-setup");
  };

  return (
    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={1} totalSteps={3} />
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Brand <span className="text-[#8F00FF]">Book Preview</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          Your complete brand identity guide
        </p>

        {/* Main Container */}
        <div
          className="w-full max-w-4xl bg-white rounded-[20px] border border-[#E4E4E4] p-12 mb-8 flex flex-col items-center justify-center"
          style={{
            minHeight: "400px",
            boxShadow: "0px 10px 40px 0px #8F00FF26",
          }}
        >
          {/* Coming Soon Icon */}
          <div className="mb-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              }}
            >
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Coming Soon Text */}
          <h2 className="font-inter text-[32px] font-semibold leading-[120%] tracking-normal text-gray-800 mb-4 text-center">
            Brand Book Preview
          </h2>
          <p className="font-inter text-[18px] font-normal leading-[150%] tracking-normal text-[#6B7280] text-center max-w-md mb-8">
            Coming Soon
          </p>

          {/* Feature List */}
          <div className="w-full max-w-md">
            <p className="font-inter text-sm font-medium text-gray-700 mb-3 text-center">
              What you'll see here:
            </p>
            <ul className="space-y-2">
              <li className="font-inter text-sm text-[#6B7280] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F00FF]" />
                Interactive brand book slider
              </li>
              <li className="font-inter text-sm text-[#6B7280] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F00FF]" />
                Color palette showcase
              </li>
              <li className="font-inter text-sm text-[#6B7280] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F00FF]" />
                Typography guidelines
              </li>
              <li className="font-inter text-sm text-[#6B7280] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F00FF]" />
                Logo variations
              </li>
              <li className="font-inter text-sm text-[#6B7280] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F00FF]" />
                Usage examples
              </li>
            </ul>
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
    </div>
  );
}
