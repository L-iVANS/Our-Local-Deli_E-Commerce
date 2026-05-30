export type Review = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  review: string;
  rating: number;
};

export const reviewsData: Review[] = [
  {
    id: 1,
    name: "Lovely S.",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?u=1",
    review: "\"Ang bilis dumating! Gandaaa ng quality basta Omega! Excited na ako gamitin. Thank you Omega til next purchase.\"",
    rating: 5,
  },
  {
    id: 2,
    name: "Elvira A.",
    role: "Satisfied Customer",
    avatar: "https://i.pravatar.cc/150?u=2",
    review: "\"Really nice and quality of the items is really good. Thanks Omega. Continue to sell nice and quality plus affordable product.\"",
    rating: 5,
  },
  {
    id: 3,
    name: "Celina R.",
    role: "Home Maker",
    avatar: "https://i.pravatar.cc/150?u=3",
    review: "\"So happy with my purchase. It is very useful for families. Aesthetically organizes your kitchen! Thanks Omega.\"",
    rating: 5,
  },
  {
    id: 4,
    name: "Cristine B.",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?u=4",
    review: "\"Highly recommended products! Ang nice pa ng packaging, alam mong safe ang mga products. Thank you Omega!\"",
    rating: 5,
  }
];
