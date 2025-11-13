interface VisualStyleSlideProps {
  backgroundImage: string;
  isActive: boolean;
  slideIndex: number;
  animationClass?: string;
}

/**
 * VisualStyleSlide - Visual Design Guidelines
 * FUTURE: GPT will generate based on brand personality
 */
export default function VisualStyleSlide({
  isActive,
  slideIndex,
  animationClass = "",
}: VisualStyleSlideProps) {
  // Fetch GPT-generated visual style from localStorage
  const getVisualStyle = () => {
    try {
      const stored = localStorage.getItem('brandbookContent');
      if (stored) {
        const content = JSON.parse(stored);
        return content.visualStyle;
      }
    } catch (error) {
      console.error('Error reading visual style from localStorage:', error);
    }
    // Fallback to default
    return {
      graphicsAndIcons: {
        style: "Minimalist & Geometric",
        guidelines: [
          "Use simple, clean shapes and lines",
          "Maintain consistent corner radius (12px-16px)",
          "Apply subtle shadows for depth",
          "Limit use of gradients to brand colors",
        ],
      },
      spacingAndLayout: {
        principles: [
          "Follow 8px grid system",
          "Use generous white space",
          "Maintain clear visual hierarchy",
          "Ensure mobile responsiveness",
        ],
      },
    };
  };

  const visualStyle = getVisualStyle();

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
          padding: "60px 80px",
          gap: "40px",
        }}
      >
        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "40px",
              fontWeight: 700,
              color: "#0A0A0A",
              marginBottom: "8px",
              letterSpacing: "-0.02em",
            }}
          >
            Visual Style Guide
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              color: "#6B7280",
              fontWeight: 400,
            }}
          >
            Design principles and visual standards
          </p>
        </div>

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", flexShrink: 0 }}>
          {/* Graphics & Icons */}
          <div>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                color: "#0A0A0A",
                marginBottom: "16px",
              }}
            >
              Graphics & Icons
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#8F00FF",
                fontWeight: 500,
                marginBottom: "18px",
              }}
            >
              {visualStyle.graphicsAndIcons.style}
            </p>
            <ul
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: "1.8",
                paddingLeft: "20px",
              }}
            >
              {visualStyle.graphicsAndIcons.guidelines.map((guideline, idx) => (
                <li key={idx}>{guideline}</li>
              ))}
            </ul>
          </div>

          {/* Spacing & Layout */}
          <div>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                color: "#0A0A0A",
                marginBottom: "16px",
              }}
            >
              Spacing & Layout
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#8F00FF",
                fontWeight: 500,
                marginBottom: "18px",
              }}
            >
              Generous Whitespace
            </p>
            <ul
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: "1.8",
                paddingLeft: "20px",
              }}
            >
              {visualStyle.spacingAndLayout.principles.map((principle, idx) => (
                <li key={idx}>{principle}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
