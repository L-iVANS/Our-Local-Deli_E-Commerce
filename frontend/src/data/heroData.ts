export type HeroSettings = {
  scale?: number;
  translateY?: number;
  translateX?: number;
};

export type ProductGroup = {
  id: number;
  name: string;
  products: {
    id: number;
    image: string;
    name: string;
    price: string;
    isMain?: boolean;
    heroSettings?: HeroSettings;
  }[];
};

export type HeroPointer = {
  id: string;
  top: string;
  left: string;
  productName: string;
  description: string;
  image: string;
  link: string;
};

export type HeroScene = {
  id: string;
  video: string;
  startTime: number;
  endTime: number;
  pointers: HeroPointer[];
};

export type HeroData = {
  versionA: {
    headlinePart1: string;
    headlineItalic: string;
    description: string;
    heroDescriptionShort: string;
    bgImage: string;
    ctaPrimary: { text: string; link: string };
    ctaSecondary: { text: string; link: string };
    productGroups: ProductGroup[];
  };
  versionB: {
    headlinePart1: string;
    headlineItalic: string;
    description: string;
    heroDescriptionShort: string;
    ctaPrimary: { text: string; link: string };
    ctaSecondary: { text: string; link: string };
    scenes: HeroScene[];
  };
};

export const heroData: HeroData = {
  versionA: {
    headlinePart1: "All-around Partner sa",
    headlineItalic: "Amazing Handaan",
    description: "Discover reliable, stylish, and high-quality kitchen and home essentials designed to simplify your modern lifestyle. From cookwares to glasswares, Omega brings functionality and premium elegance into every Filipino home.",
    heroDescriptionShort: "Your all-around partner for every amazing handaan.",
    bgImage: "/assets/modernkitchen_bg_hero_crop.png",
    ctaPrimary: { text: "Shop Now", link: "#explore" },
    ctaSecondary: { text: "Explore Collections", link: "#contact" },
    productGroups: [
      {
        id: 1,
        name: "Premium Cookware",
        products: [
          { id: 101, image: "/assets/product_category/cookware/cookware1.png", name: "Tessa Aluminum Non-stick Coating Fry Pan", price: "₱759", heroSettings: { scale: 3.5, translateY: 200 } },
          { id: 102, image: "/assets/product_category/cookware/cookware2.png", name: "Valdemar Stainless Steel Whistling Kettle", price: "₱629", isMain: true, heroSettings: { scale: 1.5, translateY: 10 } },
          { id: 103, image: "/assets/product_category/vacuum-flask/vacuumflask1.png", name: "Omega Dalvin Stainless Steel Thermal Carafe", price: "₱780", heroSettings: { scale: 1.5 } },
        ]
      },
      {
        id: 2,
        name: "Elegant Glassware",
        products: [
          { id: 201, image: "/assets/product_category/glassware/glassware1.png", name: "Robbia Rectangular Glass Food Keeper", price: "₱549", heroSettings: { scale: 2, translateY: 40 } },
          { id: 202, image: "/assets/product_category/glassware/glassware2.png", name: "Shaula Square Glass Food Keeper", price: "₱449", isMain: true, heroSettings: { scale: 2.3, translateY: 60 } },
          { id: 203, image: "/assets/product_category/glassware/glassware3.png", name: "Crumpet Plastic French Press With Stainless Steel Filter", price: "₱339", heroSettings: { scale: 2, translateY: 40 } },
        ]
      },
      {
        id: 3,
        name: "Professional Bakeware",
        products: [
          { id: 301, image: "/assets/product_category/bakeware/bakeware1.png", name: "Adolf Rectangular Glass Bakedish", price: "₱629", heroSettings: { scale: 2.5, translateY: 40 } },
          { id: 302, image: "/assets/product_category/bakeware/bakeware2.png", name: "Ceramic Baking Dish", price: "₱559", isMain: true, heroSettings: { scale: 2.5, translateY: 60 } },
          { id: 303, image: "/assets/product_category/bakeware/bakeware1.png", name: "Vendome Rectangular Tempered Glass Bakedish", price: "₱429", heroSettings: { scale: 2.5, translateY: 40 } },
        ]
      }
    ]

  },
  versionB: {
    headlinePart1: "All-around Partner sa",
    headlineItalic: "Amazing Handaan",
    description: "Discover reliable, stylish, and high-quality kitchen and home essentials designed to simplify your modern lifestyle. From cookwares to glasswares, Omega brings functionality and premium elegance into every Filipino home.",
    heroDescriptionShort: "Perfect companion for every handaan—easy, reliable, and powerful.",
    ctaPrimary: { text: "Shop Now", link: "#explore" },
    ctaSecondary: { text: "Explore Collections", link: "#contact" },
    scenes: [
      {
        id: "scene1",
        video: "/assets/hero/videobgsample.mp4",
        startTime: 0,
        endTime: 6,
        pointers: [
          {
            id: "p1-1",
            top: "45%",
            left: "60%",
            productName: "Premium Cookware",
            description: "Perfect heat distribution for professional searing.",
            image: "/assets/product_category/cookware/cookware1.png",
            link: "/shop/cookware"
          },
          {
            id: "p1-2",
            top: "60%",
            left: "80%",
            productName: "Enamel Dutch Oven",
            description: "Heritage design with modern kitchen durability.",
            image: "/assets/product_category/cookware/cookware2.png",
            link: "/shop/dutch-oven"
          }
        ]
      },
      {
        id: "scene2",
        video: "/assets/hero/videobgsample.mp4",
        startTime: 6,
        endTime: 14,
        pointers: [
          {
            id: "p2-1",
            top: "40%",
            left: "70%",
            productName: "Heritage Vacuum Flask",
            description: "Keeps drinks hot or cold for 12 hours.",
            image: "/assets/product_category/vacuum-flask/vacuum-flask1.png",
            link: "/shop/vacuum-flask"
          }
        ]
      },
      {
        id: "scene3",
        video: "/assets/hero/videobgsample.mp4",
        startTime: 14,
        endTime: 999, // Final scene until loop
        pointers: [
          {
            id: "p3-1",
            top: "50%",
            left: "65%",
            productName: "Hydration Solutions",
            description: "Durable and stylish water bottles for everyday use.",
            image: "/assets/product_category/glassware/glassware2.png",
            link: "/shop/hydration"
          },
          {
            id: "p3-2",
            top: "65%",
            left: "85%",
            productName: "Elegant Glasswares",
            description: "Crystal clear glass for premium beverage service.",
            image: "/assets/product_category/glassware/glassware1.png",
            link: "/shop/glassware"
          }
        ]
      }
    ]
  }
};