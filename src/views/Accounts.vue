<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-text color="secondary">
        <h2>Active Accounts</h2>
      </ion-text>

      <ion-list v-if="!loading && accounts.length">
        <account-item
            v-for="account in accounts"
            :key="account.id"
            :account="account"
            :show_active="true"
            :show_actions="true"
            @toggle="toggleAccountStatus"
            @edit="openEditModal"
        />
      </ion-list>

      <ion-skeleton-text
          v-else-if="loading"
          :animated="true"
          class="ion-padding"
          style="height: 80px; margin: 10px"
          :count="5"
      />

      <div v-else class="ion-text-center ion-padding">
        <p v-if="error" class="ion-text-danger">{{ error }}</p>
        <p v-else>No accounts found</p>
        <ion-button @click="fetchAccounts">Retry</ion-button>
      </div>
    </ion-content>
    <account-edit-modal
        :is-open="showEditModal"
        :account="selectedAccount"
        @close="showEditModal = false"
        @update:account="handleAccountUpdated"
    />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonList,
  IonText,
  IonSkeletonText,
  IonButton,
  IonPage,
  IonContent,
} from '@ionic/vue';
import { storeToRefs } from 'pinia';
import AccountItem from "@/AccountItem.vue";
import {useAccountsStore} from "@/stores/accounts.store";
import {onMounted, ref} from "vue";
import {accountsService} from "@/services/api/accounts.service";
import {Account} from "@/types/account";
import AccountEditModal from "@/components/AccountEditModal.vue";

const store = useAccountsStore();
const { accounts, loading, error } = storeToRefs(store);

const showEditModal = ref(false);
const selectedAccount = ref<Account | null>(null);

const fetchAccounts = () => store.fetchAccounts(false);

onMounted(async () => {
  await fetchAccounts();
})

const openEditModal = (account: Account) => {
  selectedAccount.value = { ...account };   // clone
  showEditModal.value = true;
};

const handleAccountUpdated = (updatedData: Partial<Account>) => {
  if (!selectedAccount.value) return;

  // Update the account in the list
  const index = accounts.value.findIndex(a => a.id === selectedAccount.value!.id);
  if (index !== -1) {
    accounts.value[index] = { ...accounts.value[index], ...updatedData };
  }

  showEditModal.value = false;
};

const toggleAccountStatus = async (accountId: string, newIsActive: boolean) => {
  const account = accounts.value.find(a => a.id === accountId);
  if (!account) return;

  const oldStatus = account.active;

  try {
    // Optimistic update
    account.active = newIsActive;

    await accountsService.toggleStatus(accountId, newIsActive);

  } catch (err: any) {
    // Revert on error
    account.active = oldStatus;
    alert('Failed to update status: ' + (err.message || 'Unknown error'));
  }
};

</script>