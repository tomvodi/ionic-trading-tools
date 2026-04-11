# AGENTS.md

## Architecture Overview

This is an Ionic Vue mobile/web app for trading tools, built with Capacitor for cross-platform deployment. The app manages trading accounts and companies via a REST API.

### Core Structure
- **Framework**: Ionic Vue with TypeScript
- **State Management**: Pinia stores (`src/stores/`)
- **Routing**: Vue Router with lazy-loaded views (`src/views/`)
- **API**: Axios client with automatic API key injection (`src/services/api/`)
- **Persistence**: Capacitor Preferences for settings
- **Build**: Vite with legacy browser support

### Key Directories
- `src/views/`: Page components (HomePage, Accounts, Companies, Settings)
- `src/components/`: Reusable components (AccountItem, modals)
- `src/stores/`: Pinia stores for state management
- `src/services/api/`: API services (accounts, companies, client)
- `src/types/`: TypeScript interfaces (Account, Company)
- `src/utils/`: Utilities (toast notifications)
- `android/`: Capacitor Android project

## Data Flow

1. **Views** import and use Pinia stores via `storeToRefs`
2. **Stores** call API services and manage loading/error states
3. **API Client** (`src/services/api/client.ts`) adds X-API-Key header from settings store
4. **Settings Store** persists to Capacitor Preferences with watchers

## API Integration

- Base URL from `VITE_API_BASE_URL` env var
- API key stored in settings, auto-injected via interceptor
- Services return typed data matching `src/types/`

Example service pattern:
```typescript
// src/services/api/accounts.service.ts
export const accountsService = {
  async getAll(): Promise<Account[]> {
    const { data } = await api.get<Account[]>('/accounts');
    return data;
  }
}
```

## State Management Patterns

- Stores use Composition API with `ref()` for reactivity
- Loading/error states on all async operations
- Settings store auto-persists changes via watchers
- Optimistic updates in views (e.g., account status toggle)

Example store:
```typescript
// src/stores/accounts.store.ts
export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  const loading = ref(false);
  
  const fetchAccounts = async () => {
    loading.value = true;
    try {
      accounts.value = await accountsService.getAll();
    } finally {
      loading.value = false;
    }
  };
  
  return { accounts, loading, fetchAccounts };
});
```

## Component Communication

- Views use stores directly
- Components emit events for user actions
- Modals managed with `ref<boolean>` in parent views
- Toast notifications via `src/utils/toast.ts`

## Build & Deploy

### Development
```bash
npm run dev  # Vite dev server
```

### Testing
```bash
npm run test:unit  # Vitest
npm run test:e2e   # Cypress (requires dev server running)
```

### Mobile Build
```bash
npm run android       # Build Ionic + sync to Capacitor Android
npm run android-run   # Build + run on device/emulator
```

### Web Build
```bash
npm run build  # Vue-tsc + Vite build
```

## Key Conventions

- **Imports**: Use `@/` alias for `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- **Types**: Define interfaces in `src/types/`, import with relative paths
- **API Responses**: Always typed with generics: `api.get<Account[]>('/accounts')`
- **Error Handling**: Try/catch with loading states, toast on failure
- **Navigation**: Router links in `App.vue` menu, lazy-loaded routes
- **Styling**: Ionic components with custom CSS classes for layout
- **Icons**: Registered globally in `main.ts`, used via `ion-icon`

## Environment Variables

- `VITE_API_BASE_URL`: API endpoint (required for API calls)

## Capacitor Plugins

- `@capacitor/preferences`: Settings persistence
- Standard Ionic plugins (app, haptics, keyboard, status-bar)

## Testing Setup

- **Unit**: Vitest with jsdom environment
- **E2E**: Cypress with baseUrl `http://localhost:5173`
- Run dev server before e2e tests

## Common Patterns

- **Loading States**: Skeleton text while loading, error messages with retry buttons
- **CRUD Operations**: Create/edit modals, optimistic updates, confirmation dialogs
- **Data Display**: Ion-grid for responsive layouts in list items
- **User Feedback**: Toast notifications for success/error states</content>
<parameter name="filePath">/home/thomas/projekte/ionic-trading-tools/AGENTS.md
