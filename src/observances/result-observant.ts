import { lego } from '@armathai/lego';
import { setResultDelayCommand } from '../commands/result/set-result-delay-command';
import { setResultStateCommand } from '../commands/result/set-result-state-command';
import { AppState } from '../models/app/app-model';
import { ResultState } from '../models/app/result-model';
import { store } from '../models/store';

export class ResultObservant {
    public constructor() {
        document.addEventListener('keydown', this._onKeyDown);
    }

    private _onKeyDown = (event: KeyboardEvent): void => {
        if (store.app.paused || store.app.state !== AppState.game) {
            return;
        }

        switch (event.key) {
            case 'w':
                this._winGame();
                break;
            case 'l':
                this._loseGame();
                break;
        }
    };

    private _winGame(): void {
        lego.command
            //
            .payload(0)
            .execute(setResultDelayCommand)

            .payload(ResultState.success)
            .execute(setResultStateCommand);
    }

    private _loseGame(): void {
        lego.command
            //
            .payload(0)
            .execute(setResultDelayCommand)

            .payload(ResultState.fail)
            .execute(setResultStateCommand);
    }
}
