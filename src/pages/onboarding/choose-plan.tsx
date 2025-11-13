import FAQSection from "@/components/onboarding/choose-plan/faq-section";
// import { PlanRequestModal } from "@/components/onboarding/choose-plan/plan-request-modal";
import PricingCard from "@/components/onboarding/choose-plan/pricing-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedPlan, setSelectedPlan] = useState<
  //   "professional" | "enterprise"
  // >("professional");

  // Dummy data - Replace with actual plan management when ready
  const [currentPlan] = useState<"free" | "professional" | "enterprise">("free");

  const handlePlanSelection = (
    plan: "free" | "professional" | "enterprise"
  ) => {
    console.log("Plan selected:", plan);
    // Navigate to setup page
    navigate("/setup-your-brand");
  };

  const handleRequestAccess = (planType: "professional" | "enterprise") => {
    console.log("Request access for:", planType);
    // setSelectedPlan(planType);
    // setModalOpen(true);
    // Optionally navigate or show a different UI
    navigate("/setup-your-brand");
  };

  const faqItems = [
    {
      question: "Can I purchase additional credits?",
      answer:
        "Yes! You can purchase additional credits through our add-on packages. We offer a Small Boost (500 credits for $6) and Big Boost (2,000 credits for $20). Add-on credits expire at the end of your billing cycle.",
    },
    {
      question: "Do my credits expire?",
      answer:
        "Free plan credits renew monthly (no rollover). Professional plan credits renew monthly. Any unused credits from your monthly allowance don't carry over to the next month.",
    },
    {
      question: "What can I create with 100 credits on the Free plan?",
      answer:
        "With 100 credits, you can create approximately 14 social media posts, or 10+ strategy sessions, or 2-3 carousel slides, or 1 reel. You have access to all our AI marketing agents within your credit limit.",
    },
    {
      question: "How much does each marketing agent cost?",
      answer:
        "Social Media Posts: 7 credits, Carousel (per slide): 13 credits, Strategy Agent: 9 credits, Logo Generator: 13 credits, Reel Maker: 80 credits, Brand Book: 240 credits.",
    },
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be charged or credited on a pro-rated basis.",
    },
    {
      question: "What happens if I exceed my credit limit?",
      answer:
        "When you run out of credits, you can either wait for your monthly renewal, upgrade your plan, or purchase additional credit packs. Your account won't be charged automatically.",
    },
    {
      question: "Are there any setup fees or hidden costs?",
      answer:
        "No setup fees or hidden costs. You only pay for your chosen plan and any additional credit packs you purchase. All pricing is transparent and shown upfront.",
    },
    {
      question: "Do I get support with my subscription?",
      answer:
        "Yes! All plans include access to our customer support team. We're here to help you get the most out of MARQAIT's AI marketing tools.",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto py-10">
        <div className="text-center mb-7">
          <h1 className="font-Inter font-bold text-2xl sm:text-3xl md:text-[32px] leading-[100%] text-[#1D2127] mb-2">
            Purchase a subscription
          </h1>
          <p className="font-Inter font-normal text-base sm:text-lg md:text-[20px] leading-[100%] text-[#52575D]">
            Choose the plan that works for you.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <Tabs
            value={billingPeriod}
            onValueChange={setBillingPeriod}
            className="w-auto"
          >
            <TabsList
              className="grid grid-cols-2 bg-[#FFFFFF] p-1 rounded-[100px] gap-2"
              style={{ width: "316px", height: "47px" }}
            >
              <TabsTrigger
                value="monthly"
                className={`rounded-[100px] font-Inter text-[16px] leading-[100%] text-center cursor-pointer ${
                  billingPeriod === "monthly"
                    ? "font-bold text-[#FFFFFF]"
                    : "font-normal text-[#1D2127]"
                }`}
                style={{
                  width: "150px",
                  height: "39px",
                  padding: "10px 32px",
                  letterSpacing: "2%",
                  background:
                    billingPeriod === "monthly"
                      ? "linear-gradient(90deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)"
                      : "transparent",
                  boxShadow:
                    billingPeriod === "monthly"
                      ? "0px 1px 2px 0px rgba(10, 13, 18, 0.05)"
                      : "none",
                  color: billingPeriod === "monthly" ? "#FFFFFF" : "#1D2127",
                }}
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className={`rounded-[100px] font-Inter text-[16px] leading-[100%] text-center cursor-pointer ${
                  billingPeriod === "yearly"
                    ? "font-bold text-[#FFFFFF]"
                    : "font-normal text-[#1D2127]"
                }`}
                style={{
                  width: "150px",
                  height: "39px",
                  padding: "10px 32px",
                  letterSpacing: "2%",
                  background:
                    billingPeriod === "yearly"
                      ? "linear-gradient(90deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)"
                      : "transparent",
                  boxShadow:
                    billingPeriod === "yearly"
                      ? "0px 1px 2px 0px rgba(10, 13, 18, 0.05)"
                      : "none",
                  color: billingPeriod === "yearly" ? "#FFFFFF" : "#1D2127",
                }}
              >
                Yearly <span className="text-[12px]">-20% off</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <PricingCard
            planType="free"
            title="Free"
            price="$0"
            period="/per month"
            description="Perfect for getting started with AI marketing."
            credits="100 credits"
            creditsNote="(per month)"
            features={[
              "AI Logo Generator",
              "AI Social Media Post Generator",
              "AI Strategy Generator",
              "AI Reel Generator",
              "Monthly credit renewal",
            ]}
            buttonText={currentPlan === "free" ? "Current Plan" : "Get Started"}
            buttonVariant={currentPlan === "free" ? "secondary" : "default"}
            onGetStarted={() => handlePlanSelection("free")}
          />

          <PricingCard
            planType="professional"
            title="Professional"
            price="$18"
            period="/per month"
            description="Comprehensive marketing solution for active small businesses."
            credits="4,000 credits"
            features={[
              "All Free plan features",
              "Ad Campaign Generator",
              "BrandBook Creator",
            ]}
            buttonText={
              currentPlan === "professional" ? "Current Plan" : "Get Started"
            }
            buttonVariant={
              currentPlan === "professional" ? "secondary" : "default"
            }
            onGetStarted={() => handlePlanSelection("professional")}
            onRequestAccess={() => handleRequestAccess("professional")}
          />

          <PricingCard
            planType="enterprise"
            title="Enterprise"
            price="$257"
            period="/per month"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed."
            credits="100,000 credits"
            features={[
              "Lorem ipsum dolor",
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor conset",
              "Lorem ipsum dolor prop",
              "Lorem ipsum dolor",
            ]}
            buttonText={
              currentPlan === "enterprise" ? "Current Plan" : "Get Started"
            }
            buttonVariant={
              currentPlan === "enterprise" ? "secondary" : "default"
            }
            onGetStarted={() => handlePlanSelection("enterprise")}
            onRequestAccess={() => handleRequestAccess("enterprise")}
          />
        </div>

        {/* FAQ Section */}
        <FAQSection items={faqItems} />
      </div>

      {/* Plan Request Modal */}
      {/* <PlanRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        planType={selectedPlan}
      /> */}
    </div>
  );
}
