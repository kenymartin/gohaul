import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/auth.store';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Shipments', href: '/shipments', icon: TruckIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Tracking', href: '/tracking', icon: MapIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
        <h1 className="text-xl font-bold text-white">GoHaul</h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-shrink-0 border-t border-gray-700 p-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs font-medium text-gray-300">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 