import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shipmentService, Shipment } from '../services/shipment.service';
import { bidService } from '../services/bid.service';
import { useAuthStore } from '../stores/auth.store';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';

export default function BrowseShipmentsPage() {
  const { user } = useAuthStore();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'weight'>('newest');

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const data = await shipmentService.getAvailableShipments();
      setShipments(data);
    } catch (error) {
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (shipmentId: string) => {
    // This would open a bid modal or navigate to bid page
    // For now, we'll just show a toast
    toast.success('Bid functionality coming soon!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'AWAITING_BIDS': return 'text-blue-600 bg-blue-50';
      case 'BID_ACCEPTED': return 'text-green-600 bg-green-50';
      case 'IN_TRANSIT': return 'text-purple-600 bg-purple-50';
      case 'DELIVERED': return 'text-green-700 bg-green-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'SMALL': return '📦';
      case 'MEDIUM': return '📋';
      case 'LARGE': return '🚛';
      default: return '📦';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    if (filter === 'all') return true;
    return shipment.size.toLowerCase() === filter;
  });

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'weight':
        return b.weight - a.weight;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Shipments</h1>
              <p className="text-gray-600 mt-1">Find shipments to transport and place your bids</p>
            </div>
            <div className="text-sm text-gray-500">
              {sortedShipments.length} shipments available
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Size Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Package Size</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Sizes' },
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="size"
                        value={option.value}
                        checked={filter === option.value}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="weight">Heaviest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipments List */}
          <div className="flex-1">
            {sortedShipments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2m-14 0h2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No shipments available</h3>
                <p className="text-gray-500">Check back later for new shipping opportunities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedShipments.map((shipment) => (
                  <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Package Icon */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {getSizeIcon(shipment.size)}
                        </div>

                        {/* Shipment Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {shipment.origin} → {shipment.destination}
                              </h3>
                              <p className="text-gray-600 mb-3 line-clamp-2">{shipment.description}</p>
                              
                              {/* Package Info */}
                              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">Size:</span>
                                  <span>{shipment.size}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">Weight:</span>
                                  <span>{shipment.weight}kg</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">Posted:</span>
                                  <span>{formatDate(shipment.createdAt)}</span>
                                </div>
                              </div>

                              {/* Customer Info */}
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-600">
                                    {shipment.customer.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span>Posted by {shipment.customer.name}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-end space-y-3 ml-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                                {shipment.status.replace('_', ' ')}
                              </span>
                              
                              <div className="flex flex-col space-y-2">
                                <Link
                                  to={`/shipments/${shipment.id}`}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  View Details
                                </Link>
                                
                                {user?.role === 'TRANSPORTER' && shipment.status === 'AWAITING_BIDS' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handlePlaceBid(shipment.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Place Bid
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 