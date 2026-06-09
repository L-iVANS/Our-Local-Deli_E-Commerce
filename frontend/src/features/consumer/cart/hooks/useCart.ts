// "use client";

// import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
// // import { useMutation, useQuery as apolloUseQuery } from "@apollo/client/react";
// import { useAuth } from "@/features/auth/hooks/useAuth";

// import { GET_CART } from "../services/query";
// import { ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART, REMOVE_CART_ITEM_BY_PRODUCT_ID } from "../services/cartMutation";
// import { CartItem } from "../types/index";

// // Product type built from dynamic data
// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   retailPrice: number;
//   wholesalePrice?: number;
//   bulkPrice?: number;
//   minWholesale?: number;
//   minBulk?: number;
//   image?: string;
//   imageUrl?: string;
//   category?: string;
//   rating?: number;
//   badge?: string;
//   specs?: string[];
//   description?: string;
//   reviews?: number;
// }

// interface CartContextType {
//   items: CartItem[];
//   addItem: (product: Product, qty: number, opts?: { color?: string; size?: string }) => void;
//   updateQty: (productId: string, qty: number) => void;
//   removeItem: (productId: string) => void;
//   removeItems: (productIds: string[]) => void;
//   clearCart: () => void;
//   itemCount: number;
//   subtotal: number;
//   lastAdded: Product | null;
// }

// type PersistedCartItem = {
//   id?: number;
//   productId: string;
//   productName?: string;
//   productImage?: string;
//   productCategory?: string;
//   qty: number;
//   selectedColor?: string;
//   selectedSize?: string;
//   unitPrice: number;
// };

// type CartCookiePayload = {
//   items: PersistedCartItem[];
// };

// interface GetCartResponse {
//   getCart: {
//     items: any[];
//   };
// }

// const CART_STORAGE_KEY = "omega_b2b_cart_items";

// // Helper to check if user is likely authenticated (can't check httpOnly cookies from JS)
// // This is just a heuristic - actual auth is validated by backend via cookie
// function isLikelyAuthenticated(company?: any): boolean {
//   return !!company?.userId;
// }

// // Transform backend cart item response to persisted format
// function transformBackendCartItem(backendItem: any): PersistedCartItem {
//   try {
//     const product = backendItem.product || {};
//     const categoryName = product.category?.categoryName || product.categoryName || 'Unknown';
//     const imageUrl = product.imageUrl || '';
    
//     const transformed = {
//       id: backendItem.id,
//       productId: String(backendItem.productId || product.productId),
//       productName: product.productName,
//       productImage: imageUrl,
//       productCategory: categoryName,
//       qty: backendItem.quantity,
//       selectedColor: backendItem.selectedColor,
//       selectedSize: backendItem.selectedSize,
//       unitPrice: parseFloat(String(backendItem.unitPrice || product.productPrice || 0)),
//     };
//     return transformed;
//   } catch (error) {
//     console.error("[Cart] Error transforming backend item:", error, backendItem);
//     throw error;
//   }
// }

// const CartContext = createContext<CartContextType>({
//   items: [],
//   addItem: () => {},
//   updateQty: () => {},
//   removeItem: () => {},
//   removeItems: () => {},
//   clearCart: () => {},
//   itemCount: 0,
//   subtotal: 0,
//   lastAdded: null,
// });

// function getUnitPrice(product: Product) {
//   return product.retailPrice;
// }

// function serializeCartItems(items: CartItem[]): PersistedCartItem[] {
//   return items.map((item) => ({
//     id: item.id,
//     productId: item.product.id,
//     productName: item.product.name,
//     // Prefer canonical backend upload path over UI thumbnail/fallback image.
//     productImage: item.product.imageUrl || item.product.image,
//     productCategory: item.product.category,
//     qty: item.qty,
//     selectedColor: item.selectedColor,
//     selectedSize: item.selectedSize,
//     unitPrice: item.unitPrice,
//   }));
// }

