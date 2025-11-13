import { useEffect, useRef, useState } from "react";

interface FormInputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hasError?: boolean;
  trigger?: number;
}

export function FormInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  hasError = false,
  trigger = 0,
}: FormInputProps) {
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
      <label className="absolute -top-2 left-3 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl md:rounded-2xl border bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none ${
          hasError
            ? "border-red-500 focus:border-red-500"
            : "border-[#E4E4E4] focus:border-gray-400"
        } ${shake ? 'animate-vibrate' : ''}`}
      />
    </div>
  );
}
