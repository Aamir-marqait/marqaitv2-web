import { useState, useEffect, useRef } from "react";
import { Eye, EyeClosed } from "lucide-react";

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  onBlur?: () => void;
  trigger?: number;
}

export function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  hasError = false,
  onBlur,
  trigger = 0,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (hasError && trigger > 0) {
      setShake(false);
      void inputRef.current?.offsetWidth;
      setShake(true);
      const timer = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(timer);
    }
  }, [hasError, trigger]);

  return (
    <div className="relative">
      <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
        {label}<span className="text-red-500">*</span>
      </label>
      <input
        ref={inputRef}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl md:rounded-2xl border bg-white p-3 md:p-4 pr-10 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none ${
          hasError
            ? "border-red-500 focus:border-red-500"
            : "border-[#E4E4E4] focus:border-gray-400"
        } ${shake ? 'animate-vibrate' : ''}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="cursor-pointer absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
      </button>
    </div>
  );
}
