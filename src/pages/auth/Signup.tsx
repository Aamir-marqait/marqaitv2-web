import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/auth/background.jpg";
import left from "../../assets/auth/login-left.png";
import logo from "../../assets/app-logo/logo.png";
import { SignupForm } from "@/components/auth/signup/SignupForm";
import { ImageSection } from "@/components/auth/shared/ImageSection";
import { signupSchema, type SignupFormData } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

export function Signup() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationTrigger, setValidationTrigger] = useState(0);
  const { signup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/choose-plan", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const getSavedData = () => {
    const savedFormData = localStorage.getItem("signupFormData");
    if (savedFormData) {
      return JSON.parse(savedFormData);
    }
    return null;
  };

  const savedData = getSavedData();

  const [selectedIndustry, setSelectedIndustry] = useState(
    savedData?.selectedIndustry || ""
  );
  const [agreeToTerms, setAgreeToTerms] = useState(
    savedData?.agreeToTerms || false
  );
  const [fullName, setFullName] = useState(savedData?.fullName || "");
  const [email, setEmail] = useState(savedData?.email || "");
  const [password, setPassword] = useState(savedData?.password || "");
  const [confirmPassword, setConfirmPassword] = useState(
    savedData?.confirmPassword || ""
  );
  const [companyName, setCompanyName] = useState(savedData?.companyName || "");

  useEffect(() => {
    setIsLoaded(true);
    const handleBeforeUnload = () => {
      localStorage.removeItem("signupFormData");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const formData = {
      fullName,
      email,
      password,
      confirmPassword,
      companyName,
      selectedIndustry,
      agreeToTerms,
    };
    localStorage.setItem("signupFormData", JSON.stringify(formData));
  }, [
    fullName,
    email,
    password,
    confirmPassword,
    companyName,
    selectedIndustry,
    agreeToTerms,
    isLoaded,
  ]);

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && password && confirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      setValidationTrigger((prev) => prev + 1);
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (formData: SignupFormData) => {
    try {
      const validatedData = signupSchema.parse(formData);
      setErrors({});

      // Split full name into first and last name
      const nameParts = validatedData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || nameParts[0];

      // Call signup API
      await signup(
        validatedData.email,
        validatedData.password,
        firstName,
        lastName,
        validatedData.companyName || undefined,
        validatedData.selectedIndustry || undefined
      );

      // Clear saved form data
      localStorage.removeItem("signupFormData");

      // Navigate to OTP verification page
      navigate("/verify-otp", { state: { email: validatedData.email } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
        setValidationTrigger((prev) => prev + 1);
      } else if (error instanceof Error) {
        // Handle API errors
        setErrors({ general: error.message || "Signup failed. Please try again." });
        setValidationTrigger((prev) => prev + 1);
      } else {
        setErrors({ general: "An unexpected error occurred" });
        setValidationTrigger((prev) => prev + 1);
      }
    }
  };

  return (
    <>
      <title>SIGN UP • MARQAIT</title>
      <meta
        name="description"
        content="Sign up for Marqait to start managing your business with powerful tools and insights."
      />
      <meta property="og:title" content="SIGN UP • MARQAIT" />
      <meta
        property="og:description"
        content="Sign up for Marqait to start managing your business with powerful tools and insights."
      />
      <meta property="og:image" content={logo} />
      <meta name="twitter:title" content="SIGN UP • MARQAIT" />
      <meta
        name="twitter:description"
        content="Sign up for Marqait to start managing your business with powerful tools and insights."
      />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="w-full mx-2 sm:mx-6 md:mx-14 lg:mx-[60px] bg-white rounded-2xl md:rounded-[40px] flex flex-col md:flex-row overflow-hidden shadow-lg">
          <ImageSection imageSrc={left} altText="Hand holding phone" />
          <SignupForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            companyName={companyName}
            setCompanyName={setCompanyName}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            agreeToTerms={agreeToTerms}
            setAgreeToTerms={setAgreeToTerms}
            handleSubmit={handleSubmit}
            errors={errors}
            onConfirmPasswordBlur={handleConfirmPasswordBlur}
            validationTrigger={validationTrigger}
          />
        </div>
      </div>
    </>
  );
}
