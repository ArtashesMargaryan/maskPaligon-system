import { store } from '../../models/store';

export const setResultDelayCommand = (delay: number): void => {
    store.app.result.delay = delay;
};
