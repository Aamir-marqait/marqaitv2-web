import { useLogo } from "@/contexts/LogoContext";

interface TwoTshirtSlideProps {
  backgroundImage: string;
  isActive: boolean;
  isAnimating: boolean;
  direction: "next" | "prev";
  slideIndex: number;
  animationClass?: string;
}

export default function TwoTshirtSlide({
  backgroundImage,
  isActive,
  isAnimating,
  direction,
  slideIndex,
  animationClass = "",
}: TwoTshirtSlideProps) {
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
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Left T-shirt (Static - No animation, always rendered) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "30%",
          zIndex: 20,
          width: "250px",
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-125px", // Half of 250px
          marginLeft: "-125px", // Half of 250px
        }}
      >
        <img
          src={selectedLogoUrl}
          alt="Selected Logo - Left T-shirt"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.3))",
          }}
        />
      </div>

      {/* Right T-shirt (Animated based on direction) */}
      <div
        className={
          isActive && isAnimating
            ? direction === "next"
              ? "animate-logo-move-from-center-to-right"
              : "animate-logo-move-from-right-to-center"
            : ""
        }
        style={{
          position: "absolute",
          top: "50%",
          left: "71%",
          zIndex: 20,
          width: "250px",
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-125px", // Half of 250px
          marginLeft: "-125px", // Half of 250px
        }}
      >
        <img
          src={selectedLogoUrl}
          alt="Selected Logo - Right T-shirt"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.3))",
          }}
        />
      </div>
    </div>
  );
}
