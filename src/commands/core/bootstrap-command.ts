import { lego } from '@armathai/lego';
import { AppEvent } from '../../events/app';
import { assignParamsCommand } from './assign-params-command';
import { onAppInitCommand } from './on-app-init-command';

export const bootstrapCommand = (): void => {
    lego.command
        //
        .execute(assignParamsCommand)
        .once(AppEvent.init, onAppInitCommand);
};
