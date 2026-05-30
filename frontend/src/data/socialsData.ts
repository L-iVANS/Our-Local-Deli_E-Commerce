export type AffiliateSocialPost = {
  id: number;
  influencer: string;
  influencerLink: string;
  platform: "tiktok" | "instagram" | "facebook";
  productImage: string;
  videoUrl?: string; // Optional video embed URL
  avatar: string;
  likes: string;
  comments: string;
  shares: string;
  caption: string;

  // Affiliate Product Details
  productName: string;
  regularPrice: string;
  offerPrice?: string; // Optional discounted price
  affiliateLink: string;
};

export type SocialAccount = {
  platform: string;
  username: string;
  description: string;
  images: string[];
  link: string;
};

export type CategoryCarouselData = {
  categoryId: string;
  title: string;
  subtitle: string;
  bgColor: string;
  items: AffiliateSocialPost[];
  floatingImageScale?: number;
};

export const socialPostsData: AffiliateSocialPost[] = [
  {
    id: 1,
    influencer: "@cookingwithsarah",
    influencerLink: "#",
    platform: "instagram",
    productImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/150?u=1",
    likes: "12k",
    comments: "450",
    shares: "2.1k",
    caption: "Look at this amazing build with Omega Houseware! Perfect for modern kitchens. #OmegaHome #KitchenDesign",
    productName: "Premium Chef Pan",
    regularPrice: "₱1,250",
    offerPrice: "₱1,150",
    affiliateLink: "/shop/chef-pan"
  },
  {
    id: 2,
    influencer: "@chef.markus",
    influencerLink: "#",
    platform: "tiktok",
    productImage: "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?q=80&w=600&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/150?u=2",
    likes: "8.5k",
    comments: "320",
    shares: "1.2k",
    caption: "Prepping dinner with my new Omega chef pan! Absolute game changer! 🍳🔥 #ChefLife",
    productName: "Enamel Dutch Oven",
    regularPrice: "₱2,450",
    affiliateLink: "/shop/dutch-oven"
  },
  {
    id: 3,
    influencer: "@homeaesthetics",
    influencerLink: "#",
    platform: "instagram",
    productImage: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/150?u=3",
    likes: "45k",
    comments: "1.2k",
    shares: "8.4k",
    caption: "The elegant new glassware collection from Omega. Simply stunning. ✨🍷",
    productName: "Classic Glassware",
    regularPrice: "₱1,200",
    offerPrice: "₱999",
    affiliateLink: "/shop/glassware"
  },
  {
    id: 4,
    influencer: "@dailybrew",
    influencerLink: "#",
    platform: "tiktok",
    productImage: "https://images.unsplash.com/photo-1584990347897-4a001ba0f749?q=80&w=600&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/150?u=4",
    likes: "22k",
    comments: "890",
    shares: "3.5k",
    caption: "Morning coffee routine just got an upgrade! ☕️ #CoffeeLover",
    productName: "Vacuum Flask",
    regularPrice: "₱850",
    affiliateLink: "/shop/vacuum-flask"
  }
];

export const socialAccountsData: SocialAccount[] = [
  {
    platform: "Instagram",
    username: "@omegahousewareph",
    link: "https://www.instagram.com/omegahousewareph",
    description: "Follow us for styling tips, kitchen aesthetics, and behind-the-scenes glimpses of our craftsmanship.",
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop"
    ]
  },
  {
    platform: "TikTok",
    username: "@omegahousewareph",
    link: "https://www.tiktok.com/@omegahousewareph",
    description: "Catch our viral recipes, quick cleaning hacks, and fun kitchen moments with the Omega family.",
    images: [
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
    ]
  },
  {
    platform: "Shopee",
    username: "Omega Houseware Official Store",
    link: "https://shopee.ph/omegahouseware",
    description: "Shop our full collection directly on Shopee for exclusive platform deals and nationwide shipping.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=600&auto=format&fit=crop"
    ]
  }
];


