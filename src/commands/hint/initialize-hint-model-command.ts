import { lego } from '@armathai/lego';
import { store } from '../../models/store';
import { setHintVisibleCommand } from './set-hint-visible-command';

export const initializeHintModelCommand = (): void => {
    store.game.initializeHintModel();

    lego.command
        //
        .payload(true)
        .execute(setHintVisibleCommand);
};
