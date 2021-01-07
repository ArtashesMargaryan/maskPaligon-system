import { lego } from '@armathai/lego';
import { AppModelEvent, ResultModelEvent } from '../../src/events/model';
import { AppState } from '../../src/models/app-model';
import { ResultState } from '../../src/models/result-model';
import { makeSprite } from '../../src/utils';
import { AbstractButton } from '../../src/utils/button';

export abstract class CloseBtnViewAbstract extends AbstractButton {
    public constructor(btnConfig: ButtonConfig) {
        super(btnConfig);
        this.parentGroup = superApp.app.stage.foreground;
        lego.event.on(ResultModelEvent.stateUpdate, this._onResultModelStateUpdate, this);
    }

    protected createState({ bg }: ButtonStateConfig): ButtonState {
        return this.addChild(makeSprite(bg as SpriteConfig));
    }

    private _onResultModelStateUpdate(state: ResultState): void {
        switch (state) {
            case ResultState.success:
                lego.event.once(AppModelEvent.stateUpdate, this._onAppModelStateUpdate, this);
                break;
        }
    }

    private _onAppModelStateUpdate(state: AppState): void {
        switch (state) {
            case AppState.result:
                this.hide();
                break;
        }
    }

    protected abstract hide(): void;
}
