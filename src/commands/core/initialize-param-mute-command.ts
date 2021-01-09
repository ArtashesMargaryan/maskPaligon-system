import { lego } from '@armathai/lego';
import { Switch } from '../../constants/constants';
import { setSuperAppMutedCommand } from '../superapp/set-super-app-muted-command';

export const initializeParamMuteCommand = (mute: string): void => {
    switch (mute) {
        case Switch.on:
            lego.command
                //
                .payload(true)
                .execute(setSuperAppMutedCommand);
            break;
        case Switch.off:
            lego.command
                //
                .payload(false)
                .execute(setSuperAppMutedCommand);
            break;
    }
};
