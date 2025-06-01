# 🗺️ Google Maps API Setup Guide

## 🚀 Quick Setup (15 minutes)

### Step 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. **Enable these APIs** (REQUIRED):
   - Maps JavaScript API
   - Places API (New)
   - Geocoding API

### Step 2: Create API Key
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy your API key (starts with `AIza...`)

### Step 3: Secure Your API Key (IMPORTANT)
1. Click **Restrict Key** 
2. **Application restrictions**: HTTP referrers
3. Add these referrers:
   ```
   http://localhost:*
   https://yourdomain.com/*
   ```
4. **API restrictions**: Select the 3 APIs above

### Step 4: Add to Your Project
1. Open: `packages/backend/.env`
2. Add this line:
   ```
   GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
   ```

### Step 5: Update Frontend Environment
1. Open: `packages/frontend/.env` (create if doesn't exist)
2. Add:
   ```
   VITE_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
   ```

## 💰 Pricing (Don't worry - it's free for development)

### Free Tier (per month):
- **Maps JavaScript API**: 28,000 loads FREE
- **Places API**: 17,000 requests FREE  
- **Geocoding API**: 40,000 requests FREE

### Typical usage for your app:
- **Development**: ~100-500 requests/month = FREE
- **Small business**: ~2,000-5,000 requests/month = $10-25
- **Growing business**: ~10,000+ requests/month = $50-100

## ⚡ Test Your Setup

After adding the API key, test these features:
1. **Create Shipment page** → Should show map with search
2. **Location picker** → Click map to drop pin
3. **Address autocomplete** → Type to see suggestions

## 🔧 Alternative: Mapbox (if you prefer)

If you want to use Mapbox instead:
1. Sign up at [mapbox.com](https://www.mapbox.com/)
2. Get free API key (50,000 requests/month)
3. Replace Google Maps code with Mapbox GL JS

## 🚨 Troubleshooting

### "This page can't load Google Maps correctly"
- Check API key is correct
- Verify APIs are enabled
- Check billing account (add $1 to verify)

### Map shows but no search
- Enable Places API (New)
- Wait 5-10 minutes for activation

### "RefererNotAllowedMapError"
- Add `http://localhost:*` to referrer restrictions
- Or temporarily remove all restrictions for testing

## ✅ Quick Verification Commands

Test your setup:
```bash
# Frontend should show your API key
echo $VITE_GOOGLE_MAPS_API_KEY

# Backend should show your API key  
echo $GOOGLE_MAPS_API_KEY
```

**🎯 Result**: Users can now pick precise GPS coordinates instead of typing addresses! 