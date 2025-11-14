# Brand Context API Integration

## Overview

The Brand Context API integration allows the application to store brand identity information on the backend server and receive a unique `business_id` that is used throughout the application for all brand-related operations.

## API Endpoint

```
POST /api/v2/business-information/brand-context
```

## Authentication

All API calls require authentication using a Bearer token in the Authorization header:

```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Request Flow

### New Brand Flow
1. User completes **Brand Info** page (`/onboarding/new-brand`)
   - Collects: Business Name, Industry
2. User completes **Brand Details** page (`/onboarding/brand-details`)
   - Collects: Target Audience, Brand Personality, Core Values, Brand Tone
   - **Triggers GPT-4o brandbook generation** (background)
3. User completes **Color Palette** page (`/onboarding/color-palette`)
   - User selects color palette (4 colors)
   - After user clicks CONTINUE, **calls Brand Context API**
   - Maps colors: [0]=primary, [1]=secondary, [2]=accent, [3]=others
   - Stores `business_id` in localStorage and context
4. User continues to Logo Generation

### Existing Brand Flow
1. User completes **Brand Info** page (`/onboarding/existing-brand`)
   - Collects: Business Name, Industry
2. User completes **Brand Details** page (`/onboarding/existing-brand-details`)
   - Collects: Target Audience, Brand Personality, Core Values, Brand Tone
   - **Triggers GPT-4o brandbook generation** (background)
3. User completes **Color Palette** page (`/onboarding/existing-brand-color-palette`)
   - User selects color palette (4 colors)
   - After user clicks CONTINUE, **calls Brand Context API**
   - Maps colors: [0]=primary, [1]=secondary, [2]=accent, [3]=others
   - Stores `business_id` in localStorage and context
4. User continues to Upload Logo

## Request Payload

### TypeScript Interface

```typescript
interface BrandContextRequest {
  business_name: string;
  industry_category: string;
  brand_personality: string;
  brand_tone: string;
  color_palette: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  typography: string[];
  literature: {
    tagline?: string;
    mission?: string;
    story?: string;
  };
  core_values: string[];
}
```

### Example Request

```bash
curl -X POST http://localhost:8000/api/v2/business-information/brand-context \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Marqait",
    "industry_category": "Marketing & Advertising",
    "brand_personality": "Innovative, Empowering, Accessible",
    "brand_tone": "Friendly, conversational, and inspiring",
    "color_palette": {
      "primary": "#6366F1",
      "secondary": "#8B5CF6",
      "accent": "#EC4899"
    },
    "typography": ["Inter", "Poppins"],
    "literature": {
      "tagline": "From chai-wala to creator",
      "mission": "Marqait empowers everyone to run smart marketing campaigns",
      "story": "Born from the vision of making AI-powered marketing accessible..."
    },
    "core_values": ["Accessibility", "Innovation", "Empowerment"]
  }'
```

## Response Format

### Success Response

```typescript
interface BrandContextResponse {
  success: boolean;
  message: string;
  business_id: string;
  data: BrandContextRequest;
}
```

### Example Response

```json
{
  "success": true,
  "message": "Brand context created successfully",
  "business_id": "biz_1234567890abcdef",
  "data": {
    "business_name": "Marqait",
    "industry_category": "Marketing & Advertising",
    "brand_personality": "Innovative, Empowering, Accessible",
    "brand_tone": "Friendly, conversational, and inspiring",
    "color_palette": {
      "primary": "#6366F1",
      "secondary": "#8B5CF6",
      "accent": "#EC4899"
    },
    "typography": ["Inter", "Poppins"],
    "literature": {
      "tagline": "From chai-wala to creator",
      "mission": "Marqait empowers everyone to run smart marketing campaigns",
      "story": "Born from the vision of making AI-powered marketing accessible..."
    },
    "core_values": ["Accessibility", "Innovation", "Empowerment"]
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "business_name": ["This field is required"],
    "industry_category": ["Invalid industry category"]
  }
}
```

## Implementation Details

### Color Palette Mapping

Each color palette contains 4 colors that map to specific brand color roles:

| Array Index | Color Role | API Field | Example |
|-------------|-----------|-----------|---------|
| 0 | Primary | `color_palette.primary` | "#6366F1" |
| 1 | Secondary | `color_palette.secondary` | "#8B5CF6" |
| 2 | Accent | `color_palette.accent` | "#EC4899" |
| 3 | Others | Not sent to API | "#F3F4F6" |

```typescript
const selectedColors = palette.colors; // ["#6366F1", "#8B5CF6", "#EC4899", "#F3F4F6"]

color_palette: {
  primary: selectedColors[0],    // "#6366F1"
  secondary: selectedColors[1],  // "#8B5CF6"
  accent: selectedColors[2],     // "#EC4899"
}
```

### Service Layer

Located at: `src/api/services/brand-context.ts`

```typescript
import { brandContextService } from '@/api/services/brand-context';

// Create brand context
const response = await brandContextService.createBrandContext({
  business_name: "My Business",
  industry_category: "Technology",
  brand_personality: "Innovative, Modern",
  brand_tone: "Professional, Friendly",
  color_palette: {
    primary: "#6366F1",
    secondary: "#8B5CF6"
  },
  typography: ["Inter", "Roboto"],
  literature: {
    mission: "Our mission statement",
    story: "Our brand story"
  },
  core_values: ["Innovation", "Quality"]
});

// Get business_id from localStorage
const businessId = brandContextService.getBusinessId();

