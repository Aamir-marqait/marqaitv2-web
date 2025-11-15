import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBranding } from "@/hooks/useBranding";
import LinearProgress from "@/components/ui/linear-progress";
import { generateBrandbookContent } from "@/utils/generateBrandbookContent";

export default function ExistingBrandDetails() {
  const { brandingData, setBrandDetailsData } = useBranding();
  const [targetAudience, setTargetAudience] = useState("");
  const [brandPersonality, setBrandPersonality] = useState("");
  const [coreValues, setCoreValues] = useState("");
  const [styleReferences, setStyleReferences] = useState("");
  const navigate = useNavigate();

  // Load data from context on mount
  useEffect(() => {
    if (brandingData.brandDetails.targetAudience) {
      setTargetAudience(brandingData.brandDetails.targetAudience);
    }
    if (brandingData.brandDetails.brandPersonality) {
      setBrandPersonality(brandingData.brandDetails.brandPersonality);
    }
    if (brandingData.brandDetails.coreValues) {
      setCoreValues(brandingData.brandDetails.coreValues);
    }
    if (brandingData.brandDetails.styleReferences) {
      setStyleReferences(brandingData.brandDetails.styleReferences);
    }
  }, [brandingData.brandDetails]);

  const handleContinue = async () => {
    // Save to context
    setBrandDetailsData({
      targetAudience,
      brandPersonality,
      coreValues,
      styleReferences,
    });

    // Generate brandbook content in background and store in localStorage
    // This will be ready by the time user reaches the brandbook slider
    try {
      console.log('🚀 Starting brandbook content generation (Existing Brand)...');

      // Clear any existing brandbook content first to ensure fresh generation
      const existingContent = localStorage.getItem('brandbookContent');
      if (existingContent) {
        console.log('🔄 Removing old brandbook content before generating new content');
        localStorage.removeItem('brandbookContent');
      }

      // Start generation (non-blocking)
      generateBrandbookContent({
        businessName: brandingData.newBrand.businessName || 'Your Business',
        industry: brandingData.newBrand.industry || 'General',
        targetAudience,
        brandPersonality,
        coreValues,
      }).then((content) => {
        // Store NEW content in localStorage (replaces any old content)
        localStorage.setItem('brandbookContent', JSON.stringify(content));
        console.log('✅ NEW brandbook content generated and stored in localStorage (Existing Brand)');
      }).catch((error) => {
        console.error('❌ Failed to generate brandbook content:', error);
        // Continue flow even if generation fails
      });

    } catch (error) {
      console.error('❌ Error starting brandbook generation:', error);
    }

    // Navigate immediately (don't wait for generation)
    navigate("/onboarding/existing-brand-color-palette");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={1} totalSteps={3} />
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Brand <span className="text-[#8F00FF]">Details</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          Help us understand your brand better
        </p>

        {/* Form Container */}
        <div
          className="w-full max-w-full bg-white rounded-[20px] p-8 mb-8"
          style={{
            boxShadow: "0px 10px 40px 0px #8F00FF26",
          }}
        >
          <div className="space-y-6">
            {/* Row 1: Target Audience and Brand Personality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Audience Input */}
              <div className="relative">
                <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                  Target Audience<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Young professionals, Parents"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Brand Personality Input */}
              <div className="relative">
                <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                  Brand Personality<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Friendly, Professional, Bold"
                  value={brandPersonality}
                  onChange={(e) => setBrandPersonality(e.target.value)}
                  className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            {/* Row 2: Core Values and Brand Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core Values Input */}
              <div className="relative">
                <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                  Core Values<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Innovation, Sustainability"
                  value={coreValues}
                  onChange={(e) => setCoreValues(e.target.value)}
                  className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Brand Tone Input */}
              <div className="relative">
                <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                  Brand Tone<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Minimalist, Vintage, Modern"
                  value={styleReferences}
                  onChange={(e) => setStyleReferences(e.target.value)}
                  className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

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
            disabled={
              !targetAudience ||
              !brandPersonality ||
              !coreValues ||
              !styleReferences
            }
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
