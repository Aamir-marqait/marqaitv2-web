interface UsageExamplesSlideProps {
  backgroundImage: string;
  isActive: boolean;
  slideIndex: number;
  animationClass?: string;
}

/**
 * UsageExamplesSlide - Logo Usage Guidelines
 * FUTURE: GPT will generate based on logo analysis
 */
export default function UsageExamplesSlide({
  isActive,
  slideIndex,
  animationClass = "",
}: UsageExamplesSlideProps) {
  // Fetch GPT-generated usage examples from localStorage
  const getUsageExamples = () => {
    try {
      const stored = localStorage.getItem('brandbookContent');
      if (stored) {
        const content = JSON.parse(stored);
        return content.usageExamples;
      }
    } catch (error) {
      console.error('Error reading usage examples from localStorage:', error);
    }
    // Fallback to default
    return {
      dos: [
        "Maintain minimum clear space around logo",
        "Use approved color variations only",
        "Keep proportions intact when scaling",
        "Place on contrasting backgrounds",
      ],
      donts: [
        "Don't distort or stretch the logo",
        "Don't use unapproved colors",
        "Don't place on busy backgrounds",
        "Don't add effects or shadows",
      ],
      technicalSpecs: {
        minimumSize: {
          digital: "48px height",
          print: "0.5 inches height",
        },
        clearSpace: "Minimum clear space equal to the height of the logo on all sides",
      },
    };
  };

  const usageExamples = getUsageExamples();

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
            Usage Guidelines
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              color: "#6B7280",
              fontWeight: 400,
            }}
          >
            How to use your logo correctly
          </p>
        </div>

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", flexShrink: 0 }}>
          {/* Do's */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#D1FAE5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "14px",
                }}
              >
                <span style={{ fontSize: "20px", color: "#059669" }}>✓</span>
              </div>
              <h2
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#059669",
                }}
              >
                Do
              </h2>
            </div>

            <ul
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                color: "#1F2937",
                lineHeight: "2",
                paddingLeft: "20px",
              }}
            >
              {usageExamples.dos.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#FEE2E2",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "14px",
                }}
              >
                <span style={{ fontSize: "20px", color: "#DC2626" }}>✗</span>
              </div>
              <h2
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#DC2626",
                }}
              >
                Don't
              </h2>
            </div>

            <ul
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                color: "#1F2937",
                lineHeight: "2",
                paddingLeft: "20px",
              }}
            >
              {usageExamples.donts.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical Specs */}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "28px",
            padding: "28px",
            backgroundColor: "#F9FAFB",
            borderRadius: "12px",
            border: "2px solid #E4E4E4",
            flexShrink: 0,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "17px",
                fontWeight: 600,
                color: "#0A0A0A",
                marginBottom: "10px",
              }}
            >
              Minimum Size
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: "1.6",
              }}
            >
              <strong style={{ color: "#1F2937" }}>Digital:</strong> {usageExamples.technicalSpecs.minimumSize.digital}
              <br />
              <strong style={{ color: "#1F2937" }}>Print:</strong> {usageExamples.technicalSpecs.minimumSize.print}
            </p>
          </div>
          <div>
            <h3
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "17px",
                fontWeight: 600,
                color: "#0A0A0A",
                marginBottom: "10px",
              }}
            >
              Clear Space
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: "1.6",
              }}
            >
              {usageExamples.technicalSpecs.clearSpace}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
