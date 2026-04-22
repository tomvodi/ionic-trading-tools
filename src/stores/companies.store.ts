import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Company } from '@/types/company';
import { companiesService } from '@/services/api/companies.service';

export const useCompaniesStore = defineStore('companies', () => {
    const companies = ref<Company[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchCompanies = async () => {
        loading.value = true;
        error.value = null;
        try {
            companies.value = await companiesService.getAll();
        } catch (e: any) {
            error.value = e.message || 'Failed to load companies';
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    return { companies, loading, fetchCompanies };
});