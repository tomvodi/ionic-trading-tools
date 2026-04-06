<template>
  <ion-text color="secondary">
    <h2>Active Accounts</h2>
  </ion-text>

  <ion-list v-if="!loading && accounts.length">
    <account-item
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        :show_active="false"
        :show_actions="false"
        @click="openAccountDetail"
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
</template>

<script setup lang="ts">
import {
  IonList,
  IonText,
  IonSkeletonText,
  IonButton,
} from '@ionic/vue';
import { onIonViewDidEnter } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import AccountItem from "@/AccountItem.vue";
import {useAccountsStore} from "@/stores/accounts.store";

const store = useAccountsStore();
const { accounts, loading, error } = storeToRefs(store);

const fetchAccounts = () => store.fetchAccounts();

const openAccountDetail = (account: any) => {
  // navigate to detail page, open modal, etc.
  console.log('Selected account:', account);
  // router.push(`/accounts/${account.id}`);
};

onIonViewDidEnter(() => {
  if (accounts.value.length === 0) {
    fetchAccounts();
  }
});
</script>