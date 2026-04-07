// src/services/api/companies.service.ts
import axios from 'axios';
import type { Company } from '@/types/company';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const companiesService = {
    async getAll(): Promise<Company[]> {
        const { data } = await api.get<Company[]>('/companies'); // ← change if your endpoint is different
        return data;
    },
};