# Logo Background Removal Feature

## Overview
Automatic white background removal is now integrated into the logo selection flow. When a user selects one of the 6 generated logos, the system automatically removes the white background before saving it to the database and displaying it in the brandbook.

## How It Works

### Flow
1. **User selects a logo** from the 6 generated options
2. **Background removal** - White pixels are detected and made transparent using Canvas API
3. **Save to database** - Processed logo (with transparent background) is saved
4. **Logo variants generation** - 4 background variants are created using the transparent logo
5. **Brandbook display** - Transparent logo is shown throughout the brandbook slider

### Implementation Details

#### Background Removal Algorithm
Located in: `src/utils/removeBackground.ts`

```typescript
removeWhiteBackground(imageUrl, {
  threshold: 240,  // Detect pixels with RGB values >= 240
  tolerance: 30,   // Remove near-white pixels too
  quality: 1       // Maximum output quality
})
```

**How it works:**
- Uses HTML5 Canvas API to process image pixel-by-pixel
- Detects white/near-white pixels (RGB values close to 255,255,255)
- Makes white pixels fully transparent (alpha = 0)
- Gradually reduces opacity for near-white pixels
- Returns PNG with transparent background as base64 data URL

#### Integration Points

**1. Logo Generation Page** (`src/pages/onboarding/logo-generation.tsx:153`)
```typescript
const handleLogoClick = async (idx: number, isEditClick: boolean) => {
  // Step 1: Remove background
  const logoWithoutBg = await removeWhiteBackground(selectedLogoUrl)

  // Step 2: Save to database
  await brandContextService.saveLogoUrl(businessId, logoWithoutBg)

  // Step 3: Generate variants
  await generateLogoVariants(logoWithoutBg)
}
```

**2. Loading Progress** (`src/components/onboarding/LogoVariantsLoadingScreen.tsx:8`)
- 0-25%: "Removing background..."
- 25-40%: "Saving your logo..."
- 40-100%: "Generating brandbook..."

## Configuration Options

You can adjust the background removal sensitivity by modifying these parameters:

```typescript
{
  threshold: 240,    // Range: 0-255
                     // Lower = more strict white detection
                     // Higher = more colors considered "white"

  tolerance: 30,     // Range: 0-100
                     // Higher = more aggressive removal
                     // Lower = preserve more near-white pixels

  quality: 1         // Range: 0-1
                     // Output PNG quality
}
```

## Utility Functions

### Core Functions
- `removeWhiteBackground(imageUrl, options)` - Main background removal function
- `dataURLtoBlob(dataUrl)` - Convert base64 to Blob for uploads
- `dataURLtoFile(dataUrl, filename)` - Convert base64 to File object
- `uploadProcessedLogo(dataUrl, filename, endpoint)` - Upload to backend

### Example Usage

```typescript
import { removeWhiteBackground, dataURLtoBlob } from '@/utils/removeBackground';

// Basic usage
const transparentLogo = await removeWhiteBackground(logoUrl);

// Custom settings for more aggressive removal
const transparentLogo = await removeWhiteBackground(logoUrl, {
  threshold: 230,   // More colors treated as white
  tolerance: 50,    // More aggressive removal
  quality: 0.95     // Slightly compressed
});

// Convert to blob for upload
const blob = dataURLtoBlob(transparentLogo);
```

## Fallback Behavior

If background removal fails:
1. System logs error to console
2. Falls back to using original logo URL
3. Saves original logo to database
4. Continues with variant generation using original logo
5. User flow is not interrupted

## Testing

To test the background removal:
1. Navigate to logo generation page
2. Select any of the 6 generated logos
3. Watch the loading screen progress:
   - "Removing background..." (0-25%)
   - "Saving your logo..." (25-40%)
   - "Generating brandbook..." (40-100%)
4. Check browser console for logs:
   - `🎨 Removing white background from logo...`
   - `✅ Background removed successfully`
   - `💾 Saving processed logo...`
   - `✅ Processed logo saved to database`

## Performance

- **Background removal**: ~500-1000ms (depends on image size)
- **Database save**: ~200-500ms
- **Variant generation**: ~2-4 seconds per variant (4 total)
- **Total**: ~10-15 seconds from selection to brandbook

## Known Limitations

1. **White background only** - Currently optimized for white backgrounds. Won't work well with colored backgrounds.
2. **Base64 size** - Large logos may result in large base64 strings. Consider implementing server-side upload endpoint.
3. **CORS** - External image URLs must have CORS enabled (`crossOrigin: 'anonymous'`)

## Future Improvements

1. **Server-side processing** - Move background removal to backend for better performance
2. **AI-based removal** - Use Remove.bg API or similar for complex backgrounds
3. **Multiple background colors** - Support detection of different background colors
4. **Edge refinement** - Smooth edges after background removal
5. **Upload endpoint** - Create dedicated endpoint for processed logo uploads instead of base64 in database

## Troubleshooting

**Issue: Background not removed**
- Check console for errors
- Verify image URL has CORS enabled
- Adjust threshold/tolerance parameters
- Ensure image has white/near-white background

**Issue: Too much removed**
- Decrease tolerance (try 20 instead of 30)
- Increase threshold (try 245 instead of 240)

**Issue: Edges look jagged**
- This is expected with pixel-based removal
- Consider implementing edge smoothing
- Or use AI-based background removal service

**Issue: CORS error**
- Image URL must support cross-origin requests
- For local testing, use a CORS proxy
- For production, ensure your CDN allows CORS
