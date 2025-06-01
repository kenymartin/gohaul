import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, MapPin, Star, Eye, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  type: 'STANDARD' | 'AUCTION';
  status: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDateTime: string;
  deliveryDateTime: string;
  itemType: string;
  weight?: number;
  fixedPrice?: number;
  startingBid?: number;
  maxBudget?: number;
  biddingEndsAt?: string;
  poster: {
    name: string;
    rating?: number;
  };
}

interface Bid {
  id: string;
  jobId: string;
  amount: number;
  message?: string;
  estimatedDelivery: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  job: {
    title: string;
    pickupLocation: string;
    deliveryLocation: string;
  };
  transporter?: {
    name: string;
    rating?: number;
  };
}

export default function BidsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'available' | 'my-bids' | 'received'>('available');
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [receivedBids, setReceivedBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      // Mock data - replace with actual API calls
      if (activeTab === 'available') {
        setAvailableJobs([
          {
            id: '1',
            title: 'Electronics Shipment - Los Angeles to Chicago',
            description: 'Urgent shipment of electronic components for manufacturing.',
            type: 'AUCTION',
            status: 'OPEN_FOR_BIDS',
            pickupLocation: 'ACME Warehouse, Los Angeles, CA',
            deliveryLocation: 'Manufacturing Plant, Chicago, IL',
            pickupDateTime: '2024-12-18T08:00:00Z',
            deliveryDateTime: '2024-12-20T17:00:00Z',
            itemType: 'Electronics',
            weight: 500,
            startingBid: 800,
            maxBudget: 1200,
            biddingEndsAt: '2024-12-16T23:59:59Z',
            poster: { name: 'ACME Corporation', rating: 4.2 }
          },
          {
            id: '2',
            title: 'Furniture Delivery - Sofa and Coffee Table',
            description: 'Need to move furniture from store to apartment.',
            type: 'STANDARD',
            status: 'OPEN_FOR_BIDS',
            pickupLocation: '123 Furniture Store St, New York, NY',
            deliveryLocation: '123 Main St, New York, NY 10001',
            pickupDateTime: '2024-12-15T10:00:00Z',
            deliveryDateTime: '2024-12-15T14:00:00Z',
            itemType: 'Furniture',
            weight: 150,
            fixedPrice: 120,
            poster: { name: 'John Customer', rating: 4.5 }
          }
        ]);
      } else if (activeTab === 'my-bids') {
        setMyBids([
          {
            id: '1',
            jobId: '1',
            amount: 950,
            message: 'I have experience with temperature-controlled transport.',
            estimatedDelivery: '2024-12-20T16:00:00Z',
            status: 'PENDING',
            createdAt: '2024-12-10T10:00:00Z',
            job: {
              title: 'Electronics Shipment - Los Angeles to Chicago',
              pickupLocation: 'Los Angeles, CA',
              deliveryLocation: 'Chicago, IL'
            }
          }
        ]);
      } else if (activeTab === 'received') {
        setReceivedBids([
          {
            id: '1',
            jobId: '2',
            amount: 110,
            message: 'Professional furniture delivery service.',
            estimatedDelivery: '2024-12-15T13:00:00Z',
            status: 'PENDING',
            createdAt: '2024-12-10T09:00:00Z',
            job: {
              title: 'Furniture Delivery - Sofa and Coffee Table',
              pickupLocation: 'New York, NY',
              deliveryLocation: 'New York, NY'
            },
            transporter: { name: 'Carlos Rodriguez', rating: 4.9 }
          }
        ]);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const placeBid = async (jobId: string) => {
    try {
      // TODO: API call to place bid
      toast.success('Bid placed successfully!');
      setShowBidModal(null);
      setBidAmount('');
      setBidMessage('');
      // Refresh data
      fetchData();
    } catch (error) {
      toast.error('Failed to place bid');
    }
  };

  const acceptBid = async (bidId: string) => {
    try {
      // TODO: API call to accept bid
      toast.success('Bid accepted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to accept bid');
    }
  };

  const rejectBid = async (bidId: string) => {
    try {
      // TODO: API call to reject bid
      toast.success('Bid rejected');
      fetchData();
    } catch (error) {
      toast.error('Failed to reject bid');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'available', label: 'Available Jobs', show: user?.role === 'TRANSPORTER' },
    { id: 'my-bids', label: 'My Bids', show: user?.role === 'TRANSPORTER' },
    { id: 'received', label: 'Received Bids', show: user?.role === 'CUSTOMER' || user?.role === 'COMPANY' },
  ].filter(tab => tab.show);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bidding Center</h1>
        <p className="text-gray-600">
          {user?.role === 'TRANSPORTER' 
            ? 'Find jobs and place competitive bids'
            : 'Review and manage bids on your jobs'
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#FF9900] text-[#FF9900]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Available Jobs Tab */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableJobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      job.type === 'AUCTION' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.pickupLocation} → {job.deliveryLocation}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDate(job.pickupDateTime)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">Posted by: {job.poster.name}</span>
                    {job.poster.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{job.poster.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="mb-4">
                    {job.type === 'STANDARD' ? (
                      <div className="text-2xl font-bold text-gray-900">
                        ${job.fixedPrice}
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-gray-600">Starting at</div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${job.startingBid}
                        </div>
                        {job.maxBudget && (
                          <div className="text-sm text-gray-600">
                            Max: ${job.maxBudget}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {job.biddingEndsAt && (
                    <div className="text-sm text-red-600 mb-4">
                      Ends: {formatDate(job.biddingEndsAt)}
                    </div>
                  )}

                  <Button onClick={() => setShowBidModal(job.id)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Place Bid
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Bids Tab */}
      {activeTab === 'my-bids' && (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div key={bid.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {bid.job.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {bid.job.pickupLocation} → {bid.job.deliveryLocation}
                  </div>
                  {bid.message && (
                    <p className="text-gray-600 mb-3">{bid.message}</p>
                  )}
                  <div className="text-sm text-gray-500">
                    Placed on {formatDate(bid.createdAt)}
                  </div>
                </div>
                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${bid.amount}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bid.status)}`}>
                    {bid.status}
                  </span>
                  <div className="text-sm text-gray-600 mt-2">
                    ETA: {formatDate(bid.estimatedDelivery)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Received Bids Tab */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedBids.map((bid) => (
            <div key={bid.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {bid.job.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm mb-3">
                    <span className="text-gray-600">From: {bid.transporter?.name}</span>
                    {bid.transporter?.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{bid.transporter.rating}</span>
                      </div>
                    )}
                  </div>
                  {bid.message && (
                    <p className="text-gray-600 mb-3">{bid.message}</p>
                  )}
                  <div className="text-sm text-gray-500">
                    Received on {formatDate(bid.createdAt)}
                  </div>
                </div>
                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${bid.amount}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    ETA: {formatDate(bid.estimatedDelivery)}
                  </div>
                  {bid.status === 'PENDING' && (
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() => acceptBid(bid.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rejectBid(bid.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {bid.status !== 'PENDING' && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Place Your Bid</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bid Amount ($)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9900] focus:border-[#FF9900]"
                  placeholder="Enter your bid amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9900] focus:border-[#FF9900]"
                  placeholder="Add a message to stand out..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowBidModal(null)}>
                Cancel
              </Button>
              <Button onClick={() => placeBid(showBidModal)}>
                Place Bid
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 