<template>
  <ion-app>

    <ion-split-pane content-id="main-content" when="lg">
      <ion-menu side="start" menu-id="main-menu" content-id="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Menu</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            <ion-item router-link="/home" router-direction="root" detail>
              <ion-icon name="home-outline" slot="start"></ion-icon>
              <ion-label>Home</ion-label>
            </ion-item>

            <ion-item router-link="/accounts" router-direction="root" detail>
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-label>Accounts</ion-label>
            </ion-item>

            <ion-item router-link="/companies" router-direction="root" detail>
              <ion-icon name="storefront-outline" slot="start"></ion-icon>
              <ion-label>Companies</ion-label>
            </ion-item>

            <ion-item router-link="/settings" router-direction="root" detail>
              <ion-icon name="settings-outline" slot="start"></ion-icon>
              <ion-label>Settings</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-page id="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>

            <ion-title>{{ pageTitle }}</ion-title>

            <ion-buttons slot="end">
              <ion-button>
                <ion-icon name="search-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-router-outlet id="main-content" />
        </ion-content>
      </ion-page>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet
} from '@ionic/vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pageTitle = ref('Trading Tools');

watch(route, (newRoute) => {
  const titles: Record<string, string> = {
    '/home': 'Home',
    '/accounts': 'Accounts',
    '/companies': 'Companies',
    '/settings': 'Settings',
  };
  pageTitle.value = titles[newRoute.path] || 'Trading Tools';
}, { immediate: true });
</script>