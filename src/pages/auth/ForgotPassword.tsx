/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import backgroundImage from "../../assets/auth/background.jpg";
import left from "../../assets/auth/login-left.png";
import logo from "../../assets/app-logo/logo.png";
import { ImageSection } from "@/components/auth/shared/ImageSection";
import { FormInput } from "@/components/auth/signup/FormInput";
import { SubmitButton } from "@/components/auth/signup/SubmitButton";
import { authService } from "@/api/services";
import { forgotPasswordSchema } from "@/schemas/authSchemas";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [validationTrigger, setValidationTrigger] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);

    try {
      // Validate with Zod
      const validatedData = forgotPasswordSchema.parse({ email });

      setIsLoading(true);

      // Call API
      await authService.forgotPassword({ email_address: validatedData.email });

      // Navigate to reset password page after a short delay
      navigate("/account/reset-password", { state: { email: validatedData.email } });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Validation error - show vibration
        setHasError(true);
        setValidationTrigger((prev) => prev + 1);
      } else {
        // API error - show vibration
        setHasError(true);
        setValidationTrigger((prev) => prev + 1);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>FORGOT PASSWORD • MARQAIT</title>
      <meta name="description" content="Reset your Marqait account password" />
      <meta property="og:title" content="Forgot Password • Marqait" />
      <meta
        property="og:description"
        content="Reset your Marqait account password"
      />
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
            <h2 className="text-2xl sm:text-3xl md:text-[48px] min-w-2xl font-normal text-black mb-3 sm:mb-5 leading-[100%] tracking-normal font-inter">
              Forgot your password?
            </h2>
            <p className="text-[#6B7280] mb-8 sm:mb-12 md:mb-16 text-sm sm:text-base md:text-[16px] font-normal leading-[140%] tracking-normal font-inter">
              Enter your email address and we'll send you a verification code.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormInput
                label="Email address"
                type="email"
                placeholder="www.yourmail.com"
                value={email}
                onChange={setEmail}
                required
                hasError={hasError}
                trigger={validationTrigger}
              />

              <SubmitButton
                text={isLoading ? "" : "Send verification code"}
                isLoading={isLoading}
              />
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/account/login")}
                className="text-sm cursor-pointer md:text-[14px] font-normal leading-[100%] tracking-normal font-inter text-[#8F00FF] hover:underline"
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
