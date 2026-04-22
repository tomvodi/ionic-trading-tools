<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-list v-if="!loading && companies.length">
        <company-item
            v-for="company in companies"
            :key="company.id"
            :company="company"
            :show_actions="true"
            @open="openDashboard"
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
        <p v-else>No companies found</p>
        <ion-button @click="fetchCompanies">Retry</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonList,
  IonSkeletonText,
  IonButton,
  IonPage,
  IonContent,
} from '@ionic/vue';
import { storeToRefs } from 'pinia';
import CompanyItem from "@/components/CompanyItem.vue";
import { useCompaniesStore } from "@/stores/companies.store";
import { onMounted, ref } from "vue";
import type { Company } from "@/types/company";

const store = useCompaniesStore();
const { companies, loading } = storeToRefs(store);
const error = ref(false);

const fetchCompanies = () => store.fetchCompanies();

onMounted(async () => {
  await fetchCompanies();
});

const openDashboard = (company: Company) => {
  if (company.dashboard_url) {
    window.open(company.dashboard_url, '_blank');
  }
};
</script>

<style scoped>

</style>