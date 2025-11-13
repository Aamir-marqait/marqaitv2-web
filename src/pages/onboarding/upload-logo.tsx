import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { useBranding } from "@/hooks/useBranding";
import LinearProgress from "@/components/ui/linear-progress";

export default function UploadLogo() {
  const navigate = useNavigate();
  const { brandingData, setExistingBrandLogo } = useBranding();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    // Save logo to context
    if (selectedFile) {
      setExistingBrandLogo(selectedFile);
    }
    navigate("/onboarding/brand-book");
  };

  return (
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
            disabled={!selectedFile}
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
