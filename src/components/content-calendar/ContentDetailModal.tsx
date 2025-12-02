import { useState } from "react";
import { X, Trash2, Move, Edit2, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface ContentItem {
  id: string;
  platform: "instagram-post" | "instagram-reel" | "facebook-post";
  label: string;
  topic?: string;
  caption?: string;
  visual?: string;
  hashtags?: string;
  time?: string;
  date?: string;
}

interface ContentDetailModalProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onMove: (newDate: Date) => void;
  onEdit: () => void;
}

const platformConfig = {
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
  "facebook-post": {
    label: "FB - Post",
    color: "text-[#1877F2]",
    icon: "📘",
  },
};

export default function ContentDetailModal({
  content,
  isOpen,
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
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        {!showMoveCalendar ? (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-inter text-2xl font-semibold text-gray-900">
                {content.date}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Platform and Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {content.platform === "facebook-post" ? "📘" : "📷"}
                  </span>
                  <span
                    className={`font-inter text-base font-semibold ${
                      platformConfig[content.platform].color
                    }`}
                  >
                    {content.label}
                  </span>
                </div>
                <span className="font-inter text-base text-gray-600">
                  {content.time || "7:30 P.M"}
                </span>
              </div>

              {/* Topic */}
              <div>
                <label className="font-inter text-sm text-gray-500 mb-1 block">
                  Topic
                </label>
                <p className="font-inter text-base text-gray-900">
                  {content.topic || "Thursday Special Offer"}
                </p>
              </div>

              {/* Caption */}
              <div>
                <label className="font-inter text-sm text-gray-500 mb-1 block">
                  Caption
                </label>
                <p className="font-inter text-base text-gray-700 leading-relaxed">
                  {content.caption ||
                    "THURSDAY TREAT! 🎉 Order catering for November and get 15% off dessert add-ons! Perfect for holiday parties. Offer valid through Nov 30. Book now! 🍰"}
                </p>
              </div>

              {/* Visual */}
              <div>
                <label className="font-inter text-sm text-gray-500 mb-1 block">
                  Visual
                </label>
                <p className="font-inter text-base text-gray-700">
                  {content.visual ||
                    "Promotional graphic with desserts and offer details"}
                </p>
              </div>

              {/* Hashtags */}
              <div>
                <label className="font-inter text-sm text-gray-500 mb-1 block">
                  Hashtags
                </label>
                <p className="font-inter text-base text-gray-700">
                  {content.hashtags ||
                    "#SpecialOffer #CateringDeal #HolidayParty #November"}
                </p>
              </div>
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
                <Calendar className="w-6 h-6 text-[#8F00FF]" />
                <h2 className="font-inter text-2xl font-semibold text-gray-900">
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
