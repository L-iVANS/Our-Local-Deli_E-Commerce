import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });
export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => await api.get('admin/products').json<any[]>(),
    });
};
