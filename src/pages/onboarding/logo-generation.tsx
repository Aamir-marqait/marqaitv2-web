import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { fal } from "@fal-ai/client";
import LinearProgress from "@/components/ui/linear-progress";
import BrandbookSlider from "@/components/onboarding/BrandbookSlider";
import LogoVariantsLoadingScreen from "@/components/onboarding/LogoVariantsLoadingScreen";
import { useLogo } from "@/contexts/LogoContext";
import { useBranding } from "@/hooks/useBranding";
import { brandContextService } from "@/api/services/brand-context";
import { removeWhiteBackground, dataURLtoBlob } from "@/utils/removeBackground";

export default function LogoGeneration() {
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null);
  const [hoveredLogo, setHoveredLogo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [logos, setLogos] = useState<string[]>([]);
  const [showSlider, setShowSlider] = useState(false);
  const [generatingVariants, setGeneratingVariants] = useState(false);
  const [variantsProgress, setVariantsProgress] = useState(0);
  const [logoVariants, setLogoVariants] = useState<{
    blackBg: string;
    whiteBg: string;
    lightRedBg: string;
    yellowBg: string;
  } | null>(null);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const { setSelectedLogoUrl } = useLogo();
  const { brandingData } = useBranding();

  // Configure fal-ai with API key
  useEffect(() => {
    fal.config({
      credentials: import.meta.env.VITE_FAL_KEY
    });
  }, []);

  useEffect(() => {
    // Check if logo URLs are available from BrandingContext
    const generatedLogoUrls = brandingData.logo.generatedLogoUrls;

    if (generatedLogoUrls && generatedLogoUrls.length === 6) {
      console.log('✅ Using generated logo URLs from API:', generatedLogoUrls);
      setLogos(generatedLogoUrls);
      setLoading(false);
      setLogoError(false);
    } else if (generatedLogoUrls && generatedLogoUrls.length === 0) {
      // API failed - no logos generated
      console.log('❌ Logo generation failed');
      setLoading(false);
      setLogoError(true);
    }
    // If generatedLogoUrls is undefined/null, keep showing skeleton loader
    // (API call still in progress)
  }, [brandingData.logo.generatedLogoUrls]);

  const generateLogoVariants = async (logoUrl: string) => {
    try {
      console.log('🚀 Starting logo variant generation for:', logoUrl);
      setGeneratingVariants(true);
      setVariantsProgress(0);

      // TODO: When logo API is integrated, replace logoUrl with publicly accessible URL
      // Currently using local path which causes ValidationError in fal-ai
      // fal-ai requires: https://... or uploaded to fal.storage
      // Example: const uploadedUrl = await fal.storage.upload(logoFile);

      // Generate 4 variants in parallel with different prompts
      const prompts = [
        {
          key: 'blackBg',
          prompt: 'Optimize this logo to look professional and clear on a pure black background. Enhance contrast, add white or light colored outlines if needed, ensure all elements are visible and crisp.',
        },
        {
          key: 'whiteBg',
          prompt: 'Optimize this logo to look professional and clear on a pure white background. Enhance contrast, add dark outlines if needed, ensure all elements are visible and crisp.',
        },
        {
          key: 'lightRedBg',
          prompt: 'Optimize this logo to look professional and clear on a light red (#FEE2E2) background. Adjust colors for optimal contrast and visibility, ensure it stands out beautifully.',
        },
        {
          key: 'yellowBg',
          prompt: 'Optimize this logo to look professional and clear on a light yellow (#FEF3C7) background. Adjust colors for optimal contrast and visibility, ensure it stands out beautifully.',
        },
      ];

      const results: any = {
        blackBg: '',
        whiteBg: '',
        lightRedBg: '',
        yellowBg: '',
      };

      // Generate each variant
      for (let i = 0; i < prompts.length; i++) {
        const { key, prompt } = prompts[i];
        setVariantsProgress((i / prompts.length) * 100);
        console.log(`🎨 Generating ${key} variant (${i + 1}/${prompts.length})...`);

        try {
          const result = await fal.subscribe("fal-ai/nano-banana/edit", {
            input: {
              prompt: prompt,
              image_urls: [logoUrl],
              num_images: 1,
              aspect_ratio: "1:1",
              output_format: "png",
            },
            logs: true,
            onQueueUpdate: (update) => {
              console.log(`📊 ${key} queue update:`, update.status);
            },
          });

          console.log(`✅ ${key} result:`, result.data);

          // Store the generated image URL
          if (result.data?.images?.[0]?.url) {
            results[key] = result.data.images[0].url;
            console.log(`✅ ${key} variant generated:`, results[key]);
          } else {
            // Fallback to original logo if generation fails
            results[key] = logoUrl;
            console.warn(`⚠️ ${key} variant failed, using original logo`);
          }
        } catch (error) {
          console.error(`❌ Error generating ${key} variant:`, error);
          // Fallback to original logo
          results[key] = logoUrl;
        }
      }

      setVariantsProgress(100);
      setLogoVariants(results);
      setGeneratingVariants(false);

      // Open slider after variants are generated
      setTimeout(() => {
        setShowSlider(true);
      }, 300);
    } catch (error) {
      console.error("Error generating logo variants:", error);
      setGeneratingVariants(false);
      // Still open slider with original logos as fallback
      setTimeout(() => {
        setShowSlider(true);
      }, 300);
    }
  };

  const handleLogoClick = async (idx: number, isEditClick: boolean) => {
    if (isEditClick) {
      // Navigate to edit page
      setSelectedLogo(idx);
      navigate("/onboarding/edit-logo");
    } else {
      // Select logo and generate variants
      setSelectedLogo(idx);
      const selectedLogoUrl = logos[idx];

      try {
        console.log('🎨 Removing white background from logo...');
        setGeneratingVariants(true);
        setVariantsProgress(10);

        // Step 1: Remove white background from the selected logo
        const logoWithoutBg = await removeWhiteBackground(selectedLogoUrl, {
          threshold: 240,  // Detect white pixels (240-255)
          tolerance: 30,   // Remove near-white pixels too
          quality: 1,      // Maximum quality
        });

        console.log('✅ Background removed successfully');
        setVariantsProgress(25);

        // Store the processed logo URL in context
        setSelectedLogoUrl(logoWithoutBg);

        // Step 2: Save processed logo URL to backend
        const businessId = brandingData.businessId || localStorage.getItem('business_id');
        if (businessId) {
          try {
            console.log('💾 Saving processed logo (transparent background) to business profile...');

            // Convert base64 to blob for upload
            const blob = dataURLtoBlob(logoWithoutBg);
            const formData = new FormData();
            formData.append('logo', blob, `logo-${Date.now()}.png`);

            // TODO: Update this when you have an upload endpoint
            // For now, we'll save the data URL directly
            await brandContextService.saveLogoUrl(businessId, logoWithoutBg);

            console.log('✅ Processed logo saved to database');
          } catch (error) {
            console.error('❌ Failed to save logo URL:', error);
            // Continue flow even if save fails
          }
        }

        setVariantsProgress(40);

        // Step 3: Generate variants with the transparent background logo
        console.log('🎨 Generating logo variants with transparent background...');
        await generateLogoVariants(logoWithoutBg);

      } catch (error) {
        console.error('❌ Error processing logo:', error);
        // Fallback: use original logo if background removal fails
        setSelectedLogoUrl(selectedLogoUrl);

        // Save original logo to backend
        const businessId = brandingData.businessId || localStorage.getItem('business_id');
        if (businessId) {
          try {
            await brandContextService.saveLogoUrl(businessId, selectedLogoUrl);
          } catch (err) {
            console.error('❌ Failed to save logo URL:', err);
          }
        }

        // Continue with original logo
        generateLogoVariants(selectedLogoUrl);
      }
    }
  };

  const handleCloseSlider = () => {
    setShowSlider(false);
  };

  return (
    <>
      {/* Loading Screen for Logo Variants Generation */}
      {generatingVariants && (
        <LogoVariantsLoadingScreen progress={variantsProgress} />
      )}

      <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
        <div className="w-full max-w-4xl mx-auto">
          <LinearProgress step={1} totalSteps={3} />
          <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
            Choose Your <span className="text-[#8F00FF]">Logo</span>
          </h1>
          <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
            {loading
              ? "AI is generating your brand logos..."
              : "Select the logo that best represents your brand"}
          </p>

        {/* Logos Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading
            ? // Skeleton Loading
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[20px] overflow-hidden"
                  style={{
                    boxShadow: "0px 4px 12px 0px #00000010",
                    height: "200px",
                  }}
                >
                  {/* Skeleton for logo */}
                  <div className="w-full h-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                </div>
              ))
            : logoError
            ? // Error State - Something went wrong
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[20px] overflow-hidden flex items-center justify-center"
                  style={{
                    boxShadow: "0px 4px 12px 0px #00000010",
                    height: "200px",
                  }}
                >
                  <div className="text-center px-4">
                    <p className="font-inter text-sm font-semibold text-red-500 mb-2">
                      Something went wrong
                    </p>
                    <p className="font-inter text-xs text-gray-500">
                      Failed to generate logo
                    </p>
                  </div>
                </div>
              ))
            : // Actual Logos
              logos.map((logo, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredLogo(idx)}
                  onMouseLeave={() => setHoveredLogo(null)}
                  className={`cursor-pointer rounded-[20px] overflow-hidden transition-all relative group ${
                    selectedLogo === idx
                      ? "ring-4 ring-[#8F00FF]"
                      : "ring-1 ring-[#E4E4E4]"
                  }`}
                  style={{
                    boxShadow:
                      selectedLogo === idx
                        ? "0px 10px 40px 0px #8F00FF40"
                        : "0px 4px 12px 0px #00000010",
                    height: "200px",
                  }}
                >
                  {/* Logo Preview - clickable area for selection */}
                  <div
                    onClick={() => handleLogoClick(idx, false)}
                    className="w-full h-full bg-white flex items-center justify-center"
                  >
                    <img
                      src={logo}
                      alt={`Brand Logo`}
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>

                  {/* Edit CTA - appears on hover at bottom */}
                  {hoveredLogo === idx && (
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogoClick(idx, true);
                        }}
                        className="px-3 py-1.5 rounded-lg font-inter text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-all hover:scale-110"
                        style={{
                          background:
                            "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                        }}
                      >
                        <Pencil className="w-3 h-3 text-white" />
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>

        {/* Brandbook Slider */}
        <BrandbookSlider
          isOpen={showSlider}
          onClose={handleCloseSlider}
          logoVariants={logoVariants}
        />
      </div>
    </>
  );
}
