<!-- src/components/CompanyEditModal.vue -->
<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Edit Company</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <!-- Company Name -->
        <ion-item>
          <ion-label position="stacked">Company Name</ion-label>
          <ion-input
              v-model="form.name"
              placeholder="Enter company name"
              :maxlength="100"
          />
        </ion-item>

        <!-- Dashboard URL -->
        <ion-item>
          <ion-label position="stacked">Dashboard URL (Optional)</ion-label>
          <ion-input
              v-model="form.dashboard_url"
              placeholder="https://dashboard.example.com"
              type="url"
          />
        </ion-item>
      </ion-list>

      <!-- Error Message -->
      <ion-text v-if="error" color="danger" class="ion-padding">
        {{ error }}
      </ion-text>

      <div class="ion-padding-top">
        <ion-button expand="block" @click="save" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText
} from '@ionic/vue';
import { ref, watch } from 'vue';
import type { Company, CompanyUpdate } from '@/types/company';
import { companiesService } from "@/services/api/companies.service";

const props = defineProps<{
  isOpen: boolean;
  company: Company | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:company', updateData: CompanyUpdate): void;
}>();

const form = ref<Partial<CompanyUpdate>>({});
const saving = ref(false);
const error = ref<string | null>(null);

// Reset form when modal opens with new company
watch(() => props.company, (comp) => {
  if (comp) {
    form.value = {
      name: comp.name,
      dashboard_url: comp.dashboard_url || ''
    };
  }
}, { immediate: true });

// Clean and prepare data before sending
const getCleanUpdateData = (): CompanyUpdate => {
  const data: CompanyUpdate = {};

  if (form.value.name !== undefined) {
    data.name = form.value.name;
  }

  if (form.value.dashboard_url !== undefined) {
    data.dashboard_url = form.value.dashboard_url?.trim() || undefined;
  }

  return data;
};

const save = async () => {
  if (!props.company || !form.value) return;

  const updateData = getCleanUpdateData();

  saving.value = true;
  error.value = null;

  try {
    await companiesService.update(props.company.id, updateData);

    emit('update:company', form.value);
    closeModal();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save changes';
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  error.value = null;
  emit('close');
};
</script>
