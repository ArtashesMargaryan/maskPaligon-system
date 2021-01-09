import { lego } from '@armathai/lego';
import { Switch } from '../../constants/constants';
import { setSuperAppPausedCommand } from '../superapp/set-super-app-paused-command';

export const initializeParamAutoStartCommand = (autostart: string): void => {
    switch (autostart) {
        case Switch.off:
            lego.command
                //
                .payload(true)
                .execute(setSuperAppPausedCommand);

            break;
        case Switch.on:
            lego.command
                //
                .payload(false)
                .execute(setSuperAppPausedCommand);
            break;
    }
};
