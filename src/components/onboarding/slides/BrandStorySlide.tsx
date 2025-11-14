interface BrandStorySlideProps {
  backgroundImage: string;
  isActive: boolean;
  slideIndex: number;
  animationClass?: string;
}

/**
 * BrandStorySlide - Brand Story
 * GPT-generated content based on brand journey and narrative
 */
export default function BrandStorySlide({
  isActive,
  slideIndex,
  animationClass = "",
}: BrandStorySlideProps) {
  // Fetch GPT-generated brand story from localStorage
  const getBrandStory = () => {
    try {
      const stored = localStorage.getItem('brandbookContent');
      if (stored) {
        const content = JSON.parse(stored);
        return content.brandStory;
      }
    } catch (error) {
      console.error('Error reading brand story from localStorage:', error);
    }
    return null;
  };

  const brandStory = getBrandStory();

  // Don't render if no content
  if (!brandStory) {
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
            Brand Story
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
            {brandStory.description}
          </p>
        </div>
      </div>
    </div>
  );
}
