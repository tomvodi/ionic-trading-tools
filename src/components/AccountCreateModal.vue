<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Add New Account</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <!-- Company Dropdown -->
        <ion-item>
          <ion-label position="stacked">Company</ion-label>
          <ion-select
              v-model="selectedCompanyId"
              placeholder="Select a company"
              :compare-with="compareWith"
          >
            <ion-select-option
                v-for="company in companies"
                :key="company.id"
                :value="company.id"
            >
              {{ company.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <!-- Company Identifier -->
        <ion-item>
          <ion-label position="stacked">Account Identifier</ion-label>
          <ion-input v-model="form.company_identifier" placeholder="e.g. ACC-123" />
        </ion-item>

        <!-- Size k -->
        <ion-item>
          <ion-label position="stacked">Size (k)</ion-label>
          <ion-input v-model="form.size_k" type="number" placeholder="0" />
        </ion-item>
      </ion-list>

      <ion-text v-if="error" color="danger" class="ion-padding">{{ error }}</ion-text>

      <div class="ion-padding-top">
        <ion-button expand="block" @click="save" :disabled="saving || !selectedCompanyId">
          {{ saving ? 'Creating...' : 'Create Account' }}
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonInput } from '@ionic/vue';
import { ref, computed } from 'vue';
import { useCompaniesStore } from '@/stores/companies.store';
import type { AccountCreate } from '@/types/account';
import {accountsService} from "@/services/api/accounts.service";

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'created'): void }>();

const companiesStore = useCompaniesStore();
const companies = computed(() => companiesStore.companies);

const selectedCompanyId = ref<string | null>(null);
const form = ref({ company_identifier: '', size_k: 0 });
const saving = ref(false);
const error = ref<string | null>(null);

const save = async () => {
  if (!selectedCompanyId.value) return;

  saving.value = true;
  error.value = null;

  const payload: AccountCreate = {
    company_id: selectedCompanyId.value,
    company_identifier: form.value.company_identifier,
    size_k: Number(form.value.size_k),
  };

  try {
    await accountsService.create(payload);
    emit('created');
    closeModal();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to create account';
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  selectedCompanyId.value = null;
  form.value = { company_identifier: '', size_k: 0 };
  error.value = null;
  emit('close');
};

// Required for object comparison in ion-select
const compareWith = (o1: any, o2: any) => o1 === o2;
</script>