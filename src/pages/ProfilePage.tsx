import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Package, LogOut, AlertTriangle, CheckSquare 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemsContext';
import Button from '../components/shared/Button';
import { Card, CardHeader, CardBody } from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import ItemCard from '../components/shared/ItemCard';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { getItemsByUser } = useItems();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  
  if (!user) {
    return null;
  }
  
  const userItems = getItemsByUser(user.id);
  const lostItems = userItems.filter(item => item.type === 'lost');
  const foundItems = userItems.filter(item => item.type === 'found');
  
  const itemsToShow = activeTab === 'all' 
    ? userItems 
    : activeTab === 'lost' 
      ? lostItems 
      : foundItems;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* User info card */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="p-6">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 border-4 border-primary-200 mb-4">
                  <User size={48} />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                
                {user.isAdmin && (
                  <Badge variant="primary" className="mt-2">
                    Admin
                  </Badge>
                )}
                
                <div className="w-full mt-6 space-y-4">
                  <div className="flex items-center">
                    <Mail size={18} className="mr-2 text-gray-500" />
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone size={18} className="mr-2 text-gray-500" />
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="w-full mt-8 space-y-3">
                  {user.isAdmin && (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => navigate('/admin')}
                      icon={<Package size={18} />}
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleLogout}
                    icon={<LogOut size={18} />}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <Button
                  variant="accent"
                  fullWidth
                  onClick={() => navigate('/report-lost')}
                  icon={<AlertTriangle size={18} />}
                >
                  Report Lost Item
                </Button>
                
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => navigate('/report-found')}
                  icon={<CheckSquare size={18} />}
                >
                  Report Found Item
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Item listings */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex justify-between items-center p-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Items</h2>
                <div className="text-sm text-gray-500">
                  {userItems.length} {userItems.length === 1 ? 'item' : 'items'}
                </div>
              </div>
              
              <div className="px-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'all'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Items
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                      {userItems.length}
                    </span>
                  </button>
                  
                  <button
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'lost'
                        ? 'border-error-500 text-error-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('lost')}
                  >
                    Lost Items
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                      {lostItems.length}
                    </span>
                  </button>
                  
                  <button
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'found'
                        ? 'border-success-500 text-success-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('found')}
                  >
                    Found Items
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                      {foundItems.length}
                    </span>
                  </button>
                </nav>
              </div>
            </div>
            
            <div className="p-6">
              {itemsToShow.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {itemsToShow.map(item => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {activeTab === 'lost' 
                      ? "You haven't reported any lost items yet." 
                      : activeTab === 'found'
                        ? "You haven't reported any found items yet."
                        : "You haven't reported any items yet."}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      variant="accent"
                      onClick={() => navigate('/report-lost')}
                      icon={<AlertTriangle size={18} />}
                    >
                      Report Lost Item
                    </Button>
                    
                    <Button
                      variant="success"
                      onClick={() => navigate('/report-found')}
                      icon={<CheckSquare size={18} />}
                    >
                      Report Found Item
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;