import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import LinearProgress from "@/components/ui/linear-progress";
import { useMediaGallery } from "@/hooks/useMediaGallery";
import type { MediaFolder } from "@/contexts/MediaGalleryContext";
import uploadIcon from "@/assets/upload.png";
import imgIcon from "@/assets/img.png";

const folders: { id: MediaFolder; label: string }[] = [
  { id: "products", label: "Products" },
  { id: "venue", label: "Venue" },
  { id: "team", label: "Team" },
  { id: "events", label: "Events" },
];

export default function MediaGallerySetup() {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder>("products");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mediaByFolder, addMedia, removeMedia, getMediaForFolder } =
    useMediaGallery();
  const currentFolderMedia = getMediaForFolder(selectedFolder);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSkip = () => {
    navigate("/onboarding/complete");
  };

  const handleContinue = () => {
    console.log("Completed onboarding with media:", mediaByFolder);
    navigate("/onboarding/complete");
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      const isValid =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isValidExtension = /\.(jpg|jpeg|png|gif|pdf|mp4|mov|avi)$/i.test(
        file.name
      );
      return isValid || isValidExtension;
    });

    if (validFiles.length > 0) {
      addMedia(selectedFolder, validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveMedia = (fileId: string) => {
    removeMedia(selectedFolder, fileId);
  };

  return (
    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-6xl mx-auto">
        <LinearProgress step={3} totalSteps={3} />

        {/* Header */}
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Add Your <span className="text-[#8F00FF]">Photos & Videos</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          Upload media that represents your business
        </p>

        {/* Main Container */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left Sidebar - Folders */}
          <div className="w-full lg:w-[250px] h-fit bg-white rounded-xl border border-[#E4E4E4] p-6 flex flex-col gap-6 shadow-[0px_10px_40px_0px_rgba(143,0,255,0.15)]">
            <h2 className="font-inter text-[20px] font-semibold leading-[150%] tracking-[0%] text-[#11001E]">
              Folders
            </h2>
            <div className="flex flex-col gap-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-inter text-[16px] leading-[150%] tracking-[0%] transition-all ${
                    selectedFolder === folder.id
                      ? "bg-[#8F00FF] text-white font-medium"
                      : "text-[#393F47] font-normal hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {folder.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Upload Area */}
          <div className="flex-1 bg-white rounded-[20px] p-8 shadow-[0px_10px_40px_0px_rgba(143,0,255,0.15)]">
            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 mb-6 transition-all cursor-pointer ${
                isDragging
                  ? "border-[#8F00FF] bg-[#F3E8FF]"
                  : "border-[#D9D9D9] bg-white"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={(e) => {
                  handleFileSelect(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center text-center pointer-events-none">
                {/* Upload Icon */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-[rgba(143,0,255,0.1)]">
                  <img src={uploadIcon} alt="Upload" className="w-8 h-8" />
                </div>

                {/* Upload Text */}
                <p className="font-inter text-[16px] leading-[100%] tracking-[0%] mb-2">
                  <span className="font-medium text-[#8F00FF] underline">
                    Choose a File
                  </span>
                  <span className="font-normal text-[#6B7280]"> Or </span>
                  <span className="font-medium text-[#11001E]">
                    Drag & Drop
                  </span>
                </p>
                <p className="font-inter text-[12px] font-normal leading-[100%] tracking-[0%] text-center text-[#6B7280]">
                  Supported files: PDF, JPG, PNG
                </p>
              </div>
            </div>

            {/* Uploaded Images Grid */}
            {currentFolderMedia.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {currentFolderMedia.map((media) => (
                  <div key={media.id} className="flex flex-col items-center gap-[0.5px]">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={media.preview}
                        alt={media.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveMedia(media.id)}
                      className="w-8 h-8 mt-2 cursor-pointer rounded-md bg-[#FEF2F2] p-1.5 flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08),0px_2px_6px_0px_rgba(0,0,0,0.04)] hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-[5px] bg-[#F4E7FF] flex items-center justify-center mb-4">
                  <img src={imgIcon} alt="No images" className="w-10 h-10" />
                </div>
                <p className="font-inter text-[12px] font-normal leading-[100%] tracking-[0%] text-center text-[#6B7280]">
                  No images in{" "}
                  {folders
                    .find((f) => f.id === selectedFolder)
                    ?.label.toLowerCase()}{" "}
                  yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
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

          <div className="flex gap-4">
            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="cursor-pointer px-6 md:px-10 py-3 font-inter text-sm md:text-base font-semibold leading-5 tracking-normal uppercase text-[#2A2A2A] transition-all hover:bg-gray-50"
              style={{
                borderRadius: "16px",
                border: "1px solid #E4E4E4",
              }}
            >
              SKIP
            </button>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="cursor-pointer px-6 md:px-10 py-3 rounded-xl font-inter text-sm md:text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all"
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
    </div>
  );
}
