import { lego } from '@armathai/lego';
import { firstGameGuard } from '../../guards/first-game-guard';
import { hintModelGuard } from '../../guards/hint-model-guard';
import { AppState } from '../../models/app/app-model';
import { ResultState } from '../../models/app/result-model';
import { destroyGameModelCommand } from '../game/destroy-game-model-command';
import { initializeGameModelCommand } from '../game/initialize-game-model-command';
import { destroyHintModelCommand } from '../hint/destroy-hint-model-command';
import { initializeHintModelCommand } from '../hint/initialize-hint-model-command';
import { mapGameCommandsCommand } from '../lego/map-game-commands-command';
import { unmapGameCommandsCommand } from '../lego/unmap-game-commands-command';
import { setResultStateCommand } from '../result/set-result-state-command';
import { increaseRetriesCountCommand } from './increase-retries-count-command';
import { setAppStateCommand } from './set-app-state-command';

export const onAppStateUpdateCommand = (state: AppState): void => {
    switch (state) {
        case AppState.game:
            lego.command
                //
                .execute(mapGameCommandsCommand)

                .execute(initializeGameModelCommand)

                .guard(firstGameGuard)
                .execute(initializeHintModelCommand);
            break;

        case AppState.result:
            lego.command
                //
                .guard(hintModelGuard)
                .execute(destroyHintModelCommand);
            break;

        case AppState.retry:
            if (process.env.NODE_ENV === 'production') {
                return;
            }

            lego.command
                //
                .execute(increaseRetriesCountCommand)

                .execute(unmapGameCommandsCommand)

                .execute(destroyGameModelCommand)

                .payload(ResultState.unknown)
                .execute(setResultStateCommand)

                .payload(AppState.game)
                .execute(setAppStateCommand);
            break;
    }
};
