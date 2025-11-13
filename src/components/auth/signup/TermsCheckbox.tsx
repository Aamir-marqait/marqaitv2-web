import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  hasError?: boolean;
  trigger?: number;
}

export function TermsCheckbox({ checked, onChange, hasError = false, trigger = 0 }: TermsCheckboxProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (hasError && trigger > 0) {
      setShake(false);
      void divRef.current?.offsetWidth;
      setShake(true);
      const timer = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(timer);
    }
  }, [hasError, trigger]);

  return (
    <div
      ref={divRef}
      className={`flex items-center gap-2 ${shake ? 'animate-vibrate' : ''}`}
    >
      <input
        type="checkbox"
        id="terms"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`mt-0.5 h-4 w-4 rounded text-[#8F00FF] focus:ring-[#8F00FF] cursor-pointer ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <label
        htmlFor="terms"
        className={`text-[12px] font-normal leading-[100%] tracking-normal font-inter cursor-pointer ${
          hasError ? 'text-red-500' : ''
        }`}
        style={hasError ? undefined : { color: "#11001E" }}
      >
        I agree to all{" "}
        <Link
          to="/terms"
          className="hover:underline"
          style={{ color: "#8F00FF" }}
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="hover:underline"
          style={{ color: "#8F00FF" }}
        >
          Privacy Policy
        </Link>
      </label>
    </div>
  );
}
