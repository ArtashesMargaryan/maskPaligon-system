import { store } from '../models/store';

export function firstGameGuard(): boolean {
    return store.app.retries === 0;
}
