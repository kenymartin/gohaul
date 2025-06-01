import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LocationPicker from '../../components/ui/LocationPicker';
import { shipmentService } from '../../services/shipment.service';
import { CreateShipmentDto, LocationData } from '../../types/shared.types';

const createShipmentSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
  weight: z.number().min(0.1, 'Weight must be greater than 0'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  originLocation: z.object({
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
    placeId: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  destinationLocation: z.object({
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
    placeId: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
});

type CreateShipmentFormData = z.infer<typeof createShipmentSchema>;

export default function CreateShipmentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<CreateShipmentFormData>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      size: 'MEDIUM',
      weight: 1,
    },
  });

  const watchedSize = watch('size');

  const onSubmit = async (data: CreateShipmentFormData) => {
    try {
      setIsLoading(true);
      
      // Prepare shipment data
      const shipmentData: CreateShipmentDto = {
        origin: data.originLocation?.address || data.origin,
        destination: data.destinationLocation?.address || data.destination,
        size: data.size,
        weight: data.weight,
        description: data.description,
        originLocation: data.originLocation,
        destinationLocation: data.destinationLocation,
      };

      const shipment = await shipmentService.create(shipmentData);
      toast.success('Shipment created successfully!');
      navigate(`/shipments/${shipment.id}`);
    } catch (error) {
      toast.error('Failed to create shipment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOriginLocationChange = (location: LocationData | null) => {
    setValue('originLocation', location || undefined);
    if (location) {
      setValue('origin', location.address);
    }
  };

  const handleDestinationLocationChange = (location: LocationData | null) => {
    setValue('destinationLocation', location || undefined);
    if (location) {
      setValue('destination', location.address);
    }
  };

  const sizeOptions = [
    { value: 'SMALL', label: 'Small Package', description: 'Up to 2 cubic feet, max 50 lbs', icon: '📦' },
    { value: 'MEDIUM', label: 'Medium Package', description: 'Up to 10 cubic feet, max 150 lbs', icon: '📋' },
    { value: 'LARGE', label: 'Large Package', description: 'Over 10 cubic feet, 150+ lbs', icon: '🚛' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#FF9900] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post a Shipment</h1>
              <p className="text-gray-600">Get bids from transporters in your area</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Shipment Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📍 Shipment Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Controller
                name="originLocation"
                control={control}
                render={({ field }) => (
                  <LocationPicker
                    label="Pickup Location"
                    placeholder="Enter pickup address or click on map"
                    value={field.value || null}
                    onChange={handleOriginLocationChange}
                    error={errors.origin?.message}
                    required
                  />
                )}
              />
              
              <Controller
                name="destinationLocation"
                control={control}
                render={({ field }) => (
                  <LocationPicker
                    label="Delivery Location"
                    placeholder="Enter delivery address or click on map"
                    value={field.value || null}
                    onChange={handleDestinationLocationChange}
                    error={errors.destination?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Fallback input fields for when location picker isn't working */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Pickup Location (Text)"
                  placeholder="Enter pickup address or city"
                  error={errors.origin?.message}
                  {...register('origin')}
                />
                
                <Input
                  label="Delivery Location (Text)"
                  placeholder="Enter delivery address or city"
                  error={errors.destination?.message}
                  {...register('destination')}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                💡 Use the map picker above for more precise locations, or use these text fields as backup
              </p>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📦 Package Information</h2>
            
            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Package Size</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sizeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                      watchedSize === option.value
                        ? 'border-[#FF9900] ring-2 ring-[#FF9900] bg-orange-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="sr-only"
                      {...register('size')}
                    />
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{option.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="block text-sm font-medium text-gray-900">
                            {option.label}
                          </span>
                        </div>
                        <span className="block text-xs text-gray-500">
                          {option.description}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="0.0"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-[#FF9900] focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                  {...register('weight', { valueAsNumber: true })}
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Description</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe what you're shipping, any special handling requirements, pickup/delivery instructions, etc."
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-[#FF9900] focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Distance & Route Preview */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-orange-900 mb-2">🗺️ Route Information</h3>
            <div className="text-sm text-orange-800 space-y-1">
              <p>• Precise GPS coordinates will help transporters provide accurate quotes</p>
              <p>• Route optimization reduces costs and delivery time</p>
              <p>• Real-time tracking becomes available for selected locations</p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for Getting Great Bids</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use the map picker for precise pickup and delivery locations</li>
              <li>• Provide accurate dimensions and weight</li>
              <li>• Include clear pickup and delivery instructions</li>
              <li>• Mention if special handling is required</li>
              <li>• Be flexible with pickup/delivery times when possible</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creating Shipment...' : 'Post Shipment'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 