import { store } from '../../models/store';

export const destroyGameModelCommand = (): void => {
    store.destroyGameModel();
};
