// src/services/api/client.ts
import axios from 'axios';
import { useSettingsStore } from '@/stores/settings.store';

const settingsStore = useSettingsStore();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
});

// Add API Key automatically to every request
api.interceptors.request.use(async (config) => {
    // Wait until settings are loaded (important on first requests)
    if (!settingsStore.apiKey) {
        await settingsStore.loadSettings();
    }

    if (settingsStore.apiKey) {
        // config.headers.Authorization = `Bearer ${settingsStore.apiKey}`;
        config.headers['X-API-Key'] = settingsStore.apiKey;
    }

    return config;
});

export default api;