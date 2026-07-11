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
    bgImage: string;
    ctaPrimary: { text: string; link: string };
    ctaSecondary: { text: string; link: string };
    scenes: HeroScene[];
  };
};

export const heroData: HeroData = {
  versionA: {
    headlinePart1: "Good Food.",
    headlineItalic: "Local Love.",

    description:
      "Premium frozen meals, pantry staples, and everyday favorites—carefully curated for Filipino families. From ready-to-cook classics to trusted local pantry essentials, Our Local Deli brings comfort, convenience, and quality to every table.",

    heroDescriptionShort:
      "Premium frozen meals, pantry staples, and everyday favorites — carefully selected for your family.",

    bgImage: "/assets/hero/hero-food.jpg",

    ctaPrimary: {
      text: "Shop Now",
      link: "/catalog",
    },

    ctaSecondary: {
      text: "Browse Categories",
      link: "/#product-catalog",
    },

    productGroups: [
      {
        id: 1,
        name: "Frozen Favorites",
        products: [
          {
            id: 101,
            image: "/assets/products/usda-angus-tapa.png",
            name: "USDA Angus Tapa",
            price: "₱399",
            isMain: true,
            heroSettings: {
              scale: 1.3,
              translateY: 20,
            },
          },
          {
            id: 102,
            image: "/assets/products/xiao-long-bao.png",
            name: "Xiao Long Bao",
            price: "₱299",
            heroSettings: {
              scale: 1.2,
              translateY: 10,
            },
          },
          {
            id: 103,
            image: "/assets/products/ready-to-cook-meals.png",
            name: "Ready-to-Cook Meals",
            price: "₱249",
            heroSettings: {
              scale: 1.15,
            },
          },
        ],
      },
      {
        id: 2,
        name: "Pantry Staples",
        products: [
          {
            id: 201,
            image: "/assets/products/gourmet-crunchy-dilis.png",
            name: "Gourmet Crunchy Dilis",
            price: "₱189",
            isMain: true,
            heroSettings: {
              scale: 1.35,
              translateY: 25,
            },
          },
          {
            id: 202,
            image: "/assets/products/local-condiments.png",
            name: "Local Condiments",
            price: "₱149",
            heroSettings: {
              scale: 1.2,
              translateY: 10,
            },
          },
          {
            id: 203,
            image: "/assets/products/pantry-essentials.png",
            name: "Pantry Essentials",
            price: "₱199",
            heroSettings: {
              scale: 1.15,
            },
          },
        ],
      },
      {
        id: 3,
        name: "Breakfast Classics",
        products: [
          {
            id: 301,
            image: "/assets/products/beef-tapa.png",
            name: "Beef Tapa",
            price: "₱349",
            isMain: true,
            heroSettings: {
              scale: 1.25,
              translateY: 15,
            },
          },
          {
            id: 302,
            image: "/assets/products/tocino.png",
            name: "Pork Tocino",
            price: "₱299",
            heroSettings: {
              scale: 1.2,
              translateY: 10,
            },
          },
          {
            id: 303,
            image: "/assets/products/longganisa.png",
            name: "Local Longganisa",
            price: "₱289",
            heroSettings: {
              scale: 1.2,
            },
          },
        ],
      },
    ],
  },

  versionB: {
    headlinePart1: "Good Food.",
    headlineItalic: "Local Love.",

    description:
      "Premium frozen meals, pantry staples, and everyday favorites—carefully curated for Filipino families. From ready-to-cook classics to trusted local pantry essentials, Our Local Deli brings comfort, convenience, and quality to every table.",

    heroDescriptionShort:
      "Premium frozen meals, pantry staples, and everyday favorites — carefully selected for your family.",

    bgImage: "/assets/hero/hero-food.jpg",

    ctaPrimary: {
      text: "Shop Now",
      link: "/catalog",
    },

    ctaSecondary: {
      text: "Browse Categories",
      link: "/#product-catalog",
    },

    scenes: [
      {
        id: "scene1",
        video: "",
        startTime: 0,
        endTime: 999,
        pointers: [
          {
            id: "p1-1",
            top: "46%",
            left: "62%",
            productName: "USDA Angus Tapa",
            description:
              "Premium beef tapa made for easy, flavorful Filipino breakfasts.",
            image: "/assets/products/usda-angus-tapa.png",
            link: "/catalog/usda-angus-tapa",
          },
          {
            id: "p1-2",
            top: "35%",
            left: "82%",
            productName: "Xiao Long Bao",
            description:
              "Ready-to-steam dumplings for quick merienda, dinner, or handaan.",
            image: "/assets/products/xiao-long-bao.png",
            link: "/catalog/xiao-long-bao",
          },
          {
            id: "p1-3",
            top: "73%",
            left: "70%",
            productName: "Gourmet Crunchy Dilis",
            description:
              "Crispy, savory pantry favorite perfect with rice or as a snack.",
            image: "/assets/products/gourmet-crunchy-dilis.png",
            link: "/catalog/gourmet-crunchy-dilis",
          },
        ],
      },
    ],
  },
};