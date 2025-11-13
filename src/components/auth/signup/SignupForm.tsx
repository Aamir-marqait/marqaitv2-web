import { Link } from "react-router-dom";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { CompanyIndustryFields } from "./CompanyIndustryFields";
import { TermsCheckbox } from "./TermsCheckbox";
import { SubmitButton } from "./SubmitButton";
import { SocialLogin } from "../shared/SocialLogin";
import type { SignupFormData } from "@/schemas/authSchemas";

interface SignupFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (value: string) => void;
  agreeToTerms: boolean;
  setAgreeToTerms: (value: boolean) => void;
  handleSubmit: (formData: SignupFormData) => void;
  errors: Record<string, string>;
  onConfirmPasswordBlur: () => void;
  validationTrigger: number;
}

export function SignupForm({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  companyName,
  setCompanyName,
  selectedIndustry,
  setSelectedIndustry,
  agreeToTerms,
  setAgreeToTerms,
  handleSubmit,
  errors,
  onConfirmPasswordBlur,
  validationTrigger,
}: SignupFormProps) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({
      fullName,
      email,
      password,
      confirmPassword,
      companyName,
      selectedIndustry,
      agreeToTerms,
    });
  };

  return (
    <div className="md:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-28 py-6 ">
      <h2 className="text-2xl sm:text-3xl md:text-[28px] font-normal text-black text-center mb-2 sm:mb-3 leading-[100%] tracking-normal font-inter">
        Create an <span className="text-[#8F00FF]">Account</span>
      </h2>

      <p className="text-center text-[#6B7280] mb-8 sm:mb-12 md:mb-16 text-sm sm:text-base md:text-[16px] font-normal leading-[120%] tracking-normal font-inter">
        Start automating campaigns and growing your brand in minutes.
      </p>

      <form className="space-y-4" onSubmit={onSubmit}>
        <FormInput
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={setFullName}
          required
          hasError={!!errors.fullName}
          trigger={validationTrigger}
        />

        <FormInput
          label="Email"
          type="email"
          placeholder="@gmail.com"
          value={email}
          onChange={setEmail}
          required
          hasError={!!errors.email}
          trigger={validationTrigger}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PasswordInput
            label="Password"
            placeholder="******"
            value={password}
            onChange={setPassword}
            hasError={!!errors.password}
            trigger={validationTrigger}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="******"
            value={confirmPassword}
            onChange={setConfirmPassword}
            hasError={!!errors.confirmPassword}
            onBlur={onConfirmPasswordBlur}
            trigger={validationTrigger}
          />
        </div>

        <CompanyIndustryFields
          companyName={companyName}
          setCompanyName={setCompanyName}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          hasCompanyError={!!errors.companyName}
          hasIndustryError={!!errors.selectedIndustry}
          trigger={validationTrigger}
        />

        <TermsCheckbox
          checked={agreeToTerms}
          onChange={setAgreeToTerms}
          hasError={!!errors.agreeToTerms}
          trigger={validationTrigger}
        />

        <SubmitButton text="CREATE AN ACCOUNT" />
      </form>

      <SocialLogin />

      <div className="mt-1 text-center text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-500">
        Already have an account?{" "}
        <Link to="/" className="text-[#8F00FF] italic hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
}
