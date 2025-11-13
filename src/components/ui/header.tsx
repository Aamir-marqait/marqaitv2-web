import { ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCreditStore } from "@/store/useCreditStore";
import { userService } from "@/api/services";
import type { UserStats } from "@/api/types";
import fullLogo from "../../assets/app-logo/full-logo.svg";
import coinIcon from "../../assets/nav-icon/icon.png";

// Credit limits based on subscription plan
const CREDIT_LIMITS = {
  free: 100,
  professional: 4000,
  enterprise: 10000,
} as const;

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { creditsBalance, fetchCreditsBalance, isLoading } = useCreditStore();

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "A";
  const totalAvailableCredits = creditsBalance?.total_available || 0;

  // Determine credit limit based on subscription plan from stats
  const getCreditLimit = () => {
    if (!userStats) return CREDIT_LIMITS.free;

    const subscription = userStats.current_subscription.toLowerCase();
    if (subscription === 'pro' || subscription === 'professional') {
      return CREDIT_LIMITS.professional;
    } else if (subscription === 'enterprise') {
      return CREDIT_LIMITS.enterprise;
    }
    return CREDIT_LIMITS.free;
  };

  const creditLimit = getCreditLimit();

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still close dropdown and navigate even if API call fails
      setIsDropdownOpen(false);
      navigate("/");
    }
  };

  // Fetch credits and user stats on mount
  useEffect(() => {
    if (user) {
      fetchCreditsBalance();

      // Fetch user stats to get subscription plan
      userService.getUserStats()
        .then(stats => setUserStats(stats))
        .catch(error => console.error('Failed to fetch user stats:', error));
    }
  }, [user, fetchCreditsBalance]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm z-10 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <img
              src={fullLogo || "/placeholder.svg"}
              alt="MARQAIT"
              className="h-6"
            />
          </div>

          {/* Right side - Credit badge and user avatar */}
          <div className="flex items-center space-x-4">
            {/* Credit badge */}
            <div
              className="flex items-center justify-center space-x-2 bg-[#F4EAFF] rounded-[100px] px-4"
              style={{ height: "44px" }}
            >
              <img src={coinIcon} alt="Coin" className="w-6 h-6" />
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-12 bg-gray-300 rounded animate-pulse" />
                  <div className="h-3 w-1 bg-gray-300 rounded animate-pulse" />
                  <div className="h-3 w-10 bg-gray-300 rounded animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center gap-px">
                  <span className="font-Inter font-medium text-[14px] leading-[100%] text-gray-700">
                    {totalAvailableCredits.toLocaleString()}
                  </span>
                  <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
                    /
                  </span>
                  <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
                    {creditLimit.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-[100px] flex items-center justify-center text-white text-sm font-semibold">
                  {userInitial}
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[#151D48] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
