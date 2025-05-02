import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Eye } from 'lucide-react';
import { formatDate, timeAgo, getCategoryLabel, truncateText } from '../../utils/helpers';
import { Item } from '../../types';
import { Card, CardBody, CardFooter } from './Card';
import Badge from './Badge';
import ItemStatusBadge from './ItemStatusBadge';

interface ItemCardProps {
  item: Item;
  showType?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, showType = true }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/items/${item.id}`);
  };
  
  return (
    <Card hover onClick={handleClick} className="group h-full flex flex-col">
      <div className="relative overflow-hidden h-48">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex gap-2">
          {showType && (
            <Badge
              variant={item.type === 'lost' ? 'error' : 'success'}
            >
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </Badge>
          )}
          
          <Badge variant="secondary">
            {getCategoryLabel(item.category)}
          </Badge>
        </div>
        
        <div className="absolute bottom-3 right-3">
          <ItemStatusBadge status={item.status} />
        </div>
      </div>
      
      <CardBody className="flex-1">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-4">
          {truncateText(item.description, 100)}
        </p>
        
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(item.dateLostOrFound)}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin size={16} className="mr-2" />
            <span>{item.location.name}</span>
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Posted {timeAgo(item.dateReported)}
          </span>
          <div className="flex items-center text-primary-600 text-sm font-medium">
            <Eye size={16} className="mr-1" />
            View Details
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;