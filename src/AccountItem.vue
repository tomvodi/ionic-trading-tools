<!-- src/components/AccountItem.vue -->
<template>
  <ion-item>
    <ion-avatar slot="start" class="ion-hide-sm-down">
      <ion-icon :icon="personOutline" size="large" />
    </ion-avatar>

    <ion-grid>
      <ion-row class="ion-align-items-center">
        <ion-col size="12" size-sm="10">
          <h3>{{ account.company.name + " " + account.company_identifier }}</h3>
        </ion-col>
        <ion-col size-sm="2" class="ion-hide-sm-down">
          <ion-text color="medium">
            <p class="ion-text-end">Pos: {{account.position}}</p>
          </ion-text>
        </ion-col>
      </ion-row>
      <ion-row class="ion-align-items-center">
        <ion-col v-if="show_active" size="auto">
          <ion-toggle
              :checked="account.active"
              :disabled="isToggling"
              @ionChange="toggleActive"
              class="toggle-status compact-badge"
          />
        </ion-col>
        <ion-col v-if="show_active" size="3">
          <ion-badge :color="getStatusColor(account.active)" class="compact-badge">
            {{ account.active ? "active" : "inactive" }}
          </ion-badge>
        </ion-col>
        <ion-col size="3">
          <p class="compact-row">Size: {{ account.size_k + "k" }}</p>
        </ion-col>
        <ion-col size="3">
          <p  class="compact-row">Balance: {{ account.balance }}$</p>
        </ion-col>
      </ion-row>
      <ion-row v-if="show_actions" class="ion-align-items-left ion-hide-sm-up">
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
      </ion-row>
    </ion-grid>

    <ion-buttons slot="end" v-if="show_actions"  class="ion-hide-sm-down">
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
import { IonItem, IonText, IonButton, IonToggle, IonRow, IonGrid, IonCol, IonButtons, IonAvatar, IonIcon, IonBadge } from '@ionic/vue';
import { personOutline, pencilOutline, trashBinOutline } from 'ionicons/icons';
import type { Account } from '@/types/account';
import {ref} from "vue";

const props = defineProps<{
  account: Account,
  show_active: boolean,
  show_actions: boolean,
}>();

const emit = defineEmits<{
  (e: 'toggle', accountId: string | number, newStatus: boolean): void;
  (e: 'edit', account: Account): void;
  (e: 'delete', account: Account): void;
}>();

const isToggling = ref(false);

const toggleActive = async (ev: CustomEvent) => {
  const newIsActive = ev.detail.checked;
  console.log("set toggle active", newIsActive);
  isToggling.value = true;

  try {
    emit('toggle', props.account.id, newIsActive);
  } catch (err) {
    // Revert toggle on error
    if (ev.target != null) {
      ev.target.checked = !newIsActive;
    }
  } finally {
    isToggling.value = false;
  }
};

const onEditClick = (e: Event) => {
  e.stopPropagation();
  emit('edit', props.account);
};

const onDeleteClick = (e: Event) => {
  e.stopPropagation();
  emit('delete', props.account);
};

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