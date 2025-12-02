import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface ContentPost {
  id: string;
  title: string;
  date: string;
  status: "complete" | "generating" | "failed" | "pending";
  imageUrl?: string;
}

export default function GeneratingContent() {
  const [progress, setProgress] = useState(80);
  const [completedPosts, setCompletedPosts] = useState(20);
  const totalPosts = 42;
  const queuedPosts = 39;

  // Mock data for posts
  const [posts] = useState<ContentPost[]>([
    {
      id: "1",
      title: "Bakery Croissant",
      date: "Nov 21, 2025",
      status: "complete",
    },
    {
      id: "2",
      title: "Lorem Ipsum",
      date: "Nov 20, 2025",
      status: "complete",
    },
    {
      id: "3",
      title: "Lorem Ipsum",
      date: "Nov 22, 2025",
      status: "complete",
    },
    {
      id: "4",
      title: "Lorem Ipsum",
      date: "Nov 24, 2025",
      status: "complete",
    },
    {
      id: "5",
      title: "Lorem Ipsum",
      date: "Nov 25, 2025",
      status: "complete",
    },
    {
      id: "6",
      title: "Lorem Ipsum",
      date: "Nov 26, 2025",
      status: "complete",
    },
    {
      id: "7",
      title: "Lorem Ipsum",
      date: "Nov 27, 2025",
      status: "complete",
    },
  ]);

  // Mock content cards with different states
  const contentCards = [
    {
      id: "1",
      status: "complete",
      imageUrl: "/placeholder-food-1.jpg",
      label: "Complete",
    },
    {
      id: "2",
      status: "complete",
      imageUrl: "/placeholder-food-2.jpg",
      label: "Complete",
    },
    { id: "3", status: "failed", label: "Failed" },
    { id: "4", status: "generating", label: "Generating" },
    { id: "5", status: "pending", label: "" },
    { id: "6", status: "pending", label: "" },
    { id: "7", status: "pending", label: "" },
    { id: "8", status: "pending", label: "" },
  ];

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
      setCompletedPosts((prev) => {
        if (prev >= totalPosts) return totalPosts;
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [totalPosts]);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F3E8FF] to-white p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-[300px_1fr] gap-8">
          {/* Left Sidebar - Posts List */}
          <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">
            <div className="space-y-3 mb-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <p className="font-inter text-xs text-gray-500">
                      {post.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="font-inter text-sm text-gray-500 flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></span>
                Loading more posts...
              </p>
            </div>
          </div>

          {/* Right Side - Main Content */}
          <div className="space-y-6">
            {/* Progress Section */}
            <div className="bg-white rounded-3xl shadow-lg p-8 relative">
              {/* Progress Stats - Top Right */}
              <div className="absolute top-8 right-8 flex items-center gap-2">
                <span className="font-inter text-sm text-gray-900 font-medium">
                  {completedPosts} of {totalPosts} posts
                </span>
                <span className="font-inter text-sm text-gray-400">|</span>
                <span className="font-inter text-sm text-gray-500">
                  {queuedPosts} in queue...
                </span>
              </div>

              {/* Progress Circle and Text */}
              <div className="flex flex-col items-center mb-6">
                {/* Circular Progress */}
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#8F00FF"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 56 * (1 - progress / 100)
                      }`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-inter text-2xl font-semibold text-[#8F00FF]">
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Status Text */}
                <div className="text-center">
                  <h2 className="font-inter text-2xl font-semibold text-gray-900 mb-2">
                    Generating your content...
                  </h2>
                  <p className="font-inter text-sm text-gray-500 max-w-md">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit.
                    Vestibulum id tempus nibh lobortis tempor orci odor ac
                    purus.
                  </p>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-4 gap-4">
                {contentCards.map((card) => (
                  <div
                    key={card.id}
                    className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#E8D5F5]"
                  >
                    {/* Complete state with image */}
                    {card.status === "complete" && card.imageUrl && (
                      <>
                        <img
                          src={card.imageUrl}
                          alt={`Content ${card.id}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="font-inter text-xs font-medium text-gray-900">
                            {card.label}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Complete state without image */}
                    {card.status === "complete" && !card.imageUrl && (
                      <>
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="font-inter text-xs font-medium text-gray-900">
                            {card.label}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Failed state */}
                    {card.status === "failed" && (
                      <>
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full">
                          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                          <span className="font-inter text-xs font-medium text-red-600">
                            {card.label}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Generating state */}
                    {card.status === "generating" && (
                      <>
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
                          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-inter text-xs font-medium text-orange-600">
                            {card.label}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Pending state */}
                    {card.status === "pending" && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Loading Indicator */}
              <div className="flex items-center justify-center mt-6">
                <div className="w-8 h-8 border-3 border-gray-300 border-t-[#8F00FF] rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
