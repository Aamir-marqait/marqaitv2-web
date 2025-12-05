import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/auth/background.jpg";
import left from "../../assets/auth/login-left.png";
import logo from "../../assets/app-logo/logo.png";
import { SignupForm } from "@/components/auth/signup/SignupForm";
import { ImageSection } from "@/components/auth/shared/ImageSection";
import { signupSchema, type SignupFormData } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from "@/components/ui/toast";
import { z } from "zod";

interface ToastState {
  show: boolean;
  message: string;
  type: "error" | "success" | "info";
}

export function Signup() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationTrigger, setValidationTrigger] = useState(0);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "error",
  });
  const { signup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const showToast = (message: string, type: "error" | "success" | "info" = "error") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

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
  const [customIndustry, setCustomIndustry] = useState(
    savedData?.customIndustry || ""
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
      customIndustry,
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
    customIndustry,
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

  const getErrorMessage = (error: any): string => {
    // Check for HTTP status codes
    const status = error.status || error.response?.status;

    if (status) {
      if (status >= 500) {
        return "Something went wrong. Please try again later.";
      }
      if (status === 409) {
        return "An account with this email already exists. Please login instead.";
      }
      if (status === 400) {
        return "Invalid information provided. Please check your details.";
      }
      if (status === 429) {
        return "Too many attempts. Please try again later.";
      }
    }

    // Check error message content
    const errorMsg = error.message?.toLowerCase() || "";
    if (errorMsg.includes("email") && errorMsg.includes("exist")) {
      return "An account with this email already exists. Please login instead.";
    }

    if (errorMsg.includes("network") || errorMsg.includes("connection")) {
      return "Network error. Please check your connection.";
    }

    if (errorMsg.includes("password") && errorMsg.includes("weak")) {
      return "Password is too weak. Please use a stronger password.";
    }

    return error.message || "Signup failed. Please try again.";
  };

  const handleSubmit = async (formData: SignupFormData) => {
    try {
      const validatedData = signupSchema.parse(formData);
      setErrors({});

      // Split full name into first and last name
      const nameParts = validatedData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || nameParts[0];

      // Use custom industry if "other" is selected, otherwise use selected industry
      const finalIndustry = validatedData.selectedIndustry === "other"
        ? customIndustry
        : validatedData.selectedIndustry;

      // Call signup API
      await signup(
        validatedData.email,
        validatedData.password,
        firstName,
        lastName,
        validatedData.companyName || undefined,
        finalIndustry || undefined
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
      } else {
        // Show toast for API errors
        const errorMessage = getErrorMessage(error);
        showToast(errorMessage, "error");
        setErrors({ general: errorMessage });
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

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

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
            customIndustry={customIndustry}
            setCustomIndustry={setCustomIndustry}
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
