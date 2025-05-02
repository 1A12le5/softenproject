export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: string;
}

export type ItemType = 'lost' | 'found';

export type ItemCategory = 
  | 'electronics' 
  | 'clothing' 
  | 'accessories' 
  | 'documents' 
  | 'keys'
  | 'pets'
  | 'other';

export type ItemStatus = 'active' | 'claimed' | 'resolved' | 'expired';

export interface ItemLocation {
  name: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Item {
  id: string;
  type: ItemType;
  category: ItemCategory;
  title: string;
  description: string;
  dateReported: string;
  dateLostOrFound: string;
  location: ItemLocation;
  images: string[];
  status: ItemStatus;
  userId: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  matchedItemId?: string;
  claimedBy?: string;
  claimedAt?: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ItemsContextType {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: Omit<Item, 'id' | 'dateReported' | 'status'>) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<Item>;
  getItem: (id: string) => Item | undefined;
  getItemsByUser: (userId: string) => Item[];
  getItemsByType: (type: ItemType) => Item[];
  matchItems: (itemId: string) => Item[];
  claimItem: (itemId: string, userId: string) => Promise<Item>;
  resolveItem: (itemId: string) => Promise<Item>;
  getLostItems: () => Item[];
  getFoundItems: () => Item[];
  searchItems: (query: string, filters?: Partial<Item>) => Item[];
}