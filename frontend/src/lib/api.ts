// src/lib/api.ts
import ky from 'ky';

export const api = ky.create({ 
    prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    credentials: 'include', // Include cookies in requests 
});