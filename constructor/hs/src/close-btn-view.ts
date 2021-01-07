import { lego } from '@armathai/lego';
import { Images } from '../../../src/assets';
import { CloseViewEvent } from '../../../src/events/view';
import { CloseBtnViewAbstract } from '../../base/close-btn-view-abstract';

const getCloseBtnBgUpSpriteConfig = (): SpriteConfig => ({
    texture: Images['constructor/btn-close-up'],
});

const getCloseBtnConfig = (): ButtonConfig => {
    return {
        states: {
            up: {
                bg: getCloseBtnBgUpSpriteConfig(),
            },
        },
    };
};

const getCloseBtnHideTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        universal: true,
        pixi: { alpha: 0 },
        duration: 0.1,
        ease: PIXI.tween.easeLinearNone,
        onComplete: () => {
            target.visible = false;
        },
    };
};

const getCloseBtnTapTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        pixi: { scaleX: 0.8, scaleY: 0.8 },
        duration: 0.12,
        ease: PIXI.tween.easeSineInOut,
        yoyo: true,
        repeat: 1,
    };
};

export class CloseBtnView extends CloseBtnViewAbstract {
    public constructor() {
        super(getCloseBtnConfig());
    }

    protected hide(): void {
        PIXI.tween.to(this, getCloseBtnHideTweenConfig(this));
    }

    protected onDown(e: PIXI.InteractionEvent): void {
        super.onDown(e);

        PIXI.tween
            .to(this, getCloseBtnTapTweenConfig())
            .eventCallback('onStart', this._onTapStart.bind(this))
            .eventCallback('onRepeat', this._onTapRepeat.bind(this))
            .eventCallback('onComplete', this._onTapComplete.bind(this));
    }

    private _onTapStart(): void {
        this.switchInput(false);
    }

    private _onTapRepeat(): void {
        lego.event.emit(CloseViewEvent.closeBtnClick);
    }

    private _onTapComplete(): void {
        this.switchInput(true);
    }
}
