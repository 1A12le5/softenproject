import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, CheckSquare, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemsContext';
import Button from '../components/shared/Button';
import ItemCard from '../components/shared/ItemCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getLostItems, getFoundItems } = useItems();
  
  const lostItems = getLostItems().slice(0, 3);
  const foundItems = getFoundItems().slice(0, 3);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
              Lost Something? Found Something?
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 text-primary-100 animate-slide-up">
              Finder helps connect people with their lost items through a simple, secure platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
              <Button
                size="lg"
                variant="accent"
                onClick={() => navigate(isAuthenticated ? '/report-lost' : '/login')}
                icon={<AlertTriangle size={20} />}
              >
                Report Lost Item
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={() => navigate(isAuthenticated ? '/report-found' : '/login')}
                icon={<CheckSquare size={20} />}
              >
                Report Found Item
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to report lost items, find what you're looking for, and connect with others.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report</h3>
              <p className="text-gray-600">
                Submit a detailed report about your lost item or something you've found.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Browse through listings or search for specific items that match your criteria.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <CheckSquare size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Get in touch with the person who found your item or lost the item you found.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Items Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recently Reported Items</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse through the most recent lost and found items in our system.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Lost Items</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/lost-items')}
                icon={<ExternalLink size={16} />}
                iconPosition="right"
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lostItems.length > 0 ? (
                lostItems.map(item => (
                  <ItemCard key={item.id} item={item} showType={false} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No lost items reported yet.
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Found Items</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/found-items')}
                icon={<ExternalLink size={16} />}
                iconPosition="right"
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {foundItems.length > 0 ? (
                foundItems.map(item => (
                  <ItemCard key={item.id} item={item} showType={false} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No found items reported yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-accent-500 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to find what you're looking for?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-accent-50">
            Join our community today and help make the world a little more connected.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-white text-accent-600 hover:bg-gray-100"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-accent-600 hover:bg-gray-100"
                onClick={() => navigate('/lost-items')}
              >
                Browse Items
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;