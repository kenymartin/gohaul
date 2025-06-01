import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Filter, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'react-hot-toast';

interface Review {
  id: string;
  jobId: string;
  jobTitle: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer: {
    name: string;
    role: string;
  };
  reviewee: {
    name: string;
    role: string;
  };
  isFromMe: boolean;
}

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'received' | 'given'>('all');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      // Mock data - replace with actual API call
      const mockReviews: Review[] = [
        {
          id: '1',
          jobId: 'job-1',
          jobTitle: 'Office Equipment Move',
          rating: 5,
          comment: 'Excellent service! Very professional and careful with our equipment.',
          createdAt: '2024-12-09T14:30:00Z',
          reviewer: { name: 'ACME Corporation', role: 'COMPANY' },
          reviewee: { name: 'Carlos Rodriguez', role: 'TRANSPORTER' },
          isFromMe: false
        },
        {
          id: '2',
          jobId: 'job-2',
          jobTitle: 'Furniture Delivery',
          rating: 4,
          comment: 'Good communication and on-time delivery. Would recommend!',
          createdAt: '2024-12-08T16:45:00Z',
          reviewer: { name: 'John Customer', role: 'CUSTOMER' },
          reviewee: { name: 'Maria Transport', role: 'TRANSPORTER' },
          isFromMe: true
        },
        {
          id: '3',
          jobId: 'job-3',
          jobTitle: 'Electronics Shipment',
          rating: 5,
          comment: 'Outstanding transporter! Handled fragile items with extreme care.',
          createdAt: '2024-12-07T11:20:00Z',
          reviewer: { name: 'TechStartup Inc', role: 'COMPANY' },
          reviewee: { name: 'David Logistics', role: 'TRANSPORTER' },
          isFromMe: false
        }
      ];

      setReviews(mockReviews);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'received') return !review.isFromMe;
    if (filter === 'given') return review.isFromMe;
    return true;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600">View feedback from your transportation activities</p>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {reviews.length}
          </div>
          <div className="flex justify-center mb-2">
            <MessageSquare className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) || 0}%
          </div>
          <div className="flex justify-center mb-2">
            <ThumbsUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-sm text-gray-600">Positive Reviews</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All Reviews', count: reviews.length },
            { id: 'received', label: 'Received', count: reviews.filter(r => !r.isFromMe).length },
            { id: 'given', label: 'Given', count: reviews.filter(r => r.isFromMe).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                filter === tab.id
                  ? 'border-[#FF9900] text-[#FF9900]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  filter === tab.id 
                    ? 'bg-[#FF9900] text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No reviews found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'received' 
              ? 'You haven\'t received any reviews yet.' 
              : filter === 'given'
              ? 'You haven\'t given any reviews yet.'
              : 'No reviews to display.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{review.jobTitle}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      review.isFromMe ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {review.isFromMe ? 'Given by you' : 'Received'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>
                      {review.isFromMe ? 'To' : 'From'}: {review.isFromMe ? review.reviewee.name : review.reviewer.name}
                    </span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {review.rating}.0 stars
                  </div>
                </div>
              </div>

              {review.comment && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 italic">"{review.comment}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 