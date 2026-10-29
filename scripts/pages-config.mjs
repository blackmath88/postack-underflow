// Shared by the validator and the local Pages server. Keep in sync with
// vite.config.ts (BASE) and src/routes/.
export const BASE = '/postack-underflow/'
export const OUT_DIR = new URL('../dist/client/', import.meta.url)
export const ROUTES = ['', 'indexing/', 'community/', 'convergence/', 'afterword/', 'notes/', 'about/', 'archive/', 'archive/four-words/', 'archive/community/', 'archive/history/', 'lab/']
