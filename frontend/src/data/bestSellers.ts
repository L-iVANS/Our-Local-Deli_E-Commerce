// src/data/bestSeller.ts

export interface BestSeller {
  productId: number;
  name: string;
  image: string;
  price: number;
  weight: string;
  badges: {
    type: "leaf" | "shield" | "clock" | "chef";
    label: string;
  }[];
  link?: string;
}

export const bestSellersData: BestSeller[] = [
  {
    productId: 1,
    name: "USDA Angus Tapa",
    image: "/assets/products/usda-angus-tapa.jpg",
    price: 480,
    weight: "350g",
    badges: [
      {
        type: "leaf",
        label: "Preservative-Free",
      },
      {
        type: "shield",
        label: "No MSG Added",
      },
    ],
    link: "/catalog?productId=1",
  },
  {
    productId: 2,
    name: "Mattie's Favorite Premium Xiao Long Bao",
    image: "/assets/products/xiao-long-bao.jpg",
    price: 360,
    weight: "12 pcs / pack",
    badges: [
      {
        type: "clock",
        label: "Ready in 10–12 mins",
      },
    ],
    link: "/catalog?productId=2",
  },
  {
    productId: 3,
    name: "Aling Lucing Sisig",
    image: "/assets/products/aling-lucing-sisig.jpg",
    price: 350,
    weight: "300g",
    badges: [
      {
        type: "chef",
        label: "Ready to Heat",
      },
    ],
    link: "/catalog?productId=3",
  },
  {
    productId: 4,
    name: "Gourmet Crunchy Dilis",
    image: "/assets/products/crunchy-dilis.jpg",
    price: 220,
    weight: "200g",
    badges: [
      {
        type: "chef",
        label: "Freshly Cooked",
      },
    ],
    link: "/catalog?productId=4",
  },
  {
    productId: 5,
    name: "Longganisa Classic",
    image: "/assets/products/longganisa-classic.jpg",
    price: 380,
    weight: "500g",
    badges: [
      {
        type: "shield",
        label: "Premium Quality",
      },
    ],
    link: "/catalog?productId=5",
  },
  {
    productId: 6,
    name: "Corned Beef Homestyle",
    image: "/assets/products/corned-beef-homestyle.jpg",
    price: 290,
    weight: "340g",
    badges: [
      {
        type: "leaf",
        label: "High in Protein",
      },
    ],
    link: "/catalog?productId=6",
  },
];