import { store } from '../models/store';

export function superPausedGuard(): boolean {
    return store.superApp.paused;
}
