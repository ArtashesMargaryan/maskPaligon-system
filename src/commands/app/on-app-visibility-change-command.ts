import { lego } from '@armathai/lego';
import { superPausedGuard } from '../../guards/super-paused-guard';
import { setAppPausedCommand } from './set-app-paused-command';

export const onAppVisibilityChangeCommand = (visible: boolean): void => {
    lego.command
        //
        .guard(lego.not(superPausedGuard))
        .payload(!visible)
        .execute(setAppPausedCommand);
};
