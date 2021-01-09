import { lego } from '@armathai/lego';
import { AppState } from '../../models/app/app-model';
import { params } from '../../params';
import { initializeParamAutoStartCommand } from '../core/initialize-param-autoStart-command';
import { initializeParamMuteCommand } from '../core/initialize-param-mute-command';
import { setAppStateCommand } from './set-app-state-command';

export const onAppReadyCommand = (): void => {
    lego.command
        //
        .payload(AppState.game)
        .execute(setAppStateCommand)

        .payload(params.mute.value)
        .execute(initializeParamMuteCommand)

        .payload(params.autoStart.value)
        .execute(initializeParamAutoStartCommand);
};
