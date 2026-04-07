<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-list v-if="!loading && accounts.length">
        <account-item
            v-for="account in accounts"
            :key="account.id"
            :account="account"
            :show_active="true"
            :show_actions="true"
            @toggle="toggleAccountStatus"
            @edit="openEditModal"
            @delete="confirmDelete"
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

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openCreateModal" color="primary">
        <ion-icon :icon="add" size="large"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <account-edit-modal
        :is-open="showEditModal"
        :account="selectedAccount"
        @close="showEditModal = false"
        @update:account="handleAccountUpdated"
    />
    <account-create-modal
        :is-open="showCreateModal"
        @close="showCreateModal = false"
        @created="handleAccountCreated"
    />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonList,
  IonSkeletonText,
  IonButton,
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon, alertController,
} from '@ionic/vue';
import { storeToRefs } from 'pinia';
import AccountItem from "@/AccountItem.vue";
import {useAccountsStore} from "@/stores/accounts.store";
import {onMounted, ref} from "vue";
import {accountsService} from "@/services/api/accounts.service";
import {Account} from "@/types/account";
import AccountEditModal from "@/components/AccountEditModal.vue";
import AccountCreateModal from "@/components/AccountCreateModal.vue";
import {add} from "ionicons/icons";
import {useCompaniesStore} from "@/stores/companies.store";
import {presentToast} from "@/utils/toast";

const store = useAccountsStore();
const { accounts, loading, error } = storeToRefs(store);

const companiesStore = useCompaniesStore();
const showCreateModal = ref(false);

const openCreateModal = async () => {
  await companiesStore.fetchCompanies();
  showCreateModal.value = true;
};

const handleAccountCreated = () => {
  fetchAccounts();
  presentToast('Account created successfully!', 'success');
};

const showEditModal = ref(false);
const selectedAccount = ref<Account | null>(null);

const fetchAccounts = () => store.fetchAccounts(false);

onMounted(async () => {
  await fetchAccounts();
  await companiesStore.fetchCompanies();
})

const openEditModal = (account: Account) => {
  selectedAccount.value = { ...account };   // clone
  showEditModal.value = true;
};

const confirmDelete = async (account: Account) => {
  const alert = await alertController.create({
    header: 'Delete Account',
    message: `Are you sure you want to delete ${account.company?.name + " " + account.company_identifier}?`,
    cssClass: 'custom-alert',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => performDelete(account)
      }
    ]
  });

  await alert.present();
};

const performDelete = async (account: Account) => {
  try {
    await accountsService.delete(account.id);

    // Remove from local list
    accounts.value = accounts.value.filter(a => a.id !== account.id);

    // Show success toast
    await presentToast('Account deleted successfully', 'success');
  } catch (err: any) {
    await presentToast(
        err.response?.data?.message || 'Failed to delete account',
        'danger'
    );
  }
};

const handleAccountUpdated = (updatedData: Partial<Account>) => {
  if (!selectedAccount.value) return;

  // Update the account in the list
  const index = accounts.value.findIndex(a => a.id === selectedAccount.value!.id);
  if (index !== -1) {
    accounts.value[index] = { ...accounts.value[index], ...updatedData };
  }

  showEditModal.value = false;

  presentToast('Account updated successfully', 'success');
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