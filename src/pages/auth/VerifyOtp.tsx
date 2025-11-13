/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/auth/background.jpg";
import left from "../../assets/auth/login-left.png";
import logo from "../../assets/app-logo/logo.png";
import { ImageSection } from "@/components/auth/shared/ImageSection";
import { SubmitButton } from "@/components/auth/signup/SubmitButton";
import { OtpInput } from "@/components/auth/forgot-password/OtpInput";
import { authService } from "@/api/services";
import { Spinner } from "@/components/ui/Spinner";

export function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";

  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [validationTrigger, setValidationTrigger] = useState(0);
  const [otpError, setOtpError] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>({ type: "success", text: "Registration successful! Please check your email for the verification code." });

  // Redirect if no email in state
  useEffect(() => {
    if (!emailFromState) {
      navigate("/account/emailsignup");
    }
  }, [emailFromState, navigate]);

  const handleResendOtp = async () => {
    if (!emailFromState) {
      navigate("/account/emailsignup");
      return;
    }

    setIsResending(true);
    setStatusMessage(null);

    try {
      // Call signup again to resend OTP
      // Based on the existing flow, we can reuse the forgot password endpoint
      // or implement a dedicated resend endpoint if available
      await authService.forgotPassword({ email_address: emailFromState });
      setStatusMessage({
        type: "success",
        text: "Verification code sent successfully!",
      });
    } catch (err: any) {
      console.error("Failed to resend OTP:", err);
      setStatusMessage({
        type: "error",
        text: "Failed to resend verification code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(false);

    // Check if email exists
    if (!emailFromState) {
      navigate("/account/emailsignup");
      return;
    }

    // Validate OTP length
    if (otpCode.length !== 6) {
      setOtpError(true);
      setValidationTrigger((prev) => prev + 1);
      return;
    }

    try {
      setIsLoading(true);

      // Call verify OTP API
      const response = await authService.verifyOtp({
        email_address: emailFromState,
        otp_code: otpCode,
      });

      // If verification successful, navigate to choose plan
      if (response.tokens) {
        navigate("/choose-plan", { replace: true });
      }
    } catch (err: any) {
      // API error - show vibration
      setOtpError(true);
      setValidationTrigger((prev) => prev + 1);
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>VERIFY EMAIL • MARQAIT</title>
      <meta name="description" content="Verify your email address" />
      <meta property="og:title" content="Verify Email • Marqait" />
      <meta property="og:description" content="Verify your email address" />
      <meta property="og:image" content={logo} />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="w-full mx-2 sm:mx-6 md:mx-14 lg:mx-[60px] bg-white rounded-2xl md:rounded-[40px] flex flex-col md:flex-row overflow-hidden shadow-lg">
          <ImageSection imageSrc={left} altText="Hand holding phone" />

          <div className="md:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-28 py-6 sm:py-10 md:py-16">
            {/* Back to signup button */}
            <button
              onClick={() => navigate("/account/emailsignup")}
              className="flex items-center gap-2 text-sm md:text-[16px] font-normal text-gray-700 mb-6 hover:text-[#8F00FF] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to signup
            </button>

            {/* Logo */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-wider">
                M A R Q <span className="text-[#8F00FF]">A</span> I T
              </h1>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-normal text-black mb-3 leading-[100%] tracking-normal font-inter">
              Verify your email
            </h2>

            <p className="text-[#374151] mb-2 text-sm sm:text-base md:text-[16px] font-normal leading-[120%] tracking-normal font-inter">
              Enter the 6-digit code we sent to {emailFromState}
            </p>

            {statusMessage && (
              <p
                className={`mb-6 text-sm sm:text-base md:text-[14px] font-normal leading-[140%] tracking-normal font-inter ${
                  statusMessage.type === "success"
                    ? "text-[#10B981]"
                    : "text-[#EF4444]"
                }`}
              >
                {statusMessage.text}
              </p>
            )}

            <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 mb-3">
                  Verification Code
                </label>
                <OtpInput
                  value={otpCode}
                  onChange={setOtpCode}
                  length={6}
                  hasError={otpError}
                  trigger={validationTrigger}
                />
              </div>

              <SubmitButton
                text={isLoading ? "" : "Verify Code"}
                isLoading={isLoading}
              />
            </form>

            <div className="mt-6 text-center text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-[#8F00FF] italic font-normal hover:underline disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
              >
                {isResending && <Spinner className="w-4 h-4" />}
                {isResending ? "Sending..." : "Resend code"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
