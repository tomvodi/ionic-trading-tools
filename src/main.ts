import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import { addIcons } from 'ionicons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import {
  homeOutline,
  informationCircleOutline,
  settingsOutline,
  searchOutline, pencilOutline, trashOutline, storefrontOutline, personOutline
} from 'ionicons/icons';

// Register the icons you want to use
addIcons({
  'home-outline': homeOutline,
  'information-circle-outline': informationCircleOutline,
  'settings-outline': settingsOutline,
  'search-outline': searchOutline,
  'pencil-outline': pencilOutline,
  'trash-outline': trashOutline,
  'storefront-outline': storefrontOutline,
  'person-outline': personOutline,
});
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
import '@ionic/vue/css/palettes/dark.class.css';
/* import '@ionic/vue/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';
import {createPinia} from "pinia";
import {useSettingsStore} from "@/stores/settings.store";

const pinia = createPinia();

const app = createApp(App)
  .use(IonicVue)
  .use(router)
    .use(pinia);

// Load settings as early as possible
const settings = useSettingsStore();
settings.loadSettings();   // fire and forget is okay here

router.isReady().then(() => {
  app.mount('#app');
});
