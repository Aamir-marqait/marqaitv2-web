import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import LinearProgress from "@/components/ui/linear-progress";
import { useMediaGallery } from "@/hooks/useMediaGallery";
import { useBranding } from "@/hooks/useBranding";
import type { MediaFolder } from "@/contexts/MediaGalleryContext";
import { mediaGalleryService } from "@/api/services/media-gallery";
import uploadIcon from "@/assets/upload.png";
import imgIcon from "@/assets/img.png";

const folders: { id: MediaFolder; label: string }[] = [
  { id: "Products", label: "Products" },
  { id: "Venue", label: "Venue" },
  { id: "Team", label: "Team" },
  { id: "Events", label: "Events" },
  { id: "Other", label: "Other" },
];

export default function MediaGallerySetup() {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder>("Products");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { brandingData } = useBranding();
  const { mediaByFolder, addMedia, updateMediaIds, removeMedia, getMediaForFolder } =
    useMediaGallery();
  const currentFolderMedia = getMediaForFolder(selectedFolder);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSkip = () => {
    // Clear media gallery IDs from localStorage
    localStorage.removeItem('media_gallery_ids');
    console.log('🧹 Cleared media gallery IDs from localStorage');

    navigate("/onboarding/complete");
  };

  const handleContinue = () => {
    console.log("Completed onboarding with media:", mediaByFolder);

    // Clear media gallery IDs from localStorage
    localStorage.removeItem('media_gallery_ids');
    console.log('🧹 Cleared media gallery IDs from localStorage');

    navigate("/onboarding/complete");
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      const isValid =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isValidExtension = /\.(jpg|jpeg|png|gif|pdf|mp4|mov|avi)$/i.test(
        file.name
      );
      return isValid || isValidExtension;
    });

    if (validFiles.length === 0) return;

    // Limit to 10 files
    if (validFiles.length > 10) {
      alert('Maximum 10 files allowed per upload');
      return;
    }

    // Validate each file
    for (const file of validFiles) {
      const error = mediaGalleryService.validateMediaFile(file);
      if (error) {
        alert(error);
        return;
      }
    }

    // Store timestamp for mapping uploaded media IDs
    const uploadTimestamp = Date.now();

    // Add to local state immediately for preview
    addMedia(selectedFolder, validFiles);

    // Upload to backend
    const businessId = brandingData.businessId || localStorage.getItem('business_id');
    if (!businessId) {
      console.error('❌ No business_id found');
      return;
    }

    try {
      setIsUploading(true);
      console.log(`📤 Uploading ${validFiles.length} file(s) to ${selectedFolder}...`);

      const response = await mediaGalleryService.uploadBulk(
        businessId,
        validFiles,
        selectedFolder
      );

      console.log('📦 Upload response:', response);
      console.log(`✅ Successfully uploaded ${response.total_uploaded} file(s)`);

      // Map local IDs to backend media IDs and store in localStorage
      if (response.successful_uploads && response.successful_uploads.length > 0) {
        const localIdToMediaId: Record<string, string> = {};
        const currentMedia = getMediaForFolder(selectedFolder);

        console.log('🔍 Upload timestamp:', new Date(uploadTimestamp).toISOString());
        console.log('🔍 Current media in folder:', currentMedia.map(m => ({
          id: m.id,
          filename: m.file.name,
          uploadedAt: m.uploadedAt.toISOString(),
          uploadedAtTimestamp: m.uploadedAt.getTime()
        })));

        // Match uploaded media to local files by timestamp (files added just before upload)
        const recentMedia = currentMedia.filter(m => {
          const isRecent = m.uploadedAt.getTime() >= uploadTimestamp;
          console.log(`🔍 Checking ${m.file.name}: ${m.uploadedAt.getTime()} >= ${uploadTimestamp} = ${isRecent}`);
          return isRecent;
        });

        console.log('🔍 Recent media count:', recentMedia.length);
        console.log('🔍 Successful uploads count:', response.successful_uploads.length);

        response.successful_uploads.forEach((uploadedMedia, index) => {
          console.log(`🔍 Backend upload [${index}]:`, uploadedMedia.filename, uploadedMedia.id);
          if (recentMedia[index]) {
            console.log(`🔍 Local media [${index}]:`, recentMedia[index].file.name, recentMedia[index].id);
            localIdToMediaId[recentMedia[index].id] = uploadedMedia.id;
            console.log(`✅ Mapped: ${recentMedia[index].id} → ${uploadedMedia.id}`);
          } else {
            console.warn(`⚠️ No local media found at index ${index}`);
          }
        });

        console.log('🔍 Final localIdToMediaId mapping:', localIdToMediaId);

        // Update context state
        updateMediaIds(selectedFolder, localIdToMediaId);

        // Store in localStorage for deletion
        const storageKey = 'media_gallery_ids';
        const existingData = localStorage.getItem(storageKey);
        const mediaIds = existingData ? JSON.parse(existingData) : {};

        // Merge new IDs with existing ones
        Object.assign(mediaIds, localIdToMediaId);
        localStorage.setItem(storageKey, JSON.stringify(mediaIds));

        console.log('💾 Saved media IDs to localStorage:', mediaIds);
      }

      if (response.failed_uploads && response.failed_uploads.length > 0) {
        console.error('❌ Failed uploads:', response.failed_uploads);
        alert(`${response.total_failed} file(s) failed to upload`);
      }
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
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

  const handleRemoveMedia = async (fileId: string, mediaId?: string) => {
    console.log('🗑️ Removing media - fileId:', fileId, 'mediaId from context:', mediaId);

    // Try to get mediaId from localStorage if not in context
    let backendMediaId = mediaId;
    if (!backendMediaId) {
      const storageKey = 'media_gallery_ids';
      const existingData = localStorage.getItem(storageKey);
      if (existingData) {
        const mediaIds = JSON.parse(existingData);
        backendMediaId = mediaIds[fileId];
        console.log('🔍 Found mediaId in localStorage:', backendMediaId);
      }
    }

    // Remove from local state
    removeMedia(selectedFolder, fileId);

    // Delete from backend if mediaId exists
    if (backendMediaId) {
      const businessId = brandingData.businessId || localStorage.getItem('business_id');
      if (businessId) {
        try {
          console.log('🗑️ Deleting media from backend - businessId:', businessId, 'mediaId:', backendMediaId);
          await mediaGalleryService.deleteMedia(businessId, backendMediaId);
          console.log('✅ Media deleted from backend');

          // Remove from localStorage
          const storageKey = 'media_gallery_ids';
          const existingData = localStorage.getItem(storageKey);
          if (existingData) {
            const mediaIds = JSON.parse(existingData);
            delete mediaIds[fileId];
            localStorage.setItem(storageKey, JSON.stringify(mediaIds));
            console.log('💾 Removed media ID from localStorage');
          }
        } catch (error) {
          console.error('❌ Failed to delete media:', error);
        }
      } else {
        console.warn('⚠️ No business_id found for delete operation');
      }
    } else {
      console.warn('⚠️ No mediaId found - file was not uploaded to backend yet');
    }
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
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 mb-6 transition-all ${
                isUploading ? "cursor-wait opacity-60" : "cursor-pointer"
              } ${
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
                {isUploading ? (
                  <p className="font-inter text-[16px] font-semibold leading-[100%] tracking-[0%] mb-2 text-[#8F00FF]">
                    Uploading...
                  </p>
                ) : (
                  <>
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
                      Max 10 files | Images: 30MB | Videos: 500MB
                    </p>
                  </>
                )}
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
                      onClick={() => handleRemoveMedia(media.id, media.mediaId)}
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
