import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, CheckSquare, AlertTriangle, Trash2, Eye, Filter, 
  RefreshCw, ShieldAlert, X
} from 'lucide-react';
import { useItems } from '../contexts/ItemsContext';
import { Item, ItemType, ItemStatus } from '../types';
import { formatDate, getCategoryLabel } from '../utils/helpers';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import ItemStatusBadge from '../components/shared/ItemStatusBadge';
import Select, { SelectOption } from '../components/shared/Select';

const AdminDashboardPage: React.FC = () => {
  const { items, updateItem } = useItems();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'overview' | 'items'>('overview');
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter items based on selected filters
  useEffect(() => {
    let filtered = [...items];
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredItems(filtered);
  }, [items, typeFilter, statusFilter]);
  
  const lostItemsCount = items.filter(item => item.type === 'lost').length;
  const foundItemsCount = items.filter(item => item.type === 'found').length;
  const activeItemsCount = items.filter(item => item.status === 'active').length;
  const resolvedItemsCount = items.filter(item => item.status === 'resolved').length;
  
  const handleItemView = (id: string) => {
    navigate(`/items/${id}`);
  };
  
  const handleItemDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // In a real app, we would delete the item, but for this demo we'll just mark it as expired
        await updateItem(id, { status: 'expired' });
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleExpireItem = async (id: string) => {
    setIsLoading(true);
    try {
      await updateItem(id, { status: 'expired' });
    } catch (error) {
      console.error('Error expiring item:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReactivateItem = async (id: string) => {
    setIsLoading(true);
    try {
      await updateItem(id, { status: 'active' });
    } catch (error) {
      console.error('Error reactivating item:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const typeOptions: SelectOption[] = [
    { value: 'all', label: 'All Types' },
    { value: 'lost', label: 'Lost Items' },
    { value: 'found', label: 'Found Items' }
  ];
  
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'claimed', label: 'Claimed' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'expired', label: 'Expired' }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Manage lost and found items in the system
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button
              variant={view === 'overview' ? 'primary' : 'outline'}
              onClick={() => setView('overview')}
              icon={<Package size={18} />}
            >
              Overview
            </Button>
            <Button
              variant={view === 'items' ? 'primary' : 'outline'}
              onClick={() => setView('items')}
              icon={<ShieldAlert size={18} />}
            >
              Manage Items
            </Button>
          </div>
        </div>
      </div>
      
      {view === 'overview' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-10 w-10 text-gray-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Items
                    </dt>
                    <dd>
                      <div className="text-3xl font-bold text-gray-900">
                        {items.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-10 w-10 text-error-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Lost Items
                    </dt>
                    <dd>
                      <div className="text-3xl font-bold text-gray-900">
                        {lostItemsCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckSquare className="h-10 w-10 text-success-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Found Items
                    </dt>
                    <dd>
                      <div className="text-3xl font-bold text-gray-900">
                        {foundItemsCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-10 w-10 text-primary-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Success Rate
                    </dt>
                    <dd>
                      <div className="text-3xl font-bold text-gray-900">
                        {items.length > 0 
                          ? `${Math.round((resolvedItemsCount / items.length) * 100)}%` 
                          : '0%'}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="sm:flex sm:justify-between sm:items-center">
              <h2 className="text-xl font-bold text-gray-900">All Items</h2>
              
              <div className="mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  icon={<Filter size={18} />}
                  onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                >
                  Filters
                </Button>
              </div>
            </div>
            
            {isFiltersVisible && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-slide-down">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filter Options</h3>
                  <button 
                    onClick={() => setIsFiltersVisible(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Type"
                    options={typeOptions}
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as ItemType | 'all')}
                  />
                  
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ItemStatus | 'all')}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {item.images && item.images.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={item.images[0]}
                                alt={item.title}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <Package size={16} className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge 
                                variant={item.type === 'lost' ? 'error' : 'success'} 
                                size="sm"
                              >
                                {item.type === 'lost' ? 'Lost' : 'Found'}
                              </Badge>
                              <Badge 
                                variant="secondary"
                                size="sm"
                              >
                                {getCategoryLabel(item.category)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.contactInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.contactInfo.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-sm text-gray-900">
                          {formatDate(item.dateLostOrFound)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Reported: {formatDate(item.dateReported)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ItemStatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleItemView(item.id)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {item.status === 'active' ? (
                            <button
                              onClick={() => handleExpireItem(item.id)}
                              className="text-warning-600 hover:text-warning-900"
                              disabled={isLoading}
                            >
                              <ShieldAlert size={18} />
                            </button>
                          ) : item.status === 'expired' ? (
                            <button
                              onClick={() => handleReactivateItem(item.id)}
                              className="text-success-600 hover:text-success-900"
                              disabled={isLoading}
                            >
                              <RefreshCw size={18} />
                            </button>
                          ) : null}
                          
                          <button
                            onClick={() => handleItemDelete(item.id)}
                            className="text-error-600 hover:text-error-900"
                            disabled={isLoading}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Package size={32} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No items found matching your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;