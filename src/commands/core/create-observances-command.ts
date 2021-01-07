import { lego } from '@armathai/lego';
import { soundGuard } from '../../guards/sound-guard';
import { NativeInterfaceObservant } from '../../observances/native-interface-observant';
import { WindowObservant } from '../../observances/window-observant';
import { createAuxiliaryObservancesCommand } from './create-auxiliary-observances-command';
import { createSoundObservantCommand } from './create-sound-observant-command';

export const createObservancesCommand = (): void => {
    new NativeInterfaceObservant();
    new WindowObservant();

    lego.command
        //
        .guard(soundGuard)
        .execute(createSoundObservantCommand)

        .execute(createAuxiliaryObservancesCommand);
};
