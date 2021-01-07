import { lego } from '@armathai/lego';
import { setSuperAppMutedCommand } from './set-super-app-muted-command';

export const onSuperAppMuteCommand = (): void => {
    lego.command
        //
        .payload(true)
        .execute(setSuperAppMutedCommand);
};
