import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBranding } from "@/hooks/useBranding";
import LinearProgress from "@/components/ui/linear-progress";
import { brandContextService } from "@/api/services/brand-context";

export default function BusinessContentSetup() {
  const navigate = useNavigate();
  const { brandingData, setBusinessContentData } = useBranding();
  const [formData, setFormData] = useState({
    businessDescription: "",
    websiteUrl: "",
    productName: "",
    productDescription: "",
    productCategory: "",
    productPriceRange: "",
    productUrl: "",
    targetAgeRange: "",
    targetGender: "all",
    targetLocations: "",
    targetInterests: "",
    targetBehaviors: "",
    customerPainPoints: "",
    businessPhone: "",
    businessEmail: "",
    businessAddress: "",
    socialMediaFacebook: "",
    socialMediaInstagram: "",
    socialMediaLinkedin: "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = async () => {
    // Save to context
    setBusinessContentData(formData);

    // Call API to update business context
    const businessId = brandingData.businessId || localStorage.getItem('business_id');
    if (businessId) {
      try {
        console.log('📡 Updating business context via API...');

        const payload = {
          business_description: formData.businessDescription,
          website_url: formData.websiteUrl || undefined,
          primary_products_services: formData.productName ? [{
            name: formData.productName,
            description: formData.productDescription || '',
            category: formData.productCategory || '',
            price_range: formData.productPriceRange || '',
            url: formData.productUrl || '',
          }] : [],
          target_age_range: formData.targetAgeRange || undefined,
          target_gender: formData.targetGender,
          target_locations: formData.targetLocations ? formData.targetLocations.split(',').map(l => l.trim()) : [],
          target_interests: formData.targetInterests ? formData.targetInterests.split(',').map(i => i.trim()) : [],
          target_behaviors: formData.targetBehaviors ? formData.targetBehaviors.split(',').map(b => b.trim()) : [],
          customer_pain_points: formData.customerPainPoints ? formData.customerPainPoints.split(',').map(p => p.trim()) : [],
          business_phone: formData.businessPhone || undefined,
          business_email: formData.businessEmail || undefined,
          business_address: formData.businessAddress || undefined,
          social_media_handles: {
            facebook: formData.socialMediaFacebook || undefined,
            instagram: formData.socialMediaInstagram || undefined,
            linkedin: formData.socialMediaLinkedin || undefined,
          },
        };

        await brandContextService.updateBusinessContext(businessId, payload);
        console.log('✅ Business context updated successfully');

        // Set this business as primary
        await brandContextService.setPrimaryBusiness(businessId);
      } catch (error) {
        console.error('❌ Failed to update business context:', error);
        // Continue flow even if API fails
      }
    }

    navigate("/onboarding/media-gallery-setup");
  };

  const isFormValid = formData.businessDescription.trim() !== "";

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
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal font-inter text-black">
                Business Description<span className="text-red-500">*</span>
              </label>
              <textarea
                name="businessDescription"
                placeholder="Describe your business, what you do, and what makes you unique"
                value={formData.businessDescription}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>

            {/* Website URL */}
            <div className="relative">
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal font-inter text-black">
                Website URL
              </label>
              <input
                type="url"
                name="websiteUrl"
                placeholder="https://www.yourwebsite.com"
                value={formData.websiteUrl}
                onChange={handleChange}
                className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Product/Service Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-inter text-sm font-semibold text-gray-800">Primary Product/Service</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Product/Service Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    placeholder="e.g., AI Campaign Generator"
                    value={formData.productName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Category
                  </label>
                  <input
                    type="text"
                    name="productCategory"
                    placeholder="e.g., Marketing Automation"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                  Description
                </label>
                <textarea
                  name="productDescription"
                  placeholder="Brief description of your product/service"
                  value={formData.productDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Price Range
                  </label>
                  <input
                    type="text"
                    name="productPriceRange"
                    placeholder="e.g., $99-$499/month"
                    value={formData.productPriceRange}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Product URL
                  </label>
                  <input
                    type="url"
                    name="productUrl"
                    placeholder="https://www.yoursite.com/product"
                    value={formData.productUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Target Audience Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-inter text-sm font-semibold text-gray-800">Target Audience</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Age Range
                  </label>
                  <input
                    type="text"
                    name="targetAgeRange"
                    placeholder="25-45 (format: min-max)"
                    value={formData.targetAgeRange}
                    onChange={handleChange}
                    pattern="^\d+-\d+$"
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-3">Format: 25-45 (minimum-maximum)</p>
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Gender
                  </label>
                  <select
                    name="targetGender"
                    value={formData.targetGender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 focus:outline-none focus:border-gray-400"
                  >
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                  Target Locations
                </label>
                <input
                  type="text"
                  name="targetLocations"
                  placeholder="e.g., India, USA, UK (comma separated)"
                  value={formData.targetLocations}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                  Target Interests
                </label>
                <input
                  type="text"
                  name="targetInterests"
                  placeholder="e.g., entrepreneurship, digital marketing, AI (comma separated)"
                  value={formData.targetInterests}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                  Target Behaviors
                </label>
                <input
                  type="text"
                  name="targetBehaviors"
                  placeholder="e.g., online business owners, content creators (comma separated)"
                  value={formData.targetBehaviors}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                  Customer Pain Points
                </label>
                <input
                  type="text"
                  name="customerPainPoints"
                  placeholder="e.g., Marketing is expensive, Complex tools (comma separated)"
                  value={formData.customerPainPoints}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-inter text-sm font-semibold text-gray-800">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    name="businessPhone"
                    placeholder="+91-1234567890"
                    value={formData.businessPhone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="businessEmail"
                    placeholder="hello@yourbusiness.com"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                  Business Address
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  placeholder="City, Country"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-inter text-sm font-semibold text-gray-800">Social Media Handles</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="socialMediaFacebook"
                    placeholder="username"
                    value={formData.socialMediaFacebook}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="socialMediaInstagram"
                    placeholder="username"
                    value={formData.socialMediaInstagram}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal font-inter text-black">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    name="socialMediaLinkedin"
                    placeholder="company/username"
                    value={formData.socialMediaLinkedin}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E4E4E4] bg-white p-3 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
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
