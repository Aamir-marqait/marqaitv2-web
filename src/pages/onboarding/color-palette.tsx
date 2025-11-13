import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import LinearProgress from "@/components/ui/linear-progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  predefinedPalettes,
  parseHexColors,
  generateColorVariations,
  type ColorPalette,
} from "@/utils/colorPalettes";

export default function ColorPalette() {
  const [selectedPalette, setSelectedPalette] = useState<string>("");
  const [customColorInput, setCustomColorInput] = useState<string>("");
  const [customPalettes, setCustomPalettes] = useState<ColorPalette[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  // Example color palettes for the modal
  const examplePalettes = [
    { name: "Ocean Vibes", colors: "#0077BE, #00A8E8, #00C9FF, #7FDBFF" },
    { name: "Sunset Glow", colors: "#FF6B6B, #FFA07A, #FFD93D, #FFF4A3" },
    { name: "Forest Green", colors: "#2D5016, #4E9F3D, #8BC34A, #C5E1A5" },
    { name: "Royal Purple", colors: "#4A148C, #7B1FA2, #9C27B0, #CE93D8" },
  ];

  // Display predefined palettes OR custom palettes (not both)
  const displayPalettes =
    customPalettes.length > 0 ? customPalettes : predefinedPalettes.slice(0, 6);

  const handleGenerateCustomPalette = async () => {
    if (!customColorInput.trim()) return;

    setIsGenerating(true);

    // Parse hex colors from input
    const parsedColors = parseHexColors(customColorInput);

    if (parsedColors.length === 0) {
      setShowErrorModal(true);
      setIsGenerating(false);
      return;
    }

    try {
      // Generate 6 different variations of the custom palette
      const variations: ColorPalette[] = [];

      for (let i = 0; i < 6; i++) {
        let paletteColors: string[];

        if (parsedColors.length === 1) {
          // Single color: generate 6 different shade variations
          const allVariations = generateColorVariations(parsedColors[0]);
          paletteColors = [
            allVariations[i % 6],
            allVariations[(i + 1) % 6],
            allVariations[(i + 2) % 6],
            allVariations[(i + 3) % 6],
          ];
        } else if (parsedColors.length === 2) {
          // Two colors: create different combinations with variations
          const var1 = generateColorVariations(parsedColors[0]);
          const var2 = generateColorVariations(parsedColors[1]);
          paletteColors = [
            var1[i % 6],
            var2[i % 6],
            var1[(i + 2) % 6],
            var2[(i + 2) % 6],
          ];
        } else if (parsedColors.length === 3) {
          // Three colors: rotate and add variations
          const var1 = generateColorVariations(parsedColors[0]);
          const var2 = generateColorVariations(parsedColors[1]);
          paletteColors = [
            parsedColors[i % 3],
            parsedColors[(i + 1) % 3],
            var1[(i + 2) % 6],
            var2[(i + 3) % 6],
          ];
        } else {
          // Four or more colors: use direct colors with rotation
          paletteColors = [
            parsedColors[i % parsedColors.length],
            parsedColors[(i + 1) % parsedColors.length],
            parsedColors[(i + 2) % parsedColors.length],
            parsedColors[(i + 3) % parsedColors.length],
          ];
        }

        // Generate name using OpenAI
        const paletteName = await generatePaletteName(paletteColors);

        variations.push({
          name: paletteName || `Variation ${i + 1}`,
          colors: paletteColors,
        });
      }

      setCustomPalettes(variations);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating palette:", error);
      setIsGenerating(false);
    }
  };

  const generatePaletteName = async (colors: string[]): Promise<string> => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a creative color palette naming expert. Generate short, catchy, 2-3 word names for color palettes.",
              },
              {
                role: "user",
                content: `Generate a creative name for this color palette: ${colors.join(
                  ", "
                )}. Only respond with the name, nothing else.`,
              },
            ],
            max_tokens: 20,
            temperature: 0.9,
          }),
        }
      );

      const data = await response.json();
      const rawName = data.choices[0].message.content.trim();

      // Remove numbered list formatting (e.g., "1. ", "2. ", etc.)
      return rawName.replace(/^\d+\.\s*/g, '').trim();
    } catch (error) {
      console.error("Error generating name:", error);
      return `Custom Palette`;
    }
  };

  const handleContinue = () => {
    const palette = displayPalettes.find((p) => p.name === selectedPalette);
    if (palette) {
      console.log({ color_preferences: palette.colors });
      navigate("/onboarding/logo-generation");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-linear-to-b from-[#F3E8FF] to-white flex flex-col items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <LinearProgress step={1} totalSteps={3} />
        <h1 className="font-inter text-[40px] font-semibold leading-[100%] tracking-normal text-gray-800 mb-4 text-left">
          Color <span className="text-[#8F00FF]">Palette</span>
        </h1>

        {/* Description with Input */}
        <div className="flex items-center gap-4 mb-10">
          <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-[#6B7280]">
            Choose a color palette for your brand
          </p>

          {/* Custom Color Input */}
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              placeholder="#FF0000, #00FF00"
              value={customColorInput}
              onChange={(e) => setCustomColorInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleGenerateCustomPalette()
              }
              className="flex-1 rounded-xl border border-[#E4E4E4] bg-white px-4 py-2 text-sm font-normal font-inter text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#8F00FF]"
            />
            <button
              onClick={handleGenerateCustomPalette}
              disabled={isGenerating || !customColorInput.trim()}
              className="cursor-pointer px-4 py-2 rounded-xl font-inter text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
              style={{
                background:
                  "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>

        {/* Palettes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isGenerating
            ? // Skeleton Loading
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] overflow-hidden"
                  style={{
                    boxShadow: "0px 4px 12px 0px #00000010",
                  }}
                >
                  {/* Skeleton for color swatches */}
                  <div className="h-32 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                  {/* Skeleton for name */}
                  <div className="bg-white p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-24" />
                  </div>
                </div>
              ))
            : displayPalettes.map((palette) => (
                <div
                  key={palette.name}
                  onClick={() => setSelectedPalette(palette.name)}
                  className={`cursor-pointer rounded-[20px] overflow-hidden transition-all ${
                    selectedPalette === palette.name
                      ? "ring-4 ring-[#8F00FF]"
                      : "ring-1 ring-[#E4E4E4]"
                  }`}
                  style={{
                    boxShadow:
                      selectedPalette === palette.name
                        ? "0px 10px 40px 0px #8F00FF40"
                        : "0px 4px 12px 0px #00000010",
                  }}
                >
                  {/* Color Swatches */}
                  <div className="flex h-32">
                    {palette.isGradient ? (
                      <div
                        className="w-full"
                        style={{
                          background: `linear-gradient(135deg, ${palette.colors.join(
                            ", "
                          )})`,
                        }}
                      />
                    ) : (
                      palette.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))
                    )}
                  </div>

                  {/* Palette Name */}
                  <div className="bg-white p-4">
                    <h3 className="font-inter font-semibold text-[16px] leading-[100%] text-center text-gray-800">
                      {palette.name}
                    </h3>
                  </div>
                </div>
              ))}
        </div>

        <div className="flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="cursor-pointer px-10 py-3 font-inter text-base font-semibold leading-5 tracking-normal uppercase text-[#2A2A2A] transition-all hover:bg-gray-50"
            style={{
              borderRadius: "16px",
              border: "1px solid #E4E4E4",
            }}
          >
            BACK
          </button>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedPalette}
            className="cursor-pointer px-10 py-3 rounded-xl font-inter text-base font-semibold leading-5 tracking-normal uppercase text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
              borderImage:
                "linear-gradient(0deg, #8F00FF 0%, #DAABFF 99.37%) 1",
            }}
          >
            CONTINUE
          </button>
        </div>

        {/* Error Modal */}
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Invalid Hex Colors
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Please enter valid hex color codes separated by commas.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <p className="text-sm font-medium text-gray-700">
                Try these example palettes:
              </p>

              {examplePalettes.map((example, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setCustomColorInput(example.colors);
                    setShowErrorModal(false);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {example.name}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {example.colors.split(", ").map((color, colorIdx) => (
                      <div
                        key={colorIdx}
                        className="h-8 flex-1 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <code className="text-xs text-gray-600 font-mono">
                    {example.colors}
                  </code>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  <strong>Format:</strong> Enter 1-4 hex colors separated by commas
                  <br />
                  Example: #FF0000, #00FF00, #0000FF
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
