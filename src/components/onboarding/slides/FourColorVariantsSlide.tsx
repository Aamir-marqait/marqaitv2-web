import { useLogo } from "@/contexts/LogoContext";

interface FourColorVariantsSlideProps {
  backgroundImage: string;
  isActive: boolean;
  slideIndex: number;
  animationClass: string;
  logoVariants: {
    blackBg: string;
    whiteBg: string;
    lightRedBg: string;
    yellowBg: string;
  };
}

export default function FourColorVariantsSlide({
  backgroundImage,
  isActive,
  slideIndex,
  animationClass,
  logoVariants,
}: FourColorVariantsSlideProps) {
  const { selectedLogoUrl } = useLogo();

  return (
    <div
      data-slide={slideIndex}
      className={`absolute inset-0 ${animationClass}`}
      style={{
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 10 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 2x2 Grid of Logo Variants - FULLSCREEN */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 0,
        }}
      >
          {/* Black Background Variant */}
          <div
            style={{
              backgroundColor: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={logoVariants.blackBg || selectedLogoUrl}
              alt="Logo on Black Background"
              style={{
                maxWidth: "50%",
                maxHeight: "50%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* White Background Variant */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={logoVariants.whiteBg || selectedLogoUrl}
              alt="Logo on White Background"
              style={{
                maxWidth: "50%",
                maxHeight: "50%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Light Red Background Variant */}
          <div
            style={{
              backgroundColor: "#efa49a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={logoVariants.lightRedBg || selectedLogoUrl}
              alt="Logo on Light Red Background"
              style={{
                maxWidth: "50%",
                maxHeight: "50%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Yellow Background Variant */}
          <div
            style={{
              backgroundColor: "#fbf8cf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={logoVariants.yellowBg || selectedLogoUrl}
              alt="Logo on Yellow Background"
              style={{
                maxWidth: "50%",
                maxHeight: "50%",
                objectFit: "contain",
              }}
            />
          </div>
      </div>
    </div>
  );
}
