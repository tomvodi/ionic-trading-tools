<template>
  <ion-page>
    <ion-content class="ion-padding">

      <ion-card>
        <ion-card-header>
          <ion-card-title>My Crypto Funding → TradesViz</ion-card-title>
        </ion-card-header>
        <ion-card-content>

          <div class="drop-zone" :class="{ 'drag-over': isDragging }"
               @dragover.prevent="isDragging = true"
               @dragleave.prevent="isDragging = false"
               @drop.prevent="onDrop"
               @click="fileInput?.click()">
            <ion-icon name="cloud-upload-outline" class="upload-icon"></ion-icon>
            <p v-if="!selectedFile">Drop CSV file here or click to browse</p>
            <p v-else class="file-name">{{ selectedFile.name }}</p>
          </div>

          <input ref="fileInput" type="file" accept=".csv" style="display: none" @change="onFileChange" />

          <ion-button expand="block" class="ion-margin-top"
                      :disabled="!selectedFile || loading"
                      @click="convert">
            <ion-spinner v-if="loading" name="crescent" slot="start"></ion-spinner>
            {{ loading ? 'Converting…' : 'Convert' }}
          </ion-button>

          <ion-text v-if="errorMessage" color="danger">
            <p>{{ errorMessage }}</p>
          </ion-text>

        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonText, IonSpinner,
} from '@ionic/vue';
import { converterService } from '@/services/api/converter.service';

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);
const loading = ref(false);
const errorMessage = ref('');

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    selectedFile.value = input.files[0];
    errorMessage.value = '';
  }
}

function onDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    selectedFile.value = file;
    errorMessage.value = '';
  }
}

async function convert() {
  if (!selectedFile.value) return;
  loading.value = true;
  errorMessage.value = '';

  try {
    const blob = await converterService.convert(selectedFile.value);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.csv';
    a.click();
    URL.revokeObjectURL(url);
  } catch (e: any) {
    errorMessage.value = e?.response?.data?.message ?? e?.message ?? 'Conversion failed.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed var(--ion-color-medium);
  border-radius: 8px;
  padding: 40px 16px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.drop-zone.drag-over {
  border-color: var(--ion-color-primary);
  background-color: var(--ion-color-primary-tint);
}

.upload-icon {
  font-size: 48px;
  color: var(--ion-color-medium);
  display: block;
  margin: 0 auto 8px;
}

.file-name {
  font-weight: 600;
  color: var(--ion-color-primary);
}
</style>
