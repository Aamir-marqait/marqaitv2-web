import appLogo from '@/assets/app-logo/logo.png';

interface LogoVariantsLoadingScreenProps {
  progress: number; // 0-100
}

export default function LogoVariantsLoadingScreen({ progress }: LogoVariantsLoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* App Logo */}
      <img
        src={appLogo}
        alt="Marqait Logo"
        style={{
          width: "180px",
          height: "auto",
          marginBottom: "40px",
        }}
      />

      {/* Loading Text */}
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          fontWeight: 500,
          color: "#1F2937",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Generating brandbook...
      </p>

      {/* Progress Bar Container */}
      <div
        style={{
          width: "320px",
          height: "8px",
          backgroundColor: "#000000",
          borderRadius: "9999px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Progress Bar Fill */}
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
            borderRadius: "9999px",
            transition: "width 0.3s ease-out",
          }}
        />
      </div>

      {/* Progress Percentage */}
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "#8F00FF",
          marginTop: "16px",
        }}
      >
        {Math.round(progress)}%
      </p>
    </div>
  );
}
