import { lego } from '@armathai/lego';
import { ResultState } from '../../models/app/result-model';
import { startCompletionTimerCommand } from '../app/start-completion-timer-command';
import { unmapGameCommandsCommand } from '../lego/unmap-game-commands-command';

export const onResultStateUpdateCommand = (state: ResultState): void => {
    switch (state) {
        case ResultState.success:
        case ResultState.fail:
            lego.command
                //
                .execute(unmapGameCommandsCommand)

                .payload(0)
                .execute(startCompletionTimerCommand);
            break;
    }
};
