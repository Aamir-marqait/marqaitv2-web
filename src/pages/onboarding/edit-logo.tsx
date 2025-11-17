import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Loader2 } from "lucide-react";
import { fal } from "@fal-ai/client";
import BrandbookSlider from "@/components/onboarding/BrandbookSlider";
import { useLogo } from "@/contexts/LogoContext";
import { useBranding } from "@/hooks/useBranding";
import { brandContextService } from "@/api/services/brand-context";
import { removeWhiteBackground, dataURLtoFile } from "@/utils/removeBackground";
import { logoUploadService } from "@/api/services/logo-upload";

export default function EditLogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLogoUrl, setSelectedLogoUrl } = useLogo();
  const { brandingData } = useBranding();
  const [prompt, setPrompt] = useState("");
  const [showSlider, setShowSlider] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [originalLogoUrl, setOriginalLogoUrl] = useState<string | null>(null); // Store clean URL for API calls
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState(0); // Force image re-render

  // Configure fal-ai with API key
  useEffect(() => {
    fal.config({
      credentials: import.meta.env.VITE_FAL_KEY
    });
  }, []);

  // Get logo from location state or context (only on initial mount)
  useEffect(() => {
    const stateLogoUrl = (location.state as { logoUrl?: string })?.logoUrl;
    if (stateLogoUrl && !logoUrl) {
      // Only set if logoUrl is not already set
      const cleanUrl = stateLogoUrl.split('?')[0];
      setOriginalLogoUrl(cleanUrl);
      setLogoUrl(stateLogoUrl);
      console.log('🎬 Initial logo loaded from state:', stateLogoUrl);
    } else if (selectedLogoUrl && !logoUrl) {
      // Only set if logoUrl is not already set
      const cleanUrl = selectedLogoUrl.split('?')[0];
      setOriginalLogoUrl(cleanUrl);
      setLogoUrl(selectedLogoUrl);
      console.log('🎬 Initial logo loaded from context:', selectedLogoUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]); // Remove selectedLogoUrl from dependencies to prevent loops

  // Debug: Log when logoUrl changes
  useEffect(() => {
    console.log('🔍 logoUrl state changed to:', logoUrl);
    console.log('🔍 imageKey is now:', imageKey);
  }, [logoUrl, imageKey]);

  const handleRunPrompt = async () => {
    if (!prompt.trim() || !originalLogoUrl) {
      setEditError("Please enter a prompt and ensure a logo is selected");
      return;
    }

    try {
      setIsEditing(true);
      setEditError(null);
      console.log('🎨 Starting logo edit with prompt:', prompt);
      console.log('🖼️ Using logo URL for API:', originalLogoUrl);

      // Call fal-ai nano-banana/edit API using the clean original URL
      const result = await fal.subscribe("fal-ai/nano-banana/edit", {
        input: {
          prompt: prompt,
          image_urls: [originalLogoUrl], // Use clean URL without cache-buster
          num_images: 1,
          aspect_ratio: "1:1",
          output_format: "png",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log('📊 Edit progress:', update.status);
            update.logs?.map((log) => log.message).forEach(console.log);
          }
        },
      });

      console.log('✅ Logo edit result:', result.data);

      // Update the logo with the edited version
      if (result.data?.images?.[0]?.url) {
        const editedLogoUrl = result.data.images[0].url;
        console.log('🎨 New logo URL from API:', editedLogoUrl);

        const timestamp = Date.now();
        const displayUrl = `${editedLogoUrl}?v=${timestamp}`;

        // Update states - order matters!
        setImageKey(prev => prev + 1); // Increment key first
        setOriginalLogoUrl(editedLogoUrl); // Store clean URL
        setLogoUrl(displayUrl); // Set display URL with cache buster

        // Update context last (after local state is set)
        setSelectedLogoUrl(editedLogoUrl);

        console.log('✅ Local state updated with:', displayUrl);
        console.log('✅ Context updated with:', editedLogoUrl);
        setPrompt(""); // Clear prompt after successful edit
      } else {
        setEditError("Failed to edit logo. Please try again.");
      }

      setIsEditing(false);
    } catch (error: any) {
      console.error('❌ Error editing logo:', error);
      setEditError(error.message || "Failed to edit logo. Please try again.");
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (!originalLogoUrl) {
      setSaveError("No logo to save. Please select a logo first.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      // Get business_id from context or localStorage
      let businessId = brandingData.businessId;
      if (!businessId) {
        businessId = localStorage.getItem('business_id');
        console.log('📦 Business ID from localStorage:', businessId);
      } else {
        console.log('📦 Business ID from context:', businessId);
      }

      if (!businessId) {
        setSaveError('Business ID not found. Please complete the previous steps.');
        console.error('❌ No business_id found');
        setIsSaving(false);
        return;
      }

      // Step 1: Remove white background from the edited logo
      let finalLogoUrl = originalLogoUrl;
      try {
        console.log('🎨 Removing white background from edited logo...');
        const logoWithoutBg = await removeWhiteBackground(originalLogoUrl, {
          threshold: 240,  // Detect white pixels (240-255)
          tolerance: 30,   // Remove near-white pixels too
          quality: 1,      // Maximum quality
        });

        console.log('✅ Background removed successfully');

        // Step 2: Convert base64 to File
        const logoFile = dataURLtoFile(logoWithoutBg, `edited-logo-${Date.now()}.png`);
        console.log('📁 Created file:', logoFile.name, '-', (logoFile.size / 1024 / 1024).toFixed(2), 'MB');

        // Step 3: Upload the processed logo file
        console.log('📤 Uploading processed logo to server...');
        const uploadResponse = await logoUploadService.uploadLogo(businessId, logoFile);
        finalLogoUrl = uploadResponse.selected_logo_url;

        console.log('✅ Logo uploaded successfully:', finalLogoUrl);

        // Update displayed logo with uploaded version
        setLogoUrl(finalLogoUrl + '?v=' + Date.now());
        setOriginalLogoUrl(finalLogoUrl);
        setSelectedLogoUrl(finalLogoUrl);
        setImageKey(prev => prev + 1);

      } catch (bgError) {
        console.error('⚠️ Background removal/upload failed, saving original logo:', bgError);
        // Fallback: save original FAL-AI URL if upload fails
        console.log('💾 Saving original logo URL to database:', originalLogoUrl);
        await brandContextService.saveLogoUrl(businessId, originalLogoUrl);
      }

      setIsSaving(false);

      // Step 4: Open brandbook slider with final logo
      setShowSlider(true);
    } catch (error: any) {
      console.error('❌ Failed to save logo:', error);
      setSaveError(error.message || 'Failed to save logo. Please try again.');
      setIsSaving(false);
    }
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
            <div className="flex items-center justify-center bg-white rounded-[20px] border border-[#E4E4E4] shrink-0 w-full lg:w-[397px] h-[300px] md:h-[350px] lg:h-[400px] p-8 relative">
              {isEditing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[20px] flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#8F00FF] animate-spin mx-auto mb-3" />
                    <p className="font-inter text-sm font-medium text-gray-700">
                      Editing your logo...
                    </p>
                  </div>
                </div>
              )}
              {logoUrl ? (
                <img
                  key={`logo-${imageKey}`}
                  src={logoUrl}
                  alt="Selected logo"
                  className="max-w-full max-h-full object-contain"
                  crossOrigin="anonymous"
                  onLoad={(e) => {
                    console.log('✅ Image loaded:', logoUrl);
                    console.log('✅ Image element src:', (e.target as HTMLImageElement).src);
                  }}
                  onError={(e) => {
                    console.error('❌ Image failed to load:', logoUrl);
                    console.error('❌ Image element src:', (e.target as HTMLImageElement).src);
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">LOREM IPSUM</div>
                  <div className="text-sm text-gray-500">
                    Logo preview will appear here
                  </div>
                </div>
              )}
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
                  disabled={isEditing}
                  className="w-full h-24 md:h-32 rounded-xl border-none bg-[#F3F3F5] px-3 md:px-4 py-3 md:py-4 font-inter font-normal text-[14px] md:text-[16px] leading-[17.5px] resize-none focus:outline-none placeholder:text-gray-400 disabled:opacity-50"
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                  <p className="font-inter font-normal text-[10px] md:text-[12px] leading-[17.5px] text-[#717182]">
                    The result will be reflected on left side
                  </p>
                  <button
                    onClick={handleRunPrompt}
                    disabled={isEditing || !prompt.trim() || !logoUrl}
                    className="px-4 md:px-6 py-2 rounded-lg font-inter text-xs md:text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                    }}
                  >
                    {isEditing ? (
                      <>
                        <Loader2 className="w-3 md:w-4 h-3 md:h-4 animate-spin" />
                        Editing...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 md:w-4 h-3 md:h-4" />
                        Run Prompt
                      </>
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {editError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs md:text-sm text-red-600 font-inter">{editError}</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <p className="font-inter text-xs md:text-sm text-gray-700 shrink-0">
                  Quick actions:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickAction("Make it more modern")}
                    disabled={isEditing}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-black/10 cursor-pointer bg-white font-inter font-medium text-[10px] md:text-[12px] leading-[100%] text-center text-[#181A2A] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Make it more modern
                  </button>
                  <button
                    onClick={() => handleQuickAction("Try different color")}
                    disabled={isEditing}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-black/10 cursor-pointer bg-white font-inter font-medium text-[10px] md:text-[12px] leading-[100%] text-center text-[#181A2A] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Try different color
                  </button>
                  <button
                    onClick={() => handleQuickAction("Simplify the design")}
                    disabled={isEditing}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-black/10 cursor-pointer bg-white font-inter font-medium text-[10px] md:text-[12px] leading-[100%] text-center text-[#181A2A] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Simplify the design
                  </button>
                  <button
                    onClick={() => handleQuickAction("Make it bolder")}
                    disabled={isEditing}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border cursor-pointer border-black/10 bg-white font-inter font-medium text-[10px] md:text-[12px] leading-[100%] text-center text-[#181A2A] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Make it bolder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex flex-col items-center w-full max-w-[1250px] px-4 gap-3">
          {/* Error Message */}
          {saveError && (
            <div className="w-full max-w-md p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-inter text-center">{saveError}</p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !originalLogoUrl}
            className="px-12 md:px-16 py-3 rounded-xl cursor-pointer font-inter text-sm md:text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all hover:opacity-90 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background:
                "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
            }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                SAVING...
              </>
            ) : (
              'SAVE'
            )}
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
