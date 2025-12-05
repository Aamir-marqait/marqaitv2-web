import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { useBranding } from "@/hooks/useBranding";
import LinearProgress from "@/components/ui/linear-progress";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { industries } from "@/components/auth/signup/industries";

export default function NewBrand() {
  const { brandingData, setNewBrandData } = useBranding();
  const [businessName, setBusinessName] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const showCustomInput = selectedIndustry === "other";

  // Load data from context on mount and cleanup brandbook content
  useEffect(() => {
    if (brandingData.newBrand.businessName) {
      setBusinessName(brandingData.newBrand.businessName);
    }
    if (brandingData.newBrand.industry) {
      // Check if it's a predefined industry or a custom one
      const isCustom = !industries.some(ind => ind.value === brandingData.newBrand.industry);
      if (isCustom) {
        setSelectedIndustry("other");
        setCustomIndustry(brandingData.newBrand.industry);
      } else {
        setSelectedIndustry(brandingData.newBrand.industry);
      }
    }

    // Clean up brandbook content when user reaches Step 1 Brand Info (starting fresh)
    const brandbookContent = localStorage.getItem('brandbookContent');
    if (brandbookContent) {
      console.log('🧹 Cleaning up old brandbook content from localStorage (Step 1)');
      localStorage.removeItem('brandbookContent');
    }
  }, [brandingData.newBrand]);

  const handleContinue = () => {
    // Use custom industry if "other" is selected, otherwise use selected industry
    const finalIndustry = selectedIndustry === "other" ? customIndustry : selectedIndustry;

    // Save to context
    setNewBrandData({
      businessName,
      industry: finalIndustry,
    });
    navigate("/onboarding/brand-details");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0 ">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={1} totalSteps={3} />
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Brand <span className="text-[#8F00FF]"> Info</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          Tell us about your business to create your perfect brand identity
        </p>

        {/* Form Container */}
        <div
          className="w-full max-w-full bg-white rounded-[20px] p-8 mb-8"
          style={{
            boxShadow: "0px 10px 40px 0px #8F00FF26",
          }}
        >
          <div className="space-y-6">
            {/* Business Name Input */}
            <div className="relative">
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
                Business Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Industry Dropdown or Text Input */}
            <div className="relative">
              <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black z-10">
                Industry<span className="text-red-500">*</span>
              </label>
              {showCustomInput ? (
                // Text input when "Other" is selected
                <input
                  type="text"
                  placeholder="Enter your industry"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  onBlur={() => {
                    // Allow user to clear and go back to dropdown if empty
                    if (!customIndustry) {
                      setSelectedIndustry("");
                    }
                  }}
                  className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              ) : (
                // Dropdown when "Other" is not selected
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full rounded-xl md:rounded-2xl border border-[#E4E4E4] bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 focus:outline-none focus:border-gray-400 flex items-center justify-between"
                    >
                      <span
                        className={cn(
                          !selectedIndustry && "text-gray-400",
                          selectedIndustry && "truncate text-sm"
                        )}
                      >
                        {selectedIndustry
                          ? industries.find(
                              (industry) => industry.value === selectedIndustry
                            )?.label
                          : "Select industry"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search industry..."
                        className="border-b"
                      />
                      <CommandList>
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandGroup>
                          {industries.map((industry) => (
                            <CommandItem
                              key={industry.value}
                              value={industry.value}
                              onSelect={(currentValue) => {
                                setSelectedIndustry(
                                  currentValue === selectedIndustry
                                    ? ""
                                    : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedIndustry === industry.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {industry.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="cursor-pointer px-10 py-3 font-inter text-base font-semibold leading-5 tracking-normal uppercase text-[#2A2A2A] transition-all hover:bg-gray-50"
            style={{
              borderRadius: "16px",
              border: "1px solid #E4E4E4",
            }}
          >
            BACK
          </button>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!businessName || !selectedIndustry || (selectedIndustry === "other" && !customIndustry)}
            className="cursor-pointer px-10 py-3 rounded-xl font-inter text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              borderImage:
                "linear-gradient(0deg, #8F00FF 0%, #DAABFF 99.37%) 1",
            }}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
