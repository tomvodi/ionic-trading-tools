<!-- src/components/CompanyItem.vue -->
<template>
  <ion-item>
    <ion-avatar slot="start" class="ion-hide-sm-down">
      <ion-icon :icon="businessOutline" size="large" />
    </ion-avatar>

    <ion-grid>
      <ion-row class="ion-align-items-center">
        <ion-col size="12" size-sm="10">
          <h3>{{ company.name }}</h3>
        </ion-col>
      </ion-row>
      <ion-row v-if="company.dashboard_url" class="ion-align-items-center">
        <ion-col size="12">
          <ion-text color="medium">
            <p class="compact-row">{{ company.dashboard_url }}</p>
          </ion-text>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-buttons slot="end"  class="ion-hide-sm-down">
      <ion-button
          v-if="show_actions && company.dashboard_url && company.dashboard_url.trim()"
          fill="clear"
          color="primary"
          @click.stop="onOpenClick"
      >
        <ion-icon :icon="openOutline" size="small" />
      </ion-button>

      <ion-button
          v-if="show_actions"
          fill="clear"
          color="medium"
          @click.stop="onEditClick"
      >
        <ion-icon :icon="pencilOutline" size="small" />
      </ion-button>

      <ion-button
          v-if="show_actions"
          fill="clear"
          color="danger"
          @click.stop="onDeleteClick"
      >
        <ion-icon :icon="trashBinOutline" size="small" />
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonText, IonButton, IonRow, IonGrid, IonCol, IonButtons, IonAvatar, IonIcon } from '@ionic/vue';
import { businessOutline, openOutline, trashBinOutline, pencilOutline } from 'ionicons/icons';
import type { Company } from '@/types/company';

const props = defineProps<{
  company: Company,
  show_actions?: boolean,
}>();

const emit = defineEmits<{
  (e: 'open', company: Company): void;
  (e: 'edit', company: Company): void;
  (e: 'delete', company: Company): void;
}>();

const onEditClick = (e: Event) => {
  e.stopPropagation();
  emit('edit', props.company);
};

const onDeleteClick = (e: Event) => {
  e.stopPropagation();
  emit('delete', props.company);
};

const onOpenClick = (e: Event) => {
  e.stopPropagation();
  emit('open', props.company);
};
</script>

<style scoped>
.compact-row {
  margin-top: 2px;
}
</style>