// Unified Array Mapping Highlights to their respective Categories
// This mirrors exactly how your CMS API will return the nested data!
export const categoryHighlightsData: CategoryCarouselData[] = [
  {
    categoryId: "glassware",
    title: "Glassware",
    subtitle: "Elegant and durable glassware designed for both everyday use and special occasions.",
    bgColor: "bg-[#FDFDFD]",
    floatingImageScale: 2,
    items: [
      { id: 101, influencer: "@homeglass", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=1", likes: "12K", comments: "102", shares: "3K", caption: "Crystal clear mornings with Omega's new tumbler collection....", productName: "Classic Tumbler", regularPrice: "₱850", offerPrice: "₱699", affiliateLink: "/shop/classic-tumbler" },
      { id: 102, influencer: "@coffee_time", influencerLink: "#", platform: "tiktok", productImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=2", likes: "45K", comments: "892", shares: "12K", caption: "Pour over perfection. My daily ritual. ☕", productName: "Glass Casserole", regularPrice: "₱1,899", affiliateLink: "/shop/glass-casserole" },
      { id: 103, influencer: "@interior_ph", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=3", likes: "8K", comments: "56", shares: "200", caption: "Styling the kitchen shelves with these beauties.", productName: "Elegant Wine Glasses", regularPrice: "₱1,500", offerPrice: "₱1,200", affiliateLink: "/shop/wine-glasses" },
      { id: 104, influencer: "@minimalist_dining", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=11", likes: "12K", comments: "85", shares: "1.1K", caption: "The art of simple hosting. ✨", productName: "Minimalist Pitcher", regularPrice: "₱950", affiliateLink: "/shop/pitcher" },
      { id: 105, influencer: "@cocktail_hour", influencerLink: "#", platform: "tiktok", productImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=12", likes: "33K", comments: "540", shares: "6K", caption: "Shaken, not stirred. 🍸 #OmegaVibe", productName: "Martini Glass Set", regularPrice: "₱1,650", offerPrice: "₱1,400", affiliateLink: "/shop/martini-set" },
    ],
  },
  {
    categoryId: "kitchenware",
    title: "Kitchenware",
    subtitle: "Essential tools and cookware that make cooking more efficient and enjoyable.",
    bgColor: "bg-white",
    floatingImageScale: 2,
    items: [
      { id: 201, influencer: "@chef_juan", influencerLink: "#", platform: "tiktok", productImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=4", likes: "55K", comments: "1.2K", shares: "8K", caption: "Slicing through prep time like butter! 🔪 #KitchenHacks", productName: "Essential Knife Set", regularPrice: "₱4,500", affiliateLink: "/shop/knife-set" },
      { id: 202, influencer: "@mommycooks", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=5", likes: "34K", comments: "450", shares: "2.1K", caption: "Sunday stews in my favorite Dutch Oven. The heat retention is...", productName: "Enamel Dutch Oven", regularPrice: "₱2,450", offerPrice: "₱1,999", affiliateLink: "/shop/dutch-oven" },
      { id: 203, influencer: "@wok_star", influencerLink: "#", platform: "tiktok", productImage: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=6", likes: "19K", comments: "210", shares: "900", caption: "Seasoning the new wok. Ready for some serious stir-fry.", productName: "Premium Chef Pan", regularPrice: "₱1,250", affiliateLink: "/shop/chef-pan" },
      { id: 204, influencer: "@healthy_bites", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=13", likes: "27K", comments: "310", shares: "1.5K", caption: "Steam, sauté, serve. Everything in one pot. 🥘", productName: "Multi-Steamer", regularPrice: "₱2,800", affiliateLink: "/shop/steamer" },
      { id: 205, influencer: "@baking_bad", influencerLink: "#", platform: "tiktok", productImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=14", likes: "42K", comments: "920", shares: "10K", caption: "That golden crust though... Omega bakeware never fails.", productName: "Gold-Trim Bakeware", regularPrice: "₱1,200", offerPrice: "₱999", affiliateLink: "/shop/bakeware" },
    ],
  },
  {
    categoryId: "dinnerware",
    title: "Dinnerware",
    subtitle: "Stylish and functional dinner sets perfect for family meals and gatherings.",
    bgColor: "bg-[#FDFDFD]",
    floatingImageScale: 1.5,
    items: [
      { id: 301, influencer: "@table_settings", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=7", likes: "15K", comments: "180", shares: "500", caption: "Setting the table for tonight's dinner party. Classic white never...", productName: "Ceramic Dish Set", regularPrice: "₱3,200", offerPrice: "₱2,800", affiliateLink: "/shop/dish-set" },
      { id: 302, influencer: "@hostess_ph", influencerLink: "#", platform: "facebook", productImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=8", likes: "28K", comments: "340", shares: "1.2K", caption: "Details matter. Loving the gold trim on these plates.", productName: "Gold Trim Plates", regularPrice: "₱1,800", affiliateLink: "/shop/plates" },
      { id: 303, influencer: "@family_feast", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1523472721958-978152f4d69b?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=15", likes: "22K", comments: "190", shares: "800", caption: "Sunday lunch with the whole clan! 🥘👨‍👩‍👧‍👦", productName: "Serving Bowl Set", regularPrice: "₱1,450", affiliateLink: "/shop/serving-bowls" },
      { id: 304, influencer: "@modern_host", influencerLink: "#", platform: "tiktok", productImage: "https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=16", likes: "39K", comments: "410", shares: "2.3K", caption: "Sleek, matte, and perfect for every meal.", productName: "Matte Black Set", regularPrice: "₱2,100", offerPrice: "₱1,850", affiliateLink: "/shop/matte-black" },
      { id: 305, influencer: "@brunch_vibe", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=17", likes: "18K", comments: "210", shares: "750", caption: "Brunch just got more aesthetic. 🥂", productName: "Porcelain Set", regularPrice: "₱2,600", affiliateLink: "/shop/porcelain" },
    ],
  },
  {
    categoryId: "vacuum-flask",
    title: "Vacuum Flask",
    subtitle: "Keep beverages hot or cold for longer with our reliable insulated flasks.",
    bgColor: "bg-white",
    floatingImageScale: 1,
    items: [
      { id: 401, influencer: "@on_the_go", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=9", likes: "31K", comments: "420", shares: "1.8K", caption: "Keeps my coffee hot for 12 hours. Essential for long drives.", productName: "Vacuum Flask XL", regularPrice: "₱1,200", offerPrice: "₱999", affiliateLink: "/shop/vacuum-flask-xl" },
      { id: 402, influencer: "@coffee_lover", influencerLink: "#", platform: "tiktok", productImage: "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=10", likes: "18K", comments: "150", shares: "600", caption: "Morning tea time setup. 🍵", productName: "Mini Flask", regularPrice: "₱850", affiliateLink: "/shop/mini-flask" },
      { id: 403, influencer: "@hiker_lifestyle", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1613645540553-d98859ffeec5?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=18", likes: "52K", comments: "2.3K", shares: "15K", caption: "Still ice cold after a 6-hour hike. Highly recommended! 🏔️❄️", productName: "Adventure Flask", regularPrice: "₱1,450", affiliateLink: "/shop/adventure-flask" },
      { id: 404, influencer: "@gym_rat", influencerLink: "#", platform: "tiktok", productImage: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=19", likes: "25K", comments: "190", shares: "800", caption: "Stay hydrated during those heavy sessions. 💪🥤", productName: "Sports Insulated Bottle", regularPrice: "₱899", affiliateLink: "/shop/sports-bottle" },
      { id: 405, influencer: "@commuter_life", influencerLink: "#", platform: "instagram", productImage: "https://images.unsplash.com/photo-1679310289576-8e1b68b808ba?q=80&w=800&auto=format&fit=crop", avatar: "https://i.pravatar.cc/150?u=20", likes: "14K", comments: "110", shares: "300", caption: "Zero leaks in my bag. The locking mechanism is perfect.", productName: "Travel Tumbler", regularPrice: "₱750", offerPrice: "₱650", affiliateLink: "/shop/travel-tumbler" },
    ],
  }
];
