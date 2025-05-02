import React from 'react';
import Badge from './Badge';
import { ItemStatus } from '../../types';

interface ItemStatusBadgeProps {
  status: ItemStatus;
  className?: string;
}

const ItemStatusBadge: React.FC<ItemStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: ItemStatus) => {
    switch (status) {
      case 'active':
        return { variant: 'primary', label: 'Active' };
      case 'claimed':
        return { variant: 'accent', label: 'Claimed' };
      case 'resolved':
        return { variant: 'success', label: 'Resolved' };
      case 'expired':
        return { variant: 'gray', label: 'Expired' };
      default:
        return { variant: 'gray', label: 'Unknown' };
    }
  };
  
  const config = getStatusConfig(status);
  
  return (
    <Badge 
      variant={config.variant as any} 
      className={className}
    >
      {config.label}
    </Badge>
  );
};

export default ItemStatusBadge;