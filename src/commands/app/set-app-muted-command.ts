import { store } from '../../models/store';

export const setAppMutedCommand = (muted: boolean): void => {
    store.app.muted = muted;
};
