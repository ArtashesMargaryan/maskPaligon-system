import { lego } from '@armathai/lego';
import { CellAlign, CellScale, ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { Images } from '../../../src/assets';
import { WinViewEvent } from '../../../src/events/view';
import { params } from '../../../src/params';
import { delayRunnable, lp, makeSprite, removeRunnable } from '../../../src/utils';
import { BitmapText } from '../../../src/utils/bitmap-text';
import { AbstractButton } from '../../../src/utils/button';
import { BlockerComponent } from '../../../src/views/components/blocker-component';
import { ConfettiComponent } from '../../../src/views/components/confetti-component';
import { ResultViewAbstract } from '../../base/result-view-abstract';

const getGridConfig = (): ICellConfig => {
    return lp(
        {
            name: 'win',
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
                    bounds: { x: 0, y: 0.07, width: 1, height: 0.25 },
                },
                {
                    name: 'button',
                    bounds: { x: 0, y: 0.66, width: 1, height: 1 - 0.64 },
                },
                {
                    name: 'reward',
                    bounds: { x: 0, y: 0.07 + 0.25, width: 1, height: 0.64 - (0.07 + 0.21) },
                },
            ],
        },
        {
            name: 'win',
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
                    bounds: { x: 0, y: 0.07, width: 1, height: 0.25 },
                },
                {
                    name: 'button',
                    bounds: { x: 0, y: 0.66, width: 1, height: 1 - 0.64 },
                },
                {
                    name: 'reward',
                    bounds: { x: 0, y: 0.07 + 0.25, width: 1, height: 0.64 - (0.07 + 0.21) },
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
        pixi: { alpha: 0 },
        duration: 0.45,
        ease: PIXI.tween.easeBackOut,
        onStart: () => (target.visible = true),
    };
};

const getClaimBtnShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        universal: true,
        pixi: { scale: 0.3 },
        duration: 0.4,
        delay: 0.5,
        ease: PIXI.tween.easeBackOut,
        onStart: () => (target.visible = true),
    };
};

const getClaimBtnIdleTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        pixi: { scale: 0.9 },
        duration: 1,
        delay: 0.1,
        repeat: -1,
        yoyo: true,
        ease: PIXI.tween.easeQuadInOut,
    };
};

export class WinView extends ResultViewAbstract {
    private _idleRunnable: Runnable;
    private _confetti: ConfettiComponent;
    private _blocker: BlockerComponent;
    private _popup: WinPopup;
    private _reward: RewardView;
    private _claimBtn: ClaimBtn;
    private _claimBtnIdleTween: gsap.core.Tween;

    public getGridConfig(): ICellConfig {
        return getGridConfig();
    }

    public destroy(options?: ContainerDestroyOptions): void {
        super.destroy(options);
        removeRunnable(this._idleRunnable);
    }

    public rebuild(config?: ICellConfig): void {
        super.rebuild(config);
        this._resizeConfetti();
    }

    public postBuild(): void {
        this._startIdleTimer();

        this.setChild('blocker', (this._blocker = this._buildBlocker()));
        this.addChild((this._confetti = this._buildConfetti()));
        this.setChild('popup', (this._popup = this._buildPopup()));
        this.setChild('button', (this._claimBtn = this._buildButton()));
        this.setChild('reward', (this._reward = this._buildReward()));

        this._blocker.visible = false;
        this._popup.visible = false;
        this._claimBtn.visible = false;
        this._reward.visible = false;

        this._show();
    }

    private _show(): void {
        this._reward.visible = true; // TEMP

        PIXI.tween
            .timeline({ universal: true })
            .add([
                PIXI.tween.from(this._blocker, getBlockerShowTweenConfig(this._blocker)),
                PIXI.tween.from(this._popup, getPopupShowTweenConfig(this._popup)),
                PIXI.tween.from(this._claimBtn, getClaimBtnShowTweenConfig(this._claimBtn)),
            ])

            .addLabel('rewardShow', 0)
            .add(() => {
                this._reward.show();
            }, 'rewardShow')

            .addLabel('confettiShow', '-=0')
            .add(() => {
                this._resizeConfetti();
                this._confetti.start();
            }, 'confettiShow')

            .add([(this._claimBtnIdleTween = PIXI.tween.to(this._claimBtn, getClaimBtnIdleTweenConfig()))]);
    }

