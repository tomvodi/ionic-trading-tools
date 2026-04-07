import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Company } from '@/types/company';
import { companiesService } from '@/services/api/companies.service';

export const useCompaniesStore = defineStore('companies', () => {
    const companies = ref<Company[]>([]);
    const loading = ref(false);

    const fetchCompanies = async () => {
        if (companies.value.length > 0) return; // already loaded
        loading.value = true;
        try {
            companies.value = await companiesService.getAll();
        } catch (e) {
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    return { companies, loading, fetchCompanies };
});