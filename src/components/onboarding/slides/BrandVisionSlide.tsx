interface BrandVisionSlideProps {
  backgroundImage: string;
  isActive: boolean;
  slideIndex: number;
  animationClass?: string;
}

/**
 * BrandVisionSlide - Brand Vision
 * GPT-generated content based on brand personality and future goals
 */
export default function BrandVisionSlide({
  isActive,
  slideIndex,
  animationClass = "",
}: BrandVisionSlideProps) {
  // Fetch GPT-generated brand vision from localStorage
  const getBrandVision = () => {
    try {
      const stored = localStorage.getItem('brandbookContent');
      if (stored) {
        const content = JSON.parse(stored);
        return content.brandVision;
      }
    } catch (error) {
      console.error('Error reading brand vision from localStorage:', error);
    }
    return null;
  };

  const brandVision = getBrandVision();

  // Don't render if no content
  if (!brandVision) {
    return null;
  }

  return (
    <div
      data-slide={slideIndex}
      className={`absolute inset-0 ${animationClass}`}
      style={{
        opacity: isActive || animationClass ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
        zIndex: isActive ? 10 : animationClass ? 9 : 0,
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Main Container */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 100px",
          gap: "48px",
        }}
      >
        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "48px",
              fontWeight: 700,
              color: "#8F00FF",
              marginBottom: "48px",
              letterSpacing: "-0.02em",
            }}
          >
            Brand Purpose (Vision)
          </h1>
        </div>

        {/* Content Paragraph */}
        <div style={{ flexShrink: 0, maxWidth: "1100px" }}>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              color: "#1F2937",
              fontWeight: 400,
              lineHeight: "1.8",
            }}
          >
            {brandVision.description}
          </p>
        </div>
      </div>
    </div>
  );
}
