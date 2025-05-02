import { v4 as uuidv4 } from 'uuid';
import { User, Item, ItemType, ItemCategory, ItemStatus } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    isAdmin: true,
    createdAt: new Date(2023, 0, 15).toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    isAdmin: false,
    createdAt: new Date(2023, 1, 20).toISOString()
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '555-555-5555',
    isAdmin: true,
    createdAt: new Date(2022, 11, 1).toISOString()
  }
];

// Sample locations
const locations = [
  {
    name: 'Central Park',
    description: 'Near the fountain',
    coordinates: { latitude: 40.785091, longitude: -73.968285 }
  },
  {
    name: 'Downtown Library',
    description: 'Second floor, reading area',
    coordinates: { latitude: 40.753182, longitude: -73.982253 }
  },
  {
    name: 'Main Street Coffee Shop',
    description: 'Outside seating area',
    coordinates: { latitude: 40.712776, longitude: -74.005974 }
  },
  {
    name: 'University Campus',
    description: 'Student center',
    coordinates: { latitude: 40.729752, longitude: -73.996673 }
  },
  {
    name: 'City Bus Terminal',
    description: 'Platform 3',
    coordinates: { latitude: 40.757339, longitude: -73.989456 }
  }
];

// Sample item descriptions by category
const itemDescriptions: Record<ItemCategory, string[]> = {
  electronics: [
    'Brand new iPhone 13 Pro in graphite color with clear case',
    'Dell XPS 13 laptop with stickers on the cover',
    'Sony wireless headphones with noise cancellation',
    'Apple AirPods in white charging case',
    'Samsung Galaxy tablet with blue protective cover'
  ],
  clothing: [
    'Black North Face jacket with red inner lining',
    'Blue denim jeans with embroidery on the back pocket',
    'White Nike sneakers with red swoosh logo',
    'Green wool scarf with fringe edges',
    'Brown leather gloves with cashmere lining'
  ],
  accessories: [
    'Gold hoop earrings with pearl detail',
    'Silver watch with black leather strap',
    'Designer sunglasses with tortoise shell frame',
    'Black leather wallet with initials "JS" engraved',
    'Red silk scarf with floral pattern'
  ],
  documents: [
    'Passport in blue protective cover',
    'Driver\'s license in clear card holder',
    'Student ID card with lanyard',
    'Work badge with company logo',
    'Insurance card in plastic sleeve'
  ],
  keys: [
    'Car keys with bear keychain',
    'House keys with red rubber cover',
    'Office key set with company logo fob',
    'Metal keyring with about 5 keys',
    'Single gold colored key with number 305'
  ],
  pets: [
    'Small brown dog with white chest, no collar',
    'Gray tabby cat with blue collar and bell',
    'Parrot with bright green and yellow feathers',
    'White rabbit with black spots',
    'Tortoise with distinctive shell pattern'
  ],
  other: [
    'Vintage fountain pen with gold nib',
    'Prescription glasses in black case',
    'Blue umbrella with wooden handle',
    'Lunch box with superhero design',
    'Handmade quilt with patchwork pattern'
  ]
};

// Sample titles by category
const itemTitles: Record<ItemCategory, string[]> = {
  electronics: [
    'iPhone 13 Pro',
    'Dell XPS 13 Laptop',
    'Sony Headphones',
    'Apple AirPods',
    'Samsung Tablet'
  ],
  clothing: [
    'North Face Jacket',
    'Blue Jeans',
    'Nike Sneakers',
    'Green Wool Scarf',
    'Leather Gloves'
  ],
  accessories: [
    'Gold Earrings',
    'Silver Watch',
    'Designer Sunglasses',
    'Leather Wallet',
    'Silk Scarf'
  ],
  documents: [
    'Passport',
    'Driver\'s License',
    'Student ID',
    'Work Badge',
    'Insurance Card'
  ],
  keys: [
    'Car Keys',
    'House Keys',
    'Office Keys',
    'Keyring with Multiple Keys',
    'Single Gold Key'
  ],
  pets: [
    'Brown Dog',
    'Gray Cat',
    'Green Parrot',
    'White Rabbit',
    'Tortoise'
  ],
  other: [
    'Fountain Pen',
    'Prescription Glasses',
    'Blue Umbrella',
    'Lunch Box',
    'Handmade Quilt'
  ]
};

// Generate random date within the last 30 days
const getRandomRecentDate = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
};

// Sample images by category (placeholders)
const getRandomImages = (category: ItemCategory): string[] => {
  const baseUrl = 'https://images.pexels.com/photos/';
  const imageIds: Record<ItemCategory, string[]> = {
    electronics: ['3944425', '3394656', '4158', '6782570', '1334597'],
    clothing: ['1598507', '996329', '1082529', '934063', '5693889'],
    accessories: ['1152077', '190819', '264870', '8285167', '5816300'],
    documents: ['4792285', '4792284', '4778417', '4098022', '4195342'],
    keys: ['5734023', '5734018', '4498122', '2292837', '5598304'],
    pets: ['406014', '45201', '1170986', '2253275', '3361739'],
    other: ['3943903', '618613', '313719', '6044266', '1493328']
  };
  
  const randomId = imageIds[category][Math.floor(Math.random() * imageIds[category].length)];
  return [`${baseUrl}${randomId}/pexels-photo-${randomId}.jpeg`];
};

// Generate mock items
export const generateMockItems = (count = 30): Item[] => {
  const items: Item[] = [];
  const categories: ItemCategory[] = [
    'electronics', 'clothing', 'accessories', 'documents', 'keys', 'pets', 'other'
  ];
  const types: ItemType[] = ['lost', 'found'];
  const statuses: ItemStatus[] = ['active', 'claimed', 'resolved', 'expired'];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const titleIndex = Math.floor(Math.random() * itemTitles[category].length);
    
    const item: Item = {
      id: uuidv4(),
      type,
      category,
      title: itemTitles[category][titleIndex],
      description: itemDescriptions[category][titleIndex],
      dateReported: getRandomRecentDate(),
      dateLostOrFound: getRandomRecentDate(),
      location,
      images: getRandomImages(category),
      status: statuses[Math.floor(Math.random() * (type === 'lost' ? 3 : statuses.length))],
      userId: user.id,
      contactInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    };
    
    items.push(item);
  }
  
  // Create some matched pairs
  for (let i = 0; i < Math.min(5, count / 6); i++) {
    const lostItem = items.find(item => item.type === 'lost' && !item.matchedItemId);
    const foundItem = items.find(item => item.type === 'found' && !item.matchedItemId && item.category === lostItem?.category);
    
    if (lostItem && foundItem) {
      lostItem.matchedItemId = foundItem.id;
      foundItem.matchedItemId = lostItem.id;
      lostItem.status = Math.random() > 0.5 ? 'claimed' : 'resolved';
      foundItem.status = lostItem.status;
      
      if (lostItem.status === 'claimed') {
        lostItem.claimedBy = mockUsers[Math.floor(Math.random() * mockUsers.length)].id;
        lostItem.claimedAt = getRandomRecentDate();
        foundItem.claimedBy = lostItem.claimedBy;
        foundItem.claimedAt = lostItem.claimedAt;
      }
      
      if (lostItem.status === 'resolved') {
        lostItem.resolvedAt = getRandomRecentDate();
        foundItem.resolvedAt = lostItem.resolvedAt;
      }
    }
  }
  
  return items;
};

// Initial mock items
export const mockItems = generateMockItems();