// Clear business_id
brandContextService.clearBusinessId();
```

### Context Integration

The `business_id` is stored in two places:

1. **localStorage**: For persistence across sessions
2. **BrandingContext**: For access throughout the application

```typescript
// In BrandingContext
interface BrandingData {
  businessId: string | null;
  // ... other fields
}

// Usage in components
const { brandingData, setBusinessId } = useBranding();

// Store business_id after API call
setBusinessId(response.business_id);

// Access business_id
const currentBusinessId = brandingData.businessId;
```

## Data Mapping

The API request is built from multiple sources:

| API Field | Source | Example |
|-----------|--------|---------|
| `business_name` | Brand Info form | "Marqait" |
| `industry_category` | Brand Info form | "Marketing & Advertising" |
| `brand_personality` | Brand Details form | "Innovative, Empowering" |
| `brand_tone` | Brand Details form (styleReferences) | "Friendly, conversational" |
| `color_palette.primary` | GPT-generated brandbook | "#6366F1" |
| `color_palette.secondary` | GPT-generated brandbook | "#8B5CF6" |
| `typography[]` | GPT-generated brandbook | ["Inter", "Poppins"] |
| `literature.mission` | GPT-generated brandbook | Mission description |
| `literature.story` | GPT-generated brandbook | Brand story |
| `core_values[]` | Brand Details form | ["Innovation", "Quality"] |

## Integration Sequence

```
User Input → GPT-4o Generation → Brand Context API → Store business_id
     ↓              ↓                    ↓                    ↓
Brand Details   Brandbook Content    API Request      localStorage + Context
```

### Detailed Flow

1. **User fills Brand Details form**
   - Target Audience
   - Brand Personality
   - Core Values
   - Brand Tone (styleReferences)

2. **Click "CONTINUE" button**
   - Save data to BrandingContext
   - Trigger GPT-4o brandbook generation (background)

3. **GPT-4o generates brandbook content**
   - Color palettes (primary/secondary)
   - Typography recommendations
   - Brand mission, vision, story
   - Visual style guide

4. **After GPT generation completes**
   - Build Brand Context API request payload
   - Combine user input + GPT-generated content
   - Call `POST /api/v2/business-information/brand-context`

5. **API returns business_id**
   - Store in localStorage: `business_id`
   - Store in BrandingContext: `setBusinessId()`
   - Log success message

6. **User navigates to Color Palette**
   - Process continues (non-blocking)

## Error Handling

The integration includes comprehensive error handling:

```typescript
try {
  const response = await brandContextService.createBrandContext(data);
  setBusinessId(response.business_id);
  console.log('✅ Brand context created:', response.business_id);
} catch (error) {
  console.error('❌ Failed to create brand context:', error);
  // Flow continues even if API call fails
  // User experience is not blocked
}
```

### Error Scenarios

| Scenario | Behavior |
|----------|----------|
| API call fails | Error logged, flow continues |
| Network timeout | Error logged, flow continues |
| Invalid data | Error logged with validation details |
| GPT generation fails | API call skipped, flow continues |

## Usage of business_id

Once stored, the `business_id` should be used for:

1. **Business Content Setup**: Link content to business
2. **Media Gallery**: Associate media with business
3. **Campaign Creation**: Create campaigns for business
4. **Analytics**: Track business performance
5. **Settings**: Update business settings

### Example Usage

```typescript
// In any component
const { brandingData } = useBranding();
const businessId = brandingData.businessId;

// Use in API calls
await api.post(`/api/v2/campaigns`, {
  business_id: businessId,
  campaign_name: "Summer Sale",
  // ... other fields
});
```

## Testing

### Manual Testing

1. Complete onboarding flow (new or existing brand)
2. Check browser console for logs:
   - `🚀 Starting brandbook content generation...`
   - `✅ NEW brandbook content generated`
   - `📡 Creating brand context via API...`
   - `✅ Brand context created with business_id: xxx`
3. Check localStorage: `business_id` should be present
4. Check Redux/Context: `brandingData.businessId` should be set

### Automated Testing

```typescript
import { brandContextService } from '@/api/services/brand-context';

describe('Brand Context API', () => {
  it('creates brand context and returns business_id', async () => {
    const response = await brandContextService.createBrandContext({
      business_name: "Test Business",
      industry_category: "Technology",
      // ... other required fields
    });

    expect(response.business_id).toBeDefined();
    expect(localStorage.getItem('business_id')).toBe(response.business_id);
  });
});
```

## Security Considerations

1. **Authentication**: All requests require valid Bearer token
2. **Authorization**: Users can only create contexts for themselves
3. **Validation**: Server validates all input fields
4. **Rate Limiting**: API may enforce rate limits
5. **HTTPS**: All production requests use HTTPS

## Backend Requirements

The backend API must:

1. Accept `POST /api/v2/business-information/brand-context`
2. Validate authentication token
3. Validate all required fields
4. Generate unique `business_id`
5. Store brand context data
6. Return response with `business_id`
7. Handle errors gracefully

## Future Enhancements

1. **Update Brand Context**: `PUT /api/v2/business-information/brand-context/:id`
2. **Get Brand Context**: `GET /api/v2/business-information/brand-context/:id`
3. **Delete Brand Context**: `DELETE /api/v2/business-information/brand-context/:id`
4. **Validate business_id**: Check if business_id exists before operations

## Troubleshooting

### business_id not stored

**Solution**: Check console for errors, verify API endpoint is correct

### API call fails

**Solution**: Verify authentication token, check network connectivity

### GPT generation fails

**Solution**: API call will be skipped, user flow continues normally

### business_id is null

**Solution**: Wait for GPT generation + API call to complete, or manually call API

## Contact

For issues or questions about this integration, please contact the development team or create an issue in the project repository.
