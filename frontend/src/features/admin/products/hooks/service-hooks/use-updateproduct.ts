import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });

export interface UpdateProductInput {
    productName?: string;
    sku?: string;
    productDescription?: string;
    slug?: string;
    description?: string;
    productPrice?: number;
    reorderPoint?: number;
    price?: number;
    available?: number;
    stock?: number;
    categoryId?: number;
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, input }: { id: number; input: UpdateProductInput }) =>
            await api.patch(`admin/products/${id}`, { json: input }).json(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    });
};