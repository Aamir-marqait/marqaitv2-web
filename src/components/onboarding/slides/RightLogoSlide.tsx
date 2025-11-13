import { useLogo } from "@/contexts/LogoContext";

interface RightLogoSlideProps {
  backgroundImage: string;
  isActive: boolean;
  slideIndex: number;
  backgroundSize?: "cover" | "contain" | "100% 100%";
  animationClass?: string;
}

export default function RightLogoSlide({
  backgroundImage,
  isActive,
  slideIndex,
  backgroundSize = "cover",
  animationClass = "",
}: RightLogoSlideProps) {
  const { selectedLogoUrl } = useLogo();

  return (
    <div
      data-slide={slideIndex}
      className={`absolute inset-0 ${animationClass}`}
      style={{
        opacity: isActive || animationClass ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
        zIndex: isActive ? 10 : animationClass ? 9 : 0,
      }}
    >
      {/* Background Image Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: backgroundSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Right Positioned Logo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "20%",
          zIndex: 20,
          width: "500px",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-250px", // Half of 500px for vertical centering
        }}
      >
        <img
          src={selectedLogoUrl}
          alt="Selected Logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0px 10px 40px rgba(0, 0, 0, 0.3))",
          }}
        />
      </div>
    </div>
  );
}
