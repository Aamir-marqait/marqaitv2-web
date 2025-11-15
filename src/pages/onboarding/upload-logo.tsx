import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2 } from "lucide-react";
import { fal } from "@fal-ai/client";
import { useBranding } from "@/hooks/useBranding";
import { useLogo } from "@/contexts/LogoContext";
import LinearProgress from "@/components/ui/linear-progress";
import BrandbookSlider from "@/components/onboarding/BrandbookSlider";
import LogoVariantsLoadingScreen from "@/components/onboarding/LogoVariantsLoadingScreen";
import { logoUploadService } from "@/api/services/logo-upload";

export default function UploadLogo() {
  const navigate = useNavigate();
  const { brandingData, setExistingBrandLogo } = useBranding();
  const { setSelectedLogoUrl } = useLogo();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [, setUploadedLogoUrl] = useState<string | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [logoVariants, setLogoVariants] = useState<{
    blackBg: string;
    whiteBg: string;
    lightRedBg: string;
    yellowBg: string;
  } | null>(null);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);
  const [variantsProgress, setVariantsProgress] = useState(0);

  // Configure fal-ai with API key
  useEffect(() => {
    fal.config({
      credentials: import.meta.env.VITE_FAL_KEY
    });
  }, []);

  // Load data from context on mount
  useEffect(() => {
    if (brandingData.existingBrandLogo) {
      setSelectedFile(brandingData.existingBrandLogo);
      // Create preview from file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(brandingData.existingBrandLogo);
    }
  }, [brandingData.existingBrandLogo]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const generateLogoVariants = async (logoUrl: string) => {
    try {
      console.log('🚀 Starting logo variant generation for uploaded logo:', logoUrl);
      setIsGeneratingVariants(true);
      setVariantsProgress(0);

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
      setIsGeneratingVariants(false);

      // Open slider after variants are generated
      setTimeout(() => {
        setShowSlider(true);
      }, 300);
    } catch (error) {
      console.error("Error generating logo variants:", error);
      setIsGeneratingVariants(false);
      // Still open slider with original logo as fallback
      setLogoVariants({
        blackBg: logoUrl,
        whiteBg: logoUrl,
        lightRedBg: logoUrl,
        yellowBg: logoUrl,
      });
      setTimeout(() => {
        setShowSlider(true);
      }, 300);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = async () => {
    if (!selectedFile) return;

    // Validate file
    const validationError = logoUploadService.validateLogoFile(selectedFile);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    // Check if business_id exists in context or localStorage
    let businessId = brandingData.businessId;
    if (!businessId) {
      // Fallback to localStorage
      businessId = localStorage.getItem('business_id');
      console.log('📦 Business ID from localStorage:', businessId);
    } else {
      console.log('📦 Business ID from context:', businessId);
    }

    if (!businessId) {
      setUploadError('Business ID not found. Please complete the previous steps.');
      console.error('❌ No business_id found in context or localStorage');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // Upload logo to server
      console.log('📤 Uploading logo for business_id:', businessId);
      const response = await logoUploadService.uploadLogo(businessId, selectedFile);

      console.log('✅ Logo upload response:', response);

      // Save logo URL and file to context
      setUploadedLogoUrl(response.selected_logo_url);
      setExistingBrandLogo(selectedFile);

      // Set logo URL in LogoContext so slides can access it
      setSelectedLogoUrl(response.selected_logo_url);
      console.log('✅ Logo URL set in LogoContext:', response.selected_logo_url);

      setIsUploading(false);

      // Generate variants using fal-ai with uploaded logo URL
      await generateLogoVariants(response.selected_logo_url);
    } catch (error: any) {
      console.error('❌ Logo upload failed:', error);
      setUploadError(error.message || 'Failed to upload logo. Please try again.');
      setIsUploading(false);
    }
  };

  const handleCloseSlider = () => {
    setShowSlider(false);
    navigate("/onboarding/brand-book");
  };

  return (
    <>
      {/* Loading Screen for Logo Variants Generation */}
      {isGeneratingVariants && (
        <LogoVariantsLoadingScreen progress={variantsProgress} />
      )}

    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={1} totalSteps={3} />
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Upload <span className="text-[#8F00FF]">Logo</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          Upload your brand logo to get started
        </p>

        {/* Main Container */}
        <div
          className="w-full max-w-full bg-white rounded-[20px] p-8 mb-8"
          style={{
            boxShadow: "0px 10px 40px 0px #8F00FF26",
          }}
        >
          {/* Upload Container */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full bg-white rounded-[20px] border border-dashed border-[#D9D9D9] flex flex-col items-center justify-center cursor-pointer hover:border-[#8F00FF] transition-colors relative overflow-hidden"
            style={{
              maxWidth: "792px",
              height: "250px",
              margin: "0 auto",
            }}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />

            {/* Show image preview if available */}
            {imagePreview ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={imagePreview}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
              >
                {/* Upload Icon */}
                <Upload className="w-12 h-12 text-[#8F00FF] mb-4" />

                {/* Upload Text */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-inter font-medium text-base leading-[100%] underline text-[#8F00FF]">
                    Choose a File
                  </span>
                  <span className="font-inter font-medium text-base leading-[100%] text-[#6B7280]">
                    Or
                  </span>
                  <span className="font-inter font-medium text-base leading-[100%] text-gray-700">
                    Drag & Drop
                  </span>
                </div>

                {/* Supported Files Text */}
                <p className="font-inter font-normal text-xs leading-[100%] text-center text-[#6B7280]">
                  Supported files: PDF, JPG, PNG
                </p>

                {/* Display selected file name for non-image files */}
                {selectedFile && !imagePreview && (
                  <p className="mt-4 font-inter font-medium text-sm text-[#8F00FF]">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </label>
            )}
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-inter">{uploadError}</p>
            </div>
          )}
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
            disabled={!selectedFile || isUploading}
            className="cursor-pointer px-10 py-3 rounded-xl font-inter text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              background:
                "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              borderImage:
                "linear-gradient(0deg, #8F00FF 0%, #DAABFF 99.37%) 1",
            }}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                UPLOADING...
              </>
            ) : (
              'CONTINUE'
            )}
          </button>
        </div>
      </div>

      {/* Brandbook Slider with Logo Variants */}
      <BrandbookSlider
        isOpen={showSlider}
        onClose={handleCloseSlider}
        logoVariants={logoVariants}
      />
    </div>
    </>
  );
}
