import { lego } from '@armathai/lego';
import { setResultStateCommand } from '../commands/result/set-result-state-command';
import { getBgSpriteConfig, getRedSpriteConfig, getYellowSpriteConfig } from '../constants/configs/sprite-configs';
import { GameModelEvent } from '../events/model';
import { ResultState } from '../models/app/result-model';
import { makeSprite } from '../utils';
import { HintView } from './hint-view';

export class GameView extends PIXI.Container {
    public name = 'GameView';
    private _bgRed: PIXI.Sprite;
    private _bgYellow: PIXI.Sprite;
    private _winView: PIXI.Container;
    private _arr: number[];

    private _loseView: PIXI.Container;
    private _graph: PIXI.Graphics;
    private _hint: HintView;

    public constructor() {
        super();

        this._build();
        this.parentGroup = superApp.app.stage.game;
        window.addEventListener('keydown', this._moveCell);
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
        this._bgYellow = makeSprite(getYellowSpriteConfig());
        this._bgYellow.anchor.set(0.5);
        this._bgRed = makeSprite(getRedSpriteConfig());
        this._bgRed.anchor.set(0.5);
        const container = this._buildMask();
        container.addChild(makeSprite(getBgSpriteConfig()));
        container.addChild(this._bgRed);

        container.addChild(this._bgYellow);
        this.addChild(container);
    }

    // HINT
    private _moveCell = (e: KeyboardEvent): void => {
        console.warn(e.key);
        switch (e.key) {
            case 'ArrowUp':
                this._graph.height += 5;
                this._graph.position.y -= 5;
                break;

            case 'ArrowDown':
                this._graph.height += 5;
                // this._container.position.y += 5;

                break;
            case 'ArrowRight':
                // this._graph.width += 5;
                // this._buildPoligon(80, 0);
                break;

            case 'ArrowLeft':
                // this._graph.width += 5;
                // this._graph.position.x -= 5;
                break;
        }
    };

    private _onHintUpdate(hint: unknown): void {
        hint ? this._buildHint() : this._destroyHint();
    }

    private _buildMask(): PIXI.Container {
        const container = new PIXI.Container();
        const thing = this._buildPoligon(40, 40);

        container.addChild(thing);
        container.addChild(thing);
        this._bgYellow.mask = thing;
        return container;
    }

    private _buildPoligon(a1: number, a2: number, b1?: number, b2?: number): PIXI.Graphics {
        let arr: number[] = [];
        if (this._arr && this._arr.length > 1) {
            arr = this._arr;
            const index = arr.length / 2;
            arr.splice(index, 0, a1, arr[index - 1], 0, a1);
            console.warn(arr);
        } else {
            arr = [a1, 0, a1, a1, 0, a1, 0, 0];
        }
        const pol = new PIXI.Graphics();
        const poligons = new PIXI.Graphics();
        pol.beginFill();
        pol.drawPolygon([0, 20, 50, 20, 50, 0, 0, 0]);

        pol.endFill();
        pol.position.x = -200;
        pol.position.y = 100;
        const pol1 = new PIXI.Graphics();
        pol1.beginFill();
        pol1.drawPolygon([500, 200, 500, 500, 200, 500, 200, 200]);

        pol1.endFill();
        pol1.position.x = 200;
        pol1.position.y = 100;
        pol1.lineStyle(0);
        poligons.drawPolygon([500, 200, 500, 500, 200, 500, 200, 200]);
        return pol;
    }

    private _buildHint(): void {
        return;
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
