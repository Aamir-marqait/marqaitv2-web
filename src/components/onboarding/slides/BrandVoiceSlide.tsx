interface BrandVoiceSlideProps {
  backgroundImage: string;
  isActive: boolean;
  slideIndex: number;
  animationClass?: string;
}

/**
 * BrandVoiceSlide - Brand Voice & Tone Guidelines
 * FUTURE: GPT will generate based on brand personality and target audience
 */
export default function BrandVoiceSlide({
  isActive,
  slideIndex,
  animationClass = "",
}: BrandVoiceSlideProps) {
  // Fetch GPT-generated brand voice from localStorage
  const getBrandVoice = () => {
    try {
      const stored = localStorage.getItem('brandbookContent');
      if (stored) {
        const content = JSON.parse(stored);
        return content.brandVoice;
      }
    } catch (error) {
      console.error('Error reading brand voice from localStorage:', error);
    }
    // Fallback to default
    return {
      voiceTraits: [
        { trait: "Professional", description: "Clear, confident communication" },
        { trait: "Friendly", description: "Warm and approachable tone" },
        { trait: "Innovative", description: "Forward-thinking language" },
      ],
      toneContexts: [
        { context: "Marketing", description: "Engaging and persuasive" },
        { context: "Support", description: "Helpful and patient" },
        { context: "Technical", description: "Clear and precise" },
        { context: "Social", description: "Conversational and relatable" },
      ],
    };
  };

  const brandVoice = getBrandVoice();

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
            Brand Voice & Tone
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              color: "#6B7280",
              fontWeight: 400,
            }}
          >
            How we communicate with our audience
          </p>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px", flexShrink: 0 }}>
          {/* Voice Characteristics */}
          <div>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                color: "#0A0A0A",
                marginBottom: "24px",
              }}
            >
              Our Voice
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {brandVoice.voiceTraits.map((item:any, idx:number) => (
                <div
                  key={idx}
                  style={{
                    padding: "28px",
                    border: "2px solid #E4E4E4",
                    borderRadius: "12px",
                    backgroundColor: "#FAFAFA",
                    transition: "all 0.3s ease",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#8F00FF",
                      marginBottom: "10px",
                    }}
                  >
                    {item.trait}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#6B7280",
                      lineHeight: "1.6",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tone Guidelines */}
          <div>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                color: "#0A0A0A",
                marginBottom: "24px",
              }}
            >
              Tone by Context
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {brandVoice.toneContexts.map((item:any, idx:number) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 28px",
                    border: "2px solid #E4E4E4",
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#1F2937",
                    }}
                  >
                    {item.context}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#8F00FF",
                      backgroundColor: "#F3E8FF",
                      padding: "6px 14px",
                      borderRadius: "8px",
                    }}
                  >
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
