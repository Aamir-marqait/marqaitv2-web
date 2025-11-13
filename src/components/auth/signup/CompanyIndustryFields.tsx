import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { industries } from "./industries";

interface CompanyIndustryFieldsProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (value: string) => void;
  hasCompanyError?: boolean;
  hasIndustryError?: boolean;
  trigger?: number;
}

export function CompanyIndustryFields({
  companyName,
  setCompanyName,
  selectedIndustry,
  setSelectedIndustry,
  hasCompanyError = false,
  hasIndustryError = false,
  trigger = 0,
}: CompanyIndustryFieldsProps) {
  const [open, setOpen] = useState(false);
  const companyRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLButtonElement>(null);
  const [shakeCompany, setShakeCompany] = useState(false);
  const [shakeIndustry, setShakeIndustry] = useState(false);

  useEffect(() => {
    if (hasCompanyError && trigger > 0) {
      setShakeCompany(false);
      void companyRef.current?.offsetWidth;
      setShakeCompany(true);
      const timer = setTimeout(() => setShakeCompany(false), 400);
      return () => clearTimeout(timer);
    }
  }, [hasCompanyError, trigger]);

  useEffect(() => {
    if (hasIndustryError && trigger > 0) {
      setShakeIndustry(false);
      void industryRef.current?.offsetWidth;
      setShakeIndustry(true);
      const timer = setTimeout(() => setShakeIndustry(false), 400);
      return () => clearTimeout(timer);
    }
  }, [hasIndustryError, trigger]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative">
        <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black">
          Company Name<span className="text-red-500">*</span>
        </label>
        <input
          ref={companyRef}
          type="text"
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={`w-full rounded-xl md:rounded-2xl border bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none ${
            hasCompanyError
              ? "border-red-500 focus:border-red-500"
              : "border-[#E4E4E4] focus:border-gray-400"
          } ${shakeCompany ? 'animate-vibrate' : ''}`}
        />
      </div>
      <div className="relative">
        <label className="absolute -top-2 left-3 md:left-4 bg-white px-1 text-xs md:text-[12px] font-normal leading-[100%] tracking-normal font-inter text-black z-10">
          Domain / Industry<span className="text-red-500">*</span>
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              ref={industryRef}
              type="button"
              role="combobox"
              aria-expanded={open}
              className={`w-full rounded-xl md:rounded-2xl border bg-white p-3 md:p-4 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter text-gray-700 focus:outline-none flex items-center justify-between ${
                hasIndustryError
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#E4E4E4] focus:border-gray-400"
              } ${shakeIndustry ? 'animate-vibrate' : ''}`}
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
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
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
                          "mr-2 h-4 w-4 ",
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
      </div>
    </div>
  );
}
