import { lego } from '@armathai/lego';
import { PixiGrid } from '@armathai/pixi-grid';
import { getVignetteSpriteConfig } from '../../src/constants/configs/sprite-configs';
import { AppEvent } from '../../src/events/app';
import { AppModelEvent, StoreEvent } from '../../src/events/model';
import { LoseViewEvent, MainViewEvent } from '../../src/events/view';
import { AppState } from '../../src/models/app/app-model';
import { ResultState } from '../../src/models/app/result-model';
import { GameModel } from '../../src/models/game/game-model';
import { store } from '../../src/models/store';
import { params } from '../../src/params';
import { makeSprite } from '../../src/utils';
import { BlockerComponent } from '../../src/views/components/blocker-component';
import { GameView } from '../../src/views/game-view';
import { CloseBtnViewAbstract } from './close-btn-view-abstract';
import { ResultViewAbstract } from './result-view-abstract';

const getCurtainShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        universal: true,
        pixi: { alpha: 0 },
        duration: 0.5,
        ease: PIXI.tween.easeSineInOut,
        repeat: 1,
        yoyo: true,
        onStart: () => {
            target.alpha = 0;
            target.visible = true;
        },
        onComplete: () => {
            target.alpha = 1;
            target.visible = false;
        },
    };
};

export abstract class MainViewAbstract extends PixiGrid {
    protected curtainTweenRepeatDelay = 0.1;
    private _gameView: GameView;
    private _resultView: ResultViewAbstract;
    private _curtain: BlockerComponent;

    public constructor() {
        super();
        this.parentGroup = superApp.app.stage.main;

        lego.event
            //
            .on(AppEvent.resize, this.onResize, this)
            .on(StoreEvent.gameUpdate, this._onGameModelUpdate, this)
            .on(AppModelEvent.stateUpdate, this._onAppStateUpdate, this)
            .on(LoseViewEvent.hideComplete, this._onLoseViewHideComplete, this);
    }

    public onResize(): void {
        this.rebuild(this.getGridConfig());
        this._updateScale();
        this._updateHitArea();

        this._gameView.scale.set(superApp.app.gameScale);
    }

    protected build(): void {
        // this._updateScale();
        this._setInteractive();
        this._updateHitArea();
        this._buildVignette();
        this._buildCloseBtn();
        this._buildCurtain();
    }

    private _updateScale(): void {
        this.scale.set(superApp.app.appScale);
    }

    private _updateHitArea(): void {
        this.hitArea = new PIXI.Rectangle().copyFrom(superApp.app.appBounds);
    }

    private _setInteractive(): void {
        this.interactive = true;
    }

    private _buildVignette(): void {
        const vignette = makeSprite(getVignetteSpriteConfig());
        vignette.parentGroup = superApp.app.stage.vignette;
        this.setChild('vignette', vignette);
    }

    private _buildCloseBtn(): void {
        if (params.closeBtn.value) {
            const closeBtn = this.getCloseBtnView();
            this.setChild('close_btn', closeBtn);
        }
    }

    private _buildCurtain(): void {
        const curtain = new BlockerComponent(0x0, 1);
        curtain.parentGroup = superApp.app.stage.foreground;
        curtain.visible = false;
        this.setChild('blocker', (this._curtain = curtain));
    }

    // GAME
    private _onGameModelUpdate(gameModel: GameModel): void {
        gameModel ? this._buildGameView() : this._destroyGameView();
    }

    private _buildGameView(): void {
        this.setChild('game', (this._gameView = new GameView()));
        this.onResize();
    }

    private _destroyGameView(): void {
        this._gameView.destroy({ children: true });
    }

    // RESULT
    private _onAppStateUpdate(state: AppState): void {
        switch (state) {
            case AppState.game:
                if (this._resultView) {
                    this.removeContent(this._resultView);
                    this._resultView.destroy({ children: true });
                    this._resultView = null;
                }
                break;
            case AppState.result:
                this._buildResultView();
                break;
        }
    }

    private _buildResultView(): void {
        switch (store.app.result.state) {
            case ResultState.success:
                this.setChild('result', (this._resultView = this.getWinView()));
                break;
            case ResultState.fail:
                this.setChild('result', (this._resultView = this.getLoseView()));
                break;
        }
    }

    private _onLoseViewHideComplete(): void {
        PIXI.tween
            .from(this._curtain, getCurtainShowTweenConfig(this._curtain))
            .repeatDelay(this.curtainTweenRepeatDelay)
            .eventCallback('onRepeat', () => {
                lego.event.emit(MainViewEvent.curtainComplete);
            });
    }

    protected abstract getCloseBtnView(): CloseBtnViewAbstract;

    protected abstract getWinView(): ResultViewAbstract;

    protected abstract getLoseView(): ResultViewAbstract;
}
