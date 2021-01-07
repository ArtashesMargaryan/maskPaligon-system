import { lego } from '@armathai/lego';
import { manageTweensCommand } from '../core/manage-tweens-command';

export const onAppResizeCommand = (): void => {
    lego.command.execute(manageTweensCommand);
};
