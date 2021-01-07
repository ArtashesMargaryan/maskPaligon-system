import { store } from '../../models/store';

export const setAppPausedCommand = (paused: boolean): void => {
    store.app.paused = paused;
};
