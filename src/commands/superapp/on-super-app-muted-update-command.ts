import { lego } from '@armathai/lego';
import { setAppMutedCommand } from '../app/set-app-muted-command';

export const onSuperAppMutedUpdateCommand = (superMuted: boolean): void => {
    lego.command
        //
        .payload(superMuted)
        .execute(setAppMutedCommand);
};
