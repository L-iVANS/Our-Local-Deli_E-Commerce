import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: number, input: any }) =>
      await api.patch(`admin/categories/${id}`, { json: input }).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });
};
