import { lego } from '@armathai/lego';
import { CellAlign, CellScale, ICellConfig } from '@armathai/pixi-grid';
import { Images } from '../../../src/assets';
import { LoseViewEvent } from '../../../src/events/view';
import { lp, makeSprite } from '../../../src/utils';
import { AbstractButton } from '../../../src/utils/button';
import { BlockerComponent } from '../../../src/views/components/blocker-component';
import { ResultViewAbstract } from '../../base/result-view-abstract';

const getGridConfig = (): ICellConfig => {
    return lp(
        {
            name: 'lose',
            // debug: { color: 0xd95027 },
            bounds: superApp.app.appBounds,
            cells: [
                {
                    name: 'blocker',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.fill,
                },
                {
                    name: 'popup',
                    bounds: { x: 0, y: 0, width: 1, height: 0.78 },
                },
                {
                    name: 'button',
                    bounds: { x: 0, y: 0.78, width: 1, height: 1 - 0.78 },
                    align: CellAlign.centerTop,
                },
            ],
        },
        {
            name: 'lose',
            // debug: { color: 0xd95027 },
            bounds: superApp.app.appBounds,
            cells: [
                {
                    name: 'blocker',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.fill,
                },
                {
                    name: 'popup',
                    bounds: { x: 0, y: 0, width: 1, height: 0.78 },
                },
                {
                    name: 'button',
                    bounds: { x: 0, y: 0.78, width: 1, height: 1 - 0.78 },
                    align: CellAlign.centerTop,
                },
            ],
        },
    );
};

const getBlockerShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        universal: true,
        pixi: { alpha: 0 },
        duration: 0.4,
        ease: PIXI.tween.easeCubicOut,
        onStart: () => (target.visible = true),
    };
};

const getPopupShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        universal: true,
        pixi: { scale: 0 },
        duration: 0.5,
        ease: PIXI.tween.easeBackOut,
        onStart: () => (target.visible = true),
    };
};

const getRetryBtnShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        universal: true,
        pixi: { scale: 0 },
        delay: 0.1,
        duration: 0.5,
        ease: PIXI.tween.easeBackOut,
        onStart: () => (target.visible = true),
    };
};

export class LoseView extends ResultViewAbstract {
    private _blocker: BlockerComponent;
    private _popup: LosePopup;
    private _retryBtn: RetryBtn;

    public getGridConfig(): ICellConfig {
        return getGridConfig();
    }

    public postBuild(): void {
        this.setChild('blocker', (this._blocker = this._buildBlocker()));
        this.setChild('popup', (this._popup = this._buildPopup()));
        this.setChild('button', (this._retryBtn = this._buildButton()));

        this._blocker.visible = false;
        this._popup.visible = false;
        this._retryBtn.visible = false;

        this._show();
    }

    private _show(): void {
        PIXI.tween
            .timeline({ universal: true })
            .add([
                PIXI.tween.from(this._blocker, getBlockerShowTweenConfig(this._blocker)),
                PIXI.tween.from(this._popup, getPopupShowTweenConfig(this._popup)),
                PIXI.tween.from(this._retryBtn, getRetryBtnShowTweenConfig(this._retryBtn)),
            ]);
    }

    private _hide(): void {
        lego.event.emit(LoseViewEvent.hideComplete);
    }

    private _buildBlocker(): PIXI.Graphics {
        return new BlockerComponent(0x0, 0.6);
    }

    private _buildPopup(): LosePopup {
        return new LosePopup();
    }

    private _buildButton(): RetryBtn {
        const retryBtn = new RetryBtn();
        retryBtn.once('pointertap', this._onRetryBtnClick, this);

        return retryBtn;
    }

    private _onRetryBtnClick(): void {
        lego.event.emit(LoseViewEvent.retryBtnClick);
        this._hide();
    }
}

const getRetryBtnLabelUpSpriteConfig = (): SpriteConfig => ({
    texture: Images['retry'],
});

const getRetryBtnLabelDownSpriteConfig = (): SpriteConfig => ({
    texture: 'retry-pressed.png',
});

const getRetryBtnConfig = (): ButtonConfig => {
    return {
        states: {
            up: {
                bg: getRetryBtnLabelUpSpriteConfig(),
            },
            down: {
                bg: getRetryBtnLabelDownSpriteConfig(),
            },
        },
    };
};

class RetryBtn extends AbstractButton {
    public constructor() {
        super(getRetryBtnConfig());
    }

    protected createState({ bg }: ButtonStateConfig): ButtonState {
        return this.addChild(makeSprite(bg as SpriteConfig));
    }
}

const getPopupIconSpriteConfig = (): SpriteConfig => ({
    texture: Images['icon'],
});

class LosePopup extends PIXI.Container {
    private _icon: PIXI.Sprite;

    public constructor() {
        super();

        this._icon = makeSprite(getPopupIconSpriteConfig());
        this.addChild(this._icon);
    }
}
