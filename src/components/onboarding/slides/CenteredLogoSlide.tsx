import { useLogo } from "@/contexts/LogoContext";

interface CenteredLogoSlideProps {
  backgroundImage: string;
  isActive: boolean;
  slideIndex: number;
  backgroundSize?: "cover" | "contain" | "100% 100%";
  logoTopPosition?: string;
  logoLeftPosition?: string;
  logoSize?: string;
  animationClass?: string;
}

export default function CenteredLogoSlide({
  backgroundImage,
  isActive,
  slideIndex,
  backgroundSize = "cover",
  logoTopPosition = "50%",
  logoLeftPosition = "50%",
  logoSize = "300px",
  animationClass = "",
}: CenteredLogoSlideProps) {
  const { selectedLogoUrl } = useLogo();

  // Extract numeric value from logoSize (e.g., "300px" -> 150)
  const logoSizeNum = parseInt(logoSize.replace('px', ''));
  const halfSize = logoSizeNum / 2;

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

      {/* Centered Logo - No animation, just opacity change */}
      <div
        style={{
          position: "absolute",
          top: logoTopPosition,
          left: logoLeftPosition,
          zIndex: 20,
          width: logoSize,
          height: logoSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: `-${halfSize}px`,
          marginLeft: `-${halfSize}px`,
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
