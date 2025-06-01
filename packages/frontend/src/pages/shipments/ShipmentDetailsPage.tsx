import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { shipmentService, type Shipment } from '../../services/shipment.service';

export default function ShipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchShipment = async () => {
      if (!id) return;
      try {
        const data = await shipmentService.getById(id);
        setShipment(data);
      } catch (error) {
        toast.error('Failed to load shipment details');
        navigate('/shipments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipment();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus: Shipment['status']) => {
    if (!id || !shipment) return;
    setIsUpdating(true);

    try {
      const updatedShipment = await shipmentService.updateStatus(id, newStatus);
      setShipment(updatedShipment);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Shipment not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment Details</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage shipment information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline" onClick={() => navigate('/shipments')}>
            Back to Shipments
          </Button>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Shipment Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Details and status of the shipment.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    shipment.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : shipment.status === 'IN_TRANSIT'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {shipment.status}
                </span>
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(shipment.createdAt).toLocaleString()}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Origin</dt>
              <dd className="mt-1 text-sm text-gray-900">{shipment.origin}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Destination</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {shipment.destination}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{shipment.size}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Weight</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {shipment.weight} kg
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {shipment.description}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Customer</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {shipment.customer.name}
                <br />
                <span className="text-gray-500">{shipment.customer.email}</span>
              </dd>
            </div>

            {shipment.transporter && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Transporter</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {shipment.transporter.name}
                  <br />
                  <span className="text-gray-500">
                    {shipment.transporter.email}
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {shipment.status !== 'DELIVERED' && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex space-x-3">
              {shipment.status === 'PENDING' && (
                <Button
                  onClick={() => handleStatusUpdate('IN_TRANSIT')}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Start Transit'}
                </Button>
              )}
              {shipment.status === 'IN_TRANSIT' && (
                <Button
                  onClick={() => handleStatusUpdate('DELIVERED')}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Mark as Delivered'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 