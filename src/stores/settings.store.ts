import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';

export const useSettingsStore = defineStore('settings', () => {
    const theme = ref<'light' | 'dark' | 'system'>('system');
    const defaultCurrency = ref('USD');
    const apiKey = ref<string>('');
    const positionSizeSecurityFactor = ref<number>(0.7);

    // Load settings from storage on init
    const loadSettings = async () => {
        const { value: savedTheme } = await Preferences.get({ key: 'theme' });
        const { value: savedCurrency } = await Preferences.get({ key: 'defaultCurrency' });
        const { value: savedApiKey } = await Preferences.get({ key: 'apiKey' });
        const { value: savedSecurityFactor } = await Preferences.get({ key: 'positionSizeSecurityFactor' });


        if (savedTheme) theme.value = savedTheme as any;
        if (savedCurrency) defaultCurrency.value = savedCurrency;
        if (savedApiKey) apiKey.value = savedApiKey;
        if (savedSecurityFactor) positionSizeSecurityFactor.value = parseFloat(savedSecurityFactor);
    };

    // Save to storage whenever a value changes
    watch([theme, defaultCurrency, apiKey, positionSizeSecurityFactor], async () => {
        await Preferences.set({ key: 'theme', value: theme.value });
        await Preferences.set({ key: 'defaultCurrency', value: defaultCurrency.value });
        await Preferences.set({ key: 'apiKey', value: apiKey.value });
        await Preferences.set({ key: 'positionSizeSecurityFactor', value: positionSizeSecurityFactor.value.toString() });
    });

    const saveApiKey = async (newKey: string) => {
        apiKey.value = newKey.trim();
        await Preferences.set({ key: 'apiKey', value: apiKey.value });
    };

    const clearApiKey = async () => {
        apiKey.value = '';
        await Preferences.remove({ key: 'apiKey' });
    };

    const getSecurityFactor = async () => {
        const { value } = await Preferences.get({
            key: 'positionSizeSecurityFactor'
        });

        return value ? parseFloat(value) : 0.7;
    }

    return {
        theme,
        defaultCurrency,
        apiKey,
        positionSizeSecurityFactor,
        getSecurityFactor,
        loadSettings,
        saveApiKey,
        clearApiKey,
    };
});