    private _startIdleTimer(): void {
        this._idleRunnable = delayRunnable(5, () => {
            lego.event.emit(WinViewEvent.idleTime);
        });
    }

    private _buildBlocker(): PIXI.Graphics {
        const blocker = new BlockerComponent(0x0, 0.6);
        blocker.interactive = true;
        blocker.on('pointerdown', this._onScreenClick, this);

        return blocker;
    }

    private _buildPopup(): WinPopup {
        return new WinPopup();
    }

    private _buildConfetti(): ConfettiComponent {
        return new ConfettiComponent(0, 0);
    }

    private _resizeConfetti(): void {
        if (this._confetti) {
            const { width, height } = superApp.app.appBounds;
            this._confetti.onResize(width, height);
        }
    }

    private _buildButton(): ClaimBtn {
        const claimBtn = new ClaimBtn();
        claimBtn.on('pointerdown', this._onClaimBtnDown, this);
        claimBtn.once('pointertap', this._onClaimBtnTap, this);

        return claimBtn;
    }

    private _buildReward(): RewardView {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return new RewardView({ crystals: params['reward1'].value, coins: params['reward2'].value });
    }

    private _onClaimBtnDown(): void {
        this._claimBtnIdleTween.pause();
    }

    private _onClaimBtnTap(): void {
        removeRunnable(this._idleRunnable);
        lego.event.emit(WinViewEvent.claimBtnClick);
    }

    private _onScreenClick(): void {
        removeRunnable(this._idleRunnable);
        lego.event.emit(WinViewEvent.screenClick);
    }
}

const getClaimBtnBgUpSpriteConfig = (): SpriteConfig => ({
    texture: 'btn-claim.png',
});

const getClaimBtnBgDownSpriteConfig = (): SpriteConfig => ({
    texture: 'btn-claim-pressed.png',
});

const getClaimBtnConfig = (): ButtonConfig => {
    return {
        states: {
            up: {
                bg: getClaimBtnBgUpSpriteConfig(),
            },
            down: {
                bg: getClaimBtnBgDownSpriteConfig(),
            },
        },
    };
};

class ClaimBtn extends AbstractButton {
    public constructor() {
        super(getClaimBtnConfig());
    }

    protected createState({ bg }: ButtonStateConfig): ButtonState {
        return this.addChild(makeSprite(bg as SpriteConfig));
    }
}

const getPopupTitleSpriteConfig = (): SpriteConfig => ({
    texture: Images['title'],
});

const getPopupSubtitleSpriteConfig = (): SpriteConfig => ({
    texture: 'subtitle.png',
});

class WinPopup extends PIXI.Container {
    public constructor() {
        super();

        const title = makeSprite(getPopupTitleSpriteConfig());
        const subtitle = makeSprite(getPopupSubtitleSpriteConfig());

        subtitle.y += (title.height + subtitle.height) / 2 + 30;

        this.addChild(title, subtitle);
    }
}

const getRewardGridConfig = (): ICellConfig => {
    return lp(
        {
            name: 'reward',
            cells: [
                {
                    name: 'reward_1',
                    bounds: { x: 0, y: 0, width: 0.5, height: 1 },
                    align: CellAlign.rightCenter,
                    offset: { x: -72 },
                },
                {
                    name: 'reward_2',
                    bounds: { x: 0.5, y: 0, width: 0.5, height: 1 },
                    align: CellAlign.leftCenter,
                    offset: { x: 72 },
                },
            ],
        },
        {
            name: 'reward',
            cells: [
                {
                    name: 'reward_1',
                    bounds: { x: 0, y: 0, width: 0.5, height: 1 },
                    align: CellAlign.rightCenter,
                    offset: { x: -72 },
                },
                {
                    name: 'reward_2',
                    bounds: { x: 0.5, y: 0, width: 0.5, height: 1 },
                    align: CellAlign.leftCenter,
                    offset: { x: 72 },
                },
            ],
        },
    );
};

class RewardView extends PixiGrid {
    private _crystalItem: RewardItem;
    private _coinItem: RewardItem;

