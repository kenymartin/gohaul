import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { shipmentService, Shipment } from '../services/shipment.service';
import { bidService, BidResponse } from '../services/bid.service';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [bids, setBids] = useState<BidResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'bids' | 'watchlist'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [shipmentData, bidData] = await Promise.all([
        shipmentService.getMyShipments(),
        bidService.getMyBids(),
      ]);
      setShipments(shipmentData);
      setBids(bidData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Hello, {user?.name}!</h1>
              <p className="text-blue-100 mt-2">Welcome to your GoHaul dashboard</p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{shipments.length}</div>
                <div className="text-sm text-blue-100">Shipments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{bids.length}</div>
                <div className="text-sm text-blue-100">Bids</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'shipments', label: 'My Shipments', icon: '📦' },
                { id: 'bids', label: 'My Bids', icon: '💰' },
                { id: 'watchlist', label: 'Watchlist', icon: '👁️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Quick Actions */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/shipments/create"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Post New Shipment</h3>
                  <p className="text-sm text-gray-500">Create a new shipping request</p>
                </div>
              </div>
            </Link>

            <Link
              to="/browse"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Browse Shipments</h3>
                  <p className="text-sm text-gray-500">Find shipments to transport</p>
                </div>
              </div>
            </Link>

            <Link
              to="/profile"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Account Settings</h3>
                  <p className="text-sm text-gray-500">Manage your profile</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">My Shipments</h2>
                <Link
                  to="/shipments/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post New Shipment
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {shipments.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2m-14 0h2" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No shipments yet</h3>
                  <p className="text-sm text-gray-500">Get started by posting your first shipment.</p>
                </div>
              ) : (
                shipments.map((shipment) => (
                  <div key={shipment.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2m-14 0h2" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {shipment.origin} → {shipment.destination}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{shipment.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Size: {shipment.size}</span>
                              <span>Weight: {shipment.weight}kg</span>
                              <span>Posted: {formatDate(shipment.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              {shipment.status.replace('_', ' ')}
                            </span>
                            <Link
                              to={`/shipments/${shipment.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bids Tab */}
        {activeTab === 'bids' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Bids</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {bids.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No bids yet</h3>
                  <p className="text-sm text-gray-500">Browse available shipments to place your first bid.</p>
                </div>
              ) : (
                bids.map((bid) => (
                  <div key={bid.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Bid on Shipment #{bid.shipmentId.slice(-8)}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Bid Amount: ${bid.price}</span>
                          <span>ETA: {formatDate(bid.eta)}</span>
                          <span>Placed: {formatDate(bid.createdAt)}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                        {bid.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Watchlist</h2>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No items in watchlist</h3>
              <p className="text-sm text-gray-500">Items you watch will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 