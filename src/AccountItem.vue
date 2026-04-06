<!-- src/components/AccountItem.vue -->
<template>
  <ion-item button @click="onClick" detail>
    <ion-avatar slot="start">
      <!-- optional icon / avatar -->
      <ion-icon :icon="personOutline" size="large" />
    </ion-avatar>

    <ion-label>
      <h2>{{ account.company.name + " " + account.company_identifier }}</h2>
      <ion-badge :color="getStatusColor(account.active)">
        {{ account.active }}
      </ion-badge>
    </ion-label>

    <div slot="end" class="ion-text-end">
      <h3 v-if="account.balance">
        {{ account.balance.toLocaleString() }}
      </h3>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonAvatar, IonIcon, IonBadge } from '@ionic/vue';
import { personOutline } from 'ionicons/icons';
import type { Account } from '@/types/account';

const props = defineProps<{ account: Account }>();
const emit = defineEmits<{ (e: 'click', account: Account): void }>();

const getStatusColor = (status: boolean) => {
  return status ? 'success' :  'warning';
};

const onClick = () => emit('click', props.account);
</script>

<style scoped>

</style>