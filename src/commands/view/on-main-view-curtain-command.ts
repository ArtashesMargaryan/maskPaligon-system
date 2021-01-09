import { lego } from '@armathai/lego';
import { AppState } from '../../models/app/app-model';
import { setAppStateCommand } from '../app/set-app-state-command';

export const onMainViewCurtainCommand = (): void => {
    lego.command
        //
        .payload(AppState.retry)
        .execute(setAppStateCommand);
};
