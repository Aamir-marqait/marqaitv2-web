import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBranding } from "@/hooks/useBranding";
import LinearProgress from "@/components/ui/linear-progress";

export default function BusinessContentSetup() {
  const navigate = useNavigate();
  const { brandingData, setBusinessContentData } = useBranding();
  const [formData, setFormData] = useState({
    businessDescription: "",
    offerings: "",
    customers: "",
    businessGoal: "",
    marketingBudget: "",
  });

  // Load data from context on mount and cleanup brandbook content
  useEffect(() => {
    if (brandingData.businessContent.businessDescription) {
      setFormData(brandingData.businessContent);
    }

    // Clean up brandbook content from localStorage when user reaches Step 2
    // This ensures old content doesn't persist after the brandbook has been viewed
    const brandbookContent = localStorage.getItem('brandbookContent');
    if (brandbookContent) {
      console.log('🧹 Cleaning up brandbook content from localStorage');
      localStorage.removeItem('brandbookContent');
    }
  }, [brandingData.businessContent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    // Save to context
    setBusinessContentData(formData);
    navigate("/onboarding/media-gallery-setup");
  };

  const isFormValid =
    formData.businessDescription &&
    formData.offerings &&
    formData.customers &&
    formData.businessGoal &&
    formData.marketingBudget;

  return (
    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={2} totalSteps={3} />

        {/* Header */}
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Tell Us About <span className="text-[#8F00FF]">Your Business</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          Help us understand your business better so we can create personalized marketing content
        </p>

        {/* Main Container */}
        <div
          className="w-full max-w-full bg-white rounded-[20px] p-8 mb-8"
          style={{
            boxShadow: "0px 10px 40px 0px #8F00FF26",
          }}
        >
          <div className="space-y-6">
            {/* Business Description */}
            <div className="relative">
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                Business Description<span className="text-red-500">*</span>
              </label>
              <textarea
                name="businessDescription"
                placeholder="Describe your business, what you do, and what makes you unique"
                value={formData.businessDescription}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[140%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>

            {/* What do you offer? */}
            <div className="relative">
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                What do you offer?<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="offerings"
                placeholder="e.g., Handmade jewelry, Consulting services, Mobile apps"
                value={formData.offerings}
                onChange={handleChange}
                className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Who are your customers? */}
            <div className="relative">
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                Who are your customers?<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customers"
                placeholder="e.g., Young professionals, Small business owners, Parents"
                value={formData.customers}
                onChange={handleChange}
                className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* What's your main business goal? */}
            <div className="relative">
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                What's your main business goal?<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessGoal"
                placeholder="e.g., Increase brand awareness, Generate more sales, Build community"
                value={formData.businessGoal}
                onChange={handleChange}
                className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Monthly marketing budget? */}
            <div className="relative">
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                Monthly marketing budget?<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="marketingBudget"
                placeholder="e.g., $500-$1000, $5000+, Just getting started"
                value={formData.marketingBudget}
                onChange={handleChange}
                className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pb-20">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="cursor-pointer px-6 md:px-10 py-3 font-inter text-sm md:text-base font-semibold leading-5 tracking-normal uppercase text-[#2A2A2A] transition-all hover:bg-gray-50"
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
            disabled={!isFormValid}
            className="cursor-pointer px-6 md:px-10 py-3 rounded-xl font-inter text-sm md:text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
