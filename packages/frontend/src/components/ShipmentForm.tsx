import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateShipmentDto } from '@gohaul/shared';
import axios from 'axios';

const shipmentSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  size: z.string().min(1, 'Size is required'),
  weight: z.number().positive('Weight must be positive'),
  description: z.string().min(1, 'Description is required'),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

interface ShipmentFormProps {
  onSuccess: () => void;
}

export const ShipmentForm = ({ onSuccess }: ShipmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
  });

  const onSubmit = async (data: CreateShipmentDto) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/shipments', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
          Origin
        </label>
        <input
          type="text"
          id="origin"
          {...register('origin')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.origin && (
          <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
          Destination
        </label>
        <input
          type="text"
          id="destination"
          {...register('destination')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.destination && (
          <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
          Size
        </label>
        <input
          type="text"
          id="size"
          {...register('size')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.size && (
          <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          {...register('weight', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Shipment'}
      </button>
    </form>
  );
}; 