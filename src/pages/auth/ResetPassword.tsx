/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import backgroundImage from "../../assets/auth/background.jpg";
import left from "../../assets/auth/login-left.png";
import logo from "../../assets/app-logo/logo.png";
import { ImageSection } from "@/components/auth/shared/ImageSection";
import { PasswordInput } from "@/components/auth/signup/PasswordInput";
import { SubmitButton } from "@/components/auth/signup/SubmitButton";
import { OtpInput } from "@/components/auth/forgot-password/OtpInput";
import { Spinner } from "@/components/ui/Spinner";
import { authService } from "@/api/services";
import { resetPasswordSchema } from "@/schemas/authSchemas";
import { useEffect } from "react";

export function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";

  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [validationTrigger, setValidationTrigger] = useState(0);
  const [otpError, setOtpError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);

  const handleResendOtp = async () => {
    if (!emailFromState) {
      navigate("/account/forgot-password");
      return;
    }

    setIsResending(true);

    try {
      await authService.forgotPassword({ email_address: emailFromState });
      alert("Verification code sent successfully!");
    } catch (err: any) {
      console.error("Failed to resend OTP:", err);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(false);
    setPasswordError(false);

    // Check if email exists
    if (!emailFromState) {
      navigate("/account/forgot-password");
      return;
    }

    try {
      // Validate with Zod
      const validatedData = resetPasswordSchema.parse({
        email: emailFromState,
        otpCode,
        newPassword,
        confirmPassword,
      });

      setIsLoading(true);

      // Call API
      await authService.resetPassword({
        email_address: validatedData.email,
        otp_code: validatedData.otpCode,
        new_password: validatedData.newPassword,
      });

      // Show success loader
      setShowSuccessLoader(true);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Validation error - determine which field has error
        const zodErrors = err.issues;
        const hasOtpError = zodErrors.some((e: any) => e.path.includes('otpCode'));
        const hasPasswordError = zodErrors.some((e: any) =>
          e.path.includes('newPassword') || e.path.includes('confirmPassword')
        );

        if (hasOtpError) {
          setOtpError(true);
        }
        if (hasPasswordError) {
          setPasswordError(true);
        }
        setValidationTrigger(prev => prev + 1);
      } else {
        // API error - show vibration on all fields
        setOtpError(true);
        setPasswordError(true);
        setValidationTrigger(prev => prev + 1);
      }
      setIsLoading(false);
    }
  };

  // Auto-navigate to login after 4 seconds when success loader is shown
  useEffect(() => {
    if (showSuccessLoader) {
      const timer = setTimeout(() => {
        navigate("/account/login");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessLoader, navigate]);

  // Show success loader with white background
  if (showSuccessLoader) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <img src={logo} alt="Loading" className="w-16 h-16 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <title>RESET PASSWORD • MARQAIT</title>
      <meta name="description" content="Reset your Marqait account password" />
      <meta property="og:title" content="Reset Password • Marqait" />
      <meta property="og:description" content="Reset your Marqait account password" />
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
            <h2 className="text-2xl sm:text-3xl md:text-[48px] font-normal text-black mb-3 leading-[100%] tracking-normal font-inter">
              Reset your password
            </h2>
            <p className="text-[#6B7280] mb-8 sm:mb-8 text-sm sm:text-base md:text-[16px] font-normal leading-[140%] tracking-normal font-inter">
              We've sent a verification code to <span className="font-semibold">{emailFromState}</span>. Enter the code and your new password below.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 mb-2">
                  Verification Code <span className="text-red-500">*</span>
                </label>
                <OtpInput
                  value={otpCode}
                  onChange={setOtpCode}
                  length={6}
                  hasError={otpError}
                  trigger={validationTrigger}
                />
                <div className="mt-3 text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-[#8F00FF] font-semibold hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {isResending && <Spinner className="w-4 h-4" />}
                    {isResending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </div>

              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={setNewPassword}
                hasError={passwordError}
                trigger={validationTrigger}
              />

              <PasswordInput
                label="Confirm new password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                hasError={passwordError}
                trigger={validationTrigger}
              />

              <p className="text-xs text-gray-500">
                Password must be at least 8 characters, include uppercase, number, and special character.
              </p>

              <SubmitButton
                text={isLoading ? "" : "Reset Password"}
                isLoading={isLoading}
              />
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/account/login")}
                className="text-sm md:text-[14px] font-normal leading-[100%] tracking-normal font-inter text-[#8F00FF] hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
