import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryId: number) =>
            await api.delete(`admin/categories/${categoryId}`).json(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    });
};