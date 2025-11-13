import { useRef, useState, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  trigger?: number;
}

export function OtpInput({ length = 6, value, onChange, hasError = false, trigger = 0 }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      setOtp(value.split("").concat(Array(length).fill("")).slice(0, length));
    }
  }, [value, length]);

  useEffect(() => {
    if (hasError && trigger > 0) {
      setShake(false);
      void inputRefs.current[0]?.offsetWidth;
      setShake(true);
      const timer = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(timer);
    }
  }, [hasError, trigger]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // Only take last character
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move to next input if value entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(length).fill("")).slice(0, length);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus last filled input or last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={`flex gap-2 justify-start ${shake ? 'animate-vibrate' : ''}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none transition-colors ${
            hasError
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-[#8F00FF]'
          }`}
        />
      ))}
    </div>
  );
}
