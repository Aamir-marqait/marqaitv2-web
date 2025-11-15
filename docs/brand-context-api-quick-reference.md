# Brand Context API - Quick Reference

## API Endpoint

```
POST http://localhost:8000/api/v2/business-information/brand-context
```

## Quick Example

```typescript
import { brandContextService } from '@/api/services/brand-context';

const response = await brandContextService.createBrandContext({
  business_name: "Marqait",
  industry_category: "Marketing & Advertising",
  brand_personality: "Innovative, Empowering, Accessible",
  brand_tone: "Friendly, conversational, and inspiring",
  color_palette: {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#EC4899"
  },
  typography: ["Inter", "Poppins"],
  literature: {
    tagline: "From chai-wala to creator",
    mission: "Marqait empowers everyone to run smart marketing campaigns",
    story: "Born from the vision..."
  },
  core_values: ["Accessibility", "Innovation", "Empowerment"]
});

// business_id automatically stored in localStorage
console.log(response.business_id); // "biz_1234567890abcdef"
```

## Where It's Called

1. **New Brand Flow**: `src/pages/onboarding/brand-details.tsx` (line 68)
2. **Existing Brand Flow**: `src/pages/onboarding/existing-brand-details.tsx` (line 68)

## When It's Called

- After user fills Brand Details form
- After GPT-4o brandbook generation completes
- Before navigating to Color Palette page
- Runs in background (non-blocking)

## How business_id is Stored

### localStorage
```typescript
localStorage.setItem('business_id', response.business_id);
```

### Context
```typescript
const { setBusinessId } = useBranding();
setBusinessId(response.business_id);
```

## How to Access business_id

```typescript
// Method 1: From Context
const { brandingData } = useBranding();
const businessId = brandingData.businessId;

// Method 2: From Service
import { brandContextService } from '@/api/services/brand-context';
const businessId = brandContextService.getBusinessId();

// Method 3: From localStorage
const businessId = localStorage.getItem('business_id');
```

## Use business_id in Other APIs

```typescript
// Example: Create Campaign
await api.post('/api/v2/campaigns', {
  business_id: brandingData.businessId,
  campaign_name: "Summer Sale",
  // ... other fields
});
```

## Testing Checklist

- [ ] Check console logs for `✅ Brand context created with business_id:`
- [ ] Verify `business_id` in localStorage
- [ ] Verify `brandingData.businessId` in context
- [ ] API returns valid response
- [ ] Flow continues even if API fails

## Files Modified

1. `src/api/services/brand-context.ts` - New service
2. `src/api/services/index.ts` - Export service
3. `src/contexts/BrandingContext.tsx` - Added businessId field
4. `src/pages/onboarding/brand-details.tsx` - API integration
5. `src/pages/onboarding/existing-brand-details.tsx` - API integration

## Console Logs to Watch For

```
🚀 Starting brandbook content generation...
✅ NEW brandbook content generated and stored in localStorage
📡 Creating brand context via API...
✅ Brand context created with business_id: biz_xxx
```

## Error Scenarios

| Error | Impact |
|-------|--------|
| GPT generation fails | API call skipped, flow continues |
| API call fails | Logged, flow continues |
| Network timeout | Logged, flow continues |
| Invalid token | API returns 401, logged |

## Common Issues

### business_id is null
**Cause**: API call not completed yet or failed
**Solution**: Wait for background process or check console for errors

### API returns 401
**Cause**: Invalid/expired auth token
**Solution**: Refresh token or re-authenticate

### API returns 400
**Cause**: Invalid request data
**Solution**: Check request payload, verify all required fields

## Next Steps After Integration

1. Update Business Content Setup to use `business_id`
2. Update Media Gallery to associate with `business_id`
3. Update Campaign creation to include `business_id`
4. Add business_id validation before operations
5. Implement GET/PUT/DELETE endpoints for brand context
