<!-- src/components/AccountEditModal.vue -->
<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Edit Account</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <!-- Company Identifier -->
        <ion-item>
          <ion-label position="stacked">Company Identifier</ion-label>
          <ion-input
              v-model="form.company_identifier"
              placeholder="Enter company's account identifier"
              maxlength="50"
          />
        </ion-item>

        <!-- Size k -->
        <ion-item>
          <ion-label position="stacked">Size (k)</ion-label>
          <ion-input
              v-model="form.size_k"
              type="number"
              placeholder="0"
          />
        </ion-item>

        <!-- Balance -->
        <ion-item>
          <ion-label position="stacked">Balance ($)</ion-label>
          <ion-input
              v-model="form.balance"
              type="number"
              placeholder="0.00"
          />
        </ion-item>

        <!-- Position -->
        <ion-item>
          <ion-label position="stacked">Position</ion-label>
          <ion-input
              v-model="form.position"
              type="number"
              placeholder="0"
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
import type {Account, AccountUpdate} from '@/types/account';
import {accountsService} from "@/services/api/accounts.service";

const props = defineProps<{
  isOpen: boolean;
  account: Account | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:account', updateData: AccountUpdate): void;
}>();

const form = ref<Partial<AccountUpdate>>({});
const saving = ref(false);
const error = ref<string | null>(null);

// Reset form when modal opens with new account
watch(() => props.account, (acc) => {
  if (acc) {
    form.value = {
      company_identifier: acc.company_identifier,
      size_k: acc.size_k,
      balance: acc.balance ?? 0,
      position: acc.position ?? 0
    };
  }
}, { immediate: true });

// Clean and convert data before sending
const getCleanUpdateData = (): AccountUpdate => {
  const data: AccountUpdate = {};

  if (form.value.company_identifier !== undefined) {
    data.company_identifier = form.value.company_identifier;
  }

  // Convert size_k to number
  if (form.value.size_k !== undefined) {
    data.size_k = form.value.size_k ? Number(form.value.size_k) : 0;
  }

  // Convert balance to number (if present)
  if (form.value.balance !== undefined) {
    data.balance = form.value.balance ? Number(form.value.balance) : 0;
  }

  // Convert position to number (if present)
  if (form.value.position !== undefined) {
    data.position = form.value.position ? Number(form.value.position) : 0;
  }

  return data;
};

const save = async () => {
  if (!props.account || !form.value) return;

  const updateData = getCleanUpdateData();

  saving.value = true;
  error.value = null;

  try {
    await accountsService.update(props.account.id, updateData);

    emit('update:account', form.value);
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