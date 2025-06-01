import { useState, useEffect } from 'react';
import { Shipment } from '../types/shared.types';
import axios from 'axios';

export const TransporterDashboard = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableShipments();
  }, []);

  const fetchAvailableShipments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/shipments/available', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShipments(response.data.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async (shipmentId: string, price: number, eta: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:4000/api/shipments/${shipmentId}/bids`,
        { price, eta },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh shipments after placing bid
      fetchAvailableShipments();
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading available shipments...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Available Shipments</h2>
      
      {shipments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No available shipments at the moment.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {shipment.origin} → {shipment.destination}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {shipment.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Size:</span> {shipment.size}</p>
                <p><span className="font-medium">Weight:</span> {shipment.weight} kg</p>
                <p><span className="font-medium">Description:</span> {shipment.description}</p>
                <p><span className="font-medium">Customer:</span> {shipment.customer.name}</p>
              </div>
              
              <div className="mt-4 space-y-2">
                <input
                  type="number"
                  placeholder="Bid amount ($)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  placeholder="Estimated delivery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {shipment.status === 'AWAITING_BIDS' && (
                <button
                  onClick={() => placeBid(shipment.id, 100, '2024-01-15')}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Place Bid
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 