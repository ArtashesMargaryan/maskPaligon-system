import { AppState } from '../../models/app-model';
import { store } from '../../models/store';

export const setAppStateCommand = (state: AppState): void => {
    store.app.state = state;
};
