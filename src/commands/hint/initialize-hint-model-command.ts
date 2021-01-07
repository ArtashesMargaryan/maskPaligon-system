import { store } from '../../models/store';

export const initializeHintModelCommand = (): void => {
    store.game.initializeHintModel();
};
