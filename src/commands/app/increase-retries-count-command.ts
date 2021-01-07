import { store } from '../../models/store';

export const increaseRetriesCountCommand = (): void => {
    store.app.retries += 1;
};