// function hydrateCartItems(serializedItems: any[]): CartItem[] {
//   return serializedItems
//     .map((serializedItem) => {
//       const productId = String(serializedItem.productId);
//       const imageUrl = serializedItem.productImage || '';
      
//       // Always reconstruct product from persisted data
//       // No dependency on static products array
//       const product: Product = {
//         id: productId,
//         name: serializedItem.productName || `Product ${productId}`,
//         price: serializedItem.unitPrice || 0,
//         retailPrice: serializedItem.unitPrice || 0,
//         wholesalePrice: serializedItem.unitPrice || 0,
//         bulkPrice: serializedItem.unitPrice || 0,
//         minWholesale: 1,
//         minBulk: 1,
//         imageUrl: imageUrl,  // Set imageUrl for component
//         image: imageUrl,      // Also set image as fallback
//         category: serializedItem.productCategory || 'Unknown',
//         rating: 0,
//       };

//       return {
//         id: serializedItem.id,
//         product,
//         qty: serializedItem.quantity || serializedItem.qty || 1,
//         selectedColor: serializedItem.selectedColor,
//         selectedSize: serializedItem.selectedSize,
//         unitPrice: parseFloat(String(serializedItem.unitPrice)),
//       } as CartItem;
//     })
//     .filter((item): item is CartItem => item !== null);
// }

// export function CartProvider({ children }: { children: ReactNode }): React.ReactNode {
//   const { company } = useAuth();
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [lastAdded, setLastAdded] = useState<Product | null>(null);
//   const [isHydrated, setIsHydrated] = useState(false);

//   // GraphQL mutations
//   // const [addToCartMutation] = useMutation(ADD_TO_CART);
//   // const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM);
//   // const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
//   // const [clearCartMutation] = useMutation(CLEAR_CART);
//   // const [removeByProductMutation] = useMutation(REMOVE_CART_ITEM_BY_PRODUCT_ID);

//   // GraphQL query - skip if no user ID
//   // httpOnly cookie is sent automatically by browser with credentials: "include"
//   // const { data: cartData, refetch: refetchCart, error: cartError } = apolloUseQuery<GetCartResponse>(GET_CART, {
//   //   skip: !company?.userId,
//   // });

//   // Load cart from localStorage on initial mount
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
    
//     try {
//       const cached = localStorage.getItem(CART_STORAGE_KEY);
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         const hydrated = hydrateCartItems(parsed);
//         setItems(hydrated);
//       }
//     } catch (error) {
//       console.error("Failed to load cart from localStorage:", error);
//     }
    
//     setIsHydrated(true);
//   }, []);

//   // Handle cart data updates from GraphQL
//   useEffect(() => {
//     // Only update cart if backend actually returned items (not empty)
//     if (cartData?.getCart?.items && Array.isArray(cartData.getCart.items) && cartData.getCart.items.length > 0) {
//       try {
//         // Transform backend response to persisted format
//         const transformedItems = cartData.getCart.items.map(transformBackendCartItem);
//         // Hydrate the transformed items
//         const hydrated = hydrateCartItems(transformedItems);
//         setItems(hydrated);
//         // Sync backend data to localStorage
//         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(transformedItems));
//         setIsHydrated(true);
//       } catch (error) {
//         console.error("Failed to hydrate cart items:", error);
//         setIsHydrated(true);
//         setItems([]);
//       }
//     } else if (cartData?.getCart) {
//       // Backend query returned but with empty cart - don't clear localStorage
//       setIsHydrated(true);
//     }
//   }, [cartData]);

//   // Handle cart errors
//   useEffect(() => {
//     if (cartError) {
//       // Suppress "No token provided" errors - user may be logged out or session expired
//       // These are expected and not critical errors
//       const errorMessage = cartError?.message || '';
//       if (errorMessage.includes('No token provided') || errorMessage.includes('Unauthorized')) {
//         // Silently handle token errors - user can still browse with localStorage cart
//         setIsHydrated(true);
//         return;
//       }
//       console.error("Failed to fetch cart:", cartError);
//       setIsHydrated(true);
//     }
//   }, [cartError]);

