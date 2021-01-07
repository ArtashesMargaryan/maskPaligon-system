import { lego } from '@armathai/lego';
import { AppEvent } from '../../events/app';
import { AppModelEvent, SuperAppModelEvent } from '../../events/model';
import { SuperAppEvent } from '../../events/super-app';
import { MainViewEvent } from '../../events/view';
import { WindowEvent } from '../../events/window';
import { initializeAppModelCommand } from '../app/initialize-app-model-command';
import { onAppReadyCommand } from '../app/on-app-ready-command';
import { onAppResizeCommand } from '../app/on-app-resize-command';
import { onAppStateUpdateCommand } from '../app/on-app-state-update-command';
import { onAppVisibilityChangeCommand } from '../app/on-app-visibility-change-command';
import { initializeSuperAppModelCommand } from '../super/initialize-super-app-model-command';
import { onSuperAppMuteCommand } from '../super/on-super-app-mute-command';
import { onSuperAppMutedUpdateCommand } from '../super/on-super-app-muted-update-command';
import { onSuperAppPauseCommand } from '../super/on-super-app-pause-command';
import { onSuperAppPausedUpdateCommand } from '../super/on-super-app-paused-update-command';
import { onSuperAppResumeCommand } from '../super/on-super-app-resume-command';
import { onSuperAppUnmuteCommand } from '../super/on-super-app-unmute-command';
import { onMainViewCurtainCommand } from '../view/on-main-view-curtain-command';
import { createObservancesCommand } from './create-observances-command';

export const onAppInitCommand = (): void => {
    lego.command
        //
        .once(AppEvent.ready, onAppReadyCommand)
        .on(AppEvent.resize, onAppResizeCommand)

        .on(SuperAppEvent.pause, onSuperAppPauseCommand)
        .on(SuperAppEvent.resume, onSuperAppResumeCommand)
        .on(SuperAppEvent.mute, onSuperAppMuteCommand)
        .on(SuperAppEvent.unmute, onSuperAppUnmuteCommand)
        .on(SuperAppModelEvent.pausedUpdate, onSuperAppPausedUpdateCommand)
        .on(SuperAppModelEvent.mutedUpdate, onSuperAppMutedUpdateCommand)

        .on(AppModelEvent.stateUpdate, onAppStateUpdateCommand)

        .on(MainViewEvent.curtainComplete, onMainViewCurtainCommand)
        .on(WindowEvent.visibilityChange, onAppVisibilityChangeCommand)

        .execute(initializeSuperAppModelCommand)
        .execute(createObservancesCommand)
        .execute(initializeAppModelCommand);
};
