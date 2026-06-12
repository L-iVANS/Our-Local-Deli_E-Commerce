import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productId: number) => await api.delete(`admin/products/${productId}`).json(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    });
};
