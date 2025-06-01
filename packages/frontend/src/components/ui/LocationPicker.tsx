import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, X } from 'lucide-react';

interface LocationData {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface LocationPickerProps {
  label: string;
  placeholder?: string;
  value?: LocationData | null;
  onChange: (location: LocationData | null) => void;
  error?: string;
  required?: boolean;
}

export default function LocationPicker({
  label,
  placeholder = "Enter address or click on map",
  value,
  onChange,
  error,
  required = false,
}: LocationPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value?.address || '');
  const [showMap, setShowMap] = useState(false);

  // Google Maps API Key - you'll need to set this in your environment
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (isLoaded || !GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') return;

      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.load();
        setIsLoaded(true);
        initializeAutocomplete();
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    loadGoogleMaps();
  }, [GOOGLE_MAPS_API_KEY, isLoaded]);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['place_id', 'geometry', 'name', 'formatted_address', 'address_components'],
    });

    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry?.location) return;

    const location: LocationData = {
      address: place.formatted_address || place.name || '',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      placeId: place.place_id,
    };

    // Extract additional address components
    if (place.address_components) {
      place.address_components.forEach((component) => {
        const types = component.types;
        if (types.includes('locality')) {
          location.city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          location.state = component.short_name;
        } else if (types.includes('country')) {
          location.country = component.short_name;
        } else if (types.includes('postal_code')) {
          location.postalCode = component.long_name;
        }
      });
    }

    setInputValue(location.address);
    onChange(location);

    if (showMap && mapInstanceRef.current) {
      const latLng = new google.maps.LatLng(location.lat, location.lng);
      mapInstanceRef.current.setCenter(latLng);
      updateMarker(latLng);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google || mapInstanceRef.current) return;

    const defaultLocation = value ? 
      new google.maps.LatLng(value.lat, value.lng) : 
      new google.maps.LatLng(40.7128, -74.0060); // Default to NYC

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add click listener to map
    mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // Reverse geocoding to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: event.latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location: LocationData = {
            address: results[0].formatted_address,
            lat,
            lng,
            placeId: results[0].place_id,
          };
          
          setInputValue(location.address);
          onChange(location);
          updateMarker(event.latLng!);
        }
      });
    });

    // Add existing marker if value exists
    if (value) {
      updateMarker(defaultLocation);
    }
  };

  const updateMarker = (position: google.maps.LatLng) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    markerRef.current = new google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      draggable: true,
      title: 'Selected Location',
    });

    // Handle marker drag
    markerRef.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // Reverse geocoding for dragged marker
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: event.latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location: LocationData = {
            address: results[0].formatted_address,
            lat,
            lng,
            placeId: results[0].place_id,
          };
          
          setInputValue(location.address);
          onChange(location);
        }
      });
    });
  };

  const handleMapToggle = () => {
    setShowMap(!showMap);
    if (!showMap && isLoaded) {
      // Initialize map after it becomes visible
      setTimeout(initializeMap, 100);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange(null);
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If input is cleared, reset location
    if (!value) {
      onChange(null);
    }
  };

  const showApiKeyWarning = GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE';

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {showApiKeyWarning && (
        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            ⚠️ Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY in your environment.
          </p>
        </div>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`block w-full rounded-md border border-gray-300 px-3 py-2 pr-20 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-[#FF9900] focus:outline-none focus:ring-1 focus:ring-[#FF9900] ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          disabled={!isLoaded && !showApiKeyWarning}
        />
        
        <div className="absolute right-1 top-1 flex space-x-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {isLoaded && (
            <button
              type="button"
              onClick={handleMapToggle}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                showMap 
                  ? 'text-[#FF9900] bg-orange-50' 
                  : 'text-gray-400 hover:text-[#FF9900]'
              }`}
              title="Toggle map view"
            >
              <MapPin className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {showMap && isLoaded && (
        <div className="mt-2 rounded-md border border-gray-300 overflow-hidden">
          <div
            ref={mapRef}
            className="h-64 w-full"
          />
          <div className="p-2 bg-gray-50 text-xs text-gray-600">
            💡 Click on the map to select a location, or drag the marker to adjust
          </div>
        </div>
      )}

      {value && (
        <div className="mt-2 text-xs text-gray-500">
          📍 Selected: {value.city && value.state ? `${value.city}, ${value.state}` : value.address}
          {value.lat && value.lng && (
            <span className="ml-2">({value.lat.toFixed(6)}, {value.lng.toFixed(6)})</span>
          )}
        </div>
      )}
    </div>
  );
} 