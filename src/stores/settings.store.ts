import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';

export const useSettingsStore = defineStore('settings', () => {
    const theme = ref<'light' | 'dark' | 'system'>('system');
    const defaultCurrency = ref('USD');
    const apiKey = ref<string>('');

    // Load settings from storage on init
    const loadSettings = async () => {
        const { value: savedTheme } = await Preferences.get({ key: 'theme' });
        const { value: savedCurrency } = await Preferences.get({ key: 'defaultCurrency' });
        const { value: savedApiKey } = await Preferences.get({ key: 'apiKey' });


        if (savedTheme) theme.value = savedTheme as any;
        if (savedCurrency) defaultCurrency.value = savedCurrency;
        if (savedApiKey) apiKey.value = savedApiKey;
    };

    // Save to storage whenever a value changes
    watch([theme, defaultCurrency, apiKey], async () => {
        await Preferences.set({ key: 'theme', value: theme.value });
        await Preferences.set({ key: 'defaultCurrency', value: defaultCurrency.value });
        await Preferences.set({ key: 'apiKey', value: apiKey.value });
    });

    const saveApiKey = async (newKey: string) => {
        apiKey.value = newKey.trim();
        await Preferences.set({ key: 'apiKey', value: apiKey.value });
    };

    const clearApiKey = async () => {
        apiKey.value = '';
        await Preferences.remove({ key: 'apiKey' });
    };

    return {
        theme,
        defaultCurrency,
        apiKey,
        loadSettings,
        saveApiKey,
        clearApiKey,
    };
});