//   useEffect(() => {
//     const clearLegacyStorage = (storage: Storage) => {
//       const keysToRemove: string[] = [];

//       for (let i = 0; i < storage.length; i += 1) {
//         const key = storage.key(i);
//         if (!key) continue;

//         const isLegacyCartKey =
//           key === "cart_items" ||
//           key === "cart_tier" ||
//           key.startsWith("cart:") ||
//           key.startsWith("session-cart:") ||
//           key.startsWith("cart_");

//         if (isLegacyCartKey) {
//           keysToRemove.push(key);
//         }
//       }

//       keysToRemove.forEach((key) => storage.removeItem(key));
//     };

//     try {
//       clearLegacyStorage(localStorage);
//       clearLegacyStorage(sessionStorage);
//     } catch {
//       // Ignore storage cleanup issues
//     }
//   }, []);

//   // Refetch cart when user logs in
//   useEffect(() => {
//     if (company?.userId) {
//       void refetchCart();
//     } else {
//       // User is not logged in - keep localStorage items, just mark as hydrated
//       setIsHydrated(true);
//     }
//   }, [company?.userId, refetchCart]);

//   const addItem = (product: Product, qty: number, opts?: { color?: string; size?: string }) => {
//     let unitPrice = getUnitPrice(product);
    
//     // Fallback if retailPrice is missing
//     if (!unitPrice || unitPrice <= 0) {
//       unitPrice = product.price || 0;
//     }
    

//     setItems((prev) => {
//       const existing = prev.find((i) => i.product.id === product.id);
//       let updated: CartItem[];
//       if (existing) {
//         updated = prev.map((i) =>
//           i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
//         );
//       } else {
//         updated = [...prev, {
//           id: undefined,
//           product, qty, unitPrice,
//           selectedColor: opts?.color,
//           selectedSize: opts?.size,
//         }];
//       }
      
//       // Persist to localStorage with full product details
//       const serialized = serializeCartItems(updated);
//       localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serialized));
      
//       return updated;
//     });
    
//     // Sync with backend
//     if (company?.userId) {
//       const productId = parseInt(product.id, 10);
//       const input: any = {
//         productId,
//         quantity: qty,
//         unitPrice,
//       };
      
//       // Only include optional fields if they have values
//       if (opts?.color) {
//         input.selectedColor = opts.color;
//       }
//       if (opts?.size) {
//         input.selectedSize = opts.size;
//       }
      
//       if (!productId || productId <= 0) {
//         return;
//       }
      
//       if (!unitPrice || unitPrice <= 0) {
//         return;
//       }
      
//       void addToCartMutation({
//         variables: { input },
//         onCompleted: () => {
//           void refetchCart();
//         },
//         onError: (mutationError) => {
//           console.error("[Cart] Add to cart mutation failed");
//           console.error("[Cart] User context:", { 
//             isHydrated,
//             hasCompanyId: !!company?.userId,
//             likelyAuthenticated: isLikelyAuthenticated(company),
//           });
//           console.error("[Cart] Error type:", mutationError.constructor.name);
//           console.error("[Cart] Error toString():", mutationError.toString());
//           console.error("[Cart] Error message:", mutationError.message);
          
//           const apolloError = mutationError as any;
          
//           if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
//             console.error("[Cart] GraphQL Errors:");
//             apolloError.graphQLErrors.forEach((gqlErr: any, index: number) => {
//               console.error(`  [${index}] Message: ${gqlErr.message}`);
//               console.error(`  [${index}] Path: ${JSON.stringify(gqlErr.path)}`);
//               console.error(`  [${index}] Extensions: ${JSON.stringify(gqlErr.extensions)}`);
//             });
//           } else {
//             console.error("[Cart] No GraphQL errors");
//           }
          
