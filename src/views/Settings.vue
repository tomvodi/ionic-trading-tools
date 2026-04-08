<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-list>
        <!-- Theme -->
        <ion-item>
          <ion-select
              label="Theme"
              v-model="settings.theme"
              interface="action-sheet"
          >
            <ion-select-option value="system">System Default</ion-select-option>
            <ion-select-option value="light">Light</ion-select-option>
            <ion-select-option value="dark">Dark</ion-select-option>
          </ion-select>
        </ion-item>

        <!-- Default Currency -->
        <ion-item>
          <ion-select
              label="Default Currency"
              v-model="settings.defaultCurrency"
          >
            <ion-select-option value="USD">USD ($)</ion-select-option>
            <ion-select-option value="EUR">EUR (€)</ion-select-option>
            <ion-select-option value="CHF">CHF (Fr.)</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">API Key</ion-label>
          <ion-input
              v-model="apiKeyInput"
              type="password"
              placeholder="Enter your API key"
              clear-input
          />
        </ion-item>

        <ion-button expand="block" @click="saveKey">
          Save API Key
        </ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">

import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/vue';
import { useSettingsStore } from '@/stores/settings.store';
import {onMounted, ref} from 'vue';
import {presentToast} from "@/utils/toast";

const settings = useSettingsStore();

const apiKeyInput = ref('');

onMounted(async () => {
  await settings.loadSettings();
  apiKeyInput.value = settings.apiKey;
});

const saveKey = async () => {
  if (!apiKeyInput.value) return

  await settings.saveApiKey(apiKeyInput.value);
  await presentToast('API Key saved successfully', 'success');
};

</script>
<style scoped>

</style>