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
                    name: 'subtitle',
                    bounds: { x: 0, y: 0.6, width: 1, height: 0.3 },
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
                    offset: { x: 0, y: -80 },
                },
                {
                    name: 'subtitle',
                    bounds: { x: 0, y: 0.6, width: 1, height: 0.3 },
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

    public postBuild(): void {
        this._startIdleTimer();

        this.setChild('blocker', (this._blocker = this._buildBlocker()));
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
                PIXI.tween.from(this._popup, getPopupShowTweenConfig(this._popup)),
                PIXI.tween.from(this._subtitle, getSubtitleShowTweenConfig(this._subtitle)),
            ]);
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

    private _onScreenClick(): void {
        removeRunnable(this._idleRunnable);
        lego.event.emit(WinViewEvent.screenClick);
    }
}

const getPopupTitleSpriteConfig = (): SpriteConfig => ({
    texture: Images['title'],
});

class WinPopup extends PIXI.Container {
    private _title: PIXI.Sprite;

    public constructor() {
        super();

        this._title = makeSprite(getPopupTitleSpriteConfig());
        this.addChild(this._title);
    }
}
