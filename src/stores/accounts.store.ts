import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '@/types/account';
import { accountsService } from '@/services/api/accounts.service';

export const useAccountsStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchAccounts = async () => {
        loading.value = true;
        error.value = null;
        try {
            accounts.value = await accountsService.getActive();
        } catch (e: any) {
            error.value = e.message || 'Failed to load accounts';
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    return { accounts, loading, error, fetchAccounts };
});