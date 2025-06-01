import React, { useState, useEffect } from 'react';
import { Plus, Truck, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'react-hot-toast';

interface Vehicle {
  id: string;
  type: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: string;
  description?: string;
  isActive: boolean;
}

export default function VehiclesPage() {
  const { user } = useAuthStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      // TODO: Replace with actual API call
      setVehicles([
        {
          id: '1',
          type: 'LARGE_TRUCK',
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2020,
          licensePlate: 'TRK-001',
          capacity: '5000kg, 40 cubic meters',
          description: 'Large cargo truck suitable for heavy deliveries',
          isActive: true,
        },
        {
          id: '2',
          type: 'VAN',
          make: 'Mercedes',
          model: 'Sprinter',
          year: 2019,
          licensePlate: 'VAN-002',
          capacity: '1500kg, 15 cubic meters',
          description: 'Medium van for city deliveries',
          isActive: true,
        }
      ]);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  const getVehicleTypeDisplay = (type: string) => {
    switch (type) {
      case 'MOTORCYCLE': return 'Motorcycle';
      case 'CAR': return 'Car';
      case 'VAN': return 'Van';
      case 'SMALL_TRUCK': return 'Small Truck';
      case 'MEDIUM_TRUCK': return 'Medium Truck';
      case 'LARGE_TRUCK': return 'Large Truck';
      case 'TRAILER': return 'Trailer';
      case 'SPECIALIZED': return 'Specialized';
      default: return type;
    }
  };

  const toggleVehicleStatus = async (vehicleId: string, isActive: boolean) => {
    try {
      // TODO: API call to update vehicle status
      setVehicles(vehicles.map(v => 
        v.id === vehicleId ? { ...v, isActive: !isActive } : v
      ));
      toast.success(`Vehicle ${!isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update vehicle status');
    }
  };

  if (user?.role !== 'TRANSPORTER') {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Access Denied
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Only transporters can manage vehicles.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-600">Manage your fleet and vehicle information</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first vehicle.
          </p>
          <div className="mt-6">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Truck className="w-8 h-8 text-[#FF9900] mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500">{vehicle.year}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {vehicle.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium">
                    {getVehicleTypeDisplay(vehicle.type)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">License:</span>
                  <span className="text-sm font-medium">{vehicle.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="text-sm font-medium">{vehicle.capacity}</span>
                </div>
              </div>

              {vehicle.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {vehicle.description}
                </p>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {/* TODO: Edit vehicle */}}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVehicleStatus(vehicle.id, vehicle.isActive)}
                  className={vehicle.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                >
                  {vehicle.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal would go here */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
            <p className="text-gray-600 mb-4">Vehicle form will be implemented here</p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddForm(false)}>
                Add Vehicle
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 