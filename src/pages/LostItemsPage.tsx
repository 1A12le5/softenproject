import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle, X } from 'lucide-react';
import { useItems } from '../contexts/ItemsContext';
import { useAuth } from '../contexts/AuthContext';
import { ItemCategory, ItemStatus } from '../types';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Select, { SelectOption } from '../components/shared/Select';
import ItemCard from '../components/shared/ItemCard';

const LostItemsPage: React.FC = () => {
  const { getLostItems } = useItems();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<ItemCategory | ''>('');
  const [status, setStatus] = useState<ItemStatus | ''>('');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filteredItems, setFilteredItems] = useState(getLostItems());
  
  const categoryOptions: SelectOption[] = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'documents', label: 'Documents' },
    { value: 'keys', label: 'Keys' },
    { value: 'pets', label: 'Pets' },
    { value: 'other', label: 'Other' }
  ];
  
  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'claimed', label: 'Claimed' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'expired', label: 'Expired' }
  ];
  
  useEffect(() => {
    const lostItems = getLostItems();
    
    const filtered = lostItems.filter(item => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by category
      const matchesCategory = category === '' || item.category === category;
      
      // Filter by status
      const matchesStatus = status === '' || item.status === status;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredItems(filtered);
  }, [searchQuery, category, status, getLostItems]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtering in useEffect
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setCategory('');
    setStatus('');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost Items</h1>
          <p className="mt-1 text-gray-600">Browse through all reported lost items</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            variant="accent"
            onClick={() => navigate(isAuthenticated ? '/report-lost' : '/login')}
            icon={<AlertTriangle size={18} />}
          >
            Report Lost Item
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <form 
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-grow">
            <Input
              placeholder="Search for lost items..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="m-0"
            />
          </div>
          
          <Button
            type="button"
            variant="outline"
            icon={<Filter size={18} />}
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            Filters
          </Button>
          
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>
        
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
                label="Category"
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory | '')}
              />
              
              <Select
                label="Status"
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus | '')}
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No lost items found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || category || status 
              ? "No items match your search criteria. Try adjusting your filters."
              : "There are no lost items reported yet."}
          </p>
          {(searchQuery || category || status) && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LostItemsPage;