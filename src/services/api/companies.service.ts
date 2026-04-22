// src/services/api/companies.service.ts
import type { Company, CompanyCreate, CompanyUpdate } from '@/types/company';
import api from "./client";

export const companiesService = {
    async getAll(): Promise<Company[]> {
        const { data } = await api.get<Company[]>('/companies');
        return data;
    },
    async create(payload: CompanyCreate): Promise<Company> {
        const { data } = await api.post<Company>('/companies', payload);
        return data;
    },
    async update(id: string, payload: CompanyUpdate): Promise<void> {
        await api.put(`/companies/${id}`, payload);
    },
    async delete(id: string): Promise<void> {
        await api.delete(`/companies/${id}`);
    },
};