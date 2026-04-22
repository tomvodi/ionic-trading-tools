<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Add New Company</ion-title>
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
          <ion-input v-model="form.name" placeholder="e.g. Acme Inc." />
        </ion-item>

        <!-- Dashboard URL -->
        <ion-item>
          <ion-label position="stacked">Dashboard URL (Optional)</ion-label>
          <ion-input v-model="form.dashboard_url" placeholder="https://dashboard.example.com" type="url" />
        </ion-item>
      </ion-list>

      <ion-text v-if="error" color="danger" class="ion-padding">{{ error }}</ion-text>

      <div class="ion-padding-top">
        <ion-button expand="block" @click="save" :disabled="saving || !form.name">
          {{ saving ? 'Creating...' : 'Create Company' }}
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonText, IonInput } from '@ionic/vue';
import { ref } from 'vue';
import type { CompanyCreate } from '@/types/company';
import { companiesService } from "@/services/api/companies.service";

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'created'): void }>();

const form = ref<CompanyCreate>({ name: '', dashboard_url: '' });
const saving = ref(false);
const error = ref<string | null>(null);

const save = async () => {
  if (!form.value.name) return;

  saving.value = true;
  error.value = null;

  try {
    await companiesService.create({
      name: form.value.name,
      dashboard_url: form.value.dashboard_url,
    });
    emit('created');
    closeModal();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to create company';
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  form.value = { name: '', dashboard_url: '' };
  error.value = null;
  emit('close');
};
</script>

