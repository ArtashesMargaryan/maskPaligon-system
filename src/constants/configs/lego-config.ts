import { onResultStateUpdateCommand } from '../../commands/result/on-result-state-update-command';
import { ResultModelEvent } from '../../events/model';

export const legoLoggerConfig = Object.freeze({});
export const gameCommands = Object.freeze([
    {
        event: ResultModelEvent.stateUpdate,
        command: onResultStateUpdateCommand,
    },
]);
