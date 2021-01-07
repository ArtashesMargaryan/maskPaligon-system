import { lego } from '@armathai/lego';
import { setSuperAppPausedCommand } from './set-super-app-paused-command';

export const onSuperAppResumeCommand = (): void => {
    lego.command
        //
        .payload(false)
        .execute(setSuperAppPausedCommand);
};
