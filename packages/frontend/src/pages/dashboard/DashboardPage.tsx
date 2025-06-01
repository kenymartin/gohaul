import { useEffect, useState } from 'react';
import {
  TruckIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/auth.store';

const stats = [
  {
    name: 'Active Shipments',
    value: '12',
    icon: TruckIcon,
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Unread Messages',
    value: '3',
    icon: ChatBubbleLeftRightIcon,
    change: '+54.02%',
    changeType: 'positive',
  },
  {
    name: 'Tracking Updates',
    value: '24',
    icon: MapIcon,
    change: '-1.39%',
    changeType: 'negative',
  },
  {
    name: 'Total Revenue',
    value: '$24,500',
    icon: CurrencyDollarIcon,
    change: '+10.18%',
    changeType: 'positive',
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [recentShipments, setRecentShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch recent shipments
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your shipments today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  stat.changeType === 'positive'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Shipments
          </h3>
          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            ) : recentShipments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No recent shipments</p>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {/* TODO: Add shipment list items */}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 