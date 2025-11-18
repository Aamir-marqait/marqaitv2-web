interface BrandInput {
  businessName: string;
  industry: string;
  targetAudience: string;
  brandPersonality: string;
  coreValues: string;
}

async function searchDuckDuckGo(query: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    const data = await response.json();

    // Combine relevant results
    let searchResults = '';

    if (data.AbstractText) {
      searchResults += `Overview: ${data.AbstractText}\n\n`;
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      searchResults += 'Related Information:\n';
      data.RelatedTopics.slice(0, 5).forEach((topic: any) => {
        if (topic.Text) {
          searchResults += `- ${topic.Text}\n`;
        }
      });
    }

    return searchResults || 'No specific information found.';
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return 'Search unavailable.';
  }
}

export interface BrandbookContent {
  colorPalette: {
    primary: {
      name: string;
      mainColor: string;
      shades: Array<{
        hex: string;
        rgb: string;
        cmyk: string;
      }>;
    };
    secondary: {
      name: string;
      mainColor: string;
      shades: Array<{
        hex: string;
        rgb: string;
        cmyk: string;
      }>;
    };
  };
  typography: {
    heading: {
      family: string;
      weights: string[];
      usage: string;
    };
    body: {
      family: string;
      weights: string[];
      usage: string;
    };
  };
  brandTagline: {
    description: string;
  };
  brandVoice: {
    voiceTraits: Array<{
      trait: string;
      description: string;
    }>;
    toneContexts: Array<{
      context: string;
      description: string;
    }>;
  };
  visualStyle: {
    graphicsAndIcons: {
      style: string;
      guidelines: string[];
    };
    spacingAndLayout: {
      principles: string[];
    };
  };
  usageExamples: {
    dos: string[];
    donts: string[];
    technicalSpecs: {
      minimumSize: {
        digital: string;
        print: string;
      };
      clearSpace: string;
    };
  };
  brandValue: {
    description: string;
  };
  brandVision: {
    description: string;
  };
  brandMission: {
    description: string;
  };
  brandStory: {
    description: string;
  };
}

