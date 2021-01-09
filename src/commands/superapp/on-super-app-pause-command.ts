import { lego } from '@armathai/lego';
import { setSuperAppPausedCommand } from './set-super-app-paused-command';

export const onSuperAppPauseCommand = (): void => {
    lego.command
        //
        .payload(true)
        .execute(setSuperAppPausedCommand);
};
