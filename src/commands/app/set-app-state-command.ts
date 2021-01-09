import { AppState } from '../../models/app/app-model';
import { store } from '../../models/store';

export const setAppStateCommand = (state: AppState): void => {
    store.app.state = state;
};
