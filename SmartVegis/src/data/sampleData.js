// Sample data for the SmartVegis app
// In a real application, this would come from an API

export const commodities = [
  { id: 1, name: 'Vegetables', icon: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', count: 45 },
  { id: 2, name: 'Fruits', icon: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop', count: 32 },
];

// Alias for backward compatibility
export const categories = commodities;

export const products = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    image: 'https://images.unsplash.com/photo-1546470427-227c7369a9b9?w=200&h=200&fit=crop',
    price: 40,
    originalPrice: 50,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Green Farm Market',
    vendorId: 1,
    distance: '1.2 km',
    rating: 4.5,
    category: 'Vegetables'
  },
  {
    id: 2,
    name: 'Organic Spinach',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop',
    price: 30,
    originalPrice: null,
    unit: 'bunch',
    availability: 'In Stock',
    vendor: 'Organic Valley',
    vendorId: 2,
    distance: '0.8 km',
    rating: 4.8,
    category: 'Leafy Greens'
  },
  {
    id: 3,
    name: 'Fresh Carrots',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop',
    price: 35,
    originalPrice: 45,
    unit: 'kg',
    availability: 'Low Stock',
    vendor: 'Farm Fresh',
    vendorId: 3,
    distance: '2.1 km',
    rating: 4.3,
    category: 'Root Veggies'
  },
  {
    id: 4,
    name: 'Red Apples',
    image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=200&h=200&fit=crop',
    price: 120,
    originalPrice: 150,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Fruit Paradise',
    vendorId: 4,
    distance: '1.5 km',
    rating: 4.6,
    category: 'Fruits'
  },
  {
    id: 5,
    name: 'Ripe Bananas',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200&h=200&fit=crop',
    price: 45,
    originalPrice: null,
    unit: 'dozen',
    availability: 'In Stock',
    vendor: 'Green Farm Market',
    vendorId: 1,
    distance: '1.2 km',
    rating: 4.4,
    category: 'Fruits'
  },
  {
    id: 6,
    name: 'Fresh Potatoes',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber39a?w=200&h=200&fit=crop',
    price: 25,
    originalPrice: 30,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Local Bazaar',
    vendorId: 5,
    distance: '0.5 km',
    rating: 4.2,
    category: 'Root Veggies'
  },
  {
    id: 7,
    name: 'Green Capsicum',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop',
    price: 60,
    originalPrice: null,
    unit: 'kg',
    availability: 'Low Stock',
    vendor: 'Organic Valley',
    vendorId: 2,
    distance: '0.8 km',
    rating: 4.5,
    category: 'Vegetables'
  },
  {
    id: 8,
    name: 'Fresh Oranges',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=200&h=200&fit=crop',
    price: 80,
    originalPrice: 100,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Citrus Corner',
    vendorId: 6,
    distance: '1.8 km',
    rating: 4.7,
    category: 'Citrus'
  },
  {
    id: 9,
    name: 'Ripe Mangoes',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop',
    price: 150,
    originalPrice: 180,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Fruit Paradise',
    vendorId: 4,
    distance: '1.5 km',
    rating: 4.9,
    category: 'Exotic Fruits'
  },
  {
    id: 10,
    name: 'Fresh Onions',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop',
    price: 35,
    originalPrice: null,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Local Bazaar',
    vendorId: 5,
    distance: '0.5 km',
    rating: 4.3,
    category: 'Vegetables'
  },
  {
    id: 11,
    name: 'Broccoli',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop',
    price: 90,
    originalPrice: 110,
    unit: 'kg',
    availability: 'Low Stock',
    vendor: 'Green Farm Market',
    vendorId: 1,
    distance: '1.2 km',
    rating: 4.4,
    category: 'Vegetables'
  },
  {
    id: 12,
    name: 'Fresh Grapes',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&h=200&fit=crop',
    price: 100,
    originalPrice: null,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Fruit Paradise',
    vendorId: 4,
    distance: '1.5 km',
    rating: 4.6,
    category: 'Fruits'
  },
  {
    id: 13,
    name: 'Cucumber',
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=200&h=200&fit=crop',
    price: 30,
    originalPrice: 35,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Organic Valley',
    vendorId: 2,
    distance: '0.8 km',
    rating: 4.3,
    category: 'Vegetables'
  },
  {
    id: 14,
    name: 'Fresh Lemons',
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=200&h=200&fit=crop',
    price: 60,
    originalPrice: null,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Citrus Corner',
    vendorId: 6,
    distance: '1.8 km',
    rating: 4.5,
    category: 'Citrus'
  },
  {
    id: 15,
    name: 'Sweet Corn',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=200&fit=crop',
    price: 40,
    originalPrice: 50,
    unit: 'kg',
    availability: 'Out of Stock',
    vendor: 'Farm Fresh',
    vendorId: 3,
    distance: '2.1 km',
    rating: 4.4,
    category: 'Vegetables'
  },
  {
    id: 16,
    name: 'Watermelon',
    image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=200&h=200&fit=crop',
    price: 25,
    originalPrice: null,
    unit: 'kg',
    availability: 'In Stock',
    vendor: 'Fruit Paradise',
    vendorId: 4,
    distance: '1.5 km',
    rating: 4.7,
    category: 'Fruits'
  }
];

