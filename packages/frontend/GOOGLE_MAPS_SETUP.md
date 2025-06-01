# Google Maps API Setup Guide

## Overview
The GoHaul platform now includes precise location picking using Google Maps API. This enables:
- 📍 Accurate address autocomplete
- 🗺️ Visual map selection
- 📊 GPS coordinates for tracking
- 🚛 Route optimization
- 💰 Better pricing calculations

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** 
   - **Geocoding API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure Environment Variables

Create a `.env` file in the `packages/frontend` directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:4000/api

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX

# Optional: Alternative map providers
# VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
```

### 3. API Key Security (Important!)

**For Development:**
- Restrict by HTTP referrers: `http://localhost:3000/*`

**For Production:**
- Restrict by HTTP referrers: `https://yourdomain.com/*`
- Set daily usage limits
- Monitor usage in Google Cloud Console

### 4. Alternative: Mapbox Integration

If you prefer Mapbox (more generous free tier):

```bash
npm install mapbox-gl @mapbox/mapbox-gl-geocoder
```

Set environment variable:
```bash
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
```

## Pricing Information

### Google Maps API Pricing
- **Places API**: $32/1,000 requests (1,000 free/month)
- **Geocoding API**: $5/1,000 requests  
- **Maps JavaScript API**: $7/1,000 loads
- **Free tier**: $200 credit monthly

### Mapbox Pricing (Alternative)
- **100,000 requests/month free**
- $5/1,000 additional requests
- More cost-effective for high-volume applications

## Features Available

### LocationPicker Component
```tsx
import LocationPicker from './components/ui/LocationPicker';

<LocationPicker
  label="Pickup Location"
  value={location}
  onChange={setLocation}
  error={errors.location}
  required
/>
```

### What Users Can Do:
- ✅ Type address with autocomplete
- ✅ Click on map to select location
- ✅ Drag marker to adjust position
- ✅ View precise GPS coordinates
- ✅ See city, state, postal code details
- ✅ Fallback to text input if maps fail

## Troubleshooting

### Common Issues:

1. **API Key Error**: 
   - Check console for specific error
   - Verify APIs are enabled
   - Check domain restrictions

2. **Map Not Loading**:
   - Verify internet connection
   - Check browser console for errors
   - Ensure API key has correct permissions

3. **Autocomplete Not Working**:
   - Verify Places API is enabled
   - Check for JavaScript errors
   - Try disabling browser extensions

### Fallback Options:
- Text input fields are always available
- Component gracefully degrades without API key
- Users can still manually enter addresses

## Testing Without API Key

The component will show a warning but allow text input:
```
⚠️ Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY in your environment.
```

This ensures the application remains functional during development.

## Integration Complete! 🎉

Your GoHaul platform now has professional-grade location picking that will:
- Reduce address entry errors
- Improve transporter quote accuracy  
- Enable better route planning
- Provide precise GPS tracking capabilities 