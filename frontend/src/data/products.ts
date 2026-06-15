export interface Product {
  id: string | number;
  name: string;
  price: number;
  retailPrice: number;
  image?: string;
  imageUrl?: string;
  category: string;
  rating: number;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductCard {
  id: number;
  name: string;
  price: string;
  image: string;
  categoryId: string; // CHANGE from number → string
  description?: string;
}

export interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  avatar: string;
  color: string;
  role?: string;
  company?: string;
  date?: string;
}

// Featured products for homepage display
// Note: In production, these should come from the backend GraphQL API
// This is only for static homepage sections
export const products: Product[] = [
  {
    id: "p1",
    name: "Premium Ceramic Tiles",
    price: 4500,
    retailPrice: 4500,
    category: "Ceramics",
    image: "/placeholder-product.jpg",
    rating: 4.8,
    description: "High-quality ceramic tiles for commercial use",
  },
];
// Category export
export const categoriesData: Category[] = [
  {
    id: "frozen-meat",
    name: "Frozen Meat",
    slug: "frozen-meat",
  },
  {
    id: "frozen-sea-foods",
    name: "Frozen Sea Foods",
    slug: "frozen-sea-foods",
  },
  {
    id: "ready-to-cook",
    name: "Ready to Cook",
    slug: "ready-to-cook",
  },
  {
    id: "snacks",
    name: "Snacks",
    slug: "snacks",
  },
];
// Reviews for testimonials section
export const reviews: Review[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    comment:
      "Excellent quality products and outstanding customer service. The bulk pricing has helped us save significantly on our construction projects.",
    rating: 5,
    avatar: "A",
    color: "#FF6B6B",
  },
];

export const productsData: ProductCard[] = [
  {
    id: 1,
    name: "Premium Chef Pan",
    price: "₱1,250",
    image: "/assets/products/cookware/cookware-1.jpg",
    categoryId: "frozen-meat",
    description:
      "The ultimate kitchen workhorse. 5-ply construction for even heat distribution and professional results every time.",
  },
  {
    id: 2,
    name: "Ceramic Dish Set",
    price: "₱3,200",
    image: "/assets/products/dinnerware/dinnerware-1.jpg",
    categoryId: "frozen-seafood",
    description:
      "Elegant ceramic dinnerware set with a chip-resistant glaze. Perfect for both casual family meals and formal dinner parties.",
  },
  {
    id: 3,
    name: "Essential Skillet",
    price: "₱1,850",
    image: "/assets/products/cookware/cookware-2.jpg",
    categoryId: "ready-to-cook",
    description:
      "Heavy-duty cast aluminum skillet with a superior non-stick coating for effortless cooking and cleaning.",
  },
  {
    id: 4,
    name: "Professional Bakeware",
    price: "₱2,100",
    image: "/assets/products/bakeware/bakeware-1.jpg",
    categoryId: "snacks",
    description:
      "Multi-piece baking set made from carbon steel for optimal heat conduction and perfect browning.",
  },
];
