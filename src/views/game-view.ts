import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { setResultStateCommand } from '../commands/result/set-result-state-command';
import { getGameGridConfig } from '../constants/configs/grid-configs';
import { getBgSpriteConfig } from '../constants/configs/sprite-configs';
import { GameModelEvent, HintModelEvent } from '../events/model';
import { ResultState } from '../models/app/result-model';
import { makeSprite } from '../utils';
import { HintView } from './hint-view';

export class GameView extends PixiGrid {
    public name = 'GameView';
    private _bg: PIXI.Sprite;
    private _winView: PIXI.Container;
    private _loseView: PIXI.Container;
    private _hint: HintView;

    public constructor() {
        super();

        this._build();
        this.parentGroup = superApp.app.stage.game;
        lego.event
            .on(GameModelEvent.hintUpdate, this._onHintUpdate, this)
            .on(HintModelEvent.visibleUpdate, this._onHintVisibleUpdate, this);
    }

    public getGridConfig(): ICellConfig {
        return getGameGridConfig();
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

    public rebuild(config?: ICellConfig): void {
        super.rebuild(config);

        this._winView.y -= 70;
        this._loseView.y += 70;
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

        this.setChild('game', this._bg);
        this.setChild('game', this._winView);
        this.setChild('game', this._loseView);
    }

    // HINT
    private _onHintUpdate(hint: unknown): void {
        hint ? this._buildHint() : this._destroyHint();
    }
    private _onHintVisibleUpdate(visible: boolean): void {
        visible ? this._hint.show() : this._hint.hide();
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
