// Stores the currently connected account

import { writable } from 'svelte/store';

export const connectedAccount = writable(null);