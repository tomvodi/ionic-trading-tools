import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '@/types/account';
import { accountsService } from '@/services/api/accounts.service';

export const useAccountsStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([]);
    const activeAccounts = ref<Account[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchAccounts = async (onlyActive:boolean) => {
        loading.value = true;
        error.value = null;
        try {
            if (onlyActive) {
                activeAccounts.value = await accountsService.getActive();
            } else {
                accounts.value = await accountsService.getAll();
            }
        } catch (e: any) {
            error.value = e.message || 'Failed to load accounts';
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    return { accounts, activeAccounts, loading, error, fetchAccounts };
});