import { X, Clock, Coins, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ApproveContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalPosts?: number;
  instagramPosts?: number;
  instagramReels?: number;
  creditsRequired?: number;
  estimatedTime?: string;
}

export default function ApproveContentModal({
  isOpen,
  onClose,
  onConfirm,
  totalPosts = 42,
  instagramPosts = 35,
  instagramReels = 7,
  creditsRequired = 837,
  estimatedTime = "8-12 minutes",
}: ApproveContentModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    navigate("/generating-content");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-[900px] w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-8 pb-6">
          <h2 className="font-inter text-[28px] font-semibold text-gray-900">
            Ready To Generate Your Content?
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Info Row */}
        <div className="px-8 pb-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-inter text-sm text-gray-600">
              Estimated time: {estimatedTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-orange-500" />
            <span className="font-inter text-sm text-gray-600">
              Credits Required: {creditsRequired}
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="mx-8 mb-8 bg-gray-50 rounded-2xl p-6">
          {/* Your content will use */}
          <div className="mb-6">
            <h3 className="font-inter text-lg font-semibold text-gray-900 mb-3">
              Your content will use:
            </h3>
            <p className="font-inter text-sm text-gray-600 leading-relaxed">
              Your brand colors and fonts, uploaded product photos & brand voice (warm &
              welcoming)
            </p>
          </div>

          {/* This will create */}
          <div>
            <h3 className="font-inter text-lg font-semibold text-gray-900 mb-4">
              This will create:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#8F00FF] shrink-0" />
                <span className="font-inter text-sm text-gray-700">
                  {instagramPosts} Instagram posts
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#8F00FF] shrink-0" />
                <span className="font-inter text-sm text-gray-700">
                  {instagramReels} Instagram reels
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#8F00FF] shrink-0" />
                <span className="font-inter text-sm text-gray-700 font-semibold">
                  Total: {totalPosts} pieces of content
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 pt-0 flex items-center justify-center gap-4">
          <button
            onClick={onClose}
            className="px-12 py-2.5 border-2 border-[#8F00FF] rounded-xl font-inter text-base text-[#8F00FF] hover:bg-purple-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-12 py-2.5 rounded-xl font-inter text-base text-white transition-all hover:shadow-lg cursor-pointer"
            style={{
              background:
                "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
            }}
          >
            Yes, Generate all Content
          </button>
        </div>
      </div>
    </div>
  );
}
