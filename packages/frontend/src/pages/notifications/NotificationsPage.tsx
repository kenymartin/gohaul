import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Eye, Trash2, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'NEW_JOB' | 'BID_RECEIVED' | 'BID_ACCEPTED' | 'BID_REJECTED' | 'JOB_ASSIGNED' | 'JOB_COMPLETED' | 'RATING_RECEIVED' | 'PAYMENT_RECEIVED';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  jobId?: string;
  relatedUser?: {
    name: string;
    role: string;
  };
}

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      setNotifications([
        {
          id: '1',
          type: 'NEW_JOB',
          title: 'New Job Available',
          message: 'A new furniture delivery job has been posted in your area.',
          isRead: false,
          createdAt: '2024-12-10T10:00:00Z',
          jobId: 'job-1',
          relatedUser: { name: 'John Customer', role: 'CUSTOMER' }
        },
        {
          id: '2',
          type: 'BID_RECEIVED',
          title: 'New Bid Received',
          message: 'You have received a new bid for your electronics shipment.',
          isRead: false,
          createdAt: '2024-12-10T09:30:00Z',
          jobId: 'job-2',
          relatedUser: { name: 'Carlos Rodriguez', role: 'TRANSPORTER' }
        },
        {
          id: '3',
          type: 'BID_ACCEPTED',
          title: 'Bid Accepted!',
          message: 'Congratulations! Your bid for the office equipment move has been accepted.',
          isRead: true,
          createdAt: '2024-12-09T15:20:00Z',
          jobId: 'job-3',
          relatedUser: { name: 'ACME Corporation', role: 'COMPANY' }
        },
        {
          id: '4',
          type: 'JOB_COMPLETED',
          title: 'Job Completed',
          message: 'Your office equipment move has been completed successfully.',
          isRead: true,
          createdAt: '2024-12-09T14:00:00Z',
          jobId: 'job-3'
        },
        {
          id: '5',
          type: 'RATING_RECEIVED',
          title: 'New Rating Received',
          message: 'You received a 5-star rating from a recent job!',
          isRead: false,
          createdAt: '2024-12-09T12:00:00Z',
          relatedUser: { name: 'TechStartup Inc', role: 'COMPANY' }
        }
      ]);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: API call to mark as read
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: API call to mark all as read
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // TODO: API call to delete notification
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_JOB': return '📦';
      case 'BID_RECEIVED': return '💰';
      case 'BID_ACCEPTED': return '✅';
      case 'BID_REJECTED': return '❌';
      case 'JOB_ASSIGNED': return '🚛';
      case 'JOB_COMPLETED': return '🎉';
      case 'RATING_RECEIVED': return '⭐';
      case 'PAYMENT_RECEIVED': return '💳';
      default: return '🔔';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NEW_JOB': return 'bg-blue-100 text-blue-800';
      case 'BID_RECEIVED': return 'bg-green-100 text-green-800';
      case 'BID_ACCEPTED': return 'bg-green-100 text-green-800';
      case 'BID_REJECTED': return 'bg-red-100 text-red-800';
      case 'JOB_ASSIGNED': return 'bg-purple-100 text-purple-800';
      case 'JOB_COMPLETED': return 'bg-emerald-100 text-emerald-800';
      case 'RATING_RECEIVED': return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_RECEIVED': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your transportation activities
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        
        <div className="flex space-x-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'read', label: 'Read', count: notifications.length - unreadCount },
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

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No notifications
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'unread' ? 'You\'re all caught up!' : 'No notifications to show'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                !notification.isRead ? 'border-l-4 border-l-[#FF9900]' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className={`text-sm ${
                        !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{formatDate(notification.createdAt)}</span>
                        {notification.relatedUser && (
                          <span>
                            from {notification.relatedUser.name} ({notification.relatedUser.role})
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {notification.jobId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* TODO: Navigate to job details */}}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 