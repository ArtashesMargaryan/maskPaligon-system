import { store } from '../../models/store';

export const setHintVisibleCommand = (value: boolean): void => {
    store.game.hint.visible = value;
};
