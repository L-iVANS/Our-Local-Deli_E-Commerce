export interface DeliveryDetails {
  address: string;
  contactPerson: string;
  contactNumber: string;
  deliveryDate: string;
  notes: string;
  usePrimaryAddress?: boolean;
}

export interface CartItem {
  id?: number;
  product: {
    id: string;
    name: string;
    category?: string;
    image?: string;
    imageUrl?: string;
    retailPrice?: number;
    minWholesale?: number;
    minBulk?: number;
  };
  qty: number;
  unitPrice: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Company {
  userId?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  emailAddress?: string;
  companyName?: string;
  address: string;
  phoneNumber?: string;
  role?: string;
  // Extended properties for cart feature
  name?: string;
  email?: string;
  accountNumber?: string;
  contactPerson?: string;
  tier?: string;
  id?: string;
}

