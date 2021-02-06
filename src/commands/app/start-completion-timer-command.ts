import { store } from '../../models/store';

export const startCompletionTimerCommand = (): void => {
    store.app.startCompletionTimer();
};
