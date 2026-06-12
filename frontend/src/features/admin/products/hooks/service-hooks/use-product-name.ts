import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });
export const useProductName = (productName: string) => {
    return useQuery({
        queryKey: ['product', productName],
        queryFn: async () => await api.get(`admin/products/by-name/${productName}`).json<any>(),
        enabled: !!productName,
    });
};
