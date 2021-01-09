import { store } from '../../models/store';

export const setSuperAppMutedCommand = (muted: boolean): void => {
    store.superApp.muted = muted;
};
