import { lego } from '@armathai/lego';
import { setResultStateCommand } from '../commands/result/set-result-state-command';
import { getBgSpriteConfig } from '../constants/configs/sprite-configs';
import { GameModelEvent } from '../events/model';
import { ResultState } from '../models/app/result-model';
import { makeSprite } from '../utils';
import { HintView } from './hint-view';

export class GameView extends PIXI.Container {
    public name = 'GameView';
    private _bg: PIXI.Sprite;
    private _winView: PIXI.Container;
    private _loseView: PIXI.Container;
    private _hint: HintView;

    public constructor() {
        super();

        this._build();
        this.parentGroup = superApp.app.stage.game;

        lego.event.on(GameModelEvent.hintUpdate, this._onHintUpdate, this);
    }

    public get winView(): PIXI.Container {
        return this._winView;
    }

    public get loseView(): PIXI.Container {
        return this._loseView;
    }

    public destroy(option?: ContainerDestroyOptions): void {
        lego.event.removeListenersOf(this);
        super.destroy(option);
    }

    private _build(): void {
        this._bg = makeSprite(getBgSpriteConfig());
        this._bg.anchor.set(0.5);

        this._winView = this._buildView({
            bg: {
                width: 300,
                height: 100,
                tint: 0x16c947,
            },
            callback: this._onWinClick,
        });

        this._loseView = this._buildView({
            bg: {
                width: 300,
                height: 100,
                tint: 0xc93d16,
            },
            callback: this._onLoseClick,
        });

        this.addChild(this._bg);
        this.addChild(this._winView);
        this.addChild(this._loseView);

        this._winView.y -= 70;
        this._loseView.y += 70;
    }

    // HINT
    private _onHintUpdate(hint: unknown): void {
        hint ? this._buildHint() : this._destroyHint();
    }

    private _buildHint(): void {
        this.addChild((this._hint = new HintView()));
    }

    private _destroyHint(): void {
        this._hint.destroy({ children: true });
    }

    private _buildView(config: {
        bg: { tint: number; width: number; height: number };
        callback: () => void;
    }): PIXI.Container {
        const view = new PIXI.Container();

        const { tint, width, height } = config.bg;
        const bg = new PIXI.Graphics();
        bg.beginFill(tint, 1);
        bg.drawRoundedRect(-width / 2, -height / 2, width, height, 30);
        bg.endFill();

        bg.interactive = true;
        bg.once('pointertap', config.callback, this);

        view.addChild(bg);

        return view;
    }

    private _onWinClick(): void {
        lego.command.payload(ResultState.success).execute(setResultStateCommand);
    }

    private _onLoseClick(): void {
        lego.command.payload(ResultState.fail).execute(setResultStateCommand);
    }
}
