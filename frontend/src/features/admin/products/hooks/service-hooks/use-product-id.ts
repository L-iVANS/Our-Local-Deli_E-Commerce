import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });
export const useProductId = (productId: number) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: async () => await api.get(`admin/products/${productId}`).json<any>(),
        enabled: !!productId,
    });
};