export const vendors = [
  {
    id: 1,
    name: 'Green Farm Market',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&h=200&fit=crop',
    rating: 4.6,
    totalRatings: 256,
    distance: '1.2 km',
    address: '123 Market Street, City Center',
    phone: '+91 98765 43210',
    isOpen: true,
    openTime: '6:00 AM',
    closeTime: '9:00 PM',
    description: 'Fresh vegetables and fruits directly from local farms. Quality guaranteed!',
    speciality: 'Organic Vegetables',
    yearsInBusiness: 8,
    productIds: [1, 5, 11]
  },
  {
    id: 2,
    name: 'Organic Valley',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
    rating: 4.8,
    totalRatings: 189,
    distance: '0.8 km',
    address: '45 Green Lane, Sector 5',
    phone: '+91 98765 43211',
    isOpen: true,
    openTime: '7:00 AM',
    closeTime: '8:00 PM',
    description: 'Certified organic produce. No pesticides, no chemicals - just pure nature!',
    speciality: 'Organic & Pesticide-Free',
    yearsInBusiness: 5,
    productIds: [2, 7, 13]
  },
  {
    id: 3,
    name: 'Farm Fresh',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&h=200&fit=crop',
    rating: 4.3,
    totalRatings: 312,
    distance: '2.1 km',
    address: '78 Highway Road, Outskirts',
    phone: '+91 98765 43212',
    isOpen: false,
    openTime: '5:00 AM',
    closeTime: '7:00 PM',
    description: 'Farm to table fresh produce. We bring the farm to your doorstep!',
    speciality: 'Farm Fresh Daily',
    yearsInBusiness: 12,
    productIds: [3, 15]
  },
  {
    id: 4,
    name: 'Fruit Paradise',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop',
    rating: 4.7,
    totalRatings: 423,
    distance: '1.5 km',
    address: '56 Fruit Market, Main Road',
    phone: '+91 98765 43213',
    isOpen: true,
    openTime: '8:00 AM',
    closeTime: '10:00 PM',
    description: 'Premium quality fruits from across the country. Exotic varieties available!',
    speciality: 'Exotic & Premium Fruits',
    yearsInBusiness: 15,
    productIds: [4, 9, 12, 16]
  },
  {
    id: 5,
    name: 'Local Bazaar',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop',
    rating: 4.2,
    totalRatings: 567,
    distance: '0.5 km',
    address: '12 Local Market, Near Bus Stand',
    phone: '+91 98765 43214',
    isOpen: true,
    openTime: '6:00 AM',
    closeTime: '9:00 PM',
    description: 'Your neighborhood vegetable shop. Best prices guaranteed!',
    speciality: 'Budget Friendly',
    yearsInBusiness: 20,
    productIds: [6, 10]
  },
  {
    id: 6,
    name: 'Citrus Corner',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
    rating: 4.5,
    totalRatings: 145,
    distance: '1.8 km',
    address: '34 Citrus Lane, Garden Area',
    phone: '+91 98765 43215',
    isOpen: true,
    openTime: '7:00 AM',
    closeTime: '8:00 PM',
    description: 'Specializing in citrus fruits. Fresh lemons, oranges, and more!',
    speciality: 'Citrus Fruits Expert',
    yearsInBusiness: 6,
    productIds: [8, 14]
  }
];

// Helper function to get products by vendor
export const getProductsByVendor = (vendorId) => {
  return products.filter(product => product.vendorId === parseInt(vendorId));
};

// Helper function to get vendor by id
export const getVendorById = (id) => {
  return vendors.find(vendor => vendor.id === parseInt(id));
};
