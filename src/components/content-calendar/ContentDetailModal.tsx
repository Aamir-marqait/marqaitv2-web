import { useState } from "react";
import { X, Trash2, Move, Edit2, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { CalendarItem } from "@/api/types";

interface ContentDetailModalProps {
  content: CalendarItem | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onDelete: () => void;
  onMove: (newDate: Date) => void;
  onEdit: () => void;
}

const platformConfig: Record<string, { label: string; color: string; icon: string }> = {
  "instagram-post": {
    label: "Insta - Post",
    color: "text-[#E91E63]",
    icon: "📷",
  },
  "instagram-reel": {
    label: "Insta - Reel",
    color: "text-[#E91E63]",
    icon: "🎬",
  },
  "instagram-story": {
    label: "Insta - Story",
    color: "text-[#E91E63]",
    icon: "📱",
  },
  "instagram-carousel": {
    label: "Insta - Carousel",
    color: "text-[#E91E63]",
    icon: "🎠",
  },
  "facebook-post": {
    label: "FB - Post",
    color: "text-[#1877F2]",
    icon: "📘",
  },
  "facebook-reel": {
    label: "FB - Reel",
    color: "text-[#1877F2]",
    icon: "🎬",
  },
  "facebook-story": {
    label: "FB - Story",
    color: "text-[#1877F2]",
    icon: "📱",
  },
  "linkedin-post": {
    label: "LinkedIn - Post",
    color: "text-[#0A66C2]",
    icon: "💼",
  },
  "linkedin-article": {
    label: "LinkedIn - Article",
    color: "text-[#0A66C2]",
    icon: "📝",
  },
  "x-post": {
    label: "X - Post",
    color: "text-[#000000]",
    icon: "✖️",
  },
  "tiktok-post": {
    label: "TikTok - Video",
    color: "text-[#000000]",
    icon: "🎵",
  },
  "pinterest-post": {
    label: "Pinterest - Pin",
    color: "text-[#E60023]",
    icon: "📌",
  },
};

export default function ContentDetailModal({
  content,
  isOpen,
  isLoading = false,
  onClose,
  onDelete,
  onMove,
  onEdit,
}: ContentDetailModalProps) {
  // All hooks must be called before any conditional returns
  const [showMoveCalendar, setShowMoveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moveCalendarDate, setMoveCalendarDate] = useState(new Date());

  const handleMoveClick = () => {
    setShowMoveCalendar(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirmMove = () => {
    onMove(selectedDate);
    setShowMoveCalendar(false);
  };

  const handleCancelMove = () => {
    setShowMoveCalendar(false);
  };

  const generateMoveCalendarDays = () => {
    const year = moveCalendarDate.getFullYear();
    const month = moveCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Add previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = prevMonthDays; i > 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i + 1));
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const moveCalendarDays = generateMoveCalendarDays();
  const moveMonthName = moveCalendarDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setMoveCalendarDate(
      new Date(moveCalendarDate.getFullYear(), moveCalendarDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setMoveCalendarDate(
      new Date(moveCalendarDate.getFullYear(), moveCalendarDate.getMonth() + 1)
    );
  };

  const isDateSelected = (date: Date) => {
    return (
      selectedDate.getDate() === date.getDate() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === moveCalendarDate.getMonth();
  };

  // Early return after all hooks
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      weekday: "long"
    });
  };

  // Helper to format time
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get platform key for config lookup
  const getPlatformKey = () => {
    if (!content) return '';
    return `${content.platform}-${content.content_type}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#8F00FF]" />
          </div>
        ) : !content ? (
          <div className="p-12 text-center text-gray-500">
            Failed to load content details
          </div>
        ) : !showMoveCalendar ? (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-inter text-xl font-semibold text-gray-900">
                {formatDate(content.scheduled_date)}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Platform and Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {platformConfig[getPlatformKey()]?.icon || "📷"}
                  </span>
                  <span
                    className={`font-inter text-sm font-semibold ${
                      platformConfig[getPlatformKey()]?.color || "text-gray-700"
                    }`}
                  >
                    {platformConfig[getPlatformKey()]?.label || `${content.platform} - ${content.content_type}`}
                  </span>
                </div>
                <span className="font-inter text-sm text-gray-600">
                  {formatTime(content.scheduled_time)}
                </span>
              </div>

              {/* Content Theme */}
              <div>
                <label className="font-inter text-xs text-gray-500 mb-1 block">
                  Content Theme
                </label>
                <p className="font-inter text-sm text-gray-900 font-medium">
                  {content.content_theme}
                </p>
              </div>

              {/* Tone & CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-xs text-gray-500 mb-1 block">
                    Tone
                  </label>
                  <p className="font-inter text-sm text-gray-900 capitalize">
                    {content.tone}
                  </p>
                </div>
                <div>
                  <label className="font-inter text-xs text-gray-500 mb-1 block">
                    Status
                  </label>
                  <p className="font-inter text-sm text-gray-900">
                    {content.user_approved ? '✅ Approved' : '⏳ Pending'}
                  </p>
                </div>
              </div>

              {/* Caption Brief */}
              <div>
                <label className="font-inter text-xs text-gray-500 mb-1 block">
                  Caption Brief
                </label>
                <p className="font-inter text-sm text-gray-700 leading-relaxed">
                  {content.caption_brief}
                </p>
              </div>

              {/* Visual Brief */}
              <div>
                <label className="font-inter text-xs text-gray-500 mb-1 block">
                  Visual Brief
                </label>
                <p className="font-inter text-sm text-gray-700 leading-relaxed">
                  {content.visual_brief}
                </p>
              </div>

              {/* Call to Action */}
              <div>
                <label className="font-inter text-xs text-gray-500 mb-1 block">
                  Call to Action
                </label>
                <p className="font-inter text-sm text-gray-700">
                  {content.call_to_action}
                </p>
              </div>

              {/* Hashtags */}
              <div>
                <label className="font-inter text-xs text-gray-500 mb-1 block">
                  Hashtags
                </label>
                <p className="font-inter text-sm text-gray-700">
                  {content.hashtags.join(' ')}
                </p>
              </div>

              {/* Strategy Rationale */}
              {content.strategy_rationale && (
                <div>
                  <label className="font-inter text-xs text-gray-500 mb-1 block">
                    Strategy Rationale
                  </label>
                  <p className="font-inter text-sm text-gray-700 leading-relaxed">
                    {content.strategy_rationale}
                  </p>
                </div>
              )}

              {/* Target Audience */}
              {content.target_audience_segment && (
                <div>
                  <label className="font-inter text-xs text-gray-500 mb-1 block">
                    Target Audience
                  </label>
                  <p className="font-inter text-sm text-gray-700">
                    {content.target_audience_segment}
                  </p>
                </div>
              )}

              {/* Engagement Score */}
              {content.expected_engagement_score && (
                <div>
                  <label className="font-inter text-xs text-gray-500 mb-1 block">
                    Expected Engagement Score
                  </label>
                  <p className="font-inter text-sm text-gray-700">
                    {content.expected_engagement_score} / 10
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-between gap-4">
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-xl font-inter text-base text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMoveClick}
                  className="flex items-center gap-2 px-6 py-2.5 border-2 border-[#8F00FF] rounded-xl font-inter text-base text-[#8F00FF] hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <Move className="w-5 h-5" />
                  Move
                </button>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-inter text-base text-white transition-all hover:shadow-lg cursor-pointer"
                  style={{
                    background:
                      "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                  }}
                >
                  <Edit2 className="w-5 h-5" />
                  Edit
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Move Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#8F00FF]" />
                <h2 className="font-inter text-xl font-semibold text-gray-900">
                  Select New Date
                </h2>
              </div>
              <button
                onClick={handleCancelMove}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Move Calendar Body */}
            <div className="p-6">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="font-inter text-lg font-semibold text-gray-900">
                  {moveMonthName}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center font-inter text-xs font-medium text-gray-500 uppercase"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {moveCalendarDays.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 border-b border-r border-gray-200 font-inter text-sm hover:bg-purple-50 transition-colors ${
                        isDateSelected(date)
                          ? "bg-[#8F00FF] text-white font-semibold"
                          : isCurrentMonth(date)
                          ? "text-gray-900 bg-white"
                          : "text-gray-400 bg-gray-50"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Move Calendar Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCancelMove}
                className="px-6 py-2.5 border border-gray-300 rounded-xl font-inter text-base text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMove}
                className="px-6 py-2.5 rounded-xl font-inter text-base text-white transition-all hover:shadow-lg cursor-pointer"
                style={{
                  background:
                    "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
                }}
              >
                Confirm Move
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
