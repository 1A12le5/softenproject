import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, Calendar, MapPin, Tag, User, Mail, Phone, 
  Shield, AlertTriangle, CheckCircle, MessageCircle,
  ChevronLeft, ChevronRight, ThumbsUp, X
} from 'lucide-react';
import { useItems } from '../contexts/ItemsContext';
import { useAuth } from '../contexts/AuthContext';
import { Item } from '../types';
import { formatDate, getCategoryLabel } from '../utils/helpers';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import ItemStatusBadge from '../components/shared/ItemStatusBadge';
import { Card, CardHeader, CardBody, CardFooter } from '../components/shared/Card';
import ItemCard from '../components/shared/ItemCard';

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, matchItems, claimItem, resolveItem } = useItems();
  const { user, isAuthenticated } = useAuth();
  
  const [item, setItem] = useState<Item | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<Item[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundItem = getItem(id);
      if (foundItem) {
        setItem(foundItem);
        
        // Get potential matches if the item is active
        if (foundItem.status === 'active') {
          setPotentialMatches(matchItems(id));
        }
      } else {
        navigate('/not-found');
      }
    }
  }, [id, getItem, navigate, matchItems]);
  
  const handlePrevImage = () => {
    if (!item?.images.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    if (!item?.images.length) return;
    setCurrentImageIndex((prev) => 
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleClaim = async () => {
    if (!item || !user) return;
    
    setIsLoading(true);
    
    try {
      const updatedItem = await claimItem(item.id, user.id);
      setItem(updatedItem);
      setShowClaimModal(false);
    } catch (error) {
      console.error('Error claiming item:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResolve = async () => {
    if (!item) return;
    
    setIsLoading(true);
    
    try {
      const updatedItem = await resolveItem(item.id);
      setItem(updatedItem);
    } catch (error) {
      console.error('Error resolving item:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  const isOwner = user && item.userId === user.id;
  const canClaim = isAuthenticated && !isOwner && item.status === 'active';
  const canResolve = isAuthenticated && isOwner && (item.status === 'active' || item.status === 'claimed');
  
  const ContactInfo = () => (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Contact Information</h3>
        <button 
          onClick={() => setShowContactInfo(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <User size={18} className="mr-2 text-gray-500" />
          <span>{item.contactInfo.name}</span>
        </div>
        
        <div className="flex items-center">
          <Mail size={18} className="mr-2 text-gray-500" />
          <a 
            href={`mailto:${item.contactInfo.email}`}
            className="text-primary-600 hover:underline"
          >
            {item.contactInfo.email}
          </a>
        </div>
        
        {item.contactInfo.phone && (
          <div className="flex items-center">
            <Phone size={18} className="mr-2 text-gray-500" />
            <a 
              href={`tel:${item.contactInfo.phone}`}
              className="text-primary-600 hover:underline"
            >
              {item.contactInfo.phone}
            </a>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        <Shield size={14} className="inline mr-1" />
        Please be respectful and only contact for legitimate reasons.
      </p>
    </div>
  );
  
  const ClaimModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-in">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Claim This Item</h3>
          <p className="text-gray-600 mb-6">
            Are you sure this is your item? By claiming it, you'll be able to contact the person who found it.
          </p>
          
          <div className="flex flex-col sm:flex-row-reverse gap-3">
            <Button
              variant="primary"
              isLoading={isLoading}
              onClick={handleClaim}
              icon={<ThumbsUp size={18} />}
            >
              Yes, This Is Mine
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowClaimModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge 
                      variant={item.type === 'lost' ? 'error' : 'success'}
                      size="lg"
                    >
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </Badge>
                    <Badge variant="secondary" size="lg">
                      {getCategoryLabel(item.category)}
                    </Badge>
                    <ItemStatusBadge status={item.status} size="lg" />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
                </div>
                
                {isOwner && (
                  <Badge variant="primary">
                    You reported this item
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Image gallery */}
            {item.images && item.images.length > 0 ? (
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.title}
                    className="object-contain w-full h-96"
                  />
                </div>
                
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                    
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                      {item.images.map((_, index) => (
                        <button
                          key={index}
                          className={`h-2 w-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        ></button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <AlertTriangle size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No images available</p>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
            </div>
            
            {/* Details */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date {item.type === 'lost' ? 'Lost' : 'Found'}</p>
                    <p className="font-medium">{formatDate(item.dateLostOrFound)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date Reported</p>
                    <p className="font-medium">{formatDate(item.dateReported)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{item.location.name}</p>
                    {item.location.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.location.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Tag size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{getCategoryLabel(item.category)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="p-6 border-t border-gray-200">
              {canClaim && (
                <Button
                  variant="primary"
                  fullWidth
                  icon={<ThumbsUp size={18} />}
                  onClick={() => setShowClaimModal(true)}
                >
                  This Is My Item
                </Button>
              )}
              
              {canResolve && (
                <Button
                  variant="success"
                  fullWidth
                  icon={<CheckCircle size={18} />}
                  onClick={handleResolve}
                  isLoading={isLoading}
                >
                  Mark as Resolved
                </Button>
              )}
              
              {!isOwner && item.status === 'active' && (
                <div className="mt-4">
                  {showContactInfo ? (
                    <ContactInfo />
                  ) : (
                    <Button
                      variant="outline"
                      fullWidth
                      icon={<MessageCircle size={18} />}
                      onClick={() => setShowContactInfo(true)}
                    >
                      Contact Reporter
                    </Button>
                  )}
                </div>
              )}
              
              {item.status !== 'active' && (
                <div className="flex items-center justify-center p-4 text-gray-500">
                  <p>
                    {item.status === 'claimed' ? (
                      <>This item has been claimed and is awaiting resolution.</>
                    ) : item.status === 'resolved' ? (
                      <>This item has been successfully resolved.</>
                    ) : (
                      <>This listing has expired.</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Potential Matches */}
          {potentialMatches.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">Potential Matches</h2>
              </CardHeader>
              <CardBody className="p-4">
                <div className="space-y-4">
                  {potentialMatches.slice(0, 3).map(match => (
                    <div
                      key={match.id}
                      className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/items/${match.id}`)}
                    >
                      <div className="h-14 w-14 flex-shrink-0 rounded overflow-hidden mr-3">
                        {match.images && match.images.length > 0 ? (
                          <img
                            src={match.images[0]}
                            alt={match.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <AlertTriangle size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {match.title}
                        </p>
                        <div className="flex items-center mt-1">
                          <Badge
                            variant={match.type === 'lost' ? 'error' : 'success'}
                            size="sm"
                          >
                            {match.type === 'lost' ? 'Lost' : 'Found'}
                          </Badge>
                          <span className="ml-2 text-xs text-gray-500">
                            {formatDate(match.dateLostOrFound)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {potentialMatches.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      className="text-sm text-primary-600 hover:text-primary-800"
                      onClick={() => navigate(item.type === 'lost' ? '/found-items' : '/lost-items')}
                    >
                      View more potential matches
                    </button>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
          
          {/* Reporter Info Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Report Information</h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 border border-primary-200">
                  <User size={20} />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{item.contactInfo.name}</p>
                  <p className="text-sm text-gray-500">Reporter</p>
                </div>
              </div>
              
              {isAuthenticated ? (
                <>
                  {isOwner ? (
                    <p className="text-sm text-gray-600 mb-4">
                      You reported this item. You can update its status or provide additional information if needed.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 mb-4">
                      {item.type === 'lost' 
                        ? 'If you found this item, you can contact the owner using the button below.'
                        : 'If this is your item, you can claim it using the button on the left.'}
                    </p>
                  )}
                  
                  {!isOwner && !showContactInfo && (
                    <Button
                      variant="outline"
                      fullWidth
                      icon={<MessageCircle size={18} />}
                      onClick={() => setShowContactInfo(true)}
                    >
                      Contact Reporter
                    </Button>
                  )}
                  
                  {showContactInfo && <ContactInfo />}
                </>
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Sign in to contact the reporter or claim this item.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
      
      {showClaimModal && <ClaimModal />}
    </div>
  );
};

export default ItemDetailPage;