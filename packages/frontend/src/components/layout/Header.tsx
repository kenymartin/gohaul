import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth.service';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getNavigationItems = () => {
    if (!isAuthenticated || !user) return [];
    
    const commonItems = [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/browse', label: 'Browse Jobs' },
      { to: '/tracking', label: 'Live Tracking' },
      { to: '/notifications', label: 'Notifications' },
      { to: '/reviews', label: 'Reviews' },
    ];

    switch (user.role) {
      case 'TRANSPORTER':
        return [
          ...commonItems,
          { to: '/bids', label: 'Bidding Center' },
          { to: '/vehicles', label: 'My Vehicles' },
        ];
      case 'CUSTOMER':
      case 'COMPANY':
        return [
          ...commonItems,
          { to: '/shipments/create', label: 'Post Job' },
          { to: '/bids', label: 'Manage Bids' },
        ];
      default:
        return commonItems;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-8 text-xs">
            <div className="flex space-x-4">
              <span className="text-gray-600">
                Hi! {isAuthenticated ? `${user?.name} (${user?.role})` : 'Guest'}
              </span>
              <Link to="/help" className="text-[#FF9900] hover:underline">Customer Service</Link>
              <Link to="/help/shipping" className="text-[#FF9900] hover:underline">Support</Link>
            </div>
            <div className="flex space-x-4">
              <Link to="/notifications" className="text-[#FF9900] hover:underline">
                🔔 Notifications
              </Link>
              <Link to="/help" className="text-[#FF9900] hover:underline">Help</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#FF9900] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🚛</span>
              </div>
              <span className="text-2xl font-bold text-[#FF9900]">GoHaul</span>
            </Link>
          </div>

          {/* Search Bar */}
          {isAuthenticated && (
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for jobs, transporters, or locations..."
                  className="w-full px-4 py-2 pr-12 border-2 border-gray-300 rounded-md focus:border-[#FF9900] focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-[#FF9900] text-white rounded-r-md hover:bg-[#E88A00] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4">
                  {user?.role !== 'TRANSPORTER' && (
                    <Link
                      to="/shipments/create"
                      className="text-[#FF9900] hover:underline font-medium"
                    >
                      📦 Post Job
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="text-[#FF9900] hover:underline font-medium"
                  >
                    📊 Dashboard
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FF9900]">
                      <span>{user?.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        👤 Profile Settings
                      </Link>
                      <Link to="/tracking" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        📍 Live Tracking
                      </Link>
                      <Link to="/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        🔔 Notifications
                      </Link>
                      {user?.role === 'TRANSPORTER' && (
                        <Link to="/vehicles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          🚛 My Vehicles
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/register"
                  className="text-[#FF9900] hover:underline font-medium"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="bg-[#FF9900] text-white px-4 py-2 rounded-md hover:bg-[#E88A00] transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      {isAuthenticated && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 h-10 items-center text-sm">
              {getNavigationItems().map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-700 hover:text-[#FF9900] font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 