// src/services/api/companies.service.ts
import type { Company } from '@/types/company';
import api from "./client";

export const companiesService = {
    async getAll(): Promise<Company[]> {
        const { data } = await api.get<Company[]>('/companies');
        return data;
    },
};