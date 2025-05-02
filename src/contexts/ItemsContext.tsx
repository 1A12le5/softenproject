import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item, ItemsContextType, ItemType } from '../types';
import { mockItems } from '../utils/mockData';

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};

interface ItemsProviderProps {
  children: ReactNode;
}

export const ItemsProvider = ({ children }: ItemsProviderProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize with mock data
    const loadItems = async () => {
      try {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Load items from local storage or use mock data
        const storedItems = localStorage.getItem('finder_items');
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        } else {
          setItems(mockItems);
          localStorage.setItem('finder_items', JSON.stringify(mockItems));
        }
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadItems();
  }, []);
  
  // Save items to local storage whenever they change
  useEffect(() => {
    if (items.length > 0 && !isLoading) {
      localStorage.setItem('finder_items', JSON.stringify(items));
    }
  }, [items, isLoading]);
  
  const addItem = async (itemData: Omit<Item, 'id' | 'dateReported' | 'status'>): Promise<Item> => {
    try {
      const newItem: Item = {
        ...itemData,
        id: uuidv4(),
        dateReported: new Date().toISOString(),
        status: 'active'
      };
      
      setItems(prevItems => [...prevItems, newItem]);
      return newItem;
    } catch (err) {
      setError('Failed to add item');
      throw err;
    }
  };
  
  const updateItem = async (id: string, updates: Partial<Item>): Promise<Item> => {
    try {
      let updatedItem: Item | undefined;
      
      setItems(prevItems =>
        prevItems.map(item => {
          if (item.id === id) {
            updatedItem = { ...item, ...updates };
            return updatedItem;
          }
          return item;
        })
      );
      
      if (!updatedItem) {
        throw new Error('Item not found');
      }
      
      return updatedItem;
    } catch (err) {
      setError('Failed to update item');
      throw err;
    }
  };
  
  const getItem = (id: string): Item | undefined => {
    return items.find(item => item.id === id);
  };
  
  const getItemsByUser = (userId: string): Item[] => {
    return items.filter(item => item.userId === userId);
  };
  
  const getItemsByType = (type: ItemType): Item[] => {
    return items.filter(item => item.type === type);
  };
  
  const matchItems = (itemId: string): Item[] => {
    const item = getItem(itemId);
    if (!item) return [];
    
    // Find potential matches based on category, location, and date
    return items.filter(otherItem => 
      otherItem.id !== itemId &&
      otherItem.type !== item.type &&
      otherItem.category === item.category &&
      otherItem.status === 'active'
    );
  };
  
  const claimItem = async (itemId: string, userId: string): Promise<Item> => {
    const item = getItem(itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    
    const updates: Partial<Item> = {
      status: 'claimed',
      claimedBy: userId,
      claimedAt: new Date().toISOString()
    };
    
    return updateItem(itemId, updates);
  };
  
  const resolveItem = async (itemId: string): Promise<Item> => {
    const item = getItem(itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    
    const updates: Partial<Item> = {
      status: 'resolved',
      resolvedAt: new Date().toISOString()
    };
    
    // If the item is matched, also update the matched item
    if (item.matchedItemId) {
      await updateItem(item.matchedItemId, updates);
    }
    
    return updateItem(itemId, updates);
  };
  
  const getLostItems = (): Item[] => {
    return items.filter(item => item.type === 'lost');
  };
  
  const getFoundItems = (): Item[] => {
    return items.filter(item => item.type === 'found');
  };
  
  const searchItems = (query: string, filters?: Partial<Item>): Item[] => {
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item => {
      // Apply text search
      const matchesQuery = !query || 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.location.name.toLowerCase().includes(lowerQuery);
      
      // Apply filters
      const matchesFilters = !filters || Object.entries(filters).every(([key, value]) => {
        if (key === 'category' && value) {
          return item.category === value;
        }
        if (key === 'status' && value) {
          return item.status === value;
        }
        if (key === 'type' && value) {
          return item.type === value;
        }
        return true;
      });
      
      return matchesQuery && matchesFilters;
    });
  };
  
  const value: ItemsContextType = {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    getItem,
    getItemsByUser,
    getItemsByType,
    matchItems,
    claimItem,
    resolveItem,
    getLostItems,
    getFoundItems,
    searchItems
  };
  
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};