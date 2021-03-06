import { lego } from '@armathai/lego';
import { AppEvent } from '../events/app';
import { HintModelEvent } from '../events/model';
import { getDisplayObjectByProperty } from '../utils';
import { sample } from '../utils/array/sample';
import { HandComponent } from './components/hand-component';
import { GameView } from './game-view';

export class HintView extends HandComponent {
    private _target: PIXI.DisplayObject;

    public constructor() {
        super();

        this.visible = false;

        lego.event
            .on(HintModelEvent.visibleUpdate, this._onHintVisibleUpdate, this)
            .on(AppEvent.resize, this._onAppResize, this);
    }

    public destroy(option?: ContainerDestroyOptions): void {
        lego.event.removeListenersOf(this);
        super.destroy(option);
    }

    private _show(): void {
        const { winView, loseView } = getDisplayObjectByProperty('name', 'GameView') as GameView;
        this._target = sample([winView, loseView]);
        this.visible = true;
        this._updatePosition();
        this.play();
    }

    private _hide(): void {
        this.stop();
        this.visible = false;
        this._target = null;
    }

    private _onHintVisibleUpdate(visible: boolean): void {
        visible ? this._show() : this._hide();
    }

    private _onAppResize(): void {
        this._target && this._updatePosition();
    }

    private _updatePosition(): void {
        this.position.copyFrom(
            this.parent.toLocal(new PIXI.Point().copyFrom(this._target.position), this._target.parent),
        );
    }
}
