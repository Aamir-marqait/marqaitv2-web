import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  X,
} from "lucide-react";

interface ContentItem {
  id: string;
  platform: "instagram-post" | "instagram-reel" | "facebook-post";
  label: string;
}

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  content: ContentItem[];
}

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10)); // Nov 2025
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [platformFilter, setPlatformFilter] = useState("All Platforms");
  const [showChat, setShowChat] = useState(true);

  // Platform configurations with colors
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

  // Sample content data matching the screenshot
  const contentData: Record<string, ContentItem[]> = {
    "30-10-2025": [
      { id: "1", platform: "instagram-post", label: "Insta - Post" },
      { id: "2", platform: "instagram-reel", label: "Insta - Reel" },
    ],
    "1-11-2025": [{ id: "3", platform: "facebook-post", label: "FB - Post" }],
    "2-11-2025": [
      { id: "4", platform: "instagram-post", label: "Insta - Post" },
    ],
    "3-11-2025": [{ id: "5", platform: "facebook-post", label: "FB - Post" }],
    "8-11-2025": [{ id: "6", platform: "facebook-post", label: "FB - Post" }],
    "9-11-2025": [
      { id: "7", platform: "instagram-post", label: "Insta - Post" },
    ],
    "10-11-2025": [
      { id: "8", platform: "instagram-post", label: "Insta - Post" },
    ],
    "30-11-2025": [
      { id: "9", platform: "instagram-post", label: "Insta - Post" },
      { id: "10", platform: "instagram-reel", label: "Insta - Reel" },
    ],
    "10-11-2025-2": [
      { id: "11", platform: "instagram-post", label: "Insta - Post" },
    ],
    "15-11-2025": [
      { id: "12", platform: "instagram-post", label: "Insta - Post" },
    ],
    "30-11-2025-2": [
      { id: "13", platform: "instagram-post", label: "Insta - Post" },
      { id: "14", platform: "instagram-reel", label: "Insta - Reel" },
    ],
    "22-11-2025": [{ id: "15", platform: "facebook-post", label: "FB - Post" }],
    "23-11-2025": [
      { id: "16", platform: "instagram-post", label: "Insta - Post" },
    ],
    "24-11-2025": [{ id: "17", platform: "facebook-post", label: "FB - Post" }],
    "27-11-2025": [{ id: "18", platform: "facebook-post", label: "FB - Post" }],
    "30-11-2025-3": [
      { id: "19", platform: "instagram-post", label: "Insta - Post" },
      { id: "20", platform: "instagram-reel", label: "Insta - Reel" },
    ],
    "31-11-2025": [
      { id: "21", platform: "instagram-post", label: "Insta - Post" },
    ],
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Add previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = prevMonthDays; i > 0; i--) {
      const day = prevMonthLastDay - i + 1;
      const dateKey = `${day}-${month}-${year}`;
      days.push({
        day,
        month: month - 1,
        year,
        isCurrentMonth: false,
        content: contentData[dateKey] || [],
      });
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${day}-${month + 1}-${year}`;
      days.push({
        day,
        month,
        year,
        isCurrentMonth: true,
        content: contentData[dateKey] || [],
      });
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const dateKey = `${day}-${month + 2}-${year}`;
      days.push({
        day,
        month: month + 1,
        year,
        isCurrentMonth: false,
        content: contentData[dateKey] || [],
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const monthName = currentDate.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3E8FF] to-white p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-inter text-[48px] font-semibold leading-tight text-gray-900">
            Your 30-Day Content Calendar
          </h1>
          <p className="font-inter text-base text-gray-500 mt-1">Sub-Text</p>
        </div>

        {/* Main Calendar Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-6">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="font-inter text-xl font-semibold text-gray-900 min-w-[120px] text-center">
                {monthName}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Platform Filter */}
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-inter text-sm text-gray-700">
                    {platformFilter}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-4 py-2 rounded-md font-inter text-sm transition-colors ${
                    viewMode === "calendar"
                      ? "bg-white text-[#8F00FF] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 cursor-pointer py-2 rounded-md font-inter text-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-[#8F00FF] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E91E63]"></div>
              <span className="font-inter text-sm text-gray-600">
                Insta - Post
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E91E63]"></div>
              <span className="font-inter text-sm text-gray-600">
                Insta - Reel
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1877F2]"></div>
              <span className="font-inter text-sm text-gray-600">
                FB - Post
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <div
                  key={day}
                  className="py-3 text-center font-inter text-xs font-medium text-gray-500 uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-3 border-b border-r border-gray-200 ${
                    index === 11 ? "border-2 border-[#8F00FF]" : ""
                  } ${!dayInfo.isCurrentMonth ? "bg-gray-50" : "bg-white"}`}
                >
                  <div
                    className={`font-inter text-lg font-medium mb-2 ${
                      dayInfo.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {dayInfo.day}
                  </div>
                  <div className="space-y-1">
                    {dayInfo.content.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-1 text-xs font-inter ${
                          platformConfig[item.platform].color
                        }`}
                      >
                        <span className="text-base">
                          {item.platform === "facebook-post" ? "📘" : "📷"}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-between">
          <button className="px-8 cursor-pointer py-3 border border-gray-300 rounded-full font-inter text-base text-gray-700 hover:bg-gray-50 transition-colors">
            BACK TO STRATEGY
          </button>
          <div className="flex items-center gap-4">
            <button className="px-8 cursor-pointer py-3 border border-gray-300 rounded-full font-inter text-base text-gray-700 hover:bg-gray-50 transition-colors">
              EDIT
            </button>
            <button
              className="px-8 cursor-pointer py-3 rounded-[6px] font-inter text-base text-white transition-all hover:shadow-lg"
              style={{
                background:
                  "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              }}
            >
              APPROVE & GENERATE CONTENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
