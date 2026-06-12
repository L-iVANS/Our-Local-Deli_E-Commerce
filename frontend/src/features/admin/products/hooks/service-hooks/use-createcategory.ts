import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: {
            categoryName: string;
            slug: string;
            skuPrefix: string;
        }) => await api.post('admin/categories', { json: input }).json(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    });
};