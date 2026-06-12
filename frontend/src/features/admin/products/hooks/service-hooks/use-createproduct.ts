import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });

// use-createproduct.ts
export interface CreateProductInput {
  productName: string;
  productDescription?: string;
  sku: string;
  categoryId: number;
  productPrice: number;
  reorderPoint: number;
  available: number;
  imageUrl?: string;
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: CreateProductInput) =>
            await api.post('admin/products', { json: input }).json(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    });
};