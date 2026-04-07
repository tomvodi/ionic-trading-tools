import axios from 'axios'; // or use native fetch if you prefer
import type {Account, AccountCreate, AccountUpdate} from '@/types/account';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const accountsService = {
    async getActive(): Promise<Account[]> {
        const { data } = await api.get<Account[]>('/accounts/active');
        return data;
    },

    async getAll(): Promise<Account[]> {
        const { data } = await api.get<Account[]>('/accounts');
        return data;
    },

    async toggleStatus(id: string, isActive: boolean): Promise<void> {
        await api.patch(`/accounts/${id}/status`, {
            active: isActive
        });
    },

    async update(id: string, accountUpdate : AccountUpdate): Promise<void> {
        await api.put(`/accounts/${id}`, accountUpdate);
    },

    async create(accountCreate : AccountCreate): Promise<void> {
        await api.post(`/accounts`, accountCreate);
    },
};