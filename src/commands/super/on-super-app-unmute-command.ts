import { lego } from '@armathai/lego';
import { setSuperAppMutedCommand } from './set-super-app-muted-command';

export const onSuperAppUnmuteCommand = (): void => {
    lego.command
        //
        .payload(false)
        .execute(setSuperAppMutedCommand);
};
