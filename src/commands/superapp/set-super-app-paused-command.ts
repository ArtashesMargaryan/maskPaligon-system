import { store } from '../../models/store';

export const setSuperAppPausedCommand = (paused: boolean): void => {
    store.superApp.paused = paused;
};
