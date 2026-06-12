import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { Category } from '../../components/CategoriesTable';

const api = ky.create({ prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' });

export const useGetCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => await api.get('admin/categories').json<Category[]>(),
    });
};