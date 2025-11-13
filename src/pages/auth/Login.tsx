import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/auth/background.jpg";
import left from "../../assets/auth/login-left.png";
import logo from "../../assets/app-logo/logo.png";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { ImageSection } from "@/components/auth/shared/ImageSection";
import { loginSchema, type LoginFormData } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

export function Login() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationTrigger, setValidationTrigger] = useState(0);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/choose-plan", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (formData: LoginFormData) => {
    try {
      const validatedData = loginSchema.parse(formData);
      setErrors({});

      // Attempt login with validated credentials
      await login(validatedData.email, validatedData.password);

      // Navigate to choose plan page on successful login
      navigate("/choose-plan");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
        setValidationTrigger(prev => prev + 1);
      } else if (error instanceof Error) {
        // Handle API authentication errors
        setErrors({ general: error.message || "Invalid email or password" });
        setValidationTrigger(prev => prev + 1);
      } else {
        setErrors({ general: "An unexpected error occurred" });
        setValidationTrigger(prev => prev + 1);
      }
    }
  };

  return (
    <>
      <title>SIGN IN • MARQAIT</title>
      <meta name="description" content="Login to your Marqait account to access your business dashboard and tools." />
      <meta property="og:title" content="Login • Marqait" />
      <meta property="og:description" content="Login to your Marqait account to access your business dashboard and tools." />
      <meta property="og:image" content={logo} />
      <meta name="twitter:title" content="SIGN IN • MARQAIT" />
      <meta name="twitter:description" content="Login to your Marqait account to access your business dashboard and tools." />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="w-full mx-2 sm:mx-6 md:mx-14 lg:mx-[60px] bg-white rounded-2xl md:rounded-[40px] flex flex-col md:flex-row overflow-hidden shadow-lg">
          <ImageSection imageSrc={left} altText="Hand holding phone" />
          <LoginForm handleSubmit={handleSubmit} errors={errors} validationTrigger={validationTrigger} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
