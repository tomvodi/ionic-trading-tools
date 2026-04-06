<!-- src/components/AccountItem.vue -->
<template>
  <ion-item>
    <ion-avatar slot="start">
      <ion-icon :icon="personOutline" size="large" />
    </ion-avatar>

    <ion-grid>
      <ion-row class="ion-align-items-center">
        <ion-col size="12">
          <h3>{{ account.company.name + " " + account.company_identifier }}</h3>
        </ion-col>
      </ion-row>
      <ion-row class="ion-align-items-center">
        <ion-col v-if="show_active" size="3">
          <ion-badge :color="getStatusColor(account.active)" class="compact-badge">
            {{ account.active ? "active" : "inactive" }}
          </ion-badge>
        </ion-col>
        <ion-col size="4">
          <p class="compact-row">Size: {{ account.size_k + "k" }}</p>
        </ion-col>
        <ion-col size="5">
          <p  class="compact-row">Balance: {{ account.balance }}$</p>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-buttons slot="end" v-if="show_actions"  >
      <ion-button
          fill="clear"
          color="medium"
          @click.stop="onEditClick"
      >
        <ion-icon :icon="pencilOutline" size="small" />
      </ion-button>

      <ion-button
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
import { IonItem, IonAvatar, IonIcon, IonBadge } from '@ionic/vue';
import { personOutline, pencilOutline, trashBinOutline } from 'ionicons/icons';
import type { Account } from '@/types/account';

defineProps<{
  account: Account,
  show_active: boolean,
  show_actions: boolean,
}>();

const getStatusColor = (status: boolean) => {
  return status ? 'success' :  'danger';
};

</script>

<style scoped>
.compact-row {
  margin-top: 2px;
}

.compact-badge {
  margin-top: 2px;
  margin-bottom: 16px;
}
</style>