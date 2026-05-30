
export interface FeaturedOfferCardData {
  id: string;
  socialMedia: {
    mediaType: "image" | "video";
    mediaUrl: string;
    title: string;
    hashtags: string[];
  };
  promo: {
    discountLabel: string;
  };
  product: {
    id: string;
    name: string;
    image: string;
    link?: string;
  };
}

export const featuredOffersData: FeaturedOfferCardData[] = [
  {
    id: "offer-1",
    socialMedia: {
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
      title: "Kitchen Upgrade Must-Have",
      hashtags: ["#OmegaKitchen", "#SmartLiving", "#ModernHome"],
    },
    promo: {
      discountLabel: "20% OFF",
    },
    product: {
      id: "p1",
      name: "Omega Premium Cookware Set",
      image: "/assets/products/cookware/cookware-1.jpg",
      link: "/catalog?productId=p1"
    },
  },
  {
    id: "offer-2",
    socialMedia: {
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Sustainable Cooking Habits",
      hashtags: ["#EcoKitchen", "#OmegaOrganic"],
    },
    promo: {
      discountLabel: "15% OFF",
    },
    product: {
      id: "p2",
      name: "Premium Non-Stick Frying Pan",
      image: "/assets/products/cookware/cookware-7.jpg",
      link: "/catalog?productId=p2"
    },
  },
  {
    id: "offer-3",
    socialMedia: {
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
      title: "Chef's Secret Tools",
      hashtags: ["#MasterChef", "#KitchenEssentials"],
    },
    promo: {
      discountLabel: "BUY 1 GET 1",
    },
    product: {
      id: "p3",
      name: "Professional Bakeware Collection",
      image: "/assets/products/bakeware/bakeware-1.jpg",
      link: "/catalog?productId=p3"
    },
  },
];
