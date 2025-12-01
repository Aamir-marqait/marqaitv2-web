import { useEffect } from "react";
import { X } from "lucide-react";
import logo from "@/assets/app-logo/logo.png";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "error",
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    error: "bg-red-50 border-red-200",
    success: "bg-green-50 border-green-200",
    info: "bg-blue-50 border-blue-200",
  }[type];

  const textColor = {
    error: "text-red-800",
    success: "text-green-800",
    info: "text-blue-800",
  }[type];

  const iconBg = {
    error: "bg-red-100",
    success: "bg-green-100",
    info: "bg-blue-100",
  }[type];

  return (
    <div className="fixed  top-6 left-1/2 transform z-50 animate-slideDown">
      <div
        className={`flex items-center gap-3 ${bgColor} border rounded-2xl px-4 py-3 shadow-lg min-w-[320px] max-w-[500px]`}
      >
        <div
          className={`shrink-0 w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}
        >
          <img src={logo} alt="Marqait" className="w-6 h-6 object-contain" />
        </div>
        <p className={`flex-1 font-inter text-sm font-medium ${textColor}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`shrink-0 ${textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
