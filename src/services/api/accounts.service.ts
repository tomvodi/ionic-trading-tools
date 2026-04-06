import axios from 'axios'; // or use native fetch if you prefer
import type { Account } from '@/types/account';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const accountsService = {
    async getActive(): Promise<Account[]> {
        const { data } = await api.get<Account[]>('/accounts/active');
        return data;
    },

};