    public constructor({ crystals, coins }: { crystals: number; coins: number }) {
        super();

        this._buildCrystals(crystals);
        this._buildCoins(coins);

        if (crystals === 0) {
            this._crystalItem.visible = false;
            this.setChild('reward', this._coinItem);
        }
        if (coins === 0) {
            this._coinItem.visible = false;
            this.setChild('reward', this._crystalItem);
        }
    }

    public getGridConfig(): ICellConfig {
        return getRewardGridConfig();
    }

    public show(): void {
        this._crystalItem.show();
        this._coinItem.show();
    }

    private _buildCrystals(count: number): void {
        this._crystalItem = new RewardItem('crystal', count);
        this.setChild('reward_1', this._crystalItem);
    }

    private _buildCoins(count: number): void {
        this._coinItem = new RewardItem('coin', count);
        this.setChild('reward_2', this._coinItem);
    }
}

const getRewardItemSpriteConfig = (frame: string): SpriteConfig => ({
    texture: `constructor/${frame}.png`,
});

const getRewardItemShineSpriteConfig = (frame: string): SpriteConfig => ({
    texture: `constructor/${frame}-shine.png`,
});

const getRewardBackShineSpriteConfig = (): SpriteConfig => ({
    texture: 'constructor/reward-shine.png',
});

const getRewardTextConfig = (): BitmapTextConfig => ({
    basepath: 'constructor/digits/',
    spacing: 0,
});

const getRewardItemShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        pixi: { scale: 0 },
        alpha: 0,
        duration: 0.5,
        ease: PIXI.tween.easeBackOut,
        onStart: () => (target.renderable = true),
    };
};

const getRewardBackShineIdleTweenConfig = (): TweenConfig => {
    return {
        rotation: `-=${Math.PI * 2}`,
        duration: 6,
        repeat: -1,
        universal: true,
        ease: PIXI.tween.easeLinearNone,
    };
};

const getRewardBackShineHighlightShowTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        alpha: 0.5,
        duration: 0.5,
        delay: 0.6,
        repeat: 1,
        yoyo: true,
        ease: PIXI.tween.easeSineInOut,
    };
};

const getRewardItemShineShowTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        alpha: 0.8,
        duration: 0.5,
        delay: 0.6,
        repeat: 1,
        yoyo: true,
        ease: PIXI.tween.easeSineInOut,
    };
};

class RewardItem extends PIXI.Container {
    private _item: PIXI.Sprite;
    private _itemShine: PIXI.Sprite;
    private _countText: BitmapText;
    private _backShine: PIXI.Sprite;
    private _backShineHighlight: PIXI.Sprite;

    public constructor(frame: string, count: number) {
        super();
        this.renderable = false;

        const backShine = makeSprite(getRewardBackShineSpriteConfig());
        backShine.rotation = Math.random() * Math.PI;

        const backShineHighlight = makeSprite(getRewardBackShineSpriteConfig());
        backShineHighlight.alpha = 0;

        const item = makeSprite(getRewardItemSpriteConfig(frame));

        const itemShine = makeSprite(getRewardItemShineSpriteConfig(frame));
        itemShine.alpha = 0;

        const countText = new BitmapText(`${count}`, getRewardTextConfig());
        countText.pivot.set(countText.width / 2, -countText.height * 1.7);

        this.addChild((this._backShine = backShine));
        this.addChild((this._item = item));
        this.addChild((this._itemShine = itemShine));
        this.addChild((this._countText = countText));
        backShine.addChild((this._backShineHighlight = backShineHighlight));
    }

    public getBounds(): PIXI.Rectangle {
        return this._item.getBounds();
    }

    public show(): void {
        PIXI.tween
            .timeline({ universal: true })
            .add([
                PIXI.tween.from(this, getRewardItemShowTweenConfig(this)),
                PIXI.tween.from(this._backShine, getRewardBackShineIdleTweenConfig()),
                PIXI.tween.to(this._itemShine, getRewardItemShineShowTweenConfig()),
                PIXI.tween.to(this._backShineHighlight, getRewardBackShineHighlightShowTweenConfig()),
            ]);
    }
}
