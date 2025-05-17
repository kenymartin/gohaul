import { useState, useEffect } from 'react';
import { Shipment, Bid, ShipmentStatus } from '@gohaul/shared';
import axios from 'axios';

export const TransporterDashboard = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/shipments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShipments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      setError('Failed to fetch shipments');
      setLoading(false);
    }
  };

  const submitBid = async (shipmentId: string, price: number, eta: Date) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/api/bids',
        {
          shipmentId,
          price,
          eta,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchShipments();
    } catch (error) {
      console.error('Error submitting bid:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Available Shipments</h2>
      <div className="grid gap-6">
        {shipments.map((shipment) => (
          <div
            key={shipment.id}
            className="bg-white rounded-lg shadow p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {shipment.origin} → {shipment.destination}
                </h3>
                <p className="text-gray-600">{shipment.description}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {shipment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Size</p>
                <p className="font-medium">{shipment.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-medium">{shipment.weight} kg</p>
              </div>
            </div>

            {shipment.status === ShipmentStatus.AWAITING_BIDS && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const price = parseFloat(
                    (form.elements.namedItem('price') as HTMLInputElement).value
                  );
                  const eta = new Date(
                    (form.elements.namedItem('eta') as HTMLInputElement).value
                  );
                  submitBid(shipment.id, price, eta);
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="eta"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    name="eta"
                    id="eta"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Bid
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 