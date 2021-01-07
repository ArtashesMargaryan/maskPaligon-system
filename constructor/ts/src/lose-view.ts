import { lego } from '@armathai/lego';
import { CellScale, ICellConfig } from '@armathai/pixi-grid';
import { Images } from '../../../src/assets';
import { LoseViewEvent } from '../../../src/events/view';
import { lp, makeSprite } from '../../../src/utils';
import { AbstractButton } from '../../../src/utils/button';
import { BlockerComponent } from '../../../src/views/components/blocker-component';
import { HandComponent } from '../../../src/views/components/hand-component';
import { ResultViewAbstract } from '../../base/result-view-abstract';

const getGridConfig = (): ICellConfig => {
    return lp(
        {
            name: 'lose',
            // debug: { color: 0xd95027 },
            bounds: superApp.app.viewBounds,
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
                    offset: { x: 0, y: 210 },
                },
            ],
        },
        {
            name: 'lose',
            // debug: { color: 0xd95027 },
            bounds: superApp.app.viewBounds,
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
                    offset: { x: 0, y: 210 },
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
        pixi: { scale: 0.7 },
        duration: 0.4,
        delay: 0.2,
        ease: PIXI.tween.easeBackOut,
        onStart: () => (target.visible = true),
    };
};

const getRetryBtnShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        pixi: { y: target.y + 200, alpha: 0, scale: 0.6 },
        duration: 0.4,
        delay: 0.2,
        ease: PIXI.tween.easeBackOut,
        onStart: () => (target.visible = true),
    };
};

const getHandShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        pixi: { alpha: 0 },
        duration: 0.2,
        ease: PIXI.tween.easeLinearInOut,
        onStart: () => (target.visible = true),
    };
};

export class LoseView extends ResultViewAbstract {
    private _blocker: BlockerComponent;
    private _popup: LosePopup;
    private _retryBtn: RetryBtn;
    private _hand: HandComponent;

    public getGridConfig(): ICellConfig {
        return getGridConfig();
    }

    public rebuild(config?: ICellConfig): void {
        super.rebuild(config);

        if (this._hand) {
            this._updateHandPosition();
        }
    }

    public postBuild(): void {
        this.setChild('blocker', (this._blocker = this._buildBlocker()));
        this.setChild('popup', (this._popup = this._buildPopup()));
        this.setChild('button', (this._retryBtn = this._buildButton()));
        this.setChild('lose', (this._hand = this._buildHand()));

        this._blocker.visible = false;
        this._popup.visible = false;
        this._retryBtn.visible = false;
        this._hand.visible = false;

        this._show();
    }

    private _show(): void {
        PIXI.tween
            .timeline()
            .add([
                PIXI.tween.from(this._blocker, getBlockerShowTweenConfig(this._blocker)),
                PIXI.tween.from(this._popup, getPopupShowTweenConfig(this._popup)),
                PIXI.tween.from(this._retryBtn, getRetryBtnShowTweenConfig(this._retryBtn)),
            ])
            .addLabel('complete', '+=0.2')
            .add(() => {
                this._updateHandPosition();
                this._hand.play();
            }, 'complete')
            .add(PIXI.tween.from(this._hand, getHandShowTweenConfig(this._hand)));
    }

    private _hide(): void {
        this._hideHand();
        lego.event.emit(LoseViewEvent.hideComplete);
    }

    private _hideHand(): void {
        PIXI.tween.killTweensOf(this._hand);
        this._hand.visible = false;
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

    private _buildHand(): HandComponent {
        return new HandComponent();
    }

    private _onRetryBtnClick(): void {
        lego.event.emit(LoseViewEvent.retryBtnClick);
        this._hide();
    }

    private _updateHandPosition(): void {
        const { x, y, width } = this._retryBtn;
        const position = lp(true, false) ? new PIXI.Point(x + width * 0.5 - 30, y - 10) : new PIXI.Point(x, y + 20);
        this._hand.position.copyFrom(position);
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