export async function generateBrandbookContent(
  brandData: BrandInput
): Promise<BrandbookContent> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not found in environment variables');
  }

  // Step 1: Search DuckDuckGo for industry trends
  console.log('🔍 Searching for industry trends...');
  const searchQueries = [
    `${brandData.industry} branding trends 2025`,
    `${brandData.industry} design best practices`,
    `${brandData.industry} color palette trends`
  ];

  const searchResults = await Promise.all(
    searchQueries.map(query => searchDuckDuckGo(query))
  );

  const industryResearch = searchResults.join('\n---\n');
  console.log('✅ Industry research completed');

  // Step 2: Generate brandbook with research context
  const prompt = `You are a professional brand designer and strategist. Based on the following brand information AND industry research, generate comprehensive brandbook guidelines.

**Brand Information:**
- Business Name: ${brandData.businessName}
- Industry: ${brandData.industry}
- Target Audience: ${brandData.targetAudience}
- Brand Personality: ${brandData.brandPersonality}
- Core Values: ${brandData.coreValues}

**Industry Research (from web search):**
${industryResearch}

**Task:** Using the brand information and industry research above, generate professional brandbook content including:

1. **Color Palette:**
   - Primary color with 4 shade variations (lightest to darkest)
   - Secondary color with 4 shade variations
   - Each shade must include HEX, RGB, and CMYK values
   - Colors should align with the industry and brand personality

2. **Typography:**
   - Recommend heading font family (professional, web-safe fonts)
   - Recommend body font family
   - Specify font weights and usage guidelines
   - Consider readability and brand personality

3. **Brand Voice & Tone:**
   - Define 3 key voice traits with descriptions
   - Provide 4 tone contexts (e.g., Marketing, Support, Technical, Social) with descriptions

4. **Visual Style Guide:**
   - Define graphics and icons style
   - Provide 3-4 design guidelines
   - Specify 3-4 spacing and layout principles

5. **Usage Examples:**
   - List 4-5 logo usage "Do's"
   - List 4-5 logo usage "Don'ts"
   - Specify minimum logo size for both digital and print
   - Specify clear space requirements

6. **Brand Tagline:**
   - Write a catchy, memorable tagline (3-7 words)
   - Should capture the brand essence and value proposition
   - Make it inspiring, clear, and aligned with brand personality
   - Examples: "Just Do It", "Think Different", "The Ultimate Driving Machine"

7. **Brand Value:**
   - Write a comprehensive 4-6 sentence paragraph describing the brand's core values
   - Focus on what the brand stands for, beliefs, and guiding principles
   - Make it inspiring and authentic to the brand personality

8. **Brand Vision:**
   - Write a comprehensive 4-6 sentence paragraph describing the brand's vision
   - Focus on the future aspirations and long-term goals
   - Paint a picture of where the brand is heading

9. **Brand Mission:**
   - Write a comprehensive 4-6 sentence paragraph describing the brand's mission
   - Focus on what the brand does, who it serves, and why it exists
   - Make it clear, actionable, and purpose-driven

10. **Brand Story:**
   - Write a comprehensive 6-8 sentence paragraph telling the brand's story
   - Include the origin, journey, challenges overcome, and current position
   - Make it engaging, emotional, and memorable

**Important:**
- Research current design trends in the ${brandData.industry} industry
- Ensure colors are accessible and professional
- All recommendations should be practical and implementable
- Return the response ONLY as a valid JSON object matching this exact structure:

{
  "colorPalette": {
    "primary": {
      "name": "Primary Color Name",
      "mainColor": "#HEX",
      "shades": [
        {"hex": "#HEX1", "rgb": "R, G, B", "cmyk": "C, M, Y, K"},
        {"hex": "#HEX2", "rgb": "R, G, B", "cmyk": "C, M, Y, K"},
        {"hex": "#HEX3", "rgb": "R, G, B", "cmyk": "C, M, Y, K"},
        {"hex": "#HEX4", "rgb": "R, G, B", "cmyk": "C, M, Y, K"}
      ]
    },
    "secondary": {
      "name": "Secondary Color Name",
      "mainColor": "#HEX",
      "shades": [
        {"hex": "#HEX1", "rgb": "R, G, B", "cmyk": "C, M, Y, K"},
        {"hex": "#HEX2", "rgb": "R, G, B", "cmyk": "C, M, Y, K"},
        {"hex": "#HEX3", "rgb": "R, G, B", "cmyk": "C, M, Y, K"},
        {"hex": "#HEX4", "rgb": "R, G, B", "cmyk": "C, M, Y, K"}
      ]
    }
  },
  "typography": {
    "heading": {
      "family": "Font Name",
      "weights": ["Weight 1", "Weight 2", "Weight 3"],
      "usage": "Usage description"
    },
    "body": {
      "family": "Font Name",
      "weights": ["Weight 1", "Weight 2"],
      "usage": "Usage description"
    }
  },
  "brandVoice": {
    "voiceTraits": [
      {"trait": "Trait Name", "description": "Description"},
      {"trait": "Trait Name", "description": "Description"},
      {"trait": "Trait Name", "description": "Description"}
    ],
    "toneContexts": [
      {"context": "Context Name", "description": "How to communicate"},
      {"context": "Context Name", "description": "How to communicate"},
      {"context": "Context Name", "description": "How to communicate"},
      {"context": "Context Name", "description": "How to communicate"}
    ]
  },
  "visualStyle": {
    "graphicsAndIcons": {
      "style": "Style description",
      "guidelines": ["Guideline 1", "Guideline 2", "Guideline 3"]
    },
    "spacingAndLayout": {
      "principles": ["Principle 1", "Principle 2", "Principle 3"]
    }
  },
  "usageExamples": {
    "dos": ["Do 1", "Do 2", "Do 3", "Do 4"],
    "donts": ["Don't 1", "Don't 2", "Don't 3", "Don't 4"],
    "technicalSpecs": {
      "minimumSize": {
        "digital": "Digital size specification (e.g., 48px height)",
        "print": "Print size specification (e.g., 0.5 inches height)"
      },
      "clearSpace": "Clear space specification"
    }
  },
  "brandTagline": {
    "description": "A catchy, memorable tagline (3-7 words) that captures the brand essence and value proposition"
  },
  "brandValue": {
    "description": "A comprehensive 4-6 sentence paragraph describing the brand's core values, beliefs, and guiding principles"
  },
  "brandVision": {
    "description": "A comprehensive 4-6 sentence paragraph describing the brand's vision, future aspirations, and long-term goals"
  },
  "brandMission": {
    "description": "A comprehensive 4-6 sentence paragraph describing what the brand does, who it serves, and why it exists"
  },
  "brandStory": {
    "description": "A comprehensive 6-8 sentence paragraph telling the brand's story, including origin, journey, and current position"
  }
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional brand designer and strategist. You have been provided with industry research from web search. Use this research to create authentic, trendy, and industry-specific brandbook content. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    console.log('✅ Brandbook content generated successfully');
    return content as BrandbookContent;
  } catch (error) {
    console.error('❌ Error generating brandbook content:', error);
    throw error;
  }
}
