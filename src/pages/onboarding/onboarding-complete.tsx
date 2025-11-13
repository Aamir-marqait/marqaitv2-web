import { useAuth } from "@/hooks/useAuth";
import celebrateImage from "@/assets/celebrate.png";
import puffBg from "@/assets/puff.png";

export default function OnboardingComplete() {
  const { user } = useAuth();

  const handleLetsGo = () => {
    // TODO: Navigate to dashboard
    console.log("Onboarding completed! Navigate to dashboard");
  };

  // Extract first name from user name
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)",
      }}
    >
      {/* Background Confetti Pattern */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url(${puffBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Celebration Image */}
        <div className="mb-8">
          <img
            src={celebrateImage}
            alt="Celebration"
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="font-inter text-[48px] font-semibold leading-[100%] tracking-[0%] text-gray-900 mb-6">
          All Set Up, <span className="text-[#8F00FF]">{firstName}!</span>
        </h1>

        {/* Description */}
        <p className="font-inter text-[24px] font-normal leading-[100%] tracking-[0%] text-[#6B7280] mb-10 max-w-lg">
          Your AI marketing team is ready to help {user?.name?.split(" ")[0] || "your business"} grow
        </p>

        {/* Let's Go Button */}
        <button
          onClick={handleLetsGo}
          className="cursor-pointer px-12 py-4 rounded-xl font-inter text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 "
          style={{
            background:
              "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
            borderImage:
              "linear-gradient(0deg, #8F00FF 0%, #DAABFF 99.37%) 1",
          }}
        >
          LET'S GO
        </button>
      </div>
    </div>
  );
}
