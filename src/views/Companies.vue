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

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openCreateModal" color="primary">
        <ion-icon :icon="add" size="large"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <company-create-modal
        :is-open="showCreateModal"
        @close="showCreateModal = false"
        @created="handleCompanyCreated"
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
  IonIcon,
} from '@ionic/vue';
import { storeToRefs } from 'pinia';
import CompanyItem from "@/components/CompanyItem.vue";
import CompanyCreateModal from "@/components/CompanyCreateModal.vue";
import { useCompaniesStore } from "@/stores/companies.store";
import { onMounted, ref } from "vue";
import { add } from "ionicons/icons";
import type { Company } from "@/types/company";
import { presentToast } from "@/utils/toast";

const store = useCompaniesStore();
const { companies, loading } = storeToRefs(store);
const error = ref(false);
const showCreateModal = ref(false);

const fetchCompanies = () => store.fetchCompanies();

const openCreateModal = () => {
  showCreateModal.value = true;
};

const handleCompanyCreated = () => {
  fetchCompanies();
  presentToast('Company created successfully!', 'success');
};

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