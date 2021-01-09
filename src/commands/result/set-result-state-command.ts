import { ResultState } from '../../models/app/result-model';
import { store } from '../../models/store';

export const setResultStateCommand = (state: ResultState): void => {
    store.app.result.state = state;
};