//           if (apolloError.networkError) {
//             console.error("[Cart] Network error:", {
//               message: apolloError.networkError.message,
//               statusCode: (apolloError.networkError as any).statusCode,
//               result: (apolloError.networkError as any).result,
//             });
//           } else {
//             console.error("[Cart] No network error");
//           }
          
//           console.error("[Cart] Full error object:", mutationError);
//         },
//       });
//     }
    
//     setLastAdded(product);
//     setTimeout(() => setLastAdded(null), 2500);
//   };

//   const updateQty = (productId: string, qty: number) => {
//     if (qty < 1) return;

//     const targetItem = items.find((i) => i.product.id === productId);
    
//     // Update local state
//     setItems((prev) => {
//       const updated = prev.map((i) => i.product.id === productId ? { ...i, qty } : i);
//       // Persist to localStorage
//       localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializeCartItems(updated)));
//       return updated;
//     });

//     // Sync with backend
//     if (company?.userId && targetItem?.id) {
//       void updateCartItemMutation({
//         variables: {
//           input: {
//             id: targetItem.id,
//             quantity: qty,
//           },
//         },
//         onCompleted: () => {
//           void refetchCart();
//         },
//         onError: (error) => {
//           console.error("[Cart] Failed to update quantity on backend:", error);
//         },
//       });
//     } else if (company?.userId) {
//       // If legacy local cart item has no backend id yet, resync full cart snapshot.
//       void refetchCart();
//     }
//   };

//   const removeItem = (productId: string) => {
//     setItems((prev) => {
//       const updated = prev.filter((i) => i.product.id !== productId);
//       // Persist to localStorage
//       localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializeCartItems(updated)));
//       return updated;
//     });
    
//     // Sync with backend
//     if (company?.userId) {
//       void removeByProductMutation({
//         variables: {
//           productId: parseInt(productId, 10),
//         },
//         onCompleted: () => {
//           void refetchCart();
//         },
//         onError: (error) => {
//           console.error("[Cart] Failed to remove item from backend:", error);
//         },
//       });
//     }
//   };

//   const removeItems = (productIds: string[]) => {
//     if (productIds.length === 0) {
//       return;
//     }

//     const productIdSet = new Set(productIds);
//     setItems((prev) => {
//       const updated = prev.filter((item) => !productIdSet.has(item.product.id));
//       // Persist to localStorage
//       localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializeCartItems(updated)));
//       return updated;
//     });
    
//     // Sync with backend
//     if (company?.userId) {
//       productIds.forEach(productId => {
//         void removeByProductMutation({
//           variables: {
//             productId: parseInt(productId, 10),
//           },
//           onCompleted: () => {
//             void refetchCart();
//           },
//           onError: (error) => {
//             console.error("[Cart] Failed to remove items from backend:", error);
//           },
//         });
//       });
//     }
//   };

//   // const clearCart = () => {
//   //   setItems([]);
//   //   // Persist to localStorage
//   //   localStorage.removeItem(CART_STORAGE_KEY);
    
//   //   // Sync with backend
//   //   if (company?.userId) {
//   //     void clearCartMutation({
//   //       variables: {},
//   //       onCompleted: () => {
//   //         void refetchCart();
//   //       },
//   //       onError: (error) => {
//   //         console.error("[Cart] Failed to clear cart on backend:", error);
//   //       },
//   //     });
//   //   }
//   // };

//   const itemCount = items.reduce((s, i) => s + i.qty, 0);
//   const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

//   return React.createElement(CartContext.Provider, { value: {
//     items,
//     addItem, updateQty, removeItem, removeItems, clearCart: () => {}, // clearCart is currently disabled
//     itemCount, subtotal, lastAdded,
//   }}, isHydrated ? children : null);
// }

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider");
//   }
//   return context;
// };
