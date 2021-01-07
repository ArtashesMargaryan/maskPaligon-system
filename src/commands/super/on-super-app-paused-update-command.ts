import { lego } from '@armathai/lego';
import { setAppPausedCommand } from '../app/set-app-paused-command';

export const onSuperAppPausedUpdateCommand = (superPaused: boolean): void => {
    lego.command
        //
        .payload(superPaused)
        .execute(setAppPausedCommand);
};
