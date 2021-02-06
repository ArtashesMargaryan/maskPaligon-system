import { lego } from '@armathai/lego';
import { CellScale, ICellConfig } from '@armathai/pixi-grid';
import { Images } from '../../../src/assets';
import { WinViewEvent } from '../../../src/events/view';
import { delayRunnable, lp, makeSprite, removeRunnable } from '../../../src/utils';
import { BlockerComponent } from '../../../src/views/components/blocker-component';
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
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.none,
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
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.none,
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

export class WinView extends ResultViewAbstract {
    private _idleRunnable: Runnable;
    private _blocker: BlockerComponent;
    private _popup: WinPopup;

    public getGridConfig(): ICellConfig {
        return getGridConfig();
    }

    public destroy(options?: ContainerDestroyOptions): void {
        super.destroy(options);
        removeRunnable(this._idleRunnable);
    }

    public postBuild(): void {
        this._startIdleTimer();

        this.setChild('blocker', (this._blocker = this._buildBlocker()));
        this.setChild('popup', (this._popup = this._buildPopup()));

        this._blocker.visible = false;
        this._popup.visible = false;

        this._show();
    }

    private _show(): void {
        PIXI.tween
            .timeline({ universal: true })
            .add([PIXI.tween.from(this._blocker, getBlockerShowTweenConfig(this._blocker))])
            .eventCallback('onStart', () => {
                this._popup.show();
                this._popup.visible = true;
            });
    }

    private _startIdleTimer(): void {
        this._idleRunnable = delayRunnable(5, () => {
            lego.event.emit(WinViewEvent.idleTime);
        });
    }

    private _buildBlocker(): PIXI.Graphics {
        const blocker = new BlockerComponent(0x0, 0.4);
        blocker.interactive = true;
        blocker.on('pointerdown', this._onScreenClick, this);

        return blocker;
    }

    private _buildPopup(): WinPopup {
        return new WinPopup();
    }

    private _onScreenClick(): void {
        removeRunnable(this._idleRunnable);
        lego.event.emit(WinViewEvent.screenClick);
    }
}

const getPopupAustinImageConfig = (): SpriteConfig => ({
    texture: 'constructor/win-austin.png',
});

const getPopupRaysSpriteConfig = (): SpriteConfig => ({
    texture: 'constructor/rays.png',
});

const getPopupTitleSpriteConfig = (): SpriteConfig => ({
    texture: Images['title'],
    position: new PIXI.Point(0, 160),
});

const getPopupAustinShowTweenConfig = (): TweenConfig => {
    return {
        pixi: { scale: 0.4, alpha: 0 },
        duration: 0.4,
        ease: PIXI.tween.easeBackOut,
    };
};

const getPopupTitleShowTweenConfig = (): TweenConfig => {
    return {
        pixi: { angle: -90 },
        ease: PIXI.tween.easeElasticOut.config(1.04, 0.5),
        duration: 1,
    };
};

const getPopupRaysIdleTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        pixi: { angle: -360 },
        ease: PIXI.tween.easeLinearNone,
        repeat: -1,
        duration: 6,
    };
};

class WinPopup extends PIXI.Container {
    private _austin: PIXI.Container;
    private _title: PIXI.Sprite;

    public constructor() {
        super();

        this._buildAustin();
        this._buildTitle();
    }

    public show(): void {
        PIXI.tween
            .timeline()
            .add([
                PIXI.tween.from(this._austin, getPopupAustinShowTweenConfig()),
                PIXI.tween.from(this._title, getPopupTitleShowTweenConfig()),
            ]);
    }

    private _buildAustin(): void {
        this._austin = new PIXI.Container();
        const avatar = makeSprite(getPopupAustinImageConfig());
        const rays = makeSprite(getPopupRaysSpriteConfig());

        this._austin.addChild(rays);
        this._austin.addChild(avatar);

        this.addChild(this._austin);

        PIXI.tween.from(rays, getPopupRaysIdleTweenConfig());
    }

    private _buildTitle(): void {
        this._title = makeSprite(getPopupTitleSpriteConfig());
        this._title.pivot.set(0, this._title.height * 3);
        this._title.y += this._title.pivot.y;

        this.addChild(this._title);
    }
}
