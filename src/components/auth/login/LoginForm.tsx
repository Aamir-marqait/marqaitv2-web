import { useState } from "react";
import { Link } from "react-router-dom";
import { FormInput } from "../signup/FormInput";
import { PasswordInput } from "../signup/PasswordInput";
import { SubmitButton } from "../signup/SubmitButton";
import { SocialLogin } from "../shared/SocialLogin";
import type { LoginFormData } from "@/schemas/authSchemas";

interface LoginFormProps {
  handleSubmit: (formData: LoginFormData) => void;
  errors: Record<string, string>;
  validationTrigger: number;
  isLoading?: boolean;
}

export function LoginForm({ handleSubmit, errors, validationTrigger, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ email, password });
  };

  return (
    <div className="md:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-28 py-6 sm:py-10 md:py-16">
      <h2 className="text-2xl sm:text-3xl md:text-[48px] font-normal text-black text-center mb-2 sm:mb-3 leading-[100%] tracking-normal font-inter">
        Welcome Back!
      </h2>
      <h3 className="text-2xl sm:text-3xl md:text-[48px] font-normal text-center mb-3 sm:mb-5 leading-[100%] tracking-normal font-inter">
        <span className="text-[#8F00FF]">John Doe</span>
      </h3>
      <p className="text-center text-[#6B7280] mb-8 sm:mb-12 md:mb-16 text-sm sm:text-base md:text-[16px] font-normal leading-[100%] tracking-normal font-inter">
        Start Automating your market journey today
      </p>

      <form className="space-y-4" onSubmit={onSubmit}>
        <FormInput
          label="Email"
          type="email"
          placeholder="www.yourmail.com"
          value={email}
          onChange={setEmail}
          required
          hasError={!!errors.email || !!errors.general}
          trigger={validationTrigger}
        />

        <PasswordInput
          label="Password"
          placeholder="******"
          value={password}
          onChange={setPassword}
          hasError={!!errors.password || !!errors.general}
          trigger={validationTrigger}
        />

        <div className="flex justify-end">
          <Link
            to="/account/forgot-password"
            className="text-sm md:text-[14px] font-normal leading-[100%] tracking-normal font-inter text-[#8F00FF] hover:underline"
          >
            Forgot Password
          </Link>
        </div>

        <SubmitButton text="LOG IN" isLoading={isLoading} />
      </form>

      <SocialLogin />

      <div className="mt-1 text-center text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/account/emailsignup"
          className="text-[#8F00FF] italic hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
