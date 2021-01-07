import { store } from '../../models/store';

export const startCompletionTimerCommand = (delay: number): void => {
    store.app.startCompletionTimer(delay);
};
