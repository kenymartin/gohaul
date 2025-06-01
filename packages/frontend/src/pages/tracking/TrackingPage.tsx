import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Truck, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'react-hot-toast';

interface TrackingUpdate {
  id: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  message?: string;
  timestamp: string;
}

interface TrackedJob {
  id: string;
  title: string;
  description: string;
  status: 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED';
  pickupLocation: string;
  deliveryLocation: string;
  pickupDateTime: string;
  deliveryDateTime: string;
  transporter: {
    name: string;
    phone: string;
    vehicleInfo: string;
  };
  customer: {
    name: string;
    phone: string;
  };
  trackingUpdates: TrackingUpdate[];
  estimatedArrival?: string;
}

export default function TrackingPage() {
  const { user } = useAuthStore();
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<TrackedJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrackedJobs();
    // Set up real-time updates
    const interval = setInterval(fetchTrackedJobs, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTrackedJobs = async () => {
    try {
      // Mock data - replace with actual API call
      const mockJobs: TrackedJob[] = [
        {
          id: '1',
          title: 'Office Equipment Move',
          description: 'Moving office equipment including desks, chairs, and computers.',
          status: 'IN_TRANSIT',
          pickupLocation: '456 Oak Ave, Los Angeles, CA',
          deliveryLocation: '789 New Office Blvd, Los Angeles, CA',
          pickupDateTime: '2024-12-10T09:00:00Z',
          deliveryDateTime: '2024-12-10T15:00:00Z',
          transporter: {
            name: 'Carlos Rodriguez',
            phone: '+1-555-0301',
            vehicleInfo: 'Freightliner Cascadia (TRK-001)'
          },
          customer: {
            name: 'Sarah Buyer',
            phone: '+1-555-0102'
          },
          trackingUpdates: [
            {
              id: '1',
              location: 'Pickup Location - 456 Oak Ave, Los Angeles, CA',
              latitude: 34.0522,
              longitude: -118.2437,
              status: 'PICKED_UP',
              message: 'Items successfully loaded. Starting journey.',
              timestamp: '2024-12-10T09:15:00Z'
            },
            {
              id: '2',
              location: 'Highway 405, Los Angeles, CA',
              latitude: 34.0689,
              longitude: -118.2445,
              status: 'IN_TRANSIT',
              message: 'On Highway 405, traffic is light. ETA: 15:00',
              timestamp: '2024-12-10T11:30:00Z'
            },
            {
              id: '3',
              location: 'Warehouse District, Los Angeles, CA',
              latitude: 34.0522,
              longitude: -118.2437,
              status: 'IN_TRANSIT',
              message: 'All items loaded successfully. ETA: 3:00 PM',
              timestamp: '2024-12-10T13:45:00Z'
            }
          ],
          estimatedArrival: '2024-12-10T15:00:00Z'
        }
      ];
      
      setTrackedJobs(mockJobs);
      if (!selectedJob && mockJobs.length > 0) {
        setSelectedJob(mockJobs[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch tracking data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PICKED_UP': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'IN_TRANSIT': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'DELAYED': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (estimatedArrival: string) => {
    const now = new Date();
    const arrival = new Date(estimatedArrival);
    const diffInMinutes = Math.floor((arrival.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 0) return 'Overdue';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
        <p className="text-gray-600">Monitor your shipments in real-time</p>
      </div>

      {trackedJobs.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No active shipments to track
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any shipments currently in transit.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Shipments</h2>
            {trackedJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors ${
                  selectedJob?.id === job.id
                    ? 'border-[#FF9900] bg-orange-50'
                    : 'hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.deliveryLocation}
                  </div>
                  {job.estimatedArrival && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      ETA: {getTimeRemaining(job.estimatedArrival)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tracking Details */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="bg-white border border-gray-200 rounded-lg">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h2>
                      <p className="text-gray-600">{selectedJob.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedJob.status)}`}>
                      {selectedJob.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Pickup</h3>
                      <p className="text-sm text-gray-600">{selectedJob.pickupLocation}</p>
                      <p className="text-sm text-gray-500">{formatTime(selectedJob.pickupDateTime)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Delivery</h3>
                      <p className="text-sm text-gray-600">{selectedJob.deliveryLocation}</p>
                      <p className="text-sm text-gray-500">{formatTime(selectedJob.deliveryDateTime)}</p>
                    </div>
                  </div>

                  {selectedJob.estimatedArrival && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Navigation className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-900">
                          Estimated arrival: {getTimeRemaining(selectedJob.estimatedArrival)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Transporter</h4>
                      <p className="text-sm text-gray-900">{selectedJob.transporter.name}</p>
                      <p className="text-sm text-gray-600">{selectedJob.transporter.phone}</p>
                      <p className="text-sm text-gray-500">{selectedJob.transporter.vehicleInfo}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Customer</h4>
                      <p className="text-sm text-gray-900">{selectedJob.customer.name}</p>
                      <p className="text-sm text-gray-600">{selectedJob.customer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Tracking Updates</h3>
                  <div className="space-y-4">
                    {selectedJob.trackingUpdates
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((update, index) => (
                        <div key={update.id} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(update.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {update.location}
                                </p>
                                {update.message && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {update.message}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatTime(update.timestamp)}
                              </span>
                            </div>
                            {index < selectedJob.trackingUpdates.length - 1 && (
                              <div className="w-px h-4 bg-gray-200 ml-2 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="p-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Live Map</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Interactive map will be displayed here</p>
                      <p className="text-xs text-gray-400">Integration with mapping service required</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a shipment to track
                </h3>
                <p className="text-sm text-gray-500">
                  Choose a shipment from the list to view detailed tracking information.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 