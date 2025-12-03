import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/auth/background.jpg";
import left from "../../assets/auth/login-left.png";
import logo from "../../assets/app-logo/logo.png";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { ImageSection } from "@/components/auth/shared/ImageSection";
import { loginSchema, type LoginFormData } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from "@/components/ui/toast";
import { z } from "zod";

interface ToastState {
  show: boolean;
  message: string;
  type: "error" | "success" | "info";
}

export function Login() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationTrigger, setValidationTrigger] = useState(0);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "error",
  });
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const showToast = (message: string, type: "error" | "success" | "info" = "error") => {
    console.log("showToast called with:", { message, type });
    setToast({ show: true, message, type });
    console.log("Toast state after update:", { show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // If onboarding is complete, redirect to welcome chat
      if (user.isOnboardingComplete) {
        navigate("/welcome/chat", { replace: true });
      } else {
        // Otherwise, redirect to choose plan (start of onboarding)
        navigate("/choose-plan", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const getErrorMessage = (error: any): string => {
    // Check for HTTP status codes (ApiException has status property)
    const status = error.status || error.response?.status;

    if (status) {
      if (status >= 500) {
        return "Something went wrong. Please try again later.";
      }
      if (status === 401 || status === 403) {
        return "Invalid credentials. Please check your email and password.";
      }
      if (status === 404) {
        return "Account not found. Please sign up first.";
      }
      if (status === 429) {
        return "Too many attempts. Please try again later.";
      }
    }

    // Check error message content
    const errorMsg = error.message?.toLowerCase() || "";
    if (
      errorMsg.includes("invalid") ||
      errorMsg.includes("incorrect") ||
      errorMsg.includes("wrong") ||
      errorMsg.includes("credential")
    ) {
      return "Invalid credentials. Please check your email and password.";
    }

    if (errorMsg.includes("network") || errorMsg.includes("connection")) {
      return "Network error. Please check your connection.";
    }

    return error.message || "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (formData: LoginFormData) => {
    try {
      const validatedData = loginSchema.parse(formData);
      setErrors({});

      console.log("Attempting login...");

      // Attempt login with validated credentials
      await login(validatedData.email, validatedData.password);

      console.log("Login successful");
      // Navigation will be handled by useEffect after auth state updates
      // Don't navigate here to prevent double navigation
    } catch (error) {
      console.log("Login error caught:", error);

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
        console.log("Showing toast with message:", errorMessage);
        showToast(errorMessage, "error");
        setErrors({ general: errorMessage });
        setValidationTrigger((prev) => prev + 1);
      }
    }
  };

  return (
    <>
      <title>SIGN IN • MARQAIT</title>
      <meta
        name="description"
        content="Login to your Marqait account to access your business dashboard and tools."
      />
      <meta property="og:title" content="Login • Marqait" />
      <meta
        property="og:description"
        content="Login to your Marqait account to access your business dashboard and tools."
      />
      <meta property="og:image" content={logo} />
      <meta name="twitter:title" content="SIGN IN • MARQAIT" />
      <meta
        name="twitter:description"
        content="Login to your Marqait account to access your business dashboard and tools."
      />

      {/* Toast Notification */}
      {console.log("Rendering Login, toast state:", toast)}
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
          <LoginForm
            handleSubmit={handleSubmit}
            errors={errors}
            validationTrigger={validationTrigger}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
