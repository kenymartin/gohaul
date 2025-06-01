import React, { useState, useEffect } from 'react';
import { User, Building, Star, Phone, Mail, MapPin, Camera, Save, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'COMPANY' | 'TRANSPORTER';
  phone?: string;
  address?: string;
  companyName?: string;
  companyLicense?: string;
  profileImage?: string;
  isVerified: boolean;
  rating?: number;
  totalRatings: number;
  joinedAt: string;
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    companyName: '',
    companyLicense: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProfile: UserProfile = {
        id: user?.id || '1',
        name: user?.name || 'John Customer',
        email: user?.email || 'john.customer@example.com',
        role: user?.role as any || 'CUSTOMER',
        phone: '+1-555-0101',
        address: '123 Main St, New York, NY 10001',
        companyName: user?.role === 'COMPANY' ? 'ACME Corporation' : undefined,
        companyLicense: user?.role === 'COMPANY' ? 'LIC-12345' : undefined,
        isVerified: true,
        rating: 4.5,
        totalRatings: 12,
        joinedAt: '2024-01-15T00:00:00Z',
      };
      
      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        phone: mockProfile.phone || '',
        address: mockProfile.address || '',
        companyName: mockProfile.companyName || '',
        companyLicense: mockProfile.companyLicense || '',
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO: API call to update profile
      
      if (profile) {
        const updatedProfile = {
          ...profile,
          ...formData,
        };
        setProfile(updatedProfile);
        
        // Update auth store with new name
        setUser({ ...user!, name: formData.name });
      }
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone || '',
        address: profile.address || '',
        companyName: profile.companyName || '',
        companyLicense: profile.companyLicense || '',
      });
    }
    setIsEditing(false);
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'Customer';
      case 'COMPANY': return 'Company';
      case 'TRANSPORTER': return 'Transporter';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800';
      case 'COMPANY': return 'bg-purple-100 text-purple-800';
      case 'TRANSPORTER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Profile not found
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your account information and settings</p>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#FF9900] rounded-full flex items-center justify-center text-white hover:bg-[#E88A00]">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(profile.role)}`}>
                  {getRoleDisplay(profile.role)}
                </span>
                {profile.isVerified && (
                  <div className="flex items-center text-green-600">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-3">{profile.email}</p>
              
              {profile.rating && profile.totalRatings > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{profile.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({profile.totalRatings} reviews)
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    Joined {new Date(profile.joinedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{profile.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <span>{profile.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{profile.phone || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              {isEditing ? (
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your address"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{profile.address || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Information (for Company users) */}
          {profile.role === 'COMPANY' && (
            <>
              <div className="border-t border-gray-200 mt-8 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Enter company name"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-md">
                        <Building className="w-4 h-4 text-gray-400 mr-3" />
                        <span>{profile.companyName || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company License
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.companyLicense}
                        onChange={(e) => setFormData({ ...formData, companyLicense: e.target.value })}
                        placeholder="Enter license number"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-md">
                        <Shield className="w-4 h-4 text-gray-400 mr-3" />
                        <span>{profile.companyLicense || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Account Statistics */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {profile.totalRatings}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {profile.rating ? profile.rating.toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor((Date.now() - new Date(profile.joinedAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 