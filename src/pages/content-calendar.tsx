import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import ContentDetailModal from "@/components/content-calendar/ContentDetailModal";
import ApproveContentModal from "@/components/content-calendar/ApproveContentModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { strategyService } from "@/api/services";
import type { CalendarItemSummary } from "@/api/types";

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

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  content: ContentItem[];
}

export default function ContentCalendar() {
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

  // Initialize content data as state
  const initialContentData: Record<string, ContentItem[]> = {
    "30-10-2025": [
      {
        id: "1",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Monthly Promotion",
        caption: "Check out our amazing deals this month!",
        visual: "Promotional banner with brand colors",
        hashtags: "#MonthlyDeal #Shopping #Sale",
        time: "3:30 P.M",
        date: "October 30 - Monday",
      },
      {
        id: "2",
        platform: "instagram-reel",
        label: "Insta - Reel",
        topic: "Behind the Scenes",
        caption: "See how we create magic! ✨",
        visual: "Time-lapse video of product creation",
        hashtags: "#BehindTheScenes #Process #Creative",
        time: "5:00 P.M",
        date: "October 30 - Monday",
      },
    ],
    "1-11-2025": [
      {
        id: "3",
        platform: "facebook-post",
        label: "FB - Post",
        topic: "November Kickoff",
        caption: "Starting November strong! 💪",
        visual: "Motivational graphic",
        hashtags: "#NewMonth #Goals #November",
        time: "9:00 A.M",
        date: "November 1 - Wednesday",
      },
    ],
    "2-11-2025": [
      {
        id: "4",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Product Feature",
        caption: "Discover our latest product! 🎉",
        visual: "Product photography with clean background",
        hashtags: "#NewProduct #Launch #Innovation",
        time: "2:00 P.M",
        date: "November 2 - Thursday",
      },
    ],
    "3-11-2025": [
      {
        id: "5",
        platform: "facebook-post",
        label: "FB - Post",
        topic: "Weekend Prep",
        caption: "Getting ready for the weekend! 🎊",
        visual: "Weekend special offers graphic",
        hashtags: "#Weekend #Friday #Fun",
        time: "4:00 P.M",
        date: "November 3 - Friday",
      },
    ],
    "8-11-2025": [
      {
        id: "6",
        platform: "facebook-post",
        label: "FB - Post",
        topic: "Weekly Tips",
        caption: "Here's our top tip for this week! 💡",
        visual: "Infographic with tips",
        hashtags: "#Tips #Advice #HelpfulHints",
        time: "10:00 A.M",
        date: "November 8 - Wednesday",
      },
    ],
    "9-11-2025": [
      {
        id: "7",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Thursday Special Offer",
        caption:
          "THURSDAY TREAT! 🎉 Order catering for November and get 15% off dessert add-ons! Perfect for holiday parties. Offer valid through Nov 30. Book now! 🍰",
        visual: "Promotional graphic with desserts and offer details",
        hashtags: "#SpecialOffer #CateringDeal #HolidayParty #November",
        time: "7:30 P.M",
        date: "November 9 - Thursday",
      },
    ],
    "10-11-2025": [
      {
        id: "8",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Customer Spotlight",
        caption: "Featuring our amazing customers! ❤️",
        visual: "User-generated content collage",
        hashtags: "#CustomerLove #Community #Grateful",
        time: "1:00 P.M",
        date: "November 10 - Friday",
      },
    ],
    "30-11-2025": [
      {
        id: "9",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "End of November",
        caption: "Wrapping up an amazing month! 🌟",
        visual: "Monthly recap graphic",
        hashtags: "#November #MonthlyRecap #Gratitude",
        time: "6:00 P.M",
        date: "November 30 - Saturday",
      },
      {
        id: "10",
        platform: "instagram-reel",
        label: "Insta - Reel",
        topic: "Month Highlights",
        caption: "November highlights reel! 🎬",
        visual: "Video montage of best moments",
        hashtags: "#Highlights #BestOf #November",
        time: "8:00 P.M",
        date: "November 30 - Saturday",
      },
    ],
    "10-11-2025-2": [
      {
        id: "11",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Midweek Motivation",
        caption: "Keep pushing forward! 💪",
        visual: "Motivational quote graphic",
        hashtags: "#Motivation #Inspiration #KeepGoing",
        time: "11:00 A.M",
        date: "November 10 - Friday",
      },
    ],
    "15-11-2025": [
      {
        id: "12",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Team Feature",
        caption: "Meet our incredible team! 👥",
        visual: "Team photo with fun layout",
        hashtags: "#TeamSpotlight #MeetTheTeam #WeAreFamily",
        time: "3:00 P.M",
        date: "November 15 - Wednesday",
      },
    ],
    "30-11-2025-2": [
      {
        id: "13",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Sunday Vibes",
        caption: "Relaxing into the weekend! ☀️",
        visual: "Lifestyle imagery",
        hashtags: "#SundayVibes #Relaxation #WeekendMode",
        time: "12:00 P.M",
        date: "November 30 - Saturday",
      },
      {
        id: "14",
        platform: "instagram-reel",
        label: "Insta - Reel",
        topic: "Quick Tutorial",
        caption: "Learn this in 60 seconds! ⏱️",
        visual: "Fast-paced tutorial video",
        hashtags: "#Tutorial #HowTo #QuickTips",
        time: "4:30 P.M",
        date: "November 30 - Saturday",
      },
    ],
    "22-11-2025": [
      {
        id: "15",
        platform: "facebook-post",
        label: "FB - Post",
        topic: "Event Announcement",
        caption: "Mark your calendars! 📅",
        visual: "Event promotional poster",
        hashtags: "#Event #SaveTheDate #Community",
        time: "2:30 P.M",
        date: "November 22 - Wednesday",
      },
    ],
    "23-11-2025": [
      {
        id: "16",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Testimonial",
        caption: "Hear what our customers say! 💬",
        visual: "Customer testimonial graphic",
        hashtags: "#Testimonial #CustomerReview #FiveStars",
        time: "5:30 P.M",
        date: "November 23 - Thursday",
      },
    ],
    "24-11-2025": [
      {
        id: "17",
        platform: "facebook-post",
        label: "FB - Post",
        topic: "Industry News",
        caption: "Latest trends in our industry! 📰",
        visual: "News-style graphic with key points",
        hashtags: "#IndustryNews #Trends #StayInformed",
        time: "9:30 A.M",
        date: "November 24 - Friday",
      },
    ],
    "27-11-2025": [
      {
        id: "18",
        platform: "facebook-post",
        label: "FB - Post",
        topic: "Throwback",
        caption: "Throwback to when we started! 📸",
        visual: "Vintage photo with then-and-now comparison",
        hashtags: "#ThrowbackThursday #Memory #Journey",
        time: "1:30 P.M",
        date: "November 27 - Monday",
      },
    ],
    "30-11-2025-3": [
      {
        id: "19",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Last Call",
        caption: "Last chance for November deals! ⏰",
        visual: "Urgency-driven promotional graphic",
        hashtags: "#LastChance #LimitedTime #DontMissOut",
        time: "7:00 P.M",
        date: "November 30 - Saturday",
      },
      {
        id: "20",
        platform: "instagram-reel",
        label: "Insta - Reel",
        topic: "Sneak Peek",
        caption: "Sneak peek of what's coming! 👀",
        visual: "Teaser video for upcoming launch",
        hashtags: "#SneakPeek #ComingSoon #Excited",
        time: "9:00 P.M",
        date: "November 30 - Saturday",
      },
    ],
    "31-11-2025": [
      {
        id: "21",
        platform: "instagram-post",
        label: "Insta - Post",
        topic: "Month End Reflection",
        caption: "Reflecting on an amazing November! 🙏",
        visual: "Gratitude-themed graphic",
        hashtags: "#Grateful #Reflection #ThankYou",
        time: "6:30 P.M",
        date: "November 31 - Sunday",
      },
    ],
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const strategyId = searchParams.get("strategy_id");

  // State management
  const [currentDate, setCurrentDate] = useState(new Date()); // Will be set based on API data
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [platformFilter] = useState("All Platforms");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [contentData, setContentData] =
    useState<Record<string, ContentItem[]>>(initialContentData);
  const [calendarItems, setCalendarItems] = useState<CalendarItemSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendar items from API
  useEffect(() => {
    const fetchCalendarItems = async () => {
      if (!strategyId) {
        setError("Strategy ID not found in URL");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const items = await strategyService.getCalendarItemsDetailed(strategyId);
        setCalendarItems(items);

        // Set calendar to show the first month that has items
        if (items.length > 0) {
          const firstDate = new Date(items[0].scheduled_date);
          setCurrentDate(new Date(firstDate.getFullYear(), firstDate.getMonth()));
        }

        // Transform API data to contentData format for calendar display
        const transformedData: Record<string, ContentItem[]> = {};
        items.forEach((item) => {
          const date = new Date(item.scheduled_date);
          const dateKey = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

          // Map platform and content_type to our UI format
          const platformKey = `${item.platform}-${item.content_type}` as any;

          const contentItem: ContentItem = {
            id: item.id,
            platform: platformKey,
            label: `${item.platform.charAt(0).toUpperCase() + item.platform.slice(1)} - ${item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)}`,
            topic: item.content_theme,
            time: item.scheduled_time,
            date: date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              weekday: "long"
            }),
          };

          if (!transformedData[dateKey]) {
            transformedData[dateKey] = [];
          }
          transformedData[dateKey].push(contentItem);
        });

        setContentData(transformedData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching calendar items:", err);
        setError(err?.response?.data?.message || "Failed to load calendar items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarItems();
  }, [strategyId]);

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

  const handleContentClick = (item: ContentItem, dayInfo: CalendarDay) => {
    // Get day of week
    const date = new Date(dayInfo.year, dayInfo.month, dayInfo.day);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const monthName = date.toLocaleDateString("en-US", { month: "long" });

    setSelectedContent({
      ...item,
      date: `${monthName} ${dayInfo.day} - ${dayOfWeek}`,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContent(null);
  };

  const handleDelete = () => {
    if (selectedContent) {
      // TODO: Implement actual delete logic - remove from state/backend
      console.log("Delete content:", selectedContent.id);
    }
    handleCloseModal();
  };

  const handleMove = (newDate: Date) => {
    if (!selectedContent) return;

    // Create new date key for the target date
    const newDateKey = `${newDate.getDate()}-${
      newDate.getMonth() + 1
    }-${newDate.getFullYear()}`;

    // Find and remove the content from its current location
    const updatedContentData = { ...contentData };
    let contentToMove: ContentItem | null = null;
    let oldDateKey: string | null = null;

    // Find the content item in the current data
    for (const [dateKey, items] of Object.entries(updatedContentData)) {
      const itemIndex = items.findIndex(
        (item) => item.id === selectedContent.id
      );
      if (itemIndex !== -1) {
        // Found the item - remove it from current date
        contentToMove = items[itemIndex];
        oldDateKey = dateKey;
        updatedContentData[dateKey] = items.filter(
          (item) => item.id !== selectedContent.id
        );

        // Clean up empty date arrays
        if (updatedContentData[dateKey].length === 0) {
          delete updatedContentData[dateKey];
        }
        break;
      }
    }

    // If content was found, add it to the new date
    if (contentToMove) {
      // Update the content item's date string
      const dayOfWeek = newDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const monthName = newDate.toLocaleDateString("en-US", { month: "long" });
      contentToMove.date = `${monthName} ${newDate.getDate()} - ${dayOfWeek}`;

      // Add to new date
      if (updatedContentData[newDateKey]) {
        updatedContentData[newDateKey] = [
          ...updatedContentData[newDateKey],
          contentToMove,
        ];
      } else {
        updatedContentData[newDateKey] = [contentToMove];
      }

      // Update state
      setContentData(updatedContentData);
      console.log(
        `Moved content ${selectedContent.id} from ${oldDateKey} to ${newDateKey}`
      );
    }

    handleCloseModal();
  };

  const handleEdit = () => {
    if (selectedContent) {
      // TODO: Navigate to edit page or open edit modal
      console.log("Edit content:", selectedContent.id);
    }
    handleCloseModal();
  };

  const handleApproveClick = () => {
    setShowApproveModal(true);
  };

  const handleApproveModalClose = () => {
    setShowApproveModal(false);
  };

  const handleApproveConfirm = () => {
    // TODO: Implement content generation logic
    console.log("Starting content generation...");
    setShowApproveModal(false);
    // Navigate to generation progress page or show success message
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-[#F3E8FF] to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#8F00FF] mx-auto mb-4" />
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-[#F3E8FF] to-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F3E8FF] to-white p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-inter text-[48px] font-semibold leading-tight text-gray-900">
            Your 30-Day Content Calendar
          </h1>
          <p className="font-inter text-base text-gray-500 mt-1">
            {calendarItems.length} posts scheduled
          </p>
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
                        onClick={() => handleContentClick(item, dayInfo)}
                        className={`flex items-center gap-1 text-xs font-inter cursor-pointer hover:opacity-70 transition-opacity ${
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
          <button
            onClick={() => navigate(-1)}
            className="px-8  py-2.5 border border-gray-300 rounded-xl font-inter text-base text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            BACK TO STRATEGY
          </button>
          <div className="flex items-center gap-4">
            <button className="px-8 py-2.5 border border-gray-300 rounded-xl font-inter text-base text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              EDIT
            </button>
            <button
              onClick={handleApproveClick}
              className="px-8 py-2.5 rounded-xl font-inter text-base text-white transition-all hover:shadow-lg cursor-pointer"
              style={{
                background:
                  "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              }}
            >
              APPROVE & GENERATE CONTENT
            </button>
          </div>
        </div>

        {/* Content Detail Modal */}
        <ContentDetailModal
          content={selectedContent}
          isOpen={showModal}
          onClose={handleCloseModal}
          onDelete={handleDelete}
          onMove={handleMove}
          onEdit={handleEdit}
        />

        {/* Approve & Generate Content Modal */}
        <ApproveContentModal
          isOpen={showApproveModal}
          onClose={handleApproveModalClose}
          onConfirm={handleApproveConfirm}
          totalPosts={42}
          instagramPosts={35}
          instagramReels={7}
          creditsRequired={837}
          estimatedTime="8-12 minutes"
        />
      </div>
    </div>
  );
}
