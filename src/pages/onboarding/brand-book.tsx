import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LinearProgress from "@/components/ui/linear-progress";

export default function BrandBook() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoPreview } = (location.state as { logoPreview?: string; logoFile?: string }) || {};
  const [selectedOption, setSelectedOption] = useState<"create" | "logo" | null>("create");

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    // Handle form submission and navigate based on selection
    console.log({ selectedOption });
    if (selectedOption === "create") {
      // User wants to create brand book - go to brand analysis
      navigate("/onboarding/brand-analysis", {
        state: { logoPreview }
      });
    } else {
      // User just wants to use logo - skip to step 2
      navigate("/onboarding/business-content-setup");
    }
  };

  return (
    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={1} totalSteps={3} />
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Brand <span className="text-[#8F00FF]">Book</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          Would you like us to create a complete brand book for you?
        </p>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Left Container - Logo Display */}
          <div
            className="w-full md:w-[400px] bg-white rounded-[20px] border border-[#E4E4E4] flex items-center justify-center p-8"
            style={{
              height: "359px",
            }}
          >
            {/* Display uploaded logo */}
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Uploaded logo"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  {/* Placeholder if no logo */}
                  <span className="text-gray-400 text-sm">Your Logo</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Container - Brand Book Includes */}
          <div
            className="w-full md:w-[465px] bg-white rounded-[20px] border border-[#E4E4E4] p-8"
            style={{
              height: "359px",
            }}
          >
            <h3 className="font-inter font-medium text-[20px] leading-[30px] align-middle text-[#0A0A0A] mb-6">
              Brand Book Includes:
            </h3>

            {/* List of includes */}
            <ol className="space-y-3 mb-8">
              <li className="font-inter font-normal text-[14px] leading-[21px] align-middle text-[#6B7280]">
                1. Color palette
              </li>
              <li className="font-inter font-normal text-[14px] leading-[21px] align-middle text-[#6B7280]">
                2. Typography guidelines
              </li>
              <li className="font-inter font-normal text-[14px] leading-[21px] align-middle text-[#6B7280]">
                3. Logo variations
              </li>
              <li className="font-inter font-normal text-[14px] leading-[21px] align-middle text-[#6B7280]">
                4. Usage examples
              </li>
              <li className="font-inter font-normal text-[14px] leading-[21px] align-middle text-[#6B7280]">
                5. Voice & tone
              </li>
            </ol>

            {/* Radio Options */}
            <div className="space-y-2">
              {/* Create Brand Book Option */}
              <label
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setSelectedOption("create")}
              >
                <div className="relative w-6 h-6">
                  <input
                    type="radio"
                    name="brandbook"
                    value="create"
                    checked={selectedOption === "create"}
                    onChange={() => setSelectedOption("create")}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === "create"
                        ? "border-[#8F00FF]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === "create" && (
                      <div className="w-3 h-3 rounded-full bg-[#8F00FF]" />
                    )}
                  </div>
                </div>
                <span className="font-inter font-normal text-[16px] leading-[30px] align-middle text-gray-800">
                  Yes, create my brand book{" "}
                  <span className="text-[#166534]">(Recommended)</span>
                </span>
              </label>

              {/* Just Use Logo Option */}
              <label
                className="flex items-center gap-3 cursor-pointer "
                onClick={() => setSelectedOption("logo")}
              >
                <div className="relative w-6 h-6">
                  <input
                    type="radio"
                    name="brandbook"
                    value="logo"
                    checked={selectedOption === "logo"}
                    onChange={() => setSelectedOption("logo")}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === "logo"
                        ? "border-[#8F00FF]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === "logo" && (
                      <div className="w-3 h-3 rounded-full bg-[#8F00FF]" />
                    )}
                  </div>
                </div>
                <span className="font-inter font-normal text-[16px] leading-[30px] align-middle text-gray-800">
                  No, I'll just use my logo
                </span>
              </label>
            </div>
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
            disabled={!selectedOption}
            className="cursor-pointer px-10 py-3 rounded-xl font-inter text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
