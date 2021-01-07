import { lego } from '@armathai/lego';
import { CellScale, ICellConfig } from '@armathai/pixi-grid';
import { Images } from '../../../src/assets';
import { WinViewEvent } from '../../../src/events/view';
import { delayRunnable, lp, makeSprite, removeRunnable } from '../../../src/utils';
import { BlockerComponent } from '../../../src/views/components/blocker-component';
import { ConfettiComponent } from '../../../src/views/components/confetti-component';
import { ResultViewAbstract } from '../../base/result-view-abstract';

const getGridConfig = (): ICellConfig => {
    return lp(
        {
            name: 'win',
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
                    offset: { x: 0, y: -64 },
                    padding: 0.05,
                },
                {
                    name: 'subtitle',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    offset: { x: 0, y: 200 },
                    padding: 0.05,
                },
            ],
        },
        {
            name: 'win',
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
                    offset: { x: 0, y: -64 },
                    padding: 0.05,
                },
                {
                    name: 'subtitle',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    offset: { x: 0, y: 200 },
                    padding: 0.05,
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

const getSubtitleShowTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        universal: true,
        pixi: { scale: 0 },
        delay: 0.1,
        duration: 0.5,
        ease: PIXI.tween.easeBackOut,
        onStart: () => (target.visible = true),
    };
};

const getSubtitleSpriteConfig = (): SpriteConfig => ({
    texture: 'subtitle.png',
});

export class WinView extends ResultViewAbstract {
    private _idleRunnable: Runnable;
    private _confetti: ConfettiComponent;
    private _blocker: BlockerComponent;
    private _popup: WinPopup;
    private _subtitle: PIXI.Sprite;

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
        this.setChild('subtitle', (this._subtitle = this._buildSubtitle()));

        this._blocker.visible = false;
        this._popup.visible = false;
        this._subtitle.visible = false;

        this._show();
    }

    private _show(): void {
        PIXI.tween
            .timeline({ universal: true })
            .add([
                PIXI.tween.from(this._blocker, getBlockerShowTweenConfig(this._blocker)),
                PIXI.tween.from(this._subtitle, getSubtitleShowTweenConfig(this._subtitle)),
            ])
            .eventCallback('onStart', () => {
                this._popup.show();
                this._popup.visible = true;
            })
            .eventCallback('onComplete', () => {
                this._resizeConfetti();
                this._confetti.start();
            });
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

    private _buildSubtitle(): PIXI.Sprite {
        return makeSprite(getSubtitleSpriteConfig());
    }

    private _buildConfetti(): ConfettiComponent {
        return new ConfettiComponent(0, 0);
    }

    private _resizeConfetti(): void {
        if (this._confetti) {
            const { width, height } = superApp.app.viewBounds;
            this._confetti.onResize(width, height);
        }
    }

    private _onScreenClick(): void {
        removeRunnable(this._idleRunnable);
        lego.event.emit(WinViewEvent.screenClick);
    }
}

const getPopupRaysSpriteConfig = (): SpriteConfig => ({
    texture: 'constructor/rays.png',
});

const getPopupTitleSpriteConfig = (): SpriteConfig => ({
    texture: Images['title'],
});

const getPopupLabelShowTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        pixi: { scale: 0.5, alpha: 0 },
        ease: PIXI.tween.easeElasticOut.config(1.2, 0.4),
        delay: 0.1,
        duration: 1,
    };
};

const getPopupRaysShowTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        pixi: { scale: 0.5, alpha: 0 },
        ease: PIXI.tween.easeSineOut,
        delay: 0.1,
        duration: 0.2,
    };
};

const getPopupRaysIdleTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        pixi: { angle: 360 },
        ease: PIXI.tween.easeLinearNone,
        duration: 6,
        repeat: -1,
    };
};

class WinPopup extends PIXI.Container {
    private _rays: PIXI.Sprite;
    private _title: PIXI.Sprite;

    public constructor() {
        super();

        const rays = makeSprite(getPopupRaysSpriteConfig());
        const title = makeSprite(getPopupTitleSpriteConfig());

        this.addChild((this._rays = rays));
        this.addChild((this._title = title));
    }

    public show(): void {
        PIXI.tween
            .timeline({ universal: true })
            .add([
                PIXI.tween.from(this._title, getPopupLabelShowTweenConfig()),
                PIXI.tween.from(this._rays, getPopupRaysShowTweenConfig()),
                PIXI.tween.to(this._rays, getPopupRaysIdleTweenConfig()),
            ]);
    }
}
