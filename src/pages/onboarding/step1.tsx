import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBranding } from "@/hooks/useBranding";
import BrandOptionCard from "@/components/onboarding/step1/brand-option-card";
import LinearProgress from "@/components/ui/linear-progress";

import handLogo from "../../assets/onboarding/1.png";
import file from "../../assets/onboarding/2.png";

export default function Step1() {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const { setFlowType } = useBranding();

  // Clean up brandbook content when user reaches Step 0 (starting fresh)
  useEffect(() => {
    const brandbookContent = localStorage.getItem('brandbookContent');
    if (brandbookContent) {
      console.log('🧹 Cleaning up old brandbook content from localStorage (Step 0)');
      localStorage.removeItem('brandbookContent');
    }
  }, []);

  const handleContinue = () => {
    if (selected === "new") {
      setFlowType("new");
      navigate("/onboarding/new-brand");
    } else if (selected === "existing") {
      setFlowType("existing");
      navigate("/onboarding/existing-brand");
    }
  };

  return (
    <div className=" bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={0} totalSteps={3} />
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Let's Set Up <span className="text-[#8F00FF]">Your Brand</span>
        </h1>
        <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280] text-left mb-10">
          Would you like us to create a complete brand book for you?
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
          <BrandOptionCard
            selected={selected === "new"}
            onClick={() => setSelected("new")}
            icon={
              <img
                src={handLogo}
                alt="Create New Brand"
                className="w-30 h-20 object-cover mx-auto"
              />
            }
            title="Create New Brand"
            description="Generate a complete brand identity from scratch using AI"
            outline={false}
          />
          <BrandOptionCard
            selected={selected === "existing"}
            onClick={() => setSelected("existing")}
            icon={
              <img
                src={file}
                alt="Use Existing Brand"
                className="w-30 h-30 object-cover  mx-auto"
              />
            }
            title="Use Existing Brand"
            description="Upload your logo and brand assets for AI enhancement"
            outline={true}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selected}
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
