import type {Account, AccountCreate, AccountUpdate} from '@/types/account';
import api from "./client";

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

    async delete(id: string): Promise<void> {
        await api.delete(`/accounts/${id}`);
    },
};