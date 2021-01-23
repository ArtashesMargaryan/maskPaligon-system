import { lego } from '@armathai/lego';
import { CellScale, ICellConfig } from '@armathai/pixi-grid';
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
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    offset: { x: 0, y: -80 },
                },
                {
                    name: 'button',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    offset: { x: 0, y: 180 },
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
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    offset: { x: 0, y: -80 },
                },
                {
                    name: 'button',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    offset: { x: 0, y: 180 },
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
        retryBtn.once('tapComplete', this._onRetryBtnClick, this);

        return retryBtn;
    }

    private _onRetryBtnClick(): void {
        lego.event.emit(LoseViewEvent.retryBtnClick);
        this._hide();
    }
}

const getRetryBtnBgUpSpriteConfig = (): SpriteConfig => ({
    texture: 'constructor/btn-retry-up.png',
});

const getRetryBtnLabelUpSpriteConfig = (): SpriteConfig => ({
    texture: Images['retry'],
});

const getRetryBtnConfig = (): ButtonConfig => {
    return {
        states: {
            up: {
                bg: getRetryBtnBgUpSpriteConfig(),
                label: getRetryBtnLabelUpSpriteConfig(),
            },
        },
    };
};

const getRetryBtnTapTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        pixi: { scaleX: 0.84, scaleY: 0.84 },
        duration: 0.15,
        ease: PIXI.tween.easeSineInOut,
        yoyo: true,
        repeat: 1,
    };
};

class RetryBtn extends AbstractButton {
    public constructor() {
        super(getRetryBtnConfig());
    }

    protected createState({ bg, label }: ButtonStateConfig): ButtonState {
        const state = new PIXI.Container();

        const bgObj = makeSprite(bg as SpriteConfig);
        const labelObj = makeSprite(label);

        state.addChild(bgObj);
        state.addChild(labelObj);

        this.addChild(state);

        return state;
    }

    protected onDown(e: PIXI.InteractionEvent): void {
        super.onDown(e);

        PIXI.tween
            .to(this, getRetryBtnTapTweenConfig())
            .eventCallback('onStart', this._onTapStart.bind(this))
            .eventCallback('onRepeat', this._onTapRepeat.bind(this));
    }

    private _onTapStart(): void {
        this.switchInput(false);
    }

    private _onTapRepeat(): void {
        this.emit('tapComplete');
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
