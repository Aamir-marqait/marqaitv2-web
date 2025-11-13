export interface ColorPalette {
  name: string;
  colors: string[];
  isGradient?: boolean;
}

// 100+ Predefined color palettes
export const predefinedPalettes: ColorPalette[] = [
  // Warm tones
  { name: "Warm Sunset", colors: ["#FFC0CB", "#FF8C00", "#E91E63", "#4A0E0E"] },
  { name: "Autumn Leaves", colors: ["#FF6B35", "#F7931E", "#FDC830", "#8B4513"] },
  { name: "Desert Heat", colors: ["#D4A373", "#CD853F", "#8B4513", "#654321"] },
  { name: "Coral Reef", colors: ["#FF7F50", "#FF6347", "#E9967A", "#CD5C5C"] },
  { name: "Peach Melba", colors: ["#FFDAB9", "#FFB347", "#FF8C69", "#FF6347"] },
  { name: "Terracotta", colors: ["#E2725B", "#C85A3D", "#A0522D", "#8B4513"] },
  { name: "Amber Glow", colors: ["#FFBF00", "#FF8000", "#FF6600", "#CC5500"] },
  { name: "Rust & Gold", colors: ["#B7410E", "#D4A373", "#CD853F", "#8B4513"] },
  { name: "Copper Sunset", colors: ["#B87333", "#CD7F32", "#C19A6B", "#8B7355"] },
  { name: "Burnt Sienna", colors: ["#E97451", "#D2691E", "#A0522D", "#704214"] },

  // Cold tones
  { name: "Arctic Freeze", colors: ["#AFEEEE", "#00CED1", "#6495ED", "#00008B"] },
  { name: "Ocean Depths", colors: ["#006994", "#0077BE", "#4682B4", "#1E90FF"] },
  { name: "Midnight Blue", colors: ["#191970", "#000080", "#00008B", "#0000CD"] },
  { name: "Ice Crystal", colors: ["#E0FFFF", "#B0E0E6", "#87CEEB", "#4682B4"] },
  { name: "Teal Dream", colors: ["#008080", "#20B2AA", "#48D1CC", "#7FFFD4"] },
  { name: "Aqua Marine", colors: ["#00FFFF", "#00CED1", "#40E0D0", "#48D1CC"] },
  { name: "Sapphire Sky", colors: ["#0F52BA", "#0067A5", "#003B6F", "#001F3F"] },
  { name: "Frost Blue", colors: ["#C9D6DF", "#B0C4DE", "#87CEEB", "#6495ED"] },
  { name: "Deep Sea", colors: ["#01386A", "#014F86", "#026C7C", "#027B8E"] },
  { name: "Glacier", colors: ["#D6E4E5", "#B8D0D4", "#8BB8C0", "#5F9EA0"] },

  // Contrast
  { name: "Neon Nights", colors: ["#FF1493", "#FFD700", "#0000FF", "#8B008B"] },
  { name: "Pop Art", colors: ["#FF00FF", "#FFFF00", "#00FFFF", "#FF0000"] },
  { name: "Electric Vibes", colors: ["#00FF00", "#FF00FF", "#00FFFF", "#FFFF00"] },
  { name: "Bold & Bright", colors: ["#FF0000", "#0000FF", "#FFFF00", "#00FF00"] },
  { name: "Retro Wave", colors: ["#FF10F0", "#FE53BB", "#F5B800", "#08F7FE"] },
  { name: "Cyber Punk", colors: ["#FF006E", "#FFBE0B", "#06FFA5", "#3A86FF"] },
  { name: "Comic Book", colors: ["#FF4500", "#FFD700", "#1E90FF", "#32CD32"] },
  { name: "Rainbow Burst", colors: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00"] },
  { name: "Vivid Mix", colors: ["#E74C3C", "#F39C12", "#3498DB", "#9B59B6"] },
  { name: "High Energy", colors: ["#FF0080", "#00FF80", "#8000FF", "#FF8000"] },

  // Pastel
  { name: "Cotton Candy", colors: ["#FFB6C1", "#E0F4F4", "#87CEEB"] },
  { name: "Baby Shower", colors: ["#FFC0CB", "#B0E0E6", "#FFFACD", "#E6E6FA"] },
  { name: "Mint Cream", colors: ["#F5FFFA", "#E0FFEF", "#C1FFC1", "#B4EEB4"] },
  { name: "Lavender Dream", colors: ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#DA70D6"] },
  { name: "Peach Blossom", colors: ["#FFDAB9", "#FFEFD5", "#FFE4E1", "#FFF0F5"] },
  { name: "Sky Blue", colors: ["#E0F6FF", "#B0E2FF", "#87CEFA", "#7EC0EE"] },
  { name: "Soft Rose", colors: ["#FFE4E1", "#FFB6C1", "#FFA07A", "#FF91A4"] },
  { name: "Butter Cream", colors: ["#FFFACD", "#FAFAD2", "#EEE8AA", "#F0E68C"] },
  { name: "Powder Blue", colors: ["#B0E0E6", "#ADD8E6", "#87CEEB", "#87CEFA"] },
  { name: "Pale Pink", colors: ["#FADADD", "#FFB6C1", "#FFC0CB", "#FFE4E1"] },

  // Greyscale
  { name: "Monochrome", colors: ["#E5E5E5", "#9E9E9E", "#424242"] },
  { name: "Silver Lining", colors: ["#F5F5F5", "#D3D3D3", "#A9A9A9", "#808080"] },
  { name: "Charcoal", colors: ["#36454F", "#2F4F4F", "#708090", "#778899"] },
  { name: "Smoke & Ash", colors: ["#F8F8FF", "#DCDCDC", "#C0C0C0", "#A9A9A9"] },
  { name: "Steel Gray", colors: ["#708090", "#778899", "#B0C4DE", "#C0C0C0"] },
  { name: "Stone Wall", colors: ["#696969", "#808080", "#A9A9A9", "#C0C0C0"] },
  { name: "Slate", colors: ["#2F4F4F", "#708090", "#778899", "#B0C4DE"] },
  { name: "Pewter", colors: ["#96A8A1", "#8B9C90", "#7A8B8B", "#68838B"] },
  { name: "Graphite", colors: ["#383838", "#4F4F4F", "#696969", "#808080"] },
  { name: "Platinum", colors: ["#E5E4E2", "#D3D3D3", "#C0C0C0", "#B8B8B8"] },

  // Gradient
  { name: "Sunset Gradient", colors: ["#667eea", "#764ba2", "#f093fb", "#f5576c"], isGradient: true },
  { name: "Ocean Breeze", colors: ["#2E3192", "#1BFFFF", "#00D4FF", "#0099CC"], isGradient: true },
  { name: "Purple Haze", colors: ["#360033", "#0b8793", "#9D50BB", "#6E48AA"], isGradient: true },
  { name: "Fire Glow", colors: ["#f12711", "#f5af19", "#ff6a00", "#ee0979"], isGradient: true },
  { name: "Cosmic Dust", colors: ["#654ea3", "#eaafc8", "#9D50BB", "#F8B500"], isGradient: true },
  { name: "Northern Lights", colors: ["#00d2ff", "#3a7bd5", "#00d2ff", "#928DAB"], isGradient: true },
  { name: "Rose Gold", colors: ["#F4C4F3", "#FC67FA", "#ED4264", "#FFEDBC"], isGradient: true },
  { name: "Emerald Flow", colors: ["#348F50", "#56B4D3", "#00B4DB", "#0083B0"], isGradient: true },
  { name: "Cherry Blossom", colors: ["#FBD3E9", "#BB377D", "#F093FB", "#F5576C"], isGradient: true },
  { name: "Tropical Sunset", colors: ["#FFA17F", "#00223E", "#FC6076", "#FF9A44"], isGradient: true },

  // Earth tones
  { name: "Forest Floor", colors: ["#228B22", "#556B2F", "#6B8E23", "#808000"] },
  { name: "Clay & Moss", colors: ["#8B4513", "#A0522D", "#6B8E23", "#556B2F"] },
  { name: "Sahara Sand", colors: ["#EDC9AF", "#D2B48C", "#DEB887", "#BC987E"] },
  { name: "Olive Grove", colors: ["#808000", "#6B8E23", "#556B2F", "#3D5A27"] },
  { name: "Canyon Rock", colors: ["#8B7355", "#A0826D", "#BC987E", "#C9BE91"] },
  { name: "Jungle Green", colors: ["#2C5F2D", "#355E3B", "#3F704D", "#4F7942"] },
  { name: "Adobe", colors: ["#C19A6B", "#D2691E", "#B87333", "#996515"] },
  { name: "Moss & Stone", colors: ["#8A9A5B", "#697852", "#4F5D3B", "#3E4A2D"] },
  { name: "Driftwood", colors: ["#AF8A5C", "#9B7653", "#87654A", "#6B5344"] },
  { name: "Eucalyptus", colors: ["#44D7A8", "#2D8659", "#1F6D4A", "#16533B"] },

  // Jewel tones
  { name: "Ruby Red", colors: ["#E0115F", "#9B111E", "#800020", "#5C001A"] },
  { name: "Emerald Green", colors: ["#50C878", "#009B77", "#00A86B", "#00693E"] },
  { name: "Sapphire", colors: ["#0F52BA", "#0067A5", "#003B6F", "#001F3F"] },
  { name: "Amethyst", colors: ["#9966CC", "#8B5FC0", "#7F52B3", "#6A44A6"] },
  { name: "Topaz", colors: ["#FFCC00", "#FFB700", "#FFA500", "#FF8C00"] },
  { name: "Garnet", colors: ["#733635", "#8B1A1A", "#A52A2A", "#B22222"] },
  { name: "Opal", colors: ["#A8C3BC", "#8CA0BC", "#7A8DB5", "#6B7AA0"] },
  { name: "Jade", colors: ["#00A86B", "#00B87C", "#00C78C", "#00D69D"] },
  { name: "Citrine", colors: ["#E4D00A", "#F5C400", "#FFD700", "#FFC700"] },
  { name: "Pearl", colors: ["#EAE0C8", "#FAF0E6", "#FFF5EE", "#FFFAF0"] },

  // Modern tech
  { name: "Dark Mode", colors: ["#1A1A1D", "#4E4E50", "#6F2232", "#C3073F"] },
  { name: "Material Blue", colors: ["#2196F3", "#1976D2", "#1565C0", "#0D47A1"] },
  { name: "Flat UI", colors: ["#1ABC9C", "#3498DB", "#9B59B6", "#E74C3C"] },
  { name: "Bootstrap", colors: ["#007BFF", "#6C757D", "#28A745", "#FFC107"] },
  { name: "GitHub", colors: ["#24292E", "#0366D6", "#28A745", "#F9826C"] },
  { name: "Dribbble", colors: ["#EA4C89", "#F26798", "#F082AC", "#F49EC4"] },
  { name: "Slack", colors: ["#4A154B", "#36C5F0", "#2EB67D", "#E01E5A"] },
  { name: "Spotify", colors: ["#1DB954", "#191414", "#FFFFFF", "#1ED760"] },
  { name: "Twitter", colors: ["#1DA1F2", "#14171A", "#657786", "#AAB8C2"] },
  { name: "Instagram", colors: ["#E1306C", "#F56040", "#FCAF45", "#833AB4"] },

  // Food inspired
  { name: "Mint Chocolate", colors: ["#3EB489", "#98D8C8", "#6F4E37", "#5D4037"] },
  { name: "Strawberry", colors: ["#FC5A8D", "#F38181", "#FF6B9D", "#FFA69E"] },
  { name: "Lemon Lime", colors: ["#FFF44F", "#D4FF00", "#32CD32", "#00FA9A"] },
  { name: "Blueberry", colors: ["#4B6EAF", "#5B8FB9", "#6CA0DC", "#7CB9E8"] },
  { name: "Caramel", colors: ["#C68E17", "#D4A76A", "#DEB887", "#F0E68C"] },
  { name: "Pistachio", colors: ["#93C572", "#A8D08D", "#B5E7A0", "#C1F0C1"] },
  { name: "Cherry", colors: ["#DE3163", "#E30B5C", "#F62D76", "#FF5A8A"] },
  { name: "Vanilla Bean", colors: ["#F3E5AB", "#F5DEB3", "#FFE4B5", "#FFEFD5"] },
  { name: "Coconut", colors: ["#FEFEFA", "#F8F6F0", "#EFEEE9", "#E8E4D8"] },
  { name: "Grape", colors: ["#6F2DA8", "#8E44AD", "#9B59B6", "#A569BD"] },
];

/**
 * Generate color variations from a base color
 * Returns 6 variations: lighter, light, base, dark, darker, accent
 */
export function generateColorVariations(hexColor: string): string[] {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Helper function to convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    const clamp = (num: number) => Math.max(0, Math.min(255, Math.round(num)));
    return '#' + [clamp(r), clamp(g), clamp(b)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  };

  // Generate variations
  return [
    rgbToHex(r + (255 - r) * 0.6, g + (255 - g) * 0.6, b + (255 - b) * 0.6), // Lighter
    rgbToHex(r + (255 - r) * 0.3, g + (255 - g) * 0.3, b + (255 - b) * 0.3), // Light
    hexColor, // Base
    rgbToHex(r * 0.7, g * 0.7, b * 0.7), // Dark
    rgbToHex(r * 0.4, g * 0.4, b * 0.4), // Darker
    rgbToHex(Math.min(255, r * 1.2), Math.min(255, g * 0.8), Math.min(255, b * 1.1)), // Accent
  ];
}

/**
 * Parse multiple hex colors from comma-separated string
 */
export function parseHexColors(input: string): string[] {
  const hexPattern = /#?[0-9A-Fa-f]{6}/g;
  const matches = input.match(hexPattern);

  if (!matches) return [];

  return matches.map(color => color.startsWith('#') ? color : `#${color}`);
}

/**
 * Generate a custom palette from multiple colors
 */
export function generateCustomPalette(colors: string[]): string[] {
  if (colors.length === 0) return [];
  if (colors.length === 1) return generateColorVariations(colors[0]).slice(0, 4);
  if (colors.length >= 4) return colors.slice(0, 4);

  // If 2-3 colors, generate variations to fill up to 4
  const result = [...colors];
  while (result.length < 4) {
    const variations = generateColorVariations(colors[result.length % colors.length]);
    result.push(variations[result.length % 6]);
  }

  return result.slice(0, 4